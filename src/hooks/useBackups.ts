import type { ClickHouseConfig } from "../api/fetcher";
import {
  serviceBackupsHooks,
  serviceBackupConfigurationHooks,
} from "./resources/backups";

export const useServiceBackups = (
  organizationId: string,
  serviceId: string,
  config: ClickHouseConfig
) => serviceBackupsHooks.useList({ organizationId, serviceId }, config);

export const useServiceBackup = (
  organizationId: string,
  serviceId: string,
  backupId: string,
  config: ClickHouseConfig
) =>
  serviceBackupsHooks.useOne({ organizationId, serviceId, backupId }, config);

export const useServiceBackupConfiguration = (
  organizationId: string,
  serviceId: string,
  config: ClickHouseConfig
) =>
  serviceBackupConfigurationHooks.useOne({ organizationId, serviceId }, config);

export const useUpdateServiceBackupConfiguration = (
  organizationId: string,
  serviceId: string,
  config: ClickHouseConfig
) => {
  const update = serviceBackupConfigurationHooks.useUpdate(
    { organizationId, serviceId },
    config
  );
  return { updateBackupConfiguration: (body: unknown) => update(body) };
};

export const useDeleteServiceBackup = (
  organizationId: string,
  serviceId: string,
  backupId: string,
  config: ClickHouseConfig
) => {
  const del = serviceBackupsHooks.useDelete(
    { organizationId, serviceId, backupId },
    config
  );
  return { deleteBackup: () => del() };
};

