import type { ClickHouseConfig } from "../api/fetcher";
import { membersHooks, orgInvitationsHooks } from "./resources/userManagement";
import type {
  MemberPatchRequest,
  InvitationPostRequest,
} from "../schemas/schemas";

export const useOrganizationMembers = (
  organizationId: string,
  config: ClickHouseConfig
) => membersHooks.useList({ organizationId }, config);

export const useOrganizationMember = (
  organizationId: string,
  userId: string,
  config: ClickHouseConfig
) => membersHooks.useOne({ organizationId, userId }, config);

export const useUpdateOrganizationMember = (
  organizationId: string,
  userId: string,
  config: ClickHouseConfig
) => {
  const update = membersHooks.useUpdate({ organizationId, userId }, config);
  return { updateMember: (body: MemberPatchRequest) => update(body) };
};

export const useDeleteOrganizationMember = (
  organizationId: string,
  userId: string,
  config: ClickHouseConfig
) => {
  const del = membersHooks.useDelete({ organizationId, userId }, config);
  return { deleteMember: () => del() };
};

export const useOrganizationInvitations = (
  organizationId: string,
  config: ClickHouseConfig
) => orgInvitationsHooks.useList({ organizationId }, config);

export const useOrganizationInvitation = (
  organizationId: string,
  invitationId: string,
  config: ClickHouseConfig
) => orgInvitationsHooks.useOne({ organizationId, invitationId }, config);

export const useCreateOrganizationInvitation = (
  organizationId: string,
  config: ClickHouseConfig
) => {
  const create = orgInvitationsHooks.useCreate({ organizationId }, config);
  return { createInvitation: (body: InvitationPostRequest) => create(body) };
};

export const useDeleteOrganizationInvitation = (
  organizationId: string,
  invitationId: string,
  config: ClickHouseConfig
) => {
  const del = orgInvitationsHooks.useDelete(
    { organizationId, invitationId },
    config
  );
  return { deleteInvitation: () => del() };
};

