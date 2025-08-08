import { useSWRConfig } from "swr";
import type { ClickHouseConfig } from "../api/fetcher";
import {
  OrganizationsResponseSchema,
  OrganizationResponseSchema,
  UsageCostResponseSchema,
  PrivateEndpointConfigResponseSchema,
  type OrganizationsResponse,
  type OrganizationResponse,
  type UsageCostResponse,
  type PrivateEndpointConfigResponse,
  type Organization,
} from "../schemas/schemas";
import { useClickHouseSWR } from "./useClickHouseSWR";

export function useOrganizations(config: ClickHouseConfig) {
  return useClickHouseSWR<OrganizationsResponse>(
    "/v1/organizations",
    config,
    OrganizationsResponseSchema
  );
}

export function useOrganization(
  organizationId: string,
  config: ClickHouseConfig
) {
  return useClickHouseSWR<OrganizationResponse>(
    `/v1/organizations/${organizationId}`,
    config,
    OrganizationResponseSchema
  );
}

export function useUpdateOrganization(
  organizationId: string,
  config: ClickHouseConfig
) {
  const { mutate: globalMutate } = useSWRConfig();

  const updateOrganization = async (updateData: any): Promise<Organization> => {
    const {
      keyId,
      keySecret,
      baseUrl = "https://api.clickhouse.cloud",
    } = config;
    const auth = btoa(`${keyId}:${keySecret}`);
    const response = await fetch(
      `${baseUrl}/v1/organizations/${organizationId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      }
    );
    if (!response.ok) throw new Error(await response.text());
    const responseData = await response.json();

    // Validate the response
    const validatedResponse = OrganizationResponseSchema.parse(responseData);

    // Invalidate related cache entries
    await Promise.all([
      `/v1/organizations:${config.baseUrl}:${config.keyId}`,
      globalMutate(
        `/v1/organizations/${organizationId}:${config.baseUrl}:${config.keyId}`
      ),
    ]);

    return validatedResponse.result;
  };

  return { updateOrganization };
}

export function useOrganizationUsageCost(
  organizationId: string,
  config: ClickHouseConfig,
  params?: { startDate?: string; endDate?: string }
) {
  const queryParams = new URLSearchParams();
  if (params?.startDate) queryParams.append("startDate", params.startDate);
  if (params?.endDate) queryParams.append("endDate", params.endDate);
  const queryString = queryParams.toString();
  const url = `/v1/organizations/${organizationId}/usageCost${
    queryString ? `?${queryString}` : ""
  }`;
  return useClickHouseSWR<UsageCostResponse>(
    url,
    config,
    UsageCostResponseSchema
  );
}

export function useOrganizationPrivateEndpointConfig(
  organizationId: string,
  config: ClickHouseConfig,
  params?: { cloudProvider?: string; region?: string }
) {
  const queryParams = new URLSearchParams();
  if (params?.cloudProvider)
    queryParams.append("cloudProvider", params.cloudProvider);
  if (params?.region) queryParams.append("region", params.region);
  const queryString = queryParams.toString();
  const url = `/v1/organizations/${organizationId}/privateEndpointConfig${
    queryString ? `?${queryString}` : ""
  }`;
  return useClickHouseSWR<PrivateEndpointConfigResponse>(
    url,
    config,
    PrivateEndpointConfigResponseSchema
  );
}
