import type { ClickHouseConfig } from "../api/fetcher";
import {
  organizationsHooks,
  organizationUsageCostHooks,
  organizationPrivateEndpointConfigHooks,
} from "./resources/organizations";
import type { Organization } from "../schemas/schemas";

export const useOrganizations = (config: ClickHouseConfig) =>
  organizationsHooks.useList({}, config);

export const useOrganization = (
  organizationId: string,
  config: ClickHouseConfig
) => organizationsHooks.useOne({ organizationId }, config);

export const useUpdateOrganization = (
  organizationId: string,
  config: ClickHouseConfig
) => {
  const update = organizationsHooks.useUpdate({ organizationId }, config);
  return { updateOrganization: (body: Partial<Organization>) => update(body) };
};

export const useOrganizationUsageCost = (
  organizationId: string,
  config: ClickHouseConfig,
  params?: { startDate?: string; endDate?: string }
) =>
  organizationUsageCostHooks.useOne(
    { organizationId, ...params },
    config
  );

export const useOrganizationPrivateEndpointConfig = (
  organizationId: string,
  config: ClickHouseConfig,
  params?: { cloudProvider?: string; region?: string }
) =>
  organizationPrivateEndpointConfigHooks.useOne(
    { organizationId, ...params },
    config
  );

