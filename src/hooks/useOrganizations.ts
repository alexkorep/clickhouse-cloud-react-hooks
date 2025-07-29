import useSWR from "swr";
import { fetcher } from "../api/fetcher";
import type { ClickHouseConfig } from "../api/fetcher";

export function useOrganizations(config: ClickHouseConfig) {
  const { data, error, isLoading } = useSWR(
    ["/v1/organizations", config],
    ([url, cfg]: [string, ClickHouseConfig]) => fetcher(url, cfg)
  );
  return { data, error, isLoading };
}

export function useOrganization(organizationId: string, config: ClickHouseConfig) {
  const { data, error, isLoading } = useSWR(
    [`/v1/organizations/${organizationId}`, config],
    ([url, cfg]: [string, ClickHouseConfig]) => fetcher(url, cfg)
  );
  return { data, error, isLoading };
}

export function useUpdateOrganization(organizationId: string, config: ClickHouseConfig) {
  const updateOrganization = async (updateData: any) => {
    const { keyId, keySecret, baseUrl = "https://api.clickhouse.cloud" } = config;
    const auth = btoa(`${keyId}:${keySecret}`);
    const response = await fetch(`${baseUrl}/v1/organizations/${organizationId}`, {
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

  return { updateOrganization };
}

export function useOrganizationActivities(organizationId: string, config: ClickHouseConfig) {
  const { data, error, isLoading } = useSWR(
    [`/v1/organizations/${organizationId}/activities`, config],
    ([url, cfg]: [string, ClickHouseConfig]) => fetcher(url, cfg)
  );
  return { data, error, isLoading };
}

export function useOrganizationActivity(organizationId: string, activityId: string, config: ClickHouseConfig) {
  const { data, error, isLoading } = useSWR(
    [`/v1/organizations/${organizationId}/activities/${activityId}`, config],
    ([url, cfg]: [string, ClickHouseConfig]) => fetcher(url, cfg)
  );
  return { data, error, isLoading };
}

export function useOrganizationUsageCost(
  organizationId: string, 
  config: ClickHouseConfig,
  params?: { startDate?: string; endDate?: string }
) {
  const queryParams = new URLSearchParams();
  if (params?.startDate) queryParams.append('startDate', params.startDate);
  if (params?.endDate) queryParams.append('endDate', params.endDate);
  const queryString = queryParams.toString();
  const url = `/v1/organizations/${organizationId}/usageCost${queryString ? `?${queryString}` : ''}`;
  
  const { data, error, isLoading } = useSWR(
    [url, config],
    ([url, cfg]: [string, ClickHouseConfig]) => fetcher(url, cfg)
  );
  return { data, error, isLoading };
}

export function useOrganizationPrivateEndpointConfig(
  organizationId: string, 
  config: ClickHouseConfig,
  params?: { cloudProvider?: string; region?: string }
) {
  const queryParams = new URLSearchParams();
  if (params?.cloudProvider) queryParams.append('cloudProvider', params.cloudProvider);
  if (params?.region) queryParams.append('region', params.region);
  const queryString = queryParams.toString();
  const url = `/v1/organizations/${organizationId}/privateEndpointConfig${queryString ? `?${queryString}` : ''}`;
  
  const { data, error, isLoading } = useSWR(
    [url, config],
    ([url, cfg]: [string, ClickHouseConfig]) => fetcher(url, cfg)
  );
  return { data, error, isLoading };
}
