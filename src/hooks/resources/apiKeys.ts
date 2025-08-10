import { createResourceHooks } from "../createResourceHooks";
import {
  ApiKeysResponseSchema,
  ApiKeyResponseSchema,
  ApiKeyCreateResponseSchema,
  ClickHouseBaseResponseSchema,
} from "../../schemas/schemas";

interface Ctx {
  organizationId: string;
  keyId?: string;
}
const base = (c: Ctx) => `/v1/organizations/${c.organizationId}/keys`;

export const apiKeyHooks = createResourceHooks(
  {
    list: { path: base, schema: ApiKeysResponseSchema },
    item: { path: (c: Ctx) => `${base(c)}/${c.keyId}`, schema: ApiKeyResponseSchema },
    create: { method: "POST", path: base, schema: ApiKeyCreateResponseSchema },
    update: { method: "PATCH", path: (c: Ctx) => `${base(c)}/${c.keyId}`, schema: ApiKeyResponseSchema },
    remove: { method: "DELETE", path: (c: Ctx) => `${base(c)}/${c.keyId}`, schema: ClickHouseBaseResponseSchema },
    invalidate: (c: Ctx) => [base(c), `${base(c)}/${c.keyId}`],
  }
);

