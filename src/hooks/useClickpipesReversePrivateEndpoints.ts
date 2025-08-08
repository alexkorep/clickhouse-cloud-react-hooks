import useSWR from "swr";
import { fetcher } from "../api/fetcher";
import type { ClickHouseConfig } from "../api/fetcher";

export function useClickpipesReversePrivateEndpoints(
  organizationId: string,
  serviceId: string,
  config: ClickHouseConfig
) {
  const { data, error, isLoading } = useSWR(
    [
      `/v1/organizations/${organizationId}/services/${serviceId}/clickpipesReversePrivateEndpoints`,
      config,
    ],
    ([url, cfg]: [string, ClickHouseConfig]) => fetcher(url, cfg)
  );
  return { data, error, isLoading };
}

export function useCreateClickpipesReversePrivateEndpoint(
  organizationId: string,
  serviceId: string,
  config: ClickHouseConfig
) {
  const createReversePrivateEndpoint = async (endpointData: any) => {
    const {
      keyId,
      keySecret,
      baseUrl = "https://api.clickhouse.cloud",
    } = config;
    const auth = btoa(`${keyId}:${keySecret}`);
    const response = await fetch(
      `${baseUrl}/v1/organizations/${organizationId}/services/${serviceId}/clickpipesReversePrivateEndpoints`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(endpointData),
      }
    );
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  };
  return { createReversePrivateEndpoint };
}

export function useClickpipesReversePrivateEndpoint(
  organizationId: string,
  serviceId: string,
  reversePrivateEndpointId: string,
  config: ClickHouseConfig
) {
  const { data, error, isLoading } = useSWR(
    [
      `/v1/organizations/${organizationId}/services/${serviceId}/clickpipesReversePrivateEndpoints/${reversePrivateEndpointId}`,
      config,
    ],
    ([url, cfg]: [string, ClickHouseConfig]) => fetcher(url, cfg)
  );
  return { data, error, isLoading };
}

export function useDeleteClickpipesReversePrivateEndpoint(
  organizationId: string,
  serviceId: string,
  reversePrivateEndpointId: string,
  config: ClickHouseConfig
) {
  const deleteReversePrivateEndpoint = async () => {
    const {
      keyId,
      keySecret,
      baseUrl = "https://api.clickhouse.cloud",
    } = config;
    const auth = btoa(`${keyId}:${keySecret}`);
    const response = await fetch(
      `${baseUrl}/v1/organizations/${organizationId}/services/${serviceId}/clickpipesReversePrivateEndpoints/${reversePrivateEndpointId}`,
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
  return { deleteReversePrivateEndpoint };
}
