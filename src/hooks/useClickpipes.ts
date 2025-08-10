import type { ClickHouseConfig } from "../api/fetcher";
import { clickpipeHooks } from "./resources/clickpipes";

export const useClickpipes = (
  organizationId: string,
  serviceId: string,
  config: ClickHouseConfig
) => clickpipeHooks.useList({ organizationId, serviceId }, config);

export const useClickpipe = (
  organizationId: string,
  serviceId: string,
  clickPipeId: string,
  config: ClickHouseConfig
) =>
  clickpipeHooks.useOne({ organizationId, serviceId, clickPipeId }, config);

export const useCreateClickpipe = (
  organizationId: string,
  serviceId: string,
  config: ClickHouseConfig
) => {
  const create = clickpipeHooks.useCreate({ organizationId, serviceId }, config);
  return { createClickpipe: (body: unknown) => create(body) };
};

export const useUpdateClickpipe = (
  organizationId: string,
  serviceId: string,
  clickPipeId: string,
  config: ClickHouseConfig
) => {
  const update = clickpipeHooks.useUpdate(
    { organizationId, serviceId, clickPipeId },
    config
  );
  return { updateClickpipe: (body: unknown) => update(body) };
};

export const useDeleteClickpipe = (
  organizationId: string,
  serviceId: string,
  clickPipeId: string,
  config: ClickHouseConfig
) => {
  const del = clickpipeHooks.useDelete({ organizationId, serviceId, clickPipeId }, config);
  return { deleteClickpipe: () => del() };
};

export const useClickpipeScaling = (
  organizationId: string,
  serviceId: string,
  clickPipeId: string,
  config: ClickHouseConfig
) => {
  const { updateScaling } = clickpipeHooks.useActions(
    { organizationId, serviceId, clickPipeId },
    config
  );
  return { updateClickpipeScaling: (body: unknown) => updateScaling(body) };
};

export const useClickpipeState = (
  organizationId: string,
  serviceId: string,
  clickPipeId: string,
  config: ClickHouseConfig
) => {
  const { updateState } = clickpipeHooks.useActions(
    { organizationId, serviceId, clickPipeId },
    config
  );
  return { updateClickpipeState: (body: unknown) => updateState(body) };
};

