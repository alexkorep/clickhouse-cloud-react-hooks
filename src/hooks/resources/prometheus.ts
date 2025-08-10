import { createTextGetter } from "../createTextGetter";

interface OrgCtx {
  organizationId: string;
  filteredMetrics?: boolean;
}
export const useOrgPrometheus = createTextGetter<OrgCtx>((c) =>
  `/v1/organizations/${c.organizationId}/prometheus${
    c.filteredMetrics !== undefined ? `?filtered_metrics=${c.filteredMetrics}` : ""
  }`
);

interface SvcCtx {
  organizationId: string;
  serviceId: string;
  filteredMetrics?: boolean;
}
export const useServicePrometheus = createTextGetter<SvcCtx>((c) =>
  `/v1/organizations/${c.organizationId}/services/${c.serviceId}/prometheus${
    c.filteredMetrics !== undefined ? `?filtered_metrics=${c.filteredMetrics}` : ""
  }`
);

