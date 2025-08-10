import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, renderHook, act } from "@testing-library/react";
import { waitFor } from "@testing-library/dom";
import React from "react";
import {
  useInvitations,
  useCreateInvitation,
  useInvitation,
  useDeleteInvitation,
} from "../useInvitations";
import { mockFetch } from "../../utils/testUtils";

const mockInvitation = {
  role: "admin",
  id: "550e8400-e29b-41d4-a716-446655440010",
  email: "user@example.com",
  createdAt: "2024-01-01T00:00:00Z",
  expireAt: "2024-01-31T00:00:00Z",
};

const listResponse = {
  status: 200,
  requestId: "550e8400-e29b-41d4-a716-446655440100",
  result: [mockInvitation],
};

const singleResponse = {
  status: 200,
  requestId: "550e8400-e29b-41d4-a716-446655440101",
  result: mockInvitation,
};

const deleteResponse = {
  status: 200,
  requestId: "550e8400-e29b-41d4-a716-446655440102",
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
mockFetch<typeof listResponse>({ response: listResponse });

describe("useInvitations hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch<typeof listResponse>({ response: listResponse });
  });

  function InvitationsHookTest({
    onResult,
    organizationId,
    config: testConfig,
  }: {
    onResult: (result: ReturnType<typeof useInvitations>) => void;
    organizationId: string;
    config: typeof config;
  }) {
    const result = useInvitations(organizationId, testConfig);
    React.useEffect(() => {
      onResult(result);
    }, [result, onResult]);
    return null;
  }

  function InvitationHookTest({
    onResult,
    organizationId,
    invitationId,
    config: testConfig,
  }: {
    onResult: (result: ReturnType<typeof useInvitation>) => void;
    organizationId: string;
    invitationId: string;
    config: typeof config;
  }) {
    const result = useInvitation(organizationId, invitationId, testConfig);
    React.useEffect(() => {
      onResult(result);
    }, [result, onResult]);
    return null;
  }

  it("should fetch and return invitations", async () => {
    let hookResult: ReturnType<typeof useInvitations> | undefined;
    render(
      <InvitationsHookTest
        organizationId="org-123"
        config={config}
        onResult={(r) => (hookResult = r)}
      />
    );
    await waitFor(() => expect(hookResult?.isLoading).toBe(false));
    expect(hookResult?.data).toEqual(listResponse.result);
    expect(hookResult?.error).toBeUndefined();
    expect(hookResult?.response).toEqual(listResponse);
  });

  it("should handle invitations API error", async () => {
    mockFetch<{ status: number; error: string }>({
      response: { status: 404, error: "Not found" },
      ok: false,
      status: 404,
      statusText: "Not Found",
    });
    let hookResult: ReturnType<typeof useInvitations> | undefined;
    render(
      <InvitationsHookTest
        organizationId="error-org"
        config={errorConfig}
        onResult={(r) => (hookResult = r)}
      />
    );
    await waitFor(() => expect(hookResult?.isLoading).toBe(false));
    expect(hookResult?.data).toBeUndefined();
    expect(hookResult?.error).toBeDefined();
  });

  it("should create an invitation", async () => {
    mockFetch<typeof singleResponse>({ response: singleResponse });
    const { result } = renderHook(() => useCreateInvitation("org-123", config));
    await act(async () => {
      const created = await result.current.createInvitation({
        email: "user@example.com",
        role: "admin",
      });
      expect(created).toEqual(singleResponse.result);
    });
  });

  it("should handle create invitation error", async () => {
    mockFetch<{ status: number; error: string }>({
      response: { status: 400, error: "Bad request" },
      ok: false,
      status: 400,
      statusText: "Bad Request",
      text: "Bad request",
    });
    const { result } = renderHook(() =>
      useCreateInvitation("org-123", errorConfig)
    );
    await act(async () => {
      await expect(
        result.current.createInvitation({ email: "bad", role: "admin" })
      ).rejects.toBeDefined();
    });
  });

  it("should fetch single invitation", async () => {
    mockFetch<typeof singleResponse>({ response: singleResponse });
    let hookResult: ReturnType<typeof useInvitation> | undefined;
    render(
      <InvitationHookTest
        organizationId="org-123"
        invitationId="550e8400-e29b-41d4-a716-446655440010"
        config={config}
        onResult={(r) => (hookResult = r)}
      />
    );
    await waitFor(() => expect(hookResult?.isLoading).toBe(false));
    expect(hookResult?.data).toEqual(singleResponse.result);
    expect(hookResult?.error).toBeUndefined();
    expect(hookResult?.response).toEqual(singleResponse);
  });

  it("should handle invitation fetch error", async () => {
    mockFetch<{ status: number; error: string }>({
      response: { status: 404, error: "Not found" },
      ok: false,
      status: 404,
      statusText: "Not Found",
    });
    let hookResult: ReturnType<typeof useInvitation> | undefined;
    render(
      <InvitationHookTest
        organizationId="org-123"
        invitationId="invalid"
        config={errorConfig}
        onResult={(r) => (hookResult = r)}
      />
    );
    await waitFor(() => expect(hookResult?.isLoading).toBe(false));
    expect(hookResult?.data).toBeUndefined();
    expect(hookResult?.error).toBeDefined();
  });

  it("should delete an invitation", async () => {
    mockFetch<typeof deleteResponse>({ response: deleteResponse });
    const { result } = renderHook(() =>
      useDeleteInvitation(
        "org-123",
        "550e8400-e29b-41d4-a716-446655440010",
        config
      )
    );
    await act(async () => {
      const deleted = await result.current.deleteInvitation();
      expect(deleted).toEqual(deleteResponse);
    });
  });

  it("should handle delete invitation error", async () => {
    mockFetch<{ status: number; error: string }>({
      response: { status: 404, error: "Not found" },
      ok: false,
      status: 404,
      statusText: "Not Found",
      text: "Not found",
    });
    const { result } = renderHook(() =>
      useDeleteInvitation("org-123", "invalid", errorConfig)
    );
    await act(async () => {
      await expect(result.current.deleteInvitation()).rejects.toBeDefined();
    });
  });
});
