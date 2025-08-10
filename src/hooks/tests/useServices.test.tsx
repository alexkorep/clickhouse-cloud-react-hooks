import { describe, it, expect, beforeEach, vi } from "vitest";
import { render } from "@testing-library/react";
import { waitFor } from "@testing-library/dom";
import React from "react";
import {
  useServices,
  useService,
  useCreateService,
  useUpdateService,
  useDeleteService,
  useServiceState,
  useServiceReplicaScaling,
  useServicePassword,
  useServicePrivateEndpointConfig,
  useServiceQueryEndpoint,
  useServicePrometheus,
  useCreateServicePrivateEndpoint,
  useServiceScaling,
} from "../useServices";
import { mockFetch } from "../../utils/testUtils";

const config = {
  keyId: "id",
  keySecret: "secret",
  baseUrl: "https://api.clickhouse.cloud",
};

const orgId = "org1";
const serviceId = "123e4567-e89b-12d3-a456-426614174000";

const mockService = {
  id: serviceId,
  name: "svc",
  tier: "development" as const,
  region: "us-east-1",
  provider: "aws",
  state: "running" as const,
  release_channel: "stable" as const,
  version: "v1",
  max_replicas: 1,
  min_replicas: 1,
  replicas: 1,
  endpoints: [{ host: "host", port: 8123, protocol: "https" }],
  created_at: "2024-01-01T00:00:00.000Z",
  updated_at: "2024-01-01T00:00:00.000Z",
  last_used_at: "2024-01-01T00:00:00.000Z",
  ip_access: [{ source: "0.0.0.0/0", description: "all" }],
};

