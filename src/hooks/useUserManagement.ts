import { useSWRConfig } from "swr";
import type { ClickHouseConfig } from "../api/fetcher";
import { useClickHouseSWR } from "./useClickHouseSWR";
import {
  MembersResponseSchema,
  MemberResponseSchema,
  InvitationsResponseSchema,
  InvitationResponseSchema,
  MemberPatchRequest,
  InvitationPostRequest,
  type Member,
  type Invitation,
  ClickHouseBaseResponseSchema,
  type ClickHouseBaseResponse,
} from "../schemas/schemas";

export function useOrganizationMembers(
  organizationId: string,
  config: ClickHouseConfig
) {
  return useClickHouseSWR(
    `/v1/organizations/${organizationId}/members`,
    config,
    MembersResponseSchema
  );
}

export function useOrganizationMember(
  organizationId: string,
  userId: string,
  config: ClickHouseConfig
) {
  return useClickHouseSWR(
    `/v1/organizations/${organizationId}/members/${userId}`,
    config,
    MemberResponseSchema
  );
}

export function useUpdateOrganizationMember(
  organizationId: string,
  userId: string,
  config: ClickHouseConfig
) {
  const { mutate: globalMutate } = useSWRConfig();

  const updateMember = async (
    updateData: MemberPatchRequest
  ): Promise<Member> => {
    const {
      keyId,
      keySecret,
      baseUrl = "https://api.clickhouse.cloud",
    } = config;
    const auth = btoa(`${keyId}:${keySecret}`);
    const response = await fetch(
      `${baseUrl}/v1/organizations/${organizationId}/members/${userId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      }
    );
    if (!response.ok) throw new Error(await response.text());
    const responseData = await response.json();
    const validated = MemberResponseSchema.parse(responseData);
    await Promise.all([
      globalMutate(
        `/v1/organizations/${organizationId}/members:${config.baseUrl}:${config.keyId}`
      ),
      globalMutate(
        `/v1/organizations/${organizationId}/members/${userId}:${config.baseUrl}:${config.keyId}`
      ),
    ]);
    return validated.result;
  };

  return { updateMember };
}

export function useDeleteOrganizationMember(
  organizationId: string,
  userId: string,
  config: ClickHouseConfig
) {
  const { mutate: globalMutate } = useSWRConfig();

  const deleteMember = async (): Promise<ClickHouseBaseResponse> => {
    const {
      keyId,
      keySecret,
      baseUrl = "https://api.clickhouse.cloud",
    } = config;
    const auth = btoa(`${keyId}:${keySecret}`);
    const response = await fetch(
      `${baseUrl}/v1/organizations/${organizationId}/members/${userId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) throw new Error(await response.text());
    const responseData = await response.json();
    const validated = ClickHouseBaseResponseSchema.parse(responseData);
    await Promise.all([
      globalMutate(
        `/v1/organizations/${organizationId}/members:${config.baseUrl}:${config.keyId}`
      ),
      globalMutate(
        `/v1/organizations/${organizationId}/members/${userId}:${config.baseUrl}:${config.keyId}`
      ),
    ]);
    return validated;
  };

  return { deleteMember };
}

export function useOrganizationInvitations(
  organizationId: string,
  config: ClickHouseConfig
) {
  return useClickHouseSWR(
    `/v1/organizations/${organizationId}/invitations`,
    config,
    InvitationsResponseSchema
  );
}

export function useCreateOrganizationInvitation(
  organizationId: string,
  config: ClickHouseConfig
) {
  const { mutate: globalMutate } = useSWRConfig();

  const createInvitation = async (
    invitationData: InvitationPostRequest
  ): Promise<Invitation> => {
    const {
      keyId,
      keySecret,
      baseUrl = "https://api.clickhouse.cloud",
    } = config;
    const auth = btoa(`${keyId}:${keySecret}`);
    const response = await fetch(
      `${baseUrl}/v1/organizations/${organizationId}/invitations`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invitationData),
      }
    );
    if (!response.ok) throw new Error(await response.text());
    const responseData = await response.json();
    const validated = InvitationResponseSchema.parse(responseData);
    await Promise.all([
      globalMutate(
        `/v1/organizations/${organizationId}/invitations:${config.baseUrl}:${config.keyId}`
      ),
    ]);
    return validated.result;
  };

  return { createInvitation };
}

export function useOrganizationInvitation(
  organizationId: string,
  invitationId: string,
  config: ClickHouseConfig
) {
  return useClickHouseSWR(
    `/v1/organizations/${organizationId}/invitations/${invitationId}`,
    config,
    InvitationResponseSchema
  );
}

export function useDeleteOrganizationInvitation(
  organizationId: string,
  invitationId: string,
  config: ClickHouseConfig
) {
  const { mutate: globalMutate } = useSWRConfig();

  const deleteInvitation = async (): Promise<ClickHouseBaseResponse> => {
    const {
      keyId,
      keySecret,
      baseUrl = "https://api.clickhouse.cloud",
    } = config;
    const auth = btoa(`${keyId}:${keySecret}`);
    const response = await fetch(
      `${baseUrl}/v1/organizations/${organizationId}/invitations/${invitationId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) throw new Error(await response.text());
    const responseData = await response.json();
    const validated = ClickHouseBaseResponseSchema.parse(responseData);
    await Promise.all([
      globalMutate(
        `/v1/organizations/${organizationId}/invitations:${config.baseUrl}:${config.keyId}`
      ),
      globalMutate(
        `/v1/organizations/${organizationId}/invitations/${invitationId}:${config.baseUrl}:${config.keyId}`
      ),
    ]);
    return validated;
  };

  return { deleteInvitation };
}

