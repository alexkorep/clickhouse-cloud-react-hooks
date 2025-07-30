import useSWR from "swr";
import { fetcher } from "../api/fetcher";
import type { ClickHouseConfig } from "../api/fetcher";

export function useServices(organizationId: string, config: ClickHouseConfig) {
  const { data, error, isLoading } = useSWR(
    [`/v1/organizations/${organizationId}/services`, config],
    ([url, cfg]: [string, ClickHouseConfig]) => fetcher(url, cfg)
  );
  return { data, error, isLoading };
}

export function useService(
  organizationId: string,
  serviceId: string,
  config: ClickHouseConfig
) {
  const { data, error, isLoading } = useSWR(
    [`/v1/organizations/${organizationId}/services/${serviceId}`, config],
    ([url, cfg]: [string, ClickHouseConfig]) => fetcher(url, cfg)
  );
  return { data, error, isLoading };
}

export function useCreateService(
  organizationId: string,
  config: ClickHouseConfig
) {
  const createService = async (serviceData: any) => {
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
  const updateService = async (updateData: any) => {
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
  const updateServiceScaling = async (scalingData: any) => {
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
  const { data, error, isLoading } = useSWR(
    [
      `/v1/organizations/${organizationId}/services/${serviceId}/privateEndpointConfig`,
      config,
    ],
    ([url, cfg]: [string, ClickHouseConfig]) => fetcher(url, cfg)
  );
  return { data, error, isLoading };
}

export function useServiceQueryEndpoint(
  organizationId: string,
  serviceId: string,
  config: ClickHouseConfig
) {
  const { data, error, isLoading } = useSWR(
    [
      `/v1/organizations/${organizationId}/services/${serviceId}/serviceQueryEndpoint`,
      config,
    ],
    ([url, cfg]: [string, ClickHouseConfig]) => fetcher(url, cfg)
  );

  const createQueryEndpoint = async (endpointData: any) => {
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

  return { data, error, isLoading, createQueryEndpoint, deleteQueryEndpoint };
}

export function useServicePrometheus(
  organizationId: string,
  serviceId: string,
  config: ClickHouseConfig
) {
  const { data, error, isLoading } = useSWR(
    [
      `/v1/organizations/${organizationId}/services/${serviceId}/prometheus`,
      config,
    ],
    ([url, cfg]: [string, ClickHouseConfig]) => fetcher(url, cfg)
  );
  return { data, error, isLoading };
}
export function useCreateServicePrivateEndpoint(
  organizationId: string,
  serviceId: string,
  config: ClickHouseConfig
) {
  const createPrivateEndpoint = async (endpointData: any) => {
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
  const updateServiceScaling = async (scalingData: any) => {
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
