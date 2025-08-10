import { createResourceHooks } from "../createResourceHooks";
import {
  ClickPipesResponseSchema,
  ClickPipeResponseSchema,
  ClickHouseBaseResponseSchema,
} from "../../schemas/schemas";

interface Ctx {
  organizationId: string;
  serviceId: string;
  clickPipeId?: string;
}
const base = (c: Ctx) => `/v1/organizations/${c.organizationId}/services/${c.serviceId}/clickpipes`;

export const clickpipeHooks = createResourceHooks(
  {
    list: { path: base, schema: ClickPipesResponseSchema },
    item: { path: (c: Ctx) => `${base(c)}/${c.clickPipeId}`, schema: ClickPipeResponseSchema },
    create: { method: "POST", path: base, schema: ClickPipeResponseSchema },
    update: { method: "PATCH", path: (c: Ctx) => `${base(c)}/${c.clickPipeId}`, schema: ClickPipeResponseSchema },
    remove: { method: "DELETE", path: (c: Ctx) => `${base(c)}/${c.clickPipeId}`, schema: ClickHouseBaseResponseSchema },
    actions: {
      updateScaling: { method: "PATCH", path: (c: Ctx) => `${base(c)}/${c.clickPipeId}/scaling`, schema: ClickPipeResponseSchema },
      updateState: { method: "PATCH", path: (c: Ctx) => `${base(c)}/${c.clickPipeId}/state`, schema: ClickPipeResponseSchema },
    },
    invalidate: (c: Ctx) => [base(c), `${base(c)}/${c.clickPipeId}`],
  }
);

