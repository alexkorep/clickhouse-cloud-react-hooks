import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockFetch } from "../../utils/testUtils";
import { render } from "@testing-library/react";
import { waitFor } from "@testing-library/dom";
import React from "react";
import { useOrganization } from "../useOrganizations";

const mockOrganizationResponse = {
  status: 200,
  requestId: "550e8400-e29b-41d4-a716-446655440000",
  result: {
    id: "550e8400-e29b-41d4-a716-446655440001",
    createdAt: "2024-01-01T00:00:00Z",
    name: "Test Organization",
    privateEndpoints: [],
    byocConfig: [],
  },
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

// Initial mock fetch
mockFetch<typeof mockOrganizationResponse>({
  response: mockOrganizationResponse,
});

describe("useOrganization", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset fetch mock to default successful response
    mockFetch<typeof mockOrganizationResponse>({
      response: mockOrganizationResponse,
    });
  });

  function HookTest({
    onResult,
    organizationId,
    config: testConfig,
  }: {
    onResult: (result: ReturnType<typeof useOrganization>) => void;
    organizationId: string;
    config: typeof config;
  }) {
    const result = useOrganization(organizationId, testConfig);
    React.useEffect(() => {
      onResult(result);
    }, [result, onResult]);
    return null;
  }

  it("should fetch and return organization data", async () => {
    let hookResult: ReturnType<typeof useOrganization> | undefined;
    render(
      <HookTest
        organizationId="550e8400-e29b-41d4-a716-446655440001"
        config={config}
        onResult={(r) => (hookResult = r)}
      />
    );
    await waitFor(() => expect(hookResult?.isLoading).toBe(false));
    expect(hookResult?.data).toEqual(mockOrganizationResponse.result);
    expect(hookResult?.error).toBeUndefined();
    expect(hookResult?.response).toEqual(mockOrganizationResponse);
  });

  it("should handle API error", async () => {
    mockFetch<{ status: number; error: string }>({
      response: { status: 404, error: "Not found" },
      ok: false,
      status: 404,
      statusText: "Not Found",
    });
    let hookResult: ReturnType<typeof useOrganization> | undefined;
    render(
      <HookTest
        organizationId="error-id"
        config={errorConfig}
        onResult={(r) => (hookResult = r)}
      />
    );
    await waitFor(() => expect(hookResult?.isLoading).toBe(false));
    expect(hookResult?.data).toBeUndefined();
    expect(hookResult?.error).toBeDefined();
  });
});
