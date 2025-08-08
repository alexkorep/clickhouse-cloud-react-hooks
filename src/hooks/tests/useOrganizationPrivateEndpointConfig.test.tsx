import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockFetch } from "../../utils/testUtils";
import { render } from "@testing-library/react";
import { waitFor } from "@testing-library/dom";
import React from "react";
import { useOrganizationPrivateEndpointConfig } from "../useOrganizations";

const organizationId = "550e8400-e29b-41d4-a716-446655440001";

const mockPrivateEndpointConfigResponse = {
  status: 200,
  requestId: "550e8400-e29b-41d4-a716-446655440000",
  result: {
    endpointServiceId: "svc-123",
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

beforeEach(() => {
  vi.clearAllMocks();
  mockFetch<typeof mockPrivateEndpointConfigResponse>({
    response: mockPrivateEndpointConfigResponse,
  });
});

describe("useOrganizationPrivateEndpointConfig", () => {
  function HookTest({
    onResult,
    organizationId: orgId,
    config: testConfig,
    params,
  }: {
    onResult: (result: ReturnType<typeof useOrganizationPrivateEndpointConfig>) => void;
    organizationId: string;
    config: typeof config;
    params?: { cloudProvider?: string; region?: string };
  }) {
    const result = useOrganizationPrivateEndpointConfig(orgId, testConfig, params);
    React.useEffect(() => {
      onResult(result);
    }, [result, onResult]);
    return null;
  }

  it("should fetch and return private endpoint config", async () => {
    let hookResult:
      | ReturnType<typeof useOrganizationPrivateEndpointConfig>
      | undefined;
    render(
      <HookTest
        organizationId={organizationId}
        config={config}
        params={{ cloudProvider: "aws", region: "us-east-1" }}
        onResult={(r) => (hookResult = r)}
      />
    );
    await waitFor(() => expect(hookResult?.isLoading).toBe(false));
    expect(hookResult?.data).toEqual(
      mockPrivateEndpointConfigResponse.result
    );
    expect(hookResult?.error).toBeUndefined();
    expect(hookResult?.response).toEqual(
      mockPrivateEndpointConfigResponse
    );
  });

  it("should handle API error", async () => {
    mockFetch<{ status: number; error: string }>({
      response: { status: 404, error: "Not Found" },
      ok: false,
      status: 404,
      statusText: "Not Found",
    });
    let hookResult:
      | ReturnType<typeof useOrganizationPrivateEndpointConfig>
      | undefined;
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

