import { useSWRConfig } from "swr";
import type { ClickHouseConfig } from "../api/fetcher";
import { useClickHouseSWR } from "./useClickHouseSWR";
import {
  BackupsResponseSchema,
  BackupResponseSchema,
  BackupConfigurationResponseSchema,
  type BackupsResponse,
  type BackupResponse,
  type BackupConfigurationResponse,
  type BackupConfiguration,
} from "../schemas/schemas";

export function useServiceBackups(
  organizationId: string,
  serviceId: string,
  config: ClickHouseConfig
) {
  return useClickHouseSWR<BackupsResponse>(
    `/v1/organizations/${organizationId}/services/${serviceId}/backups`,
    config,
    BackupsResponseSchema
  );
}

export function useServiceBackup(
  organizationId: string,
  serviceId: string,
  backupId: string,
  config: ClickHouseConfig
) {
  return useClickHouseSWR<BackupResponse>(
    `/v1/organizations/${organizationId}/services/${serviceId}/backups/${backupId}`,
    config,
    BackupResponseSchema
  );
}

export function useServiceBackupConfiguration(
  organizationId: string,
  serviceId: string,
  config: ClickHouseConfig
) {
  return useClickHouseSWR<BackupConfigurationResponse>(
    `/v1/organizations/${organizationId}/services/${serviceId}/backupConfiguration`,
    config,
    BackupConfigurationResponseSchema
  );
}

export function useUpdateServiceBackupConfiguration(
  organizationId: string,
  serviceId: string,
  config: ClickHouseConfig
) {
  const { mutate: globalMutate } = useSWRConfig();
  const updateBackupConfiguration = async (
    configData: Partial<BackupConfiguration>
  ): Promise<BackupConfiguration> => {
    const {
      keyId,
      keySecret,
      baseUrl = "https://api.clickhouse.cloud",
    } = config;
    const auth = btoa(`${keyId}:${keySecret}`);
    const response = await fetch(
      `${baseUrl}/v1/organizations/${organizationId}/services/${serviceId}/backupConfiguration`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(configData),
      }
    );
    if (!response.ok) throw new Error(await response.text());
    const responseData = await response.json();
    const validated = BackupConfigurationResponseSchema.parse(responseData);

    await globalMutate(
      `/v1/organizations/${organizationId}/services/${serviceId}/backupConfiguration:${config.baseUrl}:${config.keyId}`
    );

    return validated.result;
  };

  return { updateBackupConfiguration };
}

export function useDeleteServiceBackup(
  organizationId: string,
  serviceId: string,
  config: ClickHouseConfig
) {
  const { mutate: globalMutate } = useSWRConfig();

  const deleteBackup = async (backupId: string) => {
    const { keyId, keySecret, baseUrl = "https://api.clickhouse.cloud" } = config;
    const auth = btoa(`${keyId}:${keySecret}`);
    const response = await fetch(
      `${baseUrl}/v1/organizations/${organizationId}/services/${serviceId}/backups/${backupId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) throw new Error(await response.text());
    await response.json().catch(() => undefined);
    await globalMutate(
      `/v1/organizations/${organizationId}/services/${serviceId}/backups:${config.baseUrl}:${config.keyId}`
    );
  };

  return { deleteBackup };
}
