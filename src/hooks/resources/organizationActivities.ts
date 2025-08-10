import { createResourceHooks } from "../createResourceHooks";
import { ActivitiesResponseSchema, ActivityResponseSchema } from "../../schemas/schemas";

interface Ctx {
  organizationId: string;
  activityId?: string;
  fromDate?: string;
  toDate?: string;
}
const listPath = (c: Ctx) => {
  const q = new URLSearchParams();
  if (c.fromDate) q.append("from_date", c.fromDate);
  if (c.toDate) q.append("to_date", c.toDate);
  const qs = q.toString();
  return `/v1/organizations/${c.organizationId}/activities${qs ? `?${qs}` : ""}`;
};

export const organizationActivitiesHooks = createResourceHooks({
  list: { path: listPath, schema: ActivitiesResponseSchema },
  item: { path: (c: Ctx) => `/v1/organizations/${c.organizationId}/activities/${c.activityId}`, schema: ActivityResponseSchema },
  invalidate: (c: Ctx) => [listPath({ organizationId: c.organizationId }), `/v1/organizations/${c.organizationId}/activities/${c.activityId}`],
});

