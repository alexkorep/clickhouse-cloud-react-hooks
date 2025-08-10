import type { ClickHouseConfig } from "../api/fetcher";
import {
  servicesHooks,
  serviceQueryEndpointHooks,
  servicePrivateEndpointConfigHooks,
} from "./resources/services";
import { useServicePrometheus as useServiceProm } from "./resources/prometheus";

export const useServices = (
  organizationId: string,
  config: ClickHouseConfig
) => servicesHooks.useList({ organizationId }, config);

export const useService = (
  organizationId: string,
  serviceId: string,
  config: ClickHouseConfig
) => servicesHooks.useOne({ organizationId, serviceId }, config);

export const useCreateService = (
  organizationId: string,
  config: ClickHouseConfig
) => {
  const create = servicesHooks.useCreate({ organizationId }, config);
  return { createService: (body: unknown) => create(body) };
};

export const useUpdateService = (
  organizationId: string,
  serviceId: string,
  config: ClickHouseConfig
) => {
  const update = servicesHooks.useUpdate({ organizationId, serviceId }, config);
  return { updateService: (body: unknown) => update(body) };
};

export const useDeleteService = (
  organizationId: string,
  serviceId: string,
  config: ClickHouseConfig
) => {
  const del = servicesHooks.useDelete({ organizationId, serviceId }, config);
  return { deleteService: () => del() };
};

export const useServiceState = (
  organizationId: string,
  serviceId: string,
  config: ClickHouseConfig
) => {
  const { updateState } = servicesHooks.useActions({ organizationId, serviceId }, config);
  return { updateServiceState: (body: unknown) => updateState(body) };
};

export const useServiceReplicaScaling = (
  organizationId: string,
  serviceId: string,
  config: ClickHouseConfig
) => {
  const { updateReplicaScaling } = servicesHooks.useActions(
    { organizationId, serviceId },
    config
  );
  return { updateServiceScaling: (body: unknown) => updateReplicaScaling(body) };
};

export const useServicePassword = (
  organizationId: string,
  serviceId: string,
  config: ClickHouseConfig
) => {
  const { updatePassword } = servicesHooks.useActions({ organizationId, serviceId }, config);
  return { updateServicePassword: (body: { newPassword: string }) => updatePassword(body) };
};

export const useServicePrivateEndpointConfig = (
  organizationId: string,
  serviceId: string,
  config: ClickHouseConfig
) =>
  servicePrivateEndpointConfigHooks.useOne({ organizationId, serviceId }, config);

export const useServiceQueryEndpoint = (
  organizationId: string,
  serviceId: string,
  config: ClickHouseConfig
) => {
  const query = serviceQueryEndpointHooks.useOne({ organizationId, serviceId }, config);
  const create = serviceQueryEndpointHooks.useCreate(
    { organizationId, serviceId },
    config
  );
  const del = serviceQueryEndpointHooks.useDelete({ organizationId, serviceId }, config);
  return {
    ...query,
    createQueryEndpoint: (body: unknown) => create(body),
    deleteQueryEndpoint: () => del(),
  };
};

export const useServicePrometheus = (
  organizationId: string,
  serviceId: string,
  config: ClickHouseConfig,
  params?: { filteredMetrics?: boolean }
) =>
  useServiceProm({ organizationId, serviceId, filteredMetrics: params?.filteredMetrics }, config);

export const useCreateServicePrivateEndpoint = (
  organizationId: string,
  serviceId: string,
  config: ClickHouseConfig
) => {
  const { createPrivateEndpoint } = servicesHooks.useActions(
    { organizationId, serviceId },
    config
  );
  return { createPrivateEndpoint: (body: unknown) => createPrivateEndpoint(body) };
};

export const useServiceScaling = (
  organizationId: string,
  serviceId: string,
  config: ClickHouseConfig
) => {
  const { updateScaling } = servicesHooks.useActions({ organizationId, serviceId }, config);
  return { updateServiceScaling: (body: unknown) => updateScaling(body) };
};

