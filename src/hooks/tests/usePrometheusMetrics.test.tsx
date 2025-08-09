import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockFetch } from "../../utils/testUtils";
import { render } from "@testing-library/react";
import { waitFor } from "@testing-library/dom";
import React from "react";
import {
  useOrganizationPrometheusMetrics,
  useServicePrometheusMetrics,
} from "../usePrometheusMetrics";

const metricsResponse = "# HELP some_metric\n# TYPE some_metric counter";

const config = {
  keyId: "test-key-id",
  keySecret: "test-key-secret",
  baseUrl: "https://api.clickhouse.cloud",
};

describe("useOrganizationPrometheusMetrics", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch({ response: metricsResponse });
  });

  function HookTest({
    onResult,
    filteredMetrics,
  }: {
    onResult: (
      result: ReturnType<typeof useOrganizationPrometheusMetrics>
    ) => void;
    filteredMetrics?: boolean;
  }) {
    const result = useOrganizationPrometheusMetrics(
      "org1",
      config,
      filteredMetrics
    );
    React.useEffect(() => {
      onResult(result);
    }, [result, onResult]);
    return null;
  }

  it("fetches organization metrics", async () => {
    let hookResult:
      | ReturnType<typeof useOrganizationPrometheusMetrics>
      | undefined;
    render(
      <HookTest
        filteredMetrics
        onResult={(r) => (hookResult = r)}
      />
    );
    await waitFor(() => expect(hookResult?.isLoading).toBe(false));
    expect(hookResult?.data).toBe(metricsResponse);
    expect(hookResult?.error).toBeUndefined();
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.clickhouse.cloud/v1/organizations/org1/prometheus?filtered_metrics=true",
      expect.any(Object)
    );
  });

  it("handles API error", async () => {
    mockFetch<{ status: number; error: string }>({
      response: { status: 404, error: "Not found" },
      ok: false,
      status: 404,
      statusText: "Not Found",
      text: JSON.stringify({ status: 404, error: "Not found" }),
    });
    let hookResult:
      | ReturnType<typeof useOrganizationPrometheusMetrics>
      | undefined;
    render(
      <HookTest onResult={(r) => (hookResult = r)} />
    );
    await waitFor(() => expect(hookResult?.isLoading).toBe(false));
    expect(hookResult?.data).toBeUndefined();
    expect(hookResult?.error).toBeDefined();
  });
});

describe("useServicePrometheusMetrics", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch({ response: metricsResponse });
  });

  function HookTest({
    onResult,
    filteredMetrics,
  }: {
    onResult: (result: ReturnType<typeof useServicePrometheusMetrics>) => void;
    filteredMetrics?: boolean;
  }) {
    const result = useServicePrometheusMetrics(
      "org1",
      "svc1",
      config,
      filteredMetrics
    );
    React.useEffect(() => {
      onResult(result);
    }, [result, onResult]);
    return null;
  }

  it("fetches service metrics", async () => {
    let hookResult: ReturnType<typeof useServicePrometheusMetrics> | undefined;
    render(
      <HookTest
        filteredMetrics
        onResult={(r) => (hookResult = r)}
      />
    );
    await waitFor(() => expect(hookResult?.isLoading).toBe(false));
    expect(hookResult?.data).toBe(metricsResponse);
    expect(hookResult?.error).toBeUndefined();
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.clickhouse.cloud/v1/organizations/org1/services/svc1/prometheus?filtered_metrics=true",
      expect.any(Object)
    );
  });

  it("handles API error", async () => {
    mockFetch<{ status: number; error: string }>({
      response: { status: 500, error: "Server error" },
      ok: false,
      status: 500,
      statusText: "Server Error",
      text: JSON.stringify({ status: 500, error: "Server error" }),
    });
    let hookResult: ReturnType<typeof useServicePrometheusMetrics> | undefined;
    render(<HookTest onResult={(r) => (hookResult = r)} />);
    await waitFor(() => expect(hookResult?.isLoading).toBe(false));
    expect(hookResult?.data).toBeUndefined();
    expect(hookResult?.error).toBeDefined();
  });
});

