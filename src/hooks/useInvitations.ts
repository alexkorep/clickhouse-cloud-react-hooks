import { ClickHouseBaseResponseSchema, InvitationResponseSchema, InvitationsResponseSchema, type InvitationResponse, type InvitationsResponse } from "../schemas/schemas";
import type { ClickHouseConfig } from "../api/fetcher";
import { useClickHouseSWR } from "./useClickHouseSWR";

export function useInvitations(organizationId: string, config: ClickHouseConfig) {
  return useClickHouseSWR<InvitationsResponse>(
    `/v1/organizations/${organizationId}/invitations`,
    config,
    InvitationsResponseSchema
  );
}

export function useCreateInvitation(
  organizationId: string,
  config: ClickHouseConfig
) {
  const createInvitation = async (invitationData: {
    email: string;
    role: "admin" | "developer";
  }) => {
    const { keyId, keySecret, baseUrl = "https://api.clickhouse.cloud" } = config;
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
    return validated.result;
  };

  return { createInvitation };
}

export function useInvitation(
  organizationId: string,
  invitationId: string,
  config: ClickHouseConfig
) {
  return useClickHouseSWR<InvitationResponse>(
    `/v1/organizations/${organizationId}/invitations/${invitationId}`,
    config,
    InvitationResponseSchema
  );
}

export function useDeleteInvitation(
  organizationId: string,
  invitationId: string,
  config: ClickHouseConfig
) {
  const deleteInvitation = async () => {
    const { keyId, keySecret, baseUrl = "https://api.clickhouse.cloud" } = config;
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
    return validated;
  };

  return { deleteInvitation };
}
