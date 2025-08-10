import { createResourceHooks } from "../createResourceHooks";
import {
  ReversePrivateEndpointsResponseSchema,
  ReversePrivateEndpointResponseSchema,
  ClickHouseBaseResponseSchema,
} from "../../schemas/schemas";

interface Ctx {
  organizationId: string;
  serviceId: string;
  endpointId?: string;
}
const base = (c: Ctx) => `/v1/organizations/${c.organizationId}/services/${c.serviceId}/clickpipesReversePrivateEndpoints`;

export const clickpipesRpeHooks = createResourceHooks({
  list: { path: base, schema: ReversePrivateEndpointsResponseSchema },
  item: { path: (c: Ctx) => `${base(c)}/${c.endpointId}`, schema: ReversePrivateEndpointResponseSchema },
  create: { method: "POST", path: base, schema: ReversePrivateEndpointResponseSchema },
  remove: { method: "DELETE", path: (c: Ctx) => `${base(c)}/${c.endpointId}`, schema: ClickHouseBaseResponseSchema },
  invalidate: (c: Ctx) => [base(c), `${base(c)}/${c.endpointId}`],
});

