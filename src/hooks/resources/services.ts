import { createResourceHooks } from "../createResourceHooks";
import { ServicesResponseSchema, ServiceResponseSchema } from "../../schemas/schemas";
import { z } from "zod";

interface Ctx {
  organizationId: string;
  serviceId?: string;
}
const base = (c: Ctx) => `/v1/organizations/${c.organizationId}/services`;

export const servicesHooks = createResourceHooks({
  list: { path: base, schema: ServicesResponseSchema },
  item: { path: (c: Ctx) => `${base(c)}/${c.serviceId}`, schema: ServiceResponseSchema },
  create: { method: "POST", path: base },
  update: { method: "PATCH", path: (c: Ctx) => `${base(c)}/${c.serviceId}` },
  remove: { method: "DELETE", path: (c: Ctx) => `${base(c)}/${c.serviceId}` },
  actions: {
    updateState: { method: "PATCH", path: (c: Ctx) => `${base(c)}/${c.serviceId}/state` },
    updateReplicaScaling: { method: "PATCH", path: (c: Ctx) => `${base(c)}/${c.serviceId}/replicaScaling` },
    updatePassword: { method: "PATCH", path: (c: Ctx) => `${base(c)}/${c.serviceId}/password` },
    updateScaling: { method: "PATCH", path: (c: Ctx) => `${base(c)}/${c.serviceId}/scaling` },
    createPrivateEndpoint: { method: "POST", path: (c: Ctx) => `${base(c)}/${c.serviceId}/privateEndpoint` },
  },
  invalidate: (c: Ctx) => [base(c), `${base(c)}/${c.serviceId}`],
});

// service query endpoint
interface QECtx {
  organizationId: string;
  serviceId: string;
}
const qbase = (c: QECtx) => `/v1/organizations/${c.organizationId}/services/${c.serviceId}/serviceQueryEndpoint`;

export const serviceQueryEndpointHooks = createResourceHooks({
  list: { path: qbase, schema: z.any() },
  item: { path: qbase, schema: z.any() },
  create: { method: "POST", path: qbase },
  remove: { method: "DELETE", path: qbase },
  invalidate: (c: QECtx) => [qbase(c)],
});

// service private endpoint config
interface SPECtx {
  organizationId: string;
  serviceId: string;
}
const spath = (c: SPECtx) => `/v1/organizations/${c.organizationId}/services/${c.serviceId}/privateEndpointConfig`;

export const servicePrivateEndpointConfigHooks = createResourceHooks({
  list: { path: spath, schema: z.any() },
  item: { path: spath, schema: z.any() },
  invalidate: (c: SPECtx) => [spath(c)],
});

