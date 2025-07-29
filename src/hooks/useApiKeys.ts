import useSWR from 'swr';
import { fetcher } from '../api/fetcher';
import type { ClickHouseConfig } from '../api/fetcher';

export function useApiKeys(organizationId: string, config: ClickHouseConfig) {
  const { data, error, isLoading } = useSWR(
    [`/v1/organizations/${organizationId}/keys`, config],
    ([url, cfg]: [string, ClickHouseConfig]) => fetcher(url, cfg)
  );
  return { data, error, isLoading };
}

export function useCreateApiKey(organizationId: string, config: ClickHouseConfig) {
  const createApiKey = async (keyData: any) => {
    const { keyId, keySecret, baseUrl = "https://api.clickhouse.cloud" } = config;
    const auth = btoa(`${keyId}:${keySecret}`);
    const response = await fetch(`${baseUrl}/v1/organizations/${organizationId}/keys`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(keyData),
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  };

  return { createApiKey };
}

export function useApiKey(organizationId: string, keyId: string, config: ClickHouseConfig) {
  const { data, error, isLoading } = useSWR(
    [`/v1/organizations/${organizationId}/keys/${keyId}`, config],
    ([url, cfg]: [string, ClickHouseConfig]) => fetcher(url, cfg)
  );
  return { data, error, isLoading };
}

export function useUpdateApiKey(organizationId: string, keyId: string, config: ClickHouseConfig) {
  const updateApiKey = async (updateData: any) => {
    const { keyId: configKeyId, keySecret, baseUrl = "https://api.clickhouse.cloud" } = config;
    const auth = btoa(`${configKeyId}:${keySecret}`);
    const response = await fetch(`${baseUrl}/v1/organizations/${organizationId}/keys/${keyId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  };

  return { updateApiKey };
}

export function useDeleteApiKey(organizationId: string, keyId: string, config: ClickHouseConfig) {
  const deleteApiKey = async () => {
    const { keyId: configKeyId, keySecret, baseUrl = "https://api.clickhouse.cloud" } = config;
    const auth = btoa(`${configKeyId}:${keySecret}`);
    const response = await fetch(`${baseUrl}/v1/organizations/${organizationId}/keys/${keyId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  };

  return { deleteApiKey };
}
