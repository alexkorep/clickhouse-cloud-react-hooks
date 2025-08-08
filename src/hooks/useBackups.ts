import useSWR from "swr";
import { fetcher } from "../api/fetcher";
import type { ClickHouseConfig } from "../api/fetcher";

export function useServiceBackups(
  organizationId: string,
  serviceId: string,
  config: ClickHouseConfig
) {
  const { data, error, isLoading } = useSWR(
    [
      `/v1/organizations/${organizationId}/services/${serviceId}/backups`,
      config,
    ],
    ([url, cfg]: [string, ClickHouseConfig]) => fetcher(url, cfg)
  );
  return { data, error, isLoading };
}

export function useServiceBackup(
  organizationId: string,
  serviceId: string,
  backupId: string,
  config: ClickHouseConfig
) {
  const { data, error, isLoading } = useSWR(
    [
      `/v1/organizations/${organizationId}/services/${serviceId}/backups/${backupId}`,
      config,
    ],
    ([url, cfg]: [string, ClickHouseConfig]) => fetcher(url, cfg)
  );
  return { data, error, isLoading };
}

export function useServiceBackupConfiguration(
  organizationId: string,
  serviceId: string,
  config: ClickHouseConfig
) {
  const { data, error, isLoading } = useSWR(
    [
      `/v1/organizations/${organizationId}/services/${serviceId}/backupConfiguration`,
      config,
    ],
    ([url, cfg]: [string, ClickHouseConfig]) => fetcher(url, cfg)
  );
  return { data, error, isLoading };
}

export function useUpdateServiceBackupConfiguration(
  organizationId: string,
  serviceId: string,
  config: ClickHouseConfig
) {
  const updateBackupConfiguration = async (configData: unknown) => {
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
    return response.json();
  };

  return { updateBackupConfiguration };
}

export function useDeleteServiceBackup(
  organizationId: string,
  serviceId: string,
  backupId: string,
  config: ClickHouseConfig
) {
  const deleteBackup = async () => {
    const {
      keyId,
      keySecret,
      baseUrl = "https://api.clickhouse.cloud",
    } = config;
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
    return response.json();
  };

  return { deleteBackup };
}
