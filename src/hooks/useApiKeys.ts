import { useSWRConfig } from "swr";
import type { ClickHouseConfig } from "../api/fetcher";
import { useClickHouseSWR } from "./useClickHouseSWR";
import {
  ApiKeysResponseSchema,
  ApiKeyResponseSchema,
  ApiKeyCreateResponseSchema,
  ClickHouseBaseResponseSchema,
  type ApiKeysResponse,
  type ApiKeyResponse,
  type ApiKey,
  type ClickHouseBaseResponse,
} from "../schemas/schemas";

type ApiKeyCreateRequest = {
  name: string;
  roles: ("admin" | "developer" | "query_endpoints")[];
  expireAt?: string | null;
  state?: "enabled" | "disabled";
  ipAccessList?: { source: string; description: string }[];
};

type ApiKeyUpdateRequest = Partial<ApiKeyCreateRequest>;

export function useApiKeys(organizationId: string, config: ClickHouseConfig) {
  return useClickHouseSWR<ApiKeysResponse>(
    `/v1/organizations/${organizationId}/keys`,
    config,
    ApiKeysResponseSchema
  );
}

export function useCreateApiKey(
  organizationId: string,
  config: ClickHouseConfig
) {
  const { mutate } = useClickHouseSWR<ApiKeysResponse>(
    `/v1/organizations/${organizationId}/keys`,
    config,
    ApiKeysResponseSchema
  );

  const createApiKey = async (keyData: ApiKeyCreateRequest) => {
    const {
      keyId,
      keySecret,
      baseUrl = "https://api.clickhouse.cloud",
    } = config;
    const auth = btoa(`${keyId}:${keySecret}`);
    const response = await fetch(
      `${baseUrl}/v1/organizations/${organizationId}/keys`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(keyData),
      }
    );
    if (!response.ok) throw new Error(await response.text());
    const responseData = await response.json();

    const validatedResponse = ApiKeyCreateResponseSchema.parse(responseData);

    await mutate();

    return validatedResponse.result;
  };

  return { createApiKey };
}

export function useApiKey(
  organizationId: string,
  keyId: string,
  config: ClickHouseConfig
) {
  return useClickHouseSWR<ApiKeyResponse>(
    `/v1/organizations/${organizationId}/keys/${keyId}`,
    config,
    ApiKeyResponseSchema
  );
}

export function useUpdateApiKey(
  organizationId: string,
  keyId: string,
  config: ClickHouseConfig
) {
  const { mutate: globalMutate } = useSWRConfig();

  const updateApiKey = async (
    updateData: ApiKeyUpdateRequest
  ): Promise<ApiKey> => {
    const {
      keyId: configKeyId,
      keySecret,
      baseUrl = "https://api.clickhouse.cloud",
    } = config;
    const auth = btoa(`${configKeyId}:${keySecret}`);
    const response = await fetch(
      `${baseUrl}/v1/organizations/${organizationId}/keys/${keyId}`,
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

    const validatedResponse = ApiKeyResponseSchema.parse(responseData);

    await Promise.all([
      globalMutate(
        `/v1/organizations/${organizationId}/keys:${config.baseUrl}:${config.keyId}`
      ),
      globalMutate(
        `/v1/organizations/${organizationId}/keys/${keyId}:${config.baseUrl}:${config.keyId}`
      ),
    ]);

    return validatedResponse.result;
  };

  return { updateApiKey };
}

export function useDeleteApiKey(
  organizationId: string,
  keyId: string,
  config: ClickHouseConfig
) {
  const { mutate: globalMutate } = useSWRConfig();

  const deleteApiKey = async (): Promise<ClickHouseBaseResponse> => {
    const {
      keyId: configKeyId,
      keySecret,
      baseUrl = "https://api.clickhouse.cloud",
    } = config;
    const auth = btoa(`${configKeyId}:${keySecret}`);
    const response = await fetch(
      `${baseUrl}/v1/organizations/${organizationId}/keys/${keyId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) throw new Error(await response.text());
    const responseData = await response.json();

    const validatedResponse = ClickHouseBaseResponseSchema.parse(responseData);

    await Promise.all([
      globalMutate(
        `/v1/organizations/${organizationId}/keys:${config.baseUrl}:${config.keyId}`
      ),
      globalMutate(
        `/v1/organizations/${organizationId}/keys/${keyId}:${config.baseUrl}:${config.keyId}`
      ),
    ]);

    return validatedResponse;
  };

  return { deleteApiKey };
}
