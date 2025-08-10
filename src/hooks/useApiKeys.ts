import type { ClickHouseConfig } from "../api/fetcher";
import { apiKeyHooks } from "./resources/apiKeys";

export type ApiKeyCreateRequest = {
  name: string;
  roles: ("admin" | "developer" | "query_endpoints")[];
  expireAt?: string | null;
  state?: "enabled" | "disabled";
  ipAccessList?: { source: string; description: string }[];
};

export type ApiKeyUpdateRequest = Partial<ApiKeyCreateRequest>;

export const useApiKeys = (organizationId: string, config: ClickHouseConfig) =>
  apiKeyHooks.useList({ organizationId }, config);

export const useApiKey = (
  organizationId: string,
  keyId: string,
  config: ClickHouseConfig
) => apiKeyHooks.useOne({ organizationId, keyId }, config);

export const useCreateApiKey = (
  organizationId: string,
  config: ClickHouseConfig
) => {
  const create = apiKeyHooks.useCreate({ organizationId }, config);
  return { createApiKey: (body: ApiKeyCreateRequest) => create(body) };
};

export const useUpdateApiKey = (
  organizationId: string,
  keyId: string,
  config: ClickHouseConfig
) => {
  const update = apiKeyHooks.useUpdate({ organizationId, keyId }, config);
  return { updateApiKey: (body: ApiKeyUpdateRequest) => update(body) };
};

export const useDeleteApiKey = (
  organizationId: string,
  keyId: string,
  config: ClickHouseConfig
) => {
  const del = apiKeyHooks.useDelete({ organizationId, keyId }, config);
  return { deleteApiKey: () => del() };
};

