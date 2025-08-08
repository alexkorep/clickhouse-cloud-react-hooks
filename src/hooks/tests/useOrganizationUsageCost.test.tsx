import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockFetch } from "../../utils/testUtils";
import { render } from "@testing-library/react";
import { waitFor } from "@testing-library/dom";
import React from "react";
import { useOrganizationUsageCost } from "../useOrganizations";

const organizationId = "550e8400-e29b-41d4-a716-446655440001";

const mockUsageCostResponse = {
  status: 200,
  requestId: "550e8400-e29b-41d4-a716-446655440000",
  result: {
    grandTotalCHC: 100,
    costs: {
      dataWarehouseId: "550e8400-e29b-41d4-a716-446655440001",
      serviceId: "550e8400-e29b-41d4-a716-446655440002",
      date: "2024-01-01",
      entityType: "datawarehouse",
      entityId: "550e8400-e29b-41d4-a716-446655440001",
      entityName: "Test Data Warehouse",
      metrics: {
        storageCHC: 10,
      },
      totalCHC: 100,
      locked: false,
    },
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
  mockFetch<typeof mockUsageCostResponse>({
    response: mockUsageCostResponse,
  });
});

describe("useOrganizationUsageCost", () => {
  function HookTest({
    onResult,
    organizationId: orgId,
    config: testConfig,
    params,
  }: {
    onResult: (result: ReturnType<typeof useOrganizationUsageCost>) => void;
    organizationId: string;
    config: typeof config;
    params?: { startDate?: string; endDate?: string };
  }) {
    const result = useOrganizationUsageCost(orgId, testConfig, params);
    React.useEffect(() => {
      onResult(result);
    }, [result, onResult]);
    return null;
  }

  it("should fetch and return usage cost data", async () => {
    let hookResult: ReturnType<typeof useOrganizationUsageCost> | undefined;
    render(
      <HookTest
        organizationId={organizationId}
        config={config}
        params={{ startDate: "2024-01-01", endDate: "2024-01-02" }}
        onResult={(r) => (hookResult = r)}
      />
    );
    await waitFor(() => expect(hookResult?.isLoading).toBe(false));
    expect(hookResult?.data).toEqual(mockUsageCostResponse.result);
    expect(hookResult?.error).toBeUndefined();
    expect(hookResult?.response).toEqual(mockUsageCostResponse);
  });

  it("should handle API error", async () => {
    mockFetch<{ status: number; error: string }>({
      response: { status: 500, error: "Internal Server Error" },
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });
    let hookResult: ReturnType<typeof useOrganizationUsageCost> | undefined;
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

