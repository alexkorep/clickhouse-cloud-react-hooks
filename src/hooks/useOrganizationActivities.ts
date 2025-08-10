import type { ClickHouseConfig } from "../api/fetcher";
import { organizationActivitiesHooks } from "./resources/organizationActivities";

export const useOrganizationActivities = (
  organizationId: string,
  config: ClickHouseConfig,
  params?: { fromDate?: string; toDate?: string }
) => organizationActivitiesHooks.useList({ organizationId, ...params }, config);

export const useOrganizationActivity = (
  organizationId: string,
  activityId: string,
  config: ClickHouseConfig
) =>
  organizationActivitiesHooks.useOne({ organizationId, activityId }, config);

