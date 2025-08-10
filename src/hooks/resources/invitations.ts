import { createResourceHooks } from "../createResourceHooks";
import {
  InvitationsResponseSchema,
  InvitationResponseSchema,
  ClickHouseBaseResponseSchema,
} from "../../schemas/schemas";

interface Ctx {
  organizationId: string;
  invitationId?: string;
}
const base = (c: Ctx) => `/v1/organizations/${c.organizationId}/invitations`;

export const invitationsHooks = createResourceHooks({
  list: { path: base, schema: InvitationsResponseSchema },
  item: { path: (c: Ctx) => `${base(c)}/${c.invitationId}`, schema: InvitationResponseSchema },
  create: { method: "POST", path: base, schema: InvitationResponseSchema },
  remove: { method: "DELETE", path: (c: Ctx) => `${base(c)}/${c.invitationId}`, schema: ClickHouseBaseResponseSchema },
  invalidate: (c: Ctx) => [base(c), `${base(c)}/${c.invitationId}`],
});

