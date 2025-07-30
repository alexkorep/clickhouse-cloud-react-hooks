import useSWR from "swr";
import { fetcher } from "../api/fetcher";
import type { ClickHouseConfig } from "../api/fetcher";

// Fetch organization-level Prometheus metrics
export function useOrganizationPrometheusMetrics(
  organizationId: string,
  config: ClickHouseConfig
) {
  const { data, error, isLoading } = useSWR(
    [`/v1/organizations/${organizationId}/prometheus`, config],
    ([url, cfg]: [string, ClickHouseConfig]) => fetcher(url, cfg)
  );
  return { data, error, isLoading };
}

// Fetch service-level Prometheus metrics
export function useServicePrometheusMetrics(
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
