import useSWR from "swr";
import { fetcher } from "../api/fetcher";
import type { ClickHouseConfig } from "../api/fetcher";
import {
  ActivitiesResponseSchema,
  ActivityResponseSchema,
  type ActivitiesResponse,
  type ActivityResponse,
} from "../schemas/schemas";

export function useOrganizationActivities(
  organizationId: string,
  config: ClickHouseConfig
) {
  const {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR(
    [`/v1/organizations/${organizationId}/activities`, config],
    ([url, cfg]: [string, ClickHouseConfig]) =>
      fetcher<ActivitiesResponse>(url, cfg, ActivitiesResponseSchema)
  );
  return {
    data: data?.result,
    error,
    isLoading,
    isValidating,
    mutate,
    response: data,
  };
}

export function useOrganizationActivity(
  organizationId: string,
  activityId: string,
  config: ClickHouseConfig
) {
  const { data, error, isLoading } = useSWR(
    [`/v1/organizations/${organizationId}/activities/${activityId}`, config],
    ([url, cfg]: [string, ClickHouseConfig]) =>
      fetcher<ActivityResponse>(url, cfg, ActivityResponseSchema)
  );
  return {
    data: data?.result,
    error,
    isLoading,
    response: data,
  };
}
