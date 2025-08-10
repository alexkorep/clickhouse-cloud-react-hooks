import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { waitFor } from "@testing-library/dom";
import React from "react";
import {
  useOrganizationActivities,
  useOrganizationActivity,
} from "../useOrganizationActivities";
import { mockFetch } from "../../utils/testUtils";

const organizationId = "550e8400-e29b-41d4-a716-446655440001";
const activityId = "activity-1";

const mockActivity = {
  id: activityId,
  createdAt: "2024-01-01T00:00:00Z",
  type: "service_create",
  actorType: "user",
  actorId: "user-1",
  actorDetails: "User 1",
  organizationId,
};

const mockActivitiesResponse = {
  status: 200,
  requestId: "550e8400-e29b-41d4-a716-446655440000",
  result: [mockActivity],
};

const mockActivityResponse = {
  status: 200,
  requestId: "550e8400-e29b-41d4-a716-446655440002",
  result: mockActivity,
};

const config = {
  keyId: "test-key-id",
  keySecret: "test-key-secret",
  baseUrl: "https://api.clickhouse.cloud",
};

const errorConfig = {
  keyId: "error-key-id",
  keySecret: "error-key-secret",
  baseUrl: "https://api.clickhouse.cloud",
};

mockFetch<typeof mockActivitiesResponse>({
  response: mockActivitiesResponse,
});

describe("useOrganizationActivities", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch<typeof mockActivitiesResponse>({
      response: mockActivitiesResponse,
    });
  });

  function HookTest({
    onResult,
    organizationId: orgId,
    config: cfg,
    params,
  }: {
    onResult: (result: ReturnType<typeof useOrganizationActivities>) => void;
    organizationId: string;
    config: typeof config;
    params?: { fromDate?: string; toDate?: string };
  }) {
    const result = useOrganizationActivities(orgId, cfg, params);
    React.useEffect(() => {
      onResult(result);
    }, [result, onResult]);
    return null;
  }

  it("should fetch and return activities", async () => {
    const fromDate = "2024-01-01T00:00:00Z";
    const toDate = "2024-01-31T00:00:00Z";
    let hookResult: ReturnType<typeof useOrganizationActivities> | undefined;
    render(
      <HookTest
        organizationId={organizationId}
        config={config}
        params={{ fromDate, toDate }}
        onResult={(r) => (hookResult = r)}
      />
    );
    await waitFor(() => expect(hookResult?.isLoading).toBe(false));
    expect(hookResult?.data).toEqual(mockActivitiesResponse.result);
    const expectedUrl = `${config.baseUrl}/v1/organizations/${organizationId}/activities?from_date=${encodeURIComponent(
      fromDate
    )}&to_date=${encodeURIComponent(toDate)}`;
    expect(global.fetch).toHaveBeenCalledWith(expectedUrl, expect.anything());
  });

  it("should handle API error", async () => {
    mockFetch<{ status: number; error: string }>({
      response: { status: 404, error: "Not found" },
      ok: false,
      status: 404,
      statusText: "Not Found",
    });
    let hookResult: ReturnType<typeof useOrganizationActivities> | undefined;
    render(
      <HookTest
        organizationId={organizationId}
        config={errorConfig}
        onResult={(r) => (hookResult = r)}
      />
    );
    await waitFor(() => expect(hookResult?.isLoading).toBe(false));
    expect(hookResult?.data).toBeUndefined();
    expect(hookResult?.error).toBeDefined();
  });
});

describe("useOrganizationActivity", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch<typeof mockActivityResponse>({
      response: mockActivityResponse,
    });
  });

  function HookTest({
    onResult,
    organizationId: orgId,
    activityId: actId,
    config: cfg,
  }: {
    onResult: (result: ReturnType<typeof useOrganizationActivity>) => void;
    organizationId: string;
    activityId: string;
    config: typeof config;
  }) {
    const result = useOrganizationActivity(orgId, actId, cfg);
    React.useEffect(() => {
      onResult(result);
    }, [result, onResult]);
    return null;
  }

  it("should fetch and return activity", async () => {
    let hookResult: ReturnType<typeof useOrganizationActivity> | undefined;
    render(
      <HookTest
        organizationId={organizationId}
        activityId={activityId}
        config={config}
        onResult={(r) => (hookResult = r)}
      />
    );
    await waitFor(() => expect(hookResult?.isLoading).toBe(false));
    expect(hookResult?.data).toEqual(mockActivityResponse.result);
    expect(global.fetch).toHaveBeenCalledWith(
      `${config.baseUrl}/v1/organizations/${organizationId}/activities/${activityId}`,
      expect.anything()
    );
  });

  it("should handle API error", async () => {
    mockFetch<{ status: number; error: string }>({
      response: { status: 404, error: "Not found" },
      ok: false,
      status: 404,
      statusText: "Not Found",
    });
    let hookResult: ReturnType<typeof useOrganizationActivity> | undefined;
    render(
      <HookTest
        organizationId={organizationId}
        activityId={activityId}
        config={errorConfig}
        onResult={(r) => (hookResult = r)}
      />
    );
    await waitFor(() => expect(hookResult?.isLoading).toBe(false));
    expect(hookResult?.data).toBeUndefined();
    expect(hookResult?.error).toBeDefined();
  });
});

