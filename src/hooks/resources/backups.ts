import { createResourceHooks } from "../createResourceHooks";
import {
  BackupsResponseSchema,
  BackupResponseSchema,
  BackupConfigurationResponseSchema,
} from "../../schemas/schemas";

interface Ctx {
  organizationId: string;
  serviceId: string;
  backupId?: string;
}
const base = (c: Ctx) => `/v1/organizations/${c.organizationId}/services/${c.serviceId}`;

export const serviceBackupsHooks = createResourceHooks({
  list: { path: (c: Ctx) => `${base(c)}/backups`, schema: BackupsResponseSchema },
  item: { path: (c: Ctx) => `${base(c)}/backups/${c.backupId}`, schema: BackupResponseSchema },
  remove: { method: "DELETE", path: (c: Ctx) => `${base(c)}/backups/${c.backupId}` },
  invalidate: (c: Ctx) => [`${base(c)}/backups`, `${base(c)}/backups/${c.backupId}`],
});

export const serviceBackupConfigurationHooks = createResourceHooks({
  list: { path: (c: Ctx) => `${base(c)}/backupConfiguration`, schema: BackupConfigurationResponseSchema },
  item: { path: (c: Ctx) => `${base(c)}/backupConfiguration`, schema: BackupConfigurationResponseSchema },
  update: { method: "PATCH", path: (c: Ctx) => `${base(c)}/backupConfiguration`, schema: BackupConfigurationResponseSchema },
  invalidate: (c: Ctx) => [`${base(c)}/backupConfiguration`],
});

