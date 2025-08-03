import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockFetch } from "../../utils/testUtils";
import { useUpdateOrganization } from "../useOrganizations";
import React from "react";
import { render } from "@testing-library/react";
import { waitFor } from "@testing-library/dom";

const organizationId = "550e8400-e29b-41d4-a716-446655440001";

const mockOrganizationResponse = {
  status: 200,
  requestId: "550e8400-e29b-41d4-a716-446655440000",
  result: {
    id: organizationId,
    createdAt: "2024-01-01T00:00:00Z",
    name: "Updated Organization",
    privateEndpoints: [],
    byocConfig: [],
  },
};

const config = {
  keyId: "test-key-id",
  keySecret: "test-key-secret",
  baseUrl: "https://api.clickhouse.cloud",
};

beforeEach(() => {
  vi.clearAllMocks();
  mockFetch<typeof mockOrganizationResponse>({
    response: mockOrganizationResponse,
  });
});

describe("useUpdateOrganization", () => {
  function HookTest({
    onResult,
    organizationId,
    config: testConfig,
  }: {
    onResult: (result: ReturnType<typeof useUpdateOrganization>) => void;
    organizationId: string;
    config: typeof config;
  }) {
    const result = useUpdateOrganization(organizationId, testConfig);
    React.useEffect(() => {
      onResult(result);
    }, [result, onResult]);
    return null;
  }

  it("should update and return organization data", async () => {
    let hookResult: ReturnType<typeof useUpdateOrganization> | undefined;
    render(
      <HookTest
        organizationId={organizationId}
        config={config}
        onResult={(r) => (hookResult = r)}
      />
    );
    await waitFor(() => {
      expect(hookResult).toBeDefined();
    });
    const updateData = { name: "Updated Organization" };
    const result = await hookResult!.updateOrganization(updateData);
    expect(result).toEqual(mockOrganizationResponse.result);
    expect(global.fetch).toHaveBeenCalledWith(
      `${config.baseUrl}/v1/organizations/${organizationId}`,
      expect.objectContaining({ method: "PATCH" })
    );
  });

  it("should throw error on API failure", async () => {
    mockFetch<{ status: number; error: string }>({
      response: { status: 400, error: "Bad request" },
      ok: false,
      status: 400,
      statusText: "Bad Request",
      text: "Bad request",
    });
    let hookResult: ReturnType<typeof useUpdateOrganization> | undefined;
    render(
      <HookTest
        organizationId={organizationId}
        config={config}
        onResult={(r) => (hookResult = r)}
      />
    );
    await waitFor(() => {
      expect(hookResult).toBeDefined();
    });
    await expect(
      hookResult!.updateOrganization({ name: "fail" })
    ).rejects.toThrow("Bad request");
  });
});
