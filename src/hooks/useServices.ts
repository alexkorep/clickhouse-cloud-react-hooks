import useSWR from "swr";
import { fetcher } from "../api/fetcher";
import { useClickHouseSWR } from "./useClickHouseSWR";
import {
  type ServicesResponse,
  ServicesResponseSchema,
  type ServiceResponse,
  ServiceResponseSchema,
} from "../schemas/schemas";
import type { ClickHouseConfig } from "../api/fetcher";

export function useServices(organizationId: string, config: ClickHouseConfig) {
  return useClickHouseSWR<ServicesResponse>(
    `/v1/organizations/${organizationId}/services`,
    config,
    ServicesResponseSchema
  );
}

export function useService(
  organizationId: string,
  serviceId: string,
  config: ClickHouseConfig
) {
  return useClickHouseSWR<ServiceResponse>(
    `/v1/organizations/${organizationId}/services/${serviceId}`,
    config,
    ServiceResponseSchema
  );
}

export function useCreateService(
  organizationId: string,
  config: ClickHouseConfig
) {
  const createService = async (serviceData: unknown) => {
    const {
      keyId,
      keySecret,
      baseUrl = "https://api.clickhouse.cloud",
    } = config;
    const auth = btoa(`${keyId}:${keySecret}`);
    const response = await fetch(
      `${baseUrl}/v1/organizations/${organizationId}/services`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serviceData),
      }
    );
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  };

  return { createService };
}

