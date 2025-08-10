import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { waitFor } from "@testing-library/dom";
import React from "react";
import {
  useClickpipesReversePrivateEndpoints,
  useClickpipesReversePrivateEndpoint,
  useCreateClickpipesReversePrivateEndpoint,
  useDeleteClickpipesReversePrivateEndpoint,
} from "../useClickpipesReversePrivateEndpoints";
import { mockFetch } from "../../utils/testUtils";

const mockEndpoint = {
  description: "My reverse private endpoint",
  type: "VPC_ENDPOINT_SERVICE",
  vpcEndpointServiceName:
    "com.amazonaws.vpce.us-east-1.vpce-svc-12345678901234567",
  vpcResourceConfigurationId: null,
  vpcResourceShareArn: null,
  mskClusterArn: null,
  mskAuthentication: null,
  id: "12345678-1234-1234-8abc-1234567890ab",
  serviceId: "87654321-4321-4321-8def-210987654321",
  endpointId: "vpce-12345678901234567",
  dnsNames: ["internal"],
  privateDnsNames: ["private"],
  status: "Ready",
};

const listResponse = {
  status: 200,
  requestId: "550e8400-e29b-41d4-a716-446655440000",
  result: [mockEndpoint],
};

const singleResponse = {
  status: 200,
  requestId: "550e8400-e29b-41d4-a716-446655440000",
  result: mockEndpoint,
};

const deleteResponse = {
  status: 200,
  requestId: "550e8400-e29b-41d4-a716-446655440000",
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

describe("useClickpipesReversePrivateEndpoints", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch({ response: listResponse });
  });

  function HookTest({
    onResult,
    organizationId,
    serviceId,
    cfg,
  }: {
    onResult: (r: ReturnType<typeof useClickpipesReversePrivateEndpoints>) => void;
    organizationId: string;
    serviceId: string;
    cfg: typeof config;
  }) {
    const result = useClickpipesReversePrivateEndpoints(
      organizationId,
      serviceId,
      cfg
    );
    React.useEffect(() => {
      onResult(result);
    }, [result, onResult]);
    return null;
  }

  it("fetches reverse private endpoints", async () => {
    let hookResult: ReturnType<typeof useClickpipesReversePrivateEndpoints> | undefined;
    render(
      <HookTest
        onResult={(r) => (hookResult = r)}
        organizationId="org-id"
        serviceId="service-id"
        cfg={config}
      />
    );
    await waitFor(() => expect(hookResult?.isLoading).toBe(false));
    expect(hookResult?.data).toEqual(listResponse.result);
    expect(hookResult?.error).toBeUndefined();
  });

  it("handles API error", async () => {
    mockFetch<{ status: number; error: string }>({
      response: { status: 404, error: "Not found" },
      ok: false,
      status: 404,
      statusText: "Not Found",
    });
    let hookResult: ReturnType<typeof useClickpipesReversePrivateEndpoints> | undefined;
    render(
      <HookTest
        onResult={(r) => (hookResult = r)}
        organizationId="error-org"
        serviceId="error-service"
        cfg={errorConfig}
      />
    );
    await waitFor(() => expect(hookResult?.isLoading).toBe(false));
    expect(hookResult?.data).toBeUndefined();
    expect(hookResult?.error).toBeDefined();
  });
});

describe("useClickpipesReversePrivateEndpoint", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch({ response: singleResponse });
  });

  function HookTest({ onResult }: { onResult: (r: ReturnType<typeof useClickpipesReversePrivateEndpoint>) => void }) {
    const result = useClickpipesReversePrivateEndpoint(
      "org-id",
      "service-id",
      "endpoint-id",
      config
    );
    React.useEffect(() => {
      onResult(result);
    }, [result, onResult]);
    return null;
  }

  it("fetches a reverse private endpoint", async () => {
    let hookResult: ReturnType<typeof useClickpipesReversePrivateEndpoint> | undefined;
    render(<HookTest onResult={(r) => (hookResult = r)} />);
    await waitFor(() => expect(hookResult?.isLoading).toBe(false));
    expect(hookResult?.data).toEqual(singleResponse.result);
    expect(hookResult?.error).toBeUndefined();
  });
});

describe("useCreateClickpipesReversePrivateEndpoint", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch({ response: singleResponse });
  });

  it("creates a reverse private endpoint", async () => {
    const { createReversePrivateEndpoint } =
      useCreateClickpipesReversePrivateEndpoint("org-id", "service-id", config);
    const createData = { description: "My reverse private endpoint", type: "VPC_ENDPOINT_SERVICE" };
    const result = await createReversePrivateEndpoint(createData);
    expect(result).toEqual(mockEndpoint);
    const auth = btoa(`${config.keyId}:${config.keySecret}`);
    expect(fetch).toHaveBeenCalledWith(
      `${config.baseUrl}/v1/organizations/org-id/services/service-id/clickpipesReversePrivateEndpoints`,
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(createData),
      })
    );
  });

  it("handles API error", async () => {
    mockFetch<{ status: number; error: string }>({
      response: { status: 400, error: "Bad Request" },
      ok: false,
      status: 400,
      statusText: "Bad Request",
    });
    const { createReversePrivateEndpoint } =
      useCreateClickpipesReversePrivateEndpoint("org-id", "service-id", errorConfig);
    await expect(
      createReversePrivateEndpoint({ description: "test", type: "VPC_ENDPOINT_SERVICE" })
    ).rejects.toThrow();
  });
});

describe("useDeleteClickpipesReversePrivateEndpoint", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch({ response: deleteResponse });
  });

  it("deletes a reverse private endpoint", async () => {
    const { deleteReversePrivateEndpoint } =
      useDeleteClickpipesReversePrivateEndpoint(
        "org-id",
        "service-id",
        "endpoint-id",
        config
      );
    const result = await deleteReversePrivateEndpoint();
    expect(result).toEqual(deleteResponse);
    const auth = btoa(`${config.keyId}:${config.keySecret}`);
    expect(fetch).toHaveBeenCalledWith(
      `${config.baseUrl}/v1/organizations/org-id/services/service-id/clickpipesReversePrivateEndpoints/endpoint-id`,
      expect.objectContaining({
        method: "DELETE",
        headers: expect.objectContaining({
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        }),
      })
    );
  });

  it("handles API error", async () => {
    mockFetch<{ status: number; error: string }>({
      response: { status: 404, error: "Not found" },
      ok: false,
      status: 404,
      statusText: "Not Found",
    });
    const { deleteReversePrivateEndpoint } =
      useDeleteClickpipesReversePrivateEndpoint(
        "org-id",
        "service-id",
        "endpoint-id",
        errorConfig
      );
    await expect(deleteReversePrivateEndpoint()).rejects.toThrow();
  });
});

