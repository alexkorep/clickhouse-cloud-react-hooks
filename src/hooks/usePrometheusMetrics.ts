import useSWR from "swr";
import { fetcher } from "../api/fetcher";
import type { ClickHouseConfig } from "../api/fetcher";

// Fetch organization-level Prometheus metrics
export function useOrganizationPrometheusMetrics(
  organizationId: string,
  config: ClickHouseConfig,
  filteredMetrics?: boolean
) {
  const query =
    filteredMetrics !== undefined
      ? `?filtered_metrics=${filteredMetrics}`
      : "";
  const { data, error, isLoading } = useSWR(
    [`/v1/organizations/${organizationId}/prometheus${query}`, config],
    ([url, cfg]: [string, ClickHouseConfig]) =>
      fetcher<string>(url, cfg, undefined, "text")
  );
  return { data, error, isLoading };
}

// Fetch service-level Prometheus metrics
export function useServicePrometheusMetrics(
  organizationId: string,
  serviceId: string,
  config: ClickHouseConfig,
  filteredMetrics?: boolean
) {
  const query =
    filteredMetrics !== undefined
      ? `?filtered_metrics=${filteredMetrics}`
      : "";
  const { data, error, isLoading } = useSWR(
    [
      `/v1/organizations/${organizationId}/services/${serviceId}/prometheus${query}`,
      config,
    ],
    ([url, cfg]: [string, ClickHouseConfig]) =>
      fetcher<string>(url, cfg, undefined, "text")
  );
  return { data, error, isLoading };
}