export function useUpdateService(
  organizationId: string,
  serviceId: string,
  config: ClickHouseConfig
) {
  const updateService = async (updateData: unknown) => {
    const {
      keyId,
      keySecret,
      baseUrl = "https://api.clickhouse.cloud",
    } = config;
    const auth = btoa(`${keyId}:${keySecret}`);
    const response = await fetch(
      `${baseUrl}/v1/organizations/${organizationId}/services/${serviceId}`,
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

  return { updateService };
}

export function useDeleteService(
  organizationId: string,
  serviceId: string,
  config: ClickHouseConfig
) {
  const deleteService = async () => {
    const {
      keyId,
      keySecret,
      baseUrl = "https://api.clickhouse.cloud",
    } = config;
    const auth = btoa(`${keyId}:${keySecret}`);
    const response = await fetch(
      `${baseUrl}/v1/organizations/${organizationId}/services/${serviceId}`,
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

  return { deleteService };
}

export function useServiceState(
  organizationId: string,
  serviceId: string,
  config: ClickHouseConfig
) {
  const updateServiceState = async (stateData: {
    command: "start" | "stop";
  }) => {
    const {
      keyId,
      keySecret,
      baseUrl = "https://api.clickhouse.cloud",
    } = config;
    const auth = btoa(`${keyId}:${keySecret}`);
    const response = await fetch(
      `${baseUrl}/v1/organizations/${organizationId}/services/${serviceId}/state`,
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

  return { updateServiceState };
}

export function useServiceReplicaScaling(
  organizationId: string,
  serviceId: string,
  config: ClickHouseConfig
) {
  const updateServiceScaling = async (scalingData: unknown) => {
    const {
      keyId,
      keySecret,
      baseUrl = "https://api.clickhouse.cloud",
    } = config;
    const auth = btoa(`${keyId}:${keySecret}`);
    const response = await fetch(
      `${baseUrl}/v1/organizations/${organizationId}/services/${serviceId}/replicaScaling`,
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

  return { updateServiceScaling };
}

export function useServicePassword(
  organizationId: string,
  serviceId: string,
  config: ClickHouseConfig
) {
  const updateServicePassword = async (passwordData: {
    newPassword: string;
  }) => {
    const {
      keyId,
      keySecret,
      baseUrl = "https://api.clickhouse.cloud",
    } = config;
    const auth = btoa(`${keyId}:${keySecret}`);
    const response = await fetch(
      `${baseUrl}/v1/organizations/${organizationId}/services/${serviceId}/password`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(passwordData),
      }
    );
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  };

  return { updateServicePassword };
}

export function useServicePrivateEndpointConfig(
  organizationId: string,
  serviceId: string,
  config: ClickHouseConfig
) {
  const { data, error, isLoading } = useSWR<any>(
    [
      `/v1/organizations/${organizationId}/services/${serviceId}/privateEndpointConfig`,
      config,
    ],
    ([url, cfg]: [string, ClickHouseConfig]) => fetcher<any>(url, cfg)
  );
  return { data: data?.result, error, isLoading, response: data };
}

export function useServiceQueryEndpoint(
  organizationId: string,
  serviceId: string,
  config: ClickHouseConfig
) {
  const { data, error, isLoading } = useSWR<any>(
    [
      `/v1/organizations/${organizationId}/services/${serviceId}/serviceQueryEndpoint`,
      config,
    ],
    ([url, cfg]: [string, ClickHouseConfig]) => fetcher<any>(url, cfg)
  );

  const createQueryEndpoint = async (endpointData: unknown) => {
    const {
      keyId,
      keySecret,
      baseUrl = "https://api.clickhouse.cloud",
    } = config;
    const auth = btoa(`${keyId}:${keySecret}`);
    const response = await fetch(
      `${baseUrl}/v1/organizations/${organizationId}/services/${serviceId}/serviceQueryEndpoint`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(endpointData),
      }
    );
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  };

  const deleteQueryEndpoint = async () => {
    const {
      keyId,
      keySecret,
      baseUrl = "https://api.clickhouse.cloud",
    } = config;
    const auth = btoa(`${keyId}:${keySecret}`);
    const response = await fetch(
      `${baseUrl}/v1/organizations/${organizationId}/services/${serviceId}/serviceQueryEndpoint`,
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

  return {
    data: data?.result,
    error,
    isLoading,
    response: data,
    createQueryEndpoint,
    deleteQueryEndpoint,
  };
}

export function useServicePrometheus(
  organizationId: string,
  serviceId: string,
  config: ClickHouseConfig,
  params?: { filteredMetrics?: boolean }
) {
  const query = params?.filteredMetrics ? "?filtered_metrics=true" : "";
  const { data, error, isLoading } = useSWR(
    [`/v1/organizations/${organizationId}/services/${serviceId}/prometheus${query}`, config],
    async ([url, cfg]: [string, ClickHouseConfig]) => {
      const { keyId, keySecret, baseUrl = "https://api.clickhouse.cloud" } = cfg;
      const auth = btoa(`${keyId}:${keySecret}`);
      const res = await fetch(`${baseUrl}${url}`, {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      return res.text();
    }
  );
  return { data, error, isLoading };
}
export function useCreateServicePrivateEndpoint(
  organizationId: string,
  serviceId: string,
  config: ClickHouseConfig
) {
  const createPrivateEndpoint = async (endpointData: unknown) => {
    const {
      keyId,
      keySecret,
      baseUrl = "https://api.clickhouse.cloud",
    } = config;
    const auth = btoa(`${keyId}:${keySecret}`);
    const response = await fetch(
      `${baseUrl}/v1/organizations/${organizationId}/services/${serviceId}/privateEndpoint`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(endpointData),
      }
    );
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  };
  return { createPrivateEndpoint };
}

export function useServiceScaling(
  organizationId: string,
  serviceId: string,
  config: ClickHouseConfig
) {
  const updateServiceScaling = async (scalingData: unknown) => {
    const {
      keyId,
      keySecret,
      baseUrl = "https://api.clickhouse.cloud",
    } = config;
    const auth = btoa(`${keyId}:${keySecret}`);
    const response = await fetch(
      `${baseUrl}/v1/organizations/${organizationId}/services/${serviceId}/scaling`,
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
  return { updateServiceScaling };
}
