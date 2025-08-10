import type { ClickHouseConfig } from "../api/fetcher";
import { useClickHouseSWR } from "./useClickHouseSWR";
import {
  ActivitiesResponseSchema,
  ActivityResponseSchema,
  type ActivitiesResponse,
  type ActivityResponse,
} from "../schemas/schemas";

export function useOrganizationActivities(
  organizationId: string,
  config: ClickHouseConfig,
  params?: { fromDate?: string; toDate?: string }
) {
  const queryParams = new URLSearchParams();
  if (params?.fromDate) queryParams.append("from_date", params.fromDate);
  if (params?.toDate) queryParams.append("to_date", params.toDate);
  const queryString = queryParams.toString();
  const url = `/v1/organizations/${organizationId}/activities${
    queryString ? `?${queryString}` : ""
  }`;
  return useClickHouseSWR<ActivitiesResponse>(
    url,
    config,
    ActivitiesResponseSchema
  );
}

export function useOrganizationActivity(
  organizationId: string,
  activityId: string,
  config: ClickHouseConfig
) {
  return useClickHouseSWR<ActivityResponse>(
    `/v1/organizations/${organizationId}/activities/${activityId}`,
    config,
    ActivityResponseSchema
  );
}
