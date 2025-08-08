import { useSWRConfig } from "swr";
import type { ClickHouseConfig } from "../api/fetcher";
import {
  ClickPipeResponseSchema,
  ClickPipesResponseSchema,
  ClickHouseBaseResponseSchema,
  type ClickPipe,
  type ClickPipeResponse,
  type ClickPipesResponse,
} from "../schemas/schemas";
import { useClickHouseSWR } from "./useClickHouseSWR";

export function useClickpipes(
  organizationId: string,
  serviceId: string,
  config: ClickHouseConfig
) {
  return useClickHouseSWR<ClickPipesResponse>(
    `/v1/organizations/${organizationId}/services/${serviceId}/clickpipes`,
    config,
    ClickPipesResponseSchema
  );
}

export function useClickpipe(
  organizationId: string,
  serviceId: string,
  clickPipeId: string,
  config: ClickHouseConfig
) {
  return useClickHouseSWR<ClickPipeResponse>(
    `/v1/organizations/${organizationId}/services/${serviceId}/clickpipes/${clickPipeId}`,
    config,
    ClickPipeResponseSchema
  );
}

export function useCreateClickpipe(
  organizationId: string,
  serviceId: string,
  config: ClickHouseConfig
) {
  const { mutate: globalMutate } = useSWRConfig();

  const createClickpipe = async (clickpipeData: unknown): Promise<ClickPipe> => {
    const { keyId, keySecret, baseUrl = "https://api.clickhouse.cloud" } = config;
    const auth = btoa(`${keyId}:${keySecret}`);
    const response = await fetch(
      `${baseUrl}/v1/organizations/${organizationId}/services/${serviceId}/clickpipes`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clickpipeData),
      }
    );
    if (!response.ok) throw new Error(await response.text());
    const responseData = await response.json();
    const validated = ClickPipeResponseSchema.parse(responseData);
    await globalMutate(
      `/v1/organizations/${organizationId}/services/${serviceId}/clickpipes:${config.baseUrl}:${config.keyId}`
    );
    return validated.result;
  };

  return { createClickpipe };
}

export function useUpdateClickpipe(
  organizationId: string,
  serviceId: string,
  clickPipeId: string,
  config: ClickHouseConfig
) {
  const { mutate: globalMutate } = useSWRConfig();

  const updateClickpipe = async (updateData: unknown): Promise<ClickPipe> => {
    const { keyId, keySecret, baseUrl = "https://api.clickhouse.cloud" } = config;
    const auth = btoa(`${keyId}:${keySecret}`);
    const response = await fetch(
      `${baseUrl}/v1/organizations/${organizationId}/services/${serviceId}/clickpipes/${clickPipeId}`,
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
    const validated = ClickPipeResponseSchema.parse(responseData);
    await Promise.all([
      globalMutate(
        `/v1/organizations/${organizationId}/services/${serviceId}/clickpipes:${config.baseUrl}:${config.keyId}`
      ),
      globalMutate(
        `/v1/organizations/${organizationId}/services/${serviceId}/clickpipes/${clickPipeId}:${config.baseUrl}:${config.keyId}`
      ),
    ]);
    return validated.result;
  };

  return { updateClickpipe };
}

export function useDeleteClickpipe(
  organizationId: string,
  serviceId: string,
  clickPipeId: string,
  config: ClickHouseConfig
) {
  const { mutate: globalMutate } = useSWRConfig();

  const deleteClickpipe = async () => {
    const { keyId, keySecret, baseUrl = "https://api.clickhouse.cloud" } = config;
    const auth = btoa(`${keyId}:${keySecret}`);
    const response = await fetch(
      `${baseUrl}/v1/organizations/${organizationId}/services/${serviceId}/clickpipes/${clickPipeId}`,
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
    const validated = ClickHouseBaseResponseSchema.parse(responseData);
    await Promise.all([
      globalMutate(
        `/v1/organizations/${organizationId}/services/${serviceId}/clickpipes:${config.baseUrl}:${config.keyId}`
      ),
      globalMutate(
        `/v1/organizations/${organizationId}/services/${serviceId}/clickpipes/${clickPipeId}:${config.baseUrl}:${config.keyId}`
      ),
    ]);
    return validated;
  };

  return { deleteClickpipe };
}

export function useClickpipeScaling(
  organizationId: string,
  serviceId: string,
  clickPipeId: string,
  config: ClickHouseConfig
) {
  const { mutate: globalMutate } = useSWRConfig();

  const updateClickpipeScaling = async (scalingData: unknown): Promise<ClickPipe> => {
    const { keyId, keySecret, baseUrl = "https://api.clickhouse.cloud" } = config;
    const auth = btoa(`${keyId}:${keySecret}`);
    const response = await fetch(
      `${baseUrl}/v1/organizations/${organizationId}/services/${serviceId}/clickpipes/${clickPipeId}/scaling`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(scalingData),
      }
    );
    if (!response.ok) throw new Error(await response.text());
    const responseData = await response.json();
    const validated = ClickPipeResponseSchema.parse(responseData);
    await Promise.all([
      globalMutate(
        `/v1/organizations/${organizationId}/services/${serviceId}/clickpipes:${config.baseUrl}:${config.keyId}`
      ),
      globalMutate(
        `/v1/organizations/${organizationId}/services/${serviceId}/clickpipes/${clickPipeId}:${config.baseUrl}:${config.keyId}`
      ),
    ]);
    return validated.result;
  };

  return { updateClickpipeScaling };
}

export function useClickpipeState(
  organizationId: string,
  serviceId: string,
  clickPipeId: string,
  config: ClickHouseConfig
) {
  const { mutate: globalMutate } = useSWRConfig();

  const updateClickpipeState = async (
    stateData: { command: "start" | "stop" | "resync" }
  ): Promise<ClickPipe> => {
    const { keyId, keySecret, baseUrl = "https://api.clickhouse.cloud" } = config;
    const auth = btoa(`${keyId}:${keySecret}`);
    const response = await fetch(
      `${baseUrl}/v1/organizations/${organizationId}/services/${serviceId}/clickpipes/${clickPipeId}/state`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stateData),
      }
    );
    if (!response.ok) throw new Error(await response.text());
    const responseData = await response.json();
    const validated = ClickPipeResponseSchema.parse(responseData);
    await Promise.all([
      globalMutate(
        `/v1/organizations/${organizationId}/services/${serviceId}/clickpipes:${config.baseUrl}:${config.keyId}`
      ),
      globalMutate(
        `/v1/organizations/${organizationId}/services/${serviceId}/clickpipes/${clickPipeId}:${config.baseUrl}:${config.keyId}`
      ),
    ]);
    return validated.result;
  };

  return { updateClickpipeState };
}

