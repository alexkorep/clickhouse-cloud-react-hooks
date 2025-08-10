import type { ClickHouseConfig } from "../api/fetcher";
import { invitationsHooks } from "./resources/invitations";
import type { InvitationPostRequest } from "../schemas/schemas";

export const useInvitations = (
  organizationId: string,
  config: ClickHouseConfig
) => invitationsHooks.useList({ organizationId }, config);

export const useInvitation = (
  organizationId: string,
  invitationId: string,
  config: ClickHouseConfig
) => invitationsHooks.useOne({ organizationId, invitationId }, config);

export const useCreateInvitation = (
  organizationId: string,
  config: ClickHouseConfig
) => {
  const create = invitationsHooks.useCreate({ organizationId }, config);
  return { createInvitation: (body: InvitationPostRequest) => create(body) };
};

export const useDeleteInvitation = (
  organizationId: string,
  invitationId: string,
  config: ClickHouseConfig
) => {
  const del = invitationsHooks.useDelete({ organizationId, invitationId }, config);
  return { deleteInvitation: () => del() };
};

