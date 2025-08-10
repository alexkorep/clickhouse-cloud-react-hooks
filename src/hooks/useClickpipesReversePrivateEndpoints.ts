import type { ClickHouseConfig } from "../api/fetcher";
import { clickpipesRpeHooks } from "./resources/clickpipesReversePrivateEndpoints";

export const useClickpipesReversePrivateEndpoints = (
  organizationId: string,
  serviceId: string,
  config: ClickHouseConfig
) => clickpipesRpeHooks.useList({ organizationId, serviceId }, config);

export const useClickpipesReversePrivateEndpoint = (
  organizationId: string,
  serviceId: string,
  endpointId: string,
  config: ClickHouseConfig
) =>
  clickpipesRpeHooks.useOne(
    { organizationId, serviceId, endpointId },
    config
  );

export const useCreateClickpipesReversePrivateEndpoint = (
  organizationId: string,
  serviceId: string,
  config: ClickHouseConfig
) => {
  const create = clickpipesRpeHooks.useCreate({ organizationId, serviceId }, config);
  return { createReversePrivateEndpoint: (body: unknown) => create(body) };
};

export const useDeleteClickpipesReversePrivateEndpoint = (
  organizationId: string,
  serviceId: string,
  endpointId: string,
  config: ClickHouseConfig
) => {
  const del = clickpipesRpeHooks.useDelete(
    { organizationId, serviceId, endpointId },
    config
  );
  return { deleteReversePrivateEndpoint: () => del() };
};

