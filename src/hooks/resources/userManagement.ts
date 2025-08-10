import { createResourceHooks } from "../createResourceHooks";
import {
  MembersResponseSchema,
  MemberResponseSchema,
  InvitationsResponseSchema,
  InvitationResponseSchema,
  ClickHouseBaseResponseSchema,
} from "../../schemas/schemas";

// Members
interface MemberCtx {
  organizationId: string;
  userId?: string;
}
const mbase = (c: MemberCtx) => `/v1/organizations/${c.organizationId}/members`;

export const membersHooks = createResourceHooks({
  list: { path: mbase, schema: MembersResponseSchema },
  item: { path: (c: MemberCtx) => `${mbase(c)}/${c.userId}`, schema: MemberResponseSchema },
  update: { method: "PATCH", path: (c: MemberCtx) => `${mbase(c)}/${c.userId}`, schema: MemberResponseSchema },
  remove: { method: "DELETE", path: (c: MemberCtx) => `${mbase(c)}/${c.userId}`, schema: ClickHouseBaseResponseSchema },
  invalidate: (c: MemberCtx) => [mbase(c), `${mbase(c)}/${c.userId}`],
});

// Organization Invitations (same as invitations)
interface InviteCtx {
  organizationId: string;
  invitationId?: string;
}
const ibase = (c: InviteCtx) => `/v1/organizations/${c.organizationId}/invitations`;

export const orgInvitationsHooks = createResourceHooks({
  list: { path: ibase, schema: InvitationsResponseSchema },
  item: { path: (c: InviteCtx) => `${ibase(c)}/${c.invitationId}`, schema: InvitationResponseSchema },
  create: { method: "POST", path: ibase, schema: InvitationResponseSchema },
  remove: { method: "DELETE", path: (c: InviteCtx) => `${ibase(c)}/${c.invitationId}`, schema: ClickHouseBaseResponseSchema },
  invalidate: (c: InviteCtx) => [ibase(c), `${ibase(c)}/${c.invitationId}`],
});

