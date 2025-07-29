import useSWR from "swr";
import { fetcher } from "../api/fetcher";
import type { ClickHouseConfig } from "../api/fetcher";
import {
  OrganizationsResponseSchema,
  OrganizationResponseSchema,
  ActivitiesResponseSchema,
  ActivityResponseSchema,
  UsageCostResponseSchema,
  PrivateEndpointConfigResponseSchema,
  type OrganizationsResponse,
  type OrganizationResponse,
  type ActivitiesResponse,
  type ActivityResponse,
  type UsageCostResponse,
  type PrivateEndpointConfigResponse,
  type Organization,
} from "../schemas/schemas";

export function useOrganizations(config: ClickHouseConfig) {
  const { data, error, isLoading } = useSWR(
    ["/v1/organizations", config],
    ([url, cfg]: [string, ClickHouseConfig]) => 
      fetcher<OrganizationsResponse>(url, cfg, OrganizationsResponseSchema)
  );
  return { 
    data: data?.result, 
    error, 
    isLoading,
    response: data
  };
}

export function useOrganization(organizationId: string, config: ClickHouseConfig) {
  const { data, error, isLoading } = useSWR(
    [`/v1/organizations/${organizationId}`, config],
    ([url, cfg]: [string, ClickHouseConfig]) => 
      fetcher<OrganizationResponse>(url, cfg, OrganizationResponseSchema)
  );
  return { 
    data: data?.result, 
    error, 
    isLoading,
    response: data
  };
}

export function useUpdateOrganization(organizationId: string, config: ClickHouseConfig) {
  const updateOrganization = async (updateData: any): Promise<Organization> => {
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
    const responseData = await response.json();
    
    // Validate the response
    const validatedResponse = OrganizationResponseSchema.parse(responseData);
    return validatedResponse.result;
  };

  return { updateOrganization };
}

export function useOrganizationActivities(organizationId: string, config: ClickHouseConfig) {
  const { data, error, isLoading } = useSWR(
    [`/v1/organizations/${organizationId}/activities`, config],
    ([url, cfg]: [string, ClickHouseConfig]) => 
      fetcher<ActivitiesResponse>(url, cfg, ActivitiesResponseSchema)
  );
  return { 
    data: data?.result, 
    error, 
    isLoading,
    response: data
  };
}

export function useOrganizationActivity(organizationId: string, activityId: string, config: ClickHouseConfig) {
  const { data, error, isLoading } = useSWR(
    [`/v1/organizations/${organizationId}/activities/${activityId}`, config],
    ([url, cfg]: [string, ClickHouseConfig]) => 
      fetcher<ActivityResponse>(url, cfg, ActivityResponseSchema)
  );
  return { 
    data: data?.result, 
    error, 
    isLoading,
    response: data
  };
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
    ([url, cfg]: [string, ClickHouseConfig]) => 
      fetcher<UsageCostResponse>(url, cfg, UsageCostResponseSchema)
  );
  return { 
    data: data?.result, 
    error, 
    isLoading,
    response: data
  };
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
    ([url, cfg]: [string, ClickHouseConfig]) => 
      fetcher<PrivateEndpointConfigResponse>(url, cfg, PrivateEndpointConfigResponseSchema)
  );
  return { 
    data: data?.result, 
    error, 
    isLoading,
    response: data
  };
}
