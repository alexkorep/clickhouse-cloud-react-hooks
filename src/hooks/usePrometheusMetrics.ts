import type { ClickHouseConfig } from "../api/fetcher";
import {
  useOrgPrometheus,
  useServicePrometheus,
} from "./resources/prometheus";

export const useOrganizationPrometheusMetrics = (
  organizationId: string,
  config: ClickHouseConfig,
  filteredMetrics?: boolean
) => useOrgPrometheus({ organizationId, filteredMetrics }, config);

export const useServicePrometheusMetrics = (
  organizationId: string,
  serviceId: string,
  config: ClickHouseConfig,
  filteredMetrics?: boolean
) =>
  useServicePrometheus(
    { organizationId, serviceId, filteredMetrics },
    config
  );

