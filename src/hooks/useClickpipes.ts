/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWR from "swr";
import { fetcher } from "../api/fetcher";
import type { ClickHouseConfig } from "../api/fetcher";

export function useClickpipes(
  organizationId: string,
  serviceId: string,
  config: ClickHouseConfig
) {
  const { data, error, isLoading } = useSWR(
    [
      `/v1/organizations/${organizationId}/services/${serviceId}/clickpipes`,
      config,
    ],
    ([url, cfg]: [string, ClickHouseConfig]) => fetcher(url, cfg)
  );
  return { data, error, isLoading };
}

export function useCreateClickpipe(
  organizationId: string,
  serviceId: string,
  config: ClickHouseConfig
) {
  const createClickpipe = async (clickpipeData: unknown) => {
    const {
      keyId,
      keySecret,
      baseUrl = "https://api.clickhouse.cloud",
    } = config;
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
    return response.json();
  };

  return { createClickpipe };
}

export function useClickpipe(
  organizationId: string,
  serviceId: string,
  clickPipeId: string,
  config: ClickHouseConfig
) {
  const { data, error, isLoading } = useSWR(
    [
      `/v1/organizations/${organizationId}/services/${serviceId}/clickpipes/${clickPipeId}`,
      config,
    ],
    ([url, cfg]: [string, ClickHouseConfig]) => fetcher(url, cfg)
  );
  return { data, error, isLoading };
}

export function useUpdateClickpipe(
  organizationId: string,
  serviceId: string,
  clickPipeId: string,
  config: ClickHouseConfig
) {
  const updateClickpipe = async (updateData: unknown) => {
    const {
      keyId,
      keySecret,
      baseUrl = "https://api.clickhouse.cloud",
    } = config;
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
    return response.json();
  };

  return { updateClickpipe };
}

export function useDeleteClickpipe(
  organizationId: string,
  serviceId: string,
  clickPipeId: string,
  config: ClickHouseConfig
) {
  const deleteClickpipe = async () => {
    const {
      keyId,
      keySecret,
      baseUrl = "https://api.clickhouse.cloud",
    } = config;
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
    return response.json();
  };

  return { deleteClickpipe };
}

export function useClickpipeScaling(
  organizationId: string,
  serviceId: string,
  clickPipeId: string,
  config: ClickHouseConfig
) {
  const updateClickpipeScaling = async (scalingData: unknown) => {
    const {
      keyId,
      keySecret,
      baseUrl = "https://api.clickhouse.cloud",
    } = config;
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
    return response.json();
  };

  return { updateClickpipeScaling };
}

export function useClickpipeState(
  organizationId: string,
  serviceId: string,
  clickPipeId: string,
  config: ClickHouseConfig
) {
  const updateClickpipeState = async (stateData: {
    command: "start" | "stop" | "resync";
  }) => {
    const {
      keyId,
      keySecret,
      baseUrl = "https://api.clickhouse.cloud",
    } = config;
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
    return response.json();
  };

  return { updateClickpipeState };
}
