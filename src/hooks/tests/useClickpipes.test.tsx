import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { waitFor } from "@testing-library/dom";
import React from "react";
import {
  useClickpipes,
  useClickpipe,
  useCreateClickpipe,
  useUpdateClickpipe,
  useDeleteClickpipe,
  useClickpipeScaling,
  useClickpipeState,
} from "../useClickpipes";
import { mockFetch } from "../../utils/testUtils";

const organizationId = "550e8400-e29b-41d4-a716-446655440000";
const serviceId = "550e8400-e29b-41d4-a716-446655440001";
const clickPipeId = "550e8400-e29b-41d4-a716-446655440002";

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

const mockClickpipesResponse = {
  status: 200,
  requestId: "550e8400-e29b-41d4-a716-446655440010",
  result: [
    {
      id: clickPipeId,
      serviceId,
      name: "Pipe 1",
      state: "running",
    },
  ],
};

const mockClickpipeResponse = {
  status: 200,
  requestId: "550e8400-e29b-41d4-a716-446655440011",
  result: {
    id: clickPipeId,
    serviceId,
    name: "Pipe 1",
    state: "running",
  },
};

const mockBaseResponse = {
  status: 200,
  requestId: "550e8400-e29b-41d4-a716-446655440012",
};

describe("useClickpipes hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch({ response: mockClickpipesResponse });
  });

  function ListHook({
    onResult,
    cfg,
  }: {
    onResult: (result: ReturnType<typeof useClickpipes>) => void;
    cfg: typeof config;
  }) {
    const result = useClickpipes(organizationId, serviceId, cfg);
    React.useEffect(() => {
      onResult(result);
    }, [result, onResult]);
    return null;
  }

  it("useClickpipes should fetch list", async () => {
    let hookResult: ReturnType<typeof useClickpipes> | undefined;
    render(<ListHook cfg={config} onResult={(r) => (hookResult = r)} />);
    await waitFor(() => expect(hookResult?.isLoading).toBe(false));
    expect(hookResult?.data).toEqual(mockClickpipesResponse.result);
    expect(hookResult?.response).toEqual(mockClickpipesResponse);
  });

  it("useClickpipes should handle error", async () => {
    mockFetch({
      response: { status: 404, error: "Not found" },
      ok: false,
      status: 404,
      statusText: "Not Found",
    });
    let hookResult: ReturnType<typeof useClickpipes> | undefined;
    render(<ListHook cfg={errorConfig} onResult={(r) => (hookResult = r)} />);
    await waitFor(() => expect(hookResult?.isLoading).toBe(false));
    expect(hookResult?.data).toBeUndefined();
    expect(hookResult?.error).toBeDefined();
  });

  function SingleHook({
    onResult,
    cfg,
  }: {
    onResult: (result: ReturnType<typeof useClickpipe>) => void;
    cfg: typeof config;
  }) {
    const result = useClickpipe(organizationId, serviceId, clickPipeId, cfg);
    React.useEffect(() => {
      onResult(result);
    }, [result, onResult]);
    return null;
  }

  it("useClickpipe should fetch single pipe", async () => {
    mockFetch({ response: mockClickpipeResponse });
    let hookResult: ReturnType<typeof useClickpipe> | undefined;
    render(<SingleHook cfg={config} onResult={(r) => (hookResult = r)} />);
    await waitFor(() => expect(hookResult?.isLoading).toBe(false));
    expect(hookResult?.data).toEqual(mockClickpipeResponse.result);
    expect(hookResult?.response).toEqual(mockClickpipeResponse);
  });

  it("useClickpipe should handle error", async () => {
    mockFetch({
      response: { status: 400, error: "Bad request" },
      ok: false,
      status: 400,
      statusText: "Bad Request",
    });
    let hookResult: ReturnType<typeof useClickpipe> | undefined;
    render(<SingleHook cfg={errorConfig} onResult={(r) => (hookResult = r)} />);
    await waitFor(() => expect(hookResult?.isLoading).toBe(false));
    expect(hookResult?.data).toBeUndefined();
    expect(hookResult?.error).toBeDefined();
  });

  it("useCreateClickpipe should create a pipe", async () => {
    mockFetch({ response: mockClickpipeResponse });
    let createFn: ReturnType<typeof useCreateClickpipe> | undefined;
    function Hook({ onReady }: { onReady: (h: ReturnType<typeof useCreateClickpipe>) => void }) {
      const hook = useCreateClickpipe(organizationId, serviceId, config);
      React.useEffect(() => {
        onReady(hook);
      }, [hook, onReady]);
      return null;
    }
    render(<Hook onReady={(h) => (createFn = h)} />);
    await waitFor(() => expect(createFn).toBeDefined());
    const result = await createFn!.createClickpipe({});
    expect(result).toEqual(mockClickpipeResponse.result);
    expect(global.fetch).toHaveBeenCalledWith(
      `${config.baseUrl}/v1/organizations/${organizationId}/services/${serviceId}/clickpipes`,
      expect.objectContaining({ method: "POST" })
    );
  });

  it("useCreateClickpipe should handle error", async () => {
    mockFetch({
      response: "Error",
      ok: false,
      status: 500,
      statusText: "Server Error",
      text: "Server Error",
    });
    let createFn: ReturnType<typeof useCreateClickpipe> | undefined;
    function Hook({ onReady }: { onReady: (h: ReturnType<typeof useCreateClickpipe>) => void }) {
      const hook = useCreateClickpipe(organizationId, serviceId, errorConfig);
      React.useEffect(() => {
        onReady(hook);
      }, [hook, onReady]);
      return null;
    }
    render(<Hook onReady={(h) => (createFn = h)} />);
    await waitFor(() => expect(createFn).toBeDefined());
    await expect(createFn!.createClickpipe({})).rejects.toBeDefined();
  });

  it("useUpdateClickpipe should update a pipe", async () => {
    mockFetch({ response: mockClickpipeResponse });
    let updateFn: ReturnType<typeof useUpdateClickpipe> | undefined;
    function Hook({ onReady }: { onReady: (h: ReturnType<typeof useUpdateClickpipe>) => void }) {
      const hook = useUpdateClickpipe(organizationId, serviceId, clickPipeId, config);
      React.useEffect(() => {
        onReady(hook);
      }, [hook, onReady]);
      return null;
    }
    render(<Hook onReady={(h) => (updateFn = h)} />);
    await waitFor(() => expect(updateFn).toBeDefined());
    const result = await updateFn!.updateClickpipe({ name: "New" });
    expect(result).toEqual(mockClickpipeResponse.result);
    expect(global.fetch).toHaveBeenCalledWith(
      `${config.baseUrl}/v1/organizations/${organizationId}/services/${serviceId}/clickpipes/${clickPipeId}`,
      expect.objectContaining({ method: "PATCH" })
    );
  });

  it("useDeleteClickpipe should delete a pipe", async () => {
    mockFetch({ response: mockBaseResponse });
    let deleteFn: ReturnType<typeof useDeleteClickpipe> | undefined;
    function Hook({ onReady }: { onReady: (h: ReturnType<typeof useDeleteClickpipe>) => void }) {
      const hook = useDeleteClickpipe(organizationId, serviceId, clickPipeId, config);
      React.useEffect(() => {
        onReady(hook);
      }, [hook, onReady]);
      return null;
    }
    render(<Hook onReady={(h) => (deleteFn = h)} />);
    await waitFor(() => expect(deleteFn).toBeDefined());
    const result = await deleteFn!.deleteClickpipe();
    expect(result).toEqual(mockBaseResponse);
    expect(global.fetch).toHaveBeenCalledWith(
      `${config.baseUrl}/v1/organizations/${organizationId}/services/${serviceId}/clickpipes/${clickPipeId}`,
      expect.objectContaining({ method: "DELETE" })
    );
  });

  it("useClickpipeScaling should update scaling", async () => {
    mockFetch({ response: mockClickpipeResponse });
    let scalingFn: ReturnType<typeof useClickpipeScaling> | undefined;
    function Hook({ onReady }: { onReady: (h: ReturnType<typeof useClickpipeScaling>) => void }) {
      const hook = useClickpipeScaling(organizationId, serviceId, clickPipeId, config);
      React.useEffect(() => {
        onReady(hook);
      }, [hook, onReady]);
      return null;
    }
    render(<Hook onReady={(h) => (scalingFn = h)} />);
    await waitFor(() => expect(scalingFn).toBeDefined());
    const result = await scalingFn!.updateClickpipeScaling({});
    expect(result).toEqual(mockClickpipeResponse.result);
    expect(global.fetch).toHaveBeenCalledWith(
      `${config.baseUrl}/v1/organizations/${organizationId}/services/${serviceId}/clickpipes/${clickPipeId}/scaling`,
      expect.objectContaining({ method: "PATCH" })
    );
  });

  it("useClickpipeState should update state", async () => {
    mockFetch({ response: mockClickpipeResponse });
    let stateFn: ReturnType<typeof useClickpipeState> | undefined;
    function Hook({ onReady }: { onReady: (h: ReturnType<typeof useClickpipeState>) => void }) {
      const hook = useClickpipeState(organizationId, serviceId, clickPipeId, config);
      React.useEffect(() => {
        onReady(hook);
      }, [hook, onReady]);
      return null;
    }
    render(<Hook onReady={(h) => (stateFn = h)} />);
    await waitFor(() => expect(stateFn).toBeDefined());
    const result = await stateFn!.updateClickpipeState({ command: "start" });
    expect(result).toEqual(mockClickpipeResponse.result);
    expect(global.fetch).toHaveBeenCalledWith(
      `${config.baseUrl}/v1/organizations/${organizationId}/services/${serviceId}/clickpipes/${clickPipeId}/state`,
      expect.objectContaining({ method: "PATCH" })
    );
  });
});

