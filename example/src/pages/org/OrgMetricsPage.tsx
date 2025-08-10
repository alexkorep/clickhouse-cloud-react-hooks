import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  useOrganizationPrometheusMetrics,
  useServicePrometheusMetrics,
  useServices,
  ClickHouseAPIError,
  type ClickHouseConfig,
} from "clickhouse-cloud-react-hooks";
import { useAtomValue } from "jotai";
import { configAtom } from "../../configAtoms";

const ServiceMetrics: React.FC<{ orgId: string; serviceId: string; filter: boolean; config: ClickHouseConfig; }> = ({ orgId, serviceId, filter, config }) => {
  const { data, error, isLoading } = useServicePrometheusMetrics(orgId, serviceId, config, filter);
  if (isLoading) return <div>Loading service metrics...</div>;
  if (error)
    return (
      <div className="error">
        {error instanceof ClickHouseAPIError ? `ClickHouse API Error: ${error.error}` : `Error: ${(error as Error).message}`}
      </div>
    );
  return <pre>{data}</pre>;
};

const OrgMetricsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const config = useAtomValue(configAtom)!;
  const [filterOrg, setFilterOrg] = useState(false);
  const [filterSvc, setFilterSvc] = useState(false);
  const [serviceId, setServiceId] = useState("");

  const orgMetrics = useOrganizationPrometheusMetrics(id!, config, filterOrg);
  const services = useServices(id!, config);

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Organization Metrics</h2>
        <label className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={filterOrg}
            onChange={(e) => setFilterOrg(e.target.checked)}
            className="mr-2"
          />
          Filter metrics
        </label>
        {orgMetrics.isLoading ? (
          <div>Loading metrics...</div>
        ) : orgMetrics.error ? (
          <div className="error">
            {orgMetrics.error instanceof ClickHouseAPIError
              ? `ClickHouse API Error: ${orgMetrics.error.error}`
              : `Error: ${(orgMetrics.error as Error).message}`}
          </div>
        ) : (
          <pre>{orgMetrics.data}</pre>
        )}
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Service Metrics</h2>
        {services.isLoading ? (
          <div>Loading services...</div>
        ) : services.error ? (
          <div className="error">Failed to load services</div>
        ) : (
          <select
            className="input mb-2"
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
          >
            <option value="">Select service</option>
            {services.data?.map((svc) => (
              <option key={svc.id} value={svc.id}>{svc.name}</option>
            ))}
          </select>
        )}
        {serviceId && (
          <label className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={filterSvc}
              onChange={(e) => setFilterSvc(e.target.checked)}
              className="mr-2"
            />
            Filter metrics
          </label>
        )}
        {serviceId && (
          <ServiceMetrics orgId={id!} serviceId={serviceId} filter={filterSvc} config={config} />
        )}
      </div>
    </section>
  );
};
export default OrgMetricsPage;