describe("useServices hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function ServicesHookTest({ onResult }: { onResult: (r: ReturnType<typeof useServices>) => void }) {
    const result = useServices(orgId, config);
    React.useEffect(() => {
      onResult(result);
    }, [result, onResult]);
    return null;
  }

  it("useServices fetches list", async () => {
    const mockResponse = {
      status: 200,
  requestId: "123e4567-e89b-12d3-a456-426614174100",
      result: [mockService],
    };
    mockFetch({ response: mockResponse });
    let hookResult: ReturnType<typeof useServices> | undefined;
    render(<ServicesHookTest onResult={(r) => (hookResult = r)} />);
    await waitFor(() => expect(hookResult?.isLoading).toBe(false));
    expect(hookResult?.data).toEqual(mockResponse.result);
  });

  function ServiceHookTest({ onResult }: { onResult: (r: ReturnType<typeof useService>) => void }) {
    const result = useService(orgId, serviceId, config);
    React.useEffect(() => {
      onResult(result);
    }, [result, onResult]);
    return null;
  }

  it("useService fetches details", async () => {
    const mockResponse = {
      status: 200,
      requestId: "123e4567-e89b-12d3-a456-426614174101",
      result: mockService,
    };
    mockFetch({ response: mockResponse });
    let hookResult: ReturnType<typeof useService> | undefined;
    render(<ServiceHookTest onResult={(r) => (hookResult = r)} />);
    await waitFor(() => expect(hookResult?.isLoading).toBe(false));
    expect(hookResult?.data).toEqual(mockResponse.result);
  });

  it("useCreateService posts data", async () => {
    const { createService } = useCreateService(orgId, config);
    const body = { name: "new" };
    mockFetch({ response: { ok: true } });
    await createService(body);
    expect(global.fetch).toHaveBeenCalledWith(
      `${config.baseUrl}/v1/organizations/${orgId}/services`,
      expect.objectContaining({ method: "POST", body: JSON.stringify(body) })
    );
  });

  it("useUpdateService patches data", async () => {
    const { updateService } = useUpdateService(orgId, serviceId, config);
    const body = { name: "upd" };
    mockFetch({ response: { ok: true } });
    await updateService(body);
    expect(global.fetch).toHaveBeenCalledWith(
      `${config.baseUrl}/v1/organizations/${orgId}/services/${serviceId}`,
      expect.objectContaining({ method: "PATCH", body: JSON.stringify(body) })
    );
  });

  it("useDeleteService deletes", async () => {
    const { deleteService } = useDeleteService(orgId, serviceId, config);
    mockFetch({ response: { ok: true } });
    await deleteService();
    expect(global.fetch).toHaveBeenCalledWith(
      `${config.baseUrl}/v1/organizations/${orgId}/services/${serviceId}`,
      expect.objectContaining({ method: "DELETE" })
    );
  });

  it("useServiceState patches state", async () => {
    const { updateServiceState } = useServiceState(orgId, serviceId, config);
    const body = { command: "start" as const };
    mockFetch({ response: { ok: true } });
    await updateServiceState(body);
    expect(global.fetch).toHaveBeenCalledWith(
      `${config.baseUrl}/v1/organizations/${orgId}/services/${serviceId}/state`,
      expect.objectContaining({ method: "PATCH", body: JSON.stringify(body) })
    );
  });

  it("useServiceReplicaScaling patches replica scaling", async () => {
    const { updateServiceScaling } = useServiceReplicaScaling(orgId, serviceId, config);
    const body = { x: 1 };
    mockFetch({ response: { ok: true } });
    await updateServiceScaling(body);
    expect(global.fetch).toHaveBeenCalledWith(
      `${config.baseUrl}/v1/organizations/${orgId}/services/${serviceId}/replicaScaling`,
      expect.objectContaining({ method: "PATCH", body: JSON.stringify(body) })
    );
  });

  it("useServicePassword patches password", async () => {
    const { updateServicePassword } = useServicePassword(orgId, serviceId, config);
    const body = { newPassword: "pass" };
    mockFetch({ response: { ok: true } });
    await updateServicePassword(body);
    expect(global.fetch).toHaveBeenCalledWith(
      `${config.baseUrl}/v1/organizations/${orgId}/services/${serviceId}/password`,
      expect.objectContaining({ method: "PATCH", body: JSON.stringify(body) })
    );
  });

  function PrivateEndpointConfigHook({ onResult }: { onResult: (r: ReturnType<typeof useServicePrivateEndpointConfig>) => void }) {
    const result = useServicePrivateEndpointConfig(orgId, serviceId, config);
    React.useEffect(() => {
      onResult(result);
    }, [result, onResult]);
    return null;
  }

  it("useServicePrivateEndpointConfig fetches data", async () => {
    const mockResponse = {
      status: 200,
      requestId: "123e4567-e89b-12d3-a456-426614174102",
      result: { endpointServiceId: "e1" },
    };
    mockFetch({ response: mockResponse });
    let hookResult: ReturnType<typeof useServicePrivateEndpointConfig> | undefined;
    render(<PrivateEndpointConfigHook onResult={(r) => (hookResult = r)} />);
    await waitFor(() => expect(hookResult?.isLoading).toBe(false));
    expect(hookResult?.data).toEqual(mockResponse.result);
  });

  function QueryEndpointHook({ onResult }: { onResult: (r: ReturnType<typeof useServiceQueryEndpoint>) => void }) {
    const result = useServiceQueryEndpoint(orgId, serviceId, config);
    React.useEffect(() => {
      onResult(result);
    }, [result, onResult]);
    return null;
  }

  it("useServiceQueryEndpoint fetches and manages endpoint", async () => {
    const mockResponse = {
      status: 200,
      requestId: "123e4567-e89b-12d3-a456-426614174103",
      result: { id: "qe1" },
    };
    mockFetch({ response: mockResponse });
    let hookResult: ReturnType<typeof useServiceQueryEndpoint> | undefined;
    render(<QueryEndpointHook onResult={(r) => (hookResult = r)} />);
    await waitFor(() => expect(hookResult?.isLoading).toBe(false));
    expect(hookResult?.data).toEqual(mockResponse.result);
    mockFetch({ response: { ok: true } });
    await hookResult!.createQueryEndpoint({ a: 1 });
    expect(global.fetch).toHaveBeenCalledWith(
      `${config.baseUrl}/v1/organizations/${orgId}/services/${serviceId}/serviceQueryEndpoint`,
      expect.objectContaining({ method: "POST" })
    );
    mockFetch({ response: { ok: true } });
    await hookResult!.deleteQueryEndpoint();
    expect(global.fetch).toHaveBeenCalledWith(
      `${config.baseUrl}/v1/organizations/${orgId}/services/${serviceId}/serviceQueryEndpoint`,
      expect.objectContaining({ method: "DELETE" })
    );
  });

  function PrometheusHook({
    onResult,
  }: {
    onResult: (r: ReturnType<typeof useServicePrometheus>) => void;
  }) {
    const result = useServicePrometheus(orgId, serviceId, config, {
      filteredMetrics: true,
    });
    React.useEffect(() => {
      onResult(result);
    }, [result, onResult]);
    return null;
  }

  it("useServicePrometheus fetches metrics", async () => {
    mockFetch({ response: "metrics" });
    let hookResult: ReturnType<typeof useServicePrometheus> | undefined;
    render(<PrometheusHook onResult={(r) => (hookResult = r)} />);
    await waitFor(() => expect(hookResult?.isLoading).toBe(false));
    expect(hookResult?.data).toBe("metrics");
    expect(global.fetch).toHaveBeenCalledWith(
      `${config.baseUrl}/v1/organizations/${orgId}/services/${serviceId}/prometheus?filtered_metrics=true`,
      expect.any(Object)
    );
  });

  it("useCreateServicePrivateEndpoint posts", async () => {
    const { createPrivateEndpoint } = useCreateServicePrivateEndpoint(orgId, serviceId, config);
    const body = { id: "pe" };
    mockFetch({ response: { ok: true } });
    await createPrivateEndpoint(body);
    expect(global.fetch).toHaveBeenCalledWith(
      `${config.baseUrl}/v1/organizations/${orgId}/services/${serviceId}/privateEndpoint`,
      expect.objectContaining({ method: "POST", body: JSON.stringify(body) })
    );
  });

  it("useServiceScaling patches scaling", async () => {
    const { updateServiceScaling } = useServiceScaling(orgId, serviceId, config);
    const body = { x: 2 };
    mockFetch({ response: { ok: true } });
    await updateServiceScaling(body);
    expect(global.fetch).toHaveBeenCalledWith(
      `${config.baseUrl}/v1/organizations/${orgId}/services/${serviceId}/scaling`,
      expect.objectContaining({ method: "PATCH", body: JSON.stringify(body) })
    );
  });
});
