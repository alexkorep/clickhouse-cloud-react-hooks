import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { waitFor } from "@testing-library/dom";
import React from "react";
import { mockFetch } from "../../utils/testUtils";
import {
  useOrganizationMembers,
  useOrganizationMember,
  useUpdateOrganizationMember,
  useDeleteOrganizationMember,
  useOrganizationInvitations,
  useCreateOrganizationInvitation,
  useOrganizationInvitation,
  useDeleteOrganizationInvitation,
} from "../useUserManagement";

const organizationId = "550e8400-e29b-41d4-a716-446655440001";
const userId = "550e8400-e29b-41d4-a716-446655440002";
const invitationId = "550e8400-e29b-41d4-a716-446655440003";

const config = {
  keyId: "test-key-id",
  keySecret: "test-key-secret",
  baseUrl: "https://api.clickhouse.cloud",
};

const member = {
  userId,
  name: "Test User",
  email: "test@example.com",
  role: "admin" as const,
  joinedAt: "2024-01-01T00:00:00Z",
};

const invitation = {
  id: invitationId,
  email: "invite@example.com",
  role: "developer" as const,
  createdAt: "2024-01-01T00:00:00Z",
  expireAt: "2024-02-01T00:00:00Z",
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useOrganizationMembers", () => {
  it("fetches and returns members", async () => {
    mockFetch({
      response: {
        status: 200,
        requestId: "550e8400-e29b-41d4-a716-446655440010",
        result: [member],
      },
    });

    function HookTest({
      onResult,
    }: {
      onResult: (r: ReturnType<typeof useOrganizationMembers>) => void;
    }) {
      const result = useOrganizationMembers(organizationId, config);
      React.useEffect(() => {
        onResult(result);
      }, [result, onResult]);
      return null;
    }

    let hookResult: ReturnType<typeof useOrganizationMembers> | undefined;
    render(<HookTest onResult={(r) => (hookResult = r)} />);
    await waitFor(() => expect(hookResult?.isLoading).toBe(false));
    expect(hookResult?.data).toEqual([member]);
    expect(hookResult?.error).toBeUndefined();
  });
});

describe("useOrganizationMember", () => {
  it("fetches and returns a member", async () => {
    mockFetch({
      response: {
        status: 200,
        requestId: "550e8400-e29b-41d4-a716-446655440011",
        result: member,
      },
    });

    function HookTest({
      onResult,
    }: {
      onResult: (r: ReturnType<typeof useOrganizationMember>) => void;
    }) {
      const result = useOrganizationMember(organizationId, userId, config);
      React.useEffect(() => {
        onResult(result);
      }, [result, onResult]);
      return null;
    }

    let hookResult: ReturnType<typeof useOrganizationMember> | undefined;
    render(<HookTest onResult={(r) => (hookResult = r)} />);
    await waitFor(() => expect(hookResult?.isLoading).toBe(false));
    expect(hookResult?.data).toEqual(member);
    expect(hookResult?.error).toBeUndefined();
  });
});

describe("useUpdateOrganizationMember", () => {
  function HookTest({
    onResult,
  }: {
    onResult: (r: ReturnType<typeof useUpdateOrganizationMember>) => void;
  }) {
    const result = useUpdateOrganizationMember(organizationId, userId, config);
    React.useEffect(() => {
      onResult(result);
    }, [result, onResult]);
    return null;
  }

  it("updates and returns member", async () => {
    mockFetch({
      response: {
        status: 200,
        requestId: "550e8400-e29b-41d4-a716-446655440012",
        result: member,
      },
    });
    let hookResult: ReturnType<typeof useUpdateOrganizationMember> | undefined;
    render(<HookTest onResult={(r) => (hookResult = r)} />);
    await waitFor(() => expect(hookResult).toBeDefined());
    const result = await hookResult!.updateMember({ role: "admin" });
    expect(result).toEqual(member);
    expect(global.fetch).toHaveBeenCalledWith(
      `${config.baseUrl}/v1/organizations/${organizationId}/members/${userId}`,
      expect.objectContaining({ method: "PATCH" })
    );
  });

  it("throws on API error", async () => {
    mockFetch({
      response: { status: 400, error: "Bad request" },
      ok: false,
      status: 400,
      statusText: "Bad Request",
      text: "Bad request",
    });
    let hookResult: ReturnType<typeof useUpdateOrganizationMember> | undefined;
    render(<HookTest onResult={(r) => (hookResult = r)} />);
    await waitFor(() => expect(hookResult).toBeDefined());
    await expect(
      hookResult!.updateMember({ role: "admin" })
    ).rejects.toThrow("Bad request");
  });
});

describe("useDeleteOrganizationMember", () => {
  it("deletes a member", async () => {
    mockFetch({
      response: {
        status: 200,
        requestId: "550e8400-e29b-41d4-a716-446655440013",
      },
    });

    function HookTest({
      onResult,
    }: {
      onResult: (r: ReturnType<typeof useDeleteOrganizationMember>) => void;
    }) {
      const result = useDeleteOrganizationMember(organizationId, userId, config);
      React.useEffect(() => {
        onResult(result);
      }, [result, onResult]);
      return null;
    }

    let hookResult: ReturnType<typeof useDeleteOrganizationMember> | undefined;
    render(<HookTest onResult={(r) => (hookResult = r)} />);
    await waitFor(() => expect(hookResult).toBeDefined());
    const res = await hookResult!.deleteMember();
    expect(res.status).toBe(200);
    expect(global.fetch).toHaveBeenCalledWith(
      `${config.baseUrl}/v1/organizations/${organizationId}/members/${userId}`,
      expect.objectContaining({ method: "DELETE" })
    );
  });
});

