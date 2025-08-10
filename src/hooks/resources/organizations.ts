import { createResourceHooks } from "../createResourceHooks";
import {
  OrganizationsResponseSchema,
  OrganizationResponseSchema,
  UsageCostResponseSchema,
  PrivateEndpointConfigResponseSchema,
} from "../../schemas/schemas";

interface Ctx {
  organizationId?: string;
}
const base = `/v1/organizations`;

export const organizationsHooks = createResourceHooks({
  list: { path: () => base, schema: OrganizationsResponseSchema },
  item: { path: (c: Ctx) => `${base}/${c.organizationId}`, schema: OrganizationResponseSchema },
  update: { method: "PATCH", path: (c: Ctx) => `${base}/${c.organizationId}`, schema: OrganizationResponseSchema },
  invalidate: (c: Ctx) => [base, `${base}/${c.organizationId}`],
});

// usage cost
interface UsageCtx {
  organizationId: string;
  startDate?: string;
  endDate?: string;
}
const usagePath = (c: UsageCtx) => {
  const q = new URLSearchParams();
  if (c.startDate) q.append("startDate", c.startDate);
  if (c.endDate) q.append("endDate", c.endDate);
  const qs = q.toString();
  return `${base}/${c.organizationId}/usageCost${qs ? `?${qs}` : ""}`;
};

export const organizationUsageCostHooks = createResourceHooks({
  list: { path: usagePath, schema: UsageCostResponseSchema },
  item: { path: usagePath, schema: UsageCostResponseSchema },
  invalidate: (c: UsageCtx) => [usagePath(c)],
});

// private endpoint config
interface OpecCtx {
  organizationId: string;
  cloudProvider?: string;
  region?: string;
}
const opecPath = (c: OpecCtx) => {
  const q = new URLSearchParams();
  if (c.cloudProvider) q.append("cloudProvider", c.cloudProvider);
  if (c.region) q.append("region", c.region);
  const qs = q.toString();
  return `${base}/${c.organizationId}/privateEndpointConfig${qs ? `?${qs}` : ""}`;
};

export const organizationPrivateEndpointConfigHooks = createResourceHooks({
  list: { path: opecPath, schema: PrivateEndpointConfigResponseSchema },
  item: { path: opecPath, schema: PrivateEndpointConfigResponseSchema },
  invalidate: (c: OpecCtx) => [opecPath(c)],
});

