import React from "react";
import "../App.css";
import { useParams, Link } from "react-router-dom";
import { useService, ClickHouseAPIError } from "clickhouse-cloud-react-hooks";
import { useAtomValue } from "jotai";
import { configAtom } from "../configAtoms";

const ServiceDetailsPage: React.FC = () => {
  const { orgId, serviceId } = useParams<{ orgId: string; serviceId: string }>();
  const config = useAtomValue(configAtom);

  const { data, error, isLoading } = useService(
    orgId || "",
    serviceId || "",
    config || { keyId: "", keySecret: "" }
  );

  if (!config) {
    return (
      <div>
        <h2>Not configured</h2>
        <p>
          Please go to the <Link to="/config">Configuration</Link> page and enter your credentials.
        </p>
      </div>
    );
  }

  return (
    <section className="organization-details-section">
      <h2>Service Details</h2>
      {isLoading ? (
        <div>Loading service...</div>
      ) : error ? (
        <div className="error">
          {error instanceof ClickHouseAPIError ? (
            <div>
              <strong>ClickHouse API Error:</strong> {error.error}
              <br />
              <small>Status: {error.status}</small>
            </div>
          ) : (
            <div>Error: {error.message}</div>
          )}
        </div>
      ) : data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <div>No data</div>
      )}
      <p className="back-link">
        <Link to={`/org/${orgId}`}>Back to details</Link>
      </p>
    </section>
  );
};

export default ServiceDetailsPage;
