import type { ClickHouseConfig } from "../api/fetcher";
import { useClickHouseSWR } from "./useClickHouseSWR";
import {
  ReversePrivateEndpointsResponseSchema,
  ReversePrivateEndpointResponseSchema,
  ClickHouseBaseResponseSchema,
  type ReversePrivateEndpoint,
  type ReversePrivateEndpointsResponse,
  type ReversePrivateEndpointResponse,
  type CreateReversePrivateEndpoint,
} from "../schemas/schemas";

export function useClickpipesReversePrivateEndpoints(
  organizationId: string,
  serviceId: string,
  config: ClickHouseConfig
) {
  return useClickHouseSWR<ReversePrivateEndpointsResponse>(
    `/v1/organizations/${organizationId}/services/${serviceId}/clickpipesReversePrivateEndpoints`,
    config,
    ReversePrivateEndpointsResponseSchema
  );
}

export function useCreateClickpipesReversePrivateEndpoint(
  organizationId: string,
  serviceId: string,
  config: ClickHouseConfig
) {
  const createReversePrivateEndpoint = async (
    endpointData: CreateReversePrivateEndpoint
  ): Promise<ReversePrivateEndpoint> => {
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
    const responseData = await response.json();
    const validated = ReversePrivateEndpointResponseSchema.parse(responseData);
    return validated.result;
  };
  return { createReversePrivateEndpoint };
}

export function useClickpipesReversePrivateEndpoint(
  organizationId: string,
  serviceId: string,
  reversePrivateEndpointId: string,
  config: ClickHouseConfig
) {
  return useClickHouseSWR<ReversePrivateEndpointResponse>(
    `/v1/organizations/${organizationId}/services/${serviceId}/clickpipesReversePrivateEndpoints/${reversePrivateEndpointId}`,
    config,
    ReversePrivateEndpointResponseSchema
  );
}

export function useDeleteClickpipesReversePrivateEndpoint(
  organizationId: string,
  serviceId: string,
  reversePrivateEndpointId: string,
  config: ClickHouseConfig
) {
  const deleteReversePrivateEndpoint = async () => {
    const { keyId, keySecret, baseUrl = "https://api.clickhouse.cloud" } = config;
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
    const responseData = await response.json();
    return ClickHouseBaseResponseSchema.parse(responseData);
  };
  return { deleteReversePrivateEndpoint };
}
