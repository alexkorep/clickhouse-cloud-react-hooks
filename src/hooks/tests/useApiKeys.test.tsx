import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { waitFor } from "@testing-library/dom";
import { act } from "react";
import React from "react";
import {
  useApiKeys,
  useApiKey,
  useCreateApiKey,
  useUpdateApiKey,
  useDeleteApiKey,
} from "../useApiKeys";
import { mockFetch } from "../../utils/testUtils";

const organizationId = "550e8400-e29b-41d4-a716-446655440001";
const apiKeyId = "550e8400-e29b-41d4-a716-446655440002";

const config = {
  keyId: "test-key-id",
  keySecret: "test-key-secret",
  baseUrl: "https://api.clickhouse.cloud",
};

const mockApiKeysResponse = {
  status: 200,
  requestId: "550e8400-e29b-41d4-a716-446655440000",
  result: [
    {
      id: apiKeyId,
      name: "Key One",
      state: "enabled",
      roles: ["developer"],
      keySuffix: "abcd",
      createdAt: "2024-01-01T00:00:00Z",
      expireAt: null,
      usedAt: null,
      ipAccessList: [],
    },
  ],
};

const mockApiKeyResponse = {
  status: 200,
  requestId: "550e8400-e29b-41d4-a716-446655440000",
  result: mockApiKeysResponse.result[0],
};

const mockCreateResponse = {
  status: 200,
  requestId: "550e8400-e29b-41d4-a716-446655440000",
  result: {
    key: mockApiKeysResponse.result[0],
    keyId: apiKeyId,
    keySecret: "secret",
  },
};

const mockUpdateResponse = mockApiKeyResponse;

const mockDeleteResponse = {
  status: 200,
  requestId: "550e8400-e29b-41d4-a716-446655440000",
};

describe("useApiKeys hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("useApiKeys should fetch keys", async () => {
    mockFetch<typeof mockApiKeysResponse>({ response: mockApiKeysResponse });
    let hookResult: ReturnType<typeof useApiKeys> | undefined;
    function HookTest({ onResult }: { onResult: (r: ReturnType<typeof useApiKeys>) => void }) {
      const result = useApiKeys(organizationId, config);
      React.useEffect(() => {
        onResult(result);
      }, [result, onResult]);
      return null;
    }
    render(<HookTest onResult={(r) => (hookResult = r)} />);
    await waitFor(() => expect(hookResult?.isLoading).toBe(false));
    expect(hookResult?.data).toEqual(mockApiKeysResponse.result);
    expect(hookResult?.response).toEqual(mockApiKeysResponse);
  });

  it("useApiKey should fetch single key", async () => {
    mockFetch<typeof mockApiKeyResponse>({ response: mockApiKeyResponse });
    let hookResult: ReturnType<typeof useApiKey> | undefined;
    function HookTest({ onResult }: { onResult: (r: ReturnType<typeof useApiKey>) => void }) {
      const result = useApiKey(organizationId, apiKeyId, config);
      React.useEffect(() => {
        onResult(result);
      }, [result, onResult]);
      return null;
    }
    render(<HookTest onResult={(r) => (hookResult = r)} />);
    await waitFor(() => expect(hookResult?.isLoading).toBe(false));
    expect(hookResult?.data).toEqual(mockApiKeyResponse.result);
    expect(hookResult?.response).toEqual(mockApiKeyResponse);
  });

  it("useCreateApiKey should create key", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        json: () => Promise.resolve(mockCreateResponse),
        headers: new Headers(),
        redirected: false,
        type: "basic",
        url: "",
        clone: () => ({} as Response),
        body: null,
        bodyUsed: false,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
        blob: () => Promise.resolve(new Blob()),
        formData: () => Promise.resolve(new FormData()),
        text: () => Promise.resolve(""),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        json: () => Promise.resolve(mockApiKeysResponse),
        headers: new Headers(),
        redirected: false,
        type: "basic",
        url: "",
        clone: () => ({} as Response),
        body: null,
        bodyUsed: false,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
        blob: () => Promise.resolve(new Blob()),
        formData: () => Promise.resolve(new FormData()),
        text: () => Promise.resolve(""),
      } as Response);
    global.fetch = fetchMock as unknown as typeof fetch;
    let hookResult: ReturnType<typeof useCreateApiKey> | undefined;
    function HookTest({ onResult }: { onResult: (r: ReturnType<typeof useCreateApiKey>) => void }) {
      const result = useCreateApiKey(organizationId, config);
      React.useEffect(() => {
        onResult(result);
      }, [result, onResult]);
      return null;
    }
    render(<HookTest onResult={(r) => (hookResult = r)} />);
    await waitFor(() => expect(hookResult).toBeDefined());
    let created;
    await act(async () => {
      created = await hookResult!.createApiKey({
        name: "Key One",
        roles: ["developer"],
      });
    });
    expect(created).toEqual(mockCreateResponse.result);
    expect(fetchMock).toHaveBeenCalledWith(
      `${config.baseUrl}/v1/organizations/${organizationId}/keys`,
      expect.objectContaining({ method: "POST" })
    );
  });

  it("useUpdateApiKey should update key", async () => {
    mockFetch<typeof mockUpdateResponse>({ response: mockUpdateResponse });
    let hookResult: ReturnType<typeof useUpdateApiKey> | undefined;
    function HookTest({ onResult }: { onResult: (r: ReturnType<typeof useUpdateApiKey>) => void }) {
      const result = useUpdateApiKey(organizationId, apiKeyId, config);
      React.useEffect(() => {
        onResult(result);
      }, [result, onResult]);
      return null;
    }
    render(<HookTest onResult={(r) => (hookResult = r)} />);
    await waitFor(() => expect(hookResult).toBeDefined());
    const result = await hookResult!.updateApiKey({ name: "Updated" });
    expect(result).toEqual(mockUpdateResponse.result);
    expect(global.fetch).toHaveBeenCalledWith(
      `${config.baseUrl}/v1/organizations/${organizationId}/keys/${apiKeyId}`,
      expect.objectContaining({ method: "PATCH" })
    );
  });

  it("useDeleteApiKey should delete key", async () => {
    mockFetch<typeof mockDeleteResponse>({ response: mockDeleteResponse });
    let hookResult: ReturnType<typeof useDeleteApiKey> | undefined;
    function HookTest({ onResult }: { onResult: (r: ReturnType<typeof useDeleteApiKey>) => void }) {
      const result = useDeleteApiKey(organizationId, apiKeyId, config);
      React.useEffect(() => {
        onResult(result);
      }, [result, onResult]);
      return null;
    }
    render(<HookTest onResult={(r) => (hookResult = r)} />);
    await waitFor(() => expect(hookResult).toBeDefined());
    const result = await hookResult!.deleteApiKey();
    expect(result).toEqual(mockDeleteResponse);
    expect(global.fetch).toHaveBeenCalledWith(
      `${config.baseUrl}/v1/organizations/${organizationId}/keys/${apiKeyId}`,
      expect.objectContaining({ method: "DELETE" })
    );
  });
});