describe("useOrganizationInvitations", () => {
  it("fetches and returns invitations", async () => {
    mockFetch({
      response: {
        status: 200,
        requestId: "550e8400-e29b-41d4-a716-446655440014",
        result: [invitation],
      },
    });

    function HookTest({
      onResult,
    }: {
      onResult: (r: ReturnType<typeof useOrganizationInvitations>) => void;
    }) {
      const result = useOrganizationInvitations(organizationId, config);
      React.useEffect(() => {
        onResult(result);
      }, [result, onResult]);
      return null;
    }

    let hookResult: ReturnType<
      typeof useOrganizationInvitations
    > | undefined;
    render(<HookTest onResult={(r) => (hookResult = r)} />);
    await waitFor(() => expect(hookResult?.isLoading).toBe(false));
    expect(hookResult?.data).toEqual([invitation]);
  });
});

describe("useCreateOrganizationInvitation", () => {
  function HookTest({
    onResult,
  }: {
    onResult: (r: ReturnType<typeof useCreateOrganizationInvitation>) => void;
  }) {
    const result = useCreateOrganizationInvitation(organizationId, config);
    React.useEffect(() => {
      onResult(result);
    }, [result, onResult]);
    return null;
  }

  it("creates and returns invitation", async () => {
    mockFetch({
      response: {
        status: 200,
        requestId: "550e8400-e29b-41d4-a716-446655440015",
        result: invitation,
      },
    });
    let hookResult:
      | ReturnType<typeof useCreateOrganizationInvitation>
      | undefined;
    render(<HookTest onResult={(r) => (hookResult = r)} />);
    await waitFor(() => expect(hookResult).toBeDefined());
    const result = await hookResult!.createInvitation({
      email: invitation.email,
      role: invitation.role,
    });
    expect(result).toEqual(invitation);
    expect(global.fetch).toHaveBeenCalledWith(
      `${config.baseUrl}/v1/organizations/${organizationId}/invitations`,
      expect.objectContaining({ method: "POST" })
    );
  });

  it("throws on API error", async () => {
    mockFetch({
      response: { status: 400, error: "Bad request" },
      ok: false,
      status: 400,
      statusText: "Bad Request",
      text: "Bad request",
    });
    let hookResult:
      | ReturnType<typeof useCreateOrganizationInvitation>
      | undefined;
    render(<HookTest onResult={(r) => (hookResult = r)} />);
    await waitFor(() => expect(hookResult).toBeDefined());
    await expect(
      hookResult!.createInvitation({
        email: invitation.email,
        role: invitation.role,
      })
    ).rejects.toThrow("Bad request");
  });
});

describe("useOrganizationInvitation", () => {
  it("fetches and returns an invitation", async () => {
    mockFetch({
      response: {
        status: 200,
        requestId: "550e8400-e29b-41d4-a716-446655440016",
        result: invitation,
      },
    });

    function HookTest({
      onResult,
    }: {
      onResult: (r: ReturnType<typeof useOrganizationInvitation>) => void;
    }) {
      const result = useOrganizationInvitation(
        organizationId,
        invitationId,
        config
      );
      React.useEffect(() => {
        onResult(result);
      }, [result, onResult]);
      return null;
    }

    let hookResult: ReturnType<
      typeof useOrganizationInvitation
    > | undefined;
    render(<HookTest onResult={(r) => (hookResult = r)} />);
    await waitFor(() => expect(hookResult?.isLoading).toBe(false));
    expect(hookResult?.data).toEqual(invitation);
  });
});

describe("useDeleteOrganizationInvitation", () => {
  it("deletes an invitation", async () => {
    mockFetch({
      response: {
        status: 200,
        requestId: "550e8400-e29b-41d4-a716-446655440017",
      },
    });

    function HookTest({
      onResult,
    }: {
      onResult: (r: ReturnType<typeof useDeleteOrganizationInvitation>) => void;
    }) {
      const result = useDeleteOrganizationInvitation(
        organizationId,
        invitationId,
        config
      );
      React.useEffect(() => {
        onResult(result);
      }, [result, onResult]);
      return null;
    }

    let hookResult: ReturnType<
      typeof useDeleteOrganizationInvitation
    > | undefined;
    render(<HookTest onResult={(r) => (hookResult = r)} />);
    await waitFor(() => expect(hookResult).toBeDefined());
    const res = await hookResult!.deleteInvitation();
    expect(res.status).toBe(200);
    expect(global.fetch).toHaveBeenCalledWith(
      `${config.baseUrl}/v1/organizations/${organizationId}/invitations/${invitationId}`,
      expect.objectContaining({ method: "DELETE" })
    );
  });
});

