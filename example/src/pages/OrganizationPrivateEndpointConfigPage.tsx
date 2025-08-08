import React, { useState } from "react";
import "../App.css";
import { useParams, Link } from "react-router-dom";
import {
  useOrganizationPrivateEndpointConfig,
  ClickHouseAPIError,
} from "clickhouse-cloud-react-hooks";
import { useAtomValue } from "jotai";
import { configAtom } from "../configAtoms";

const OrganizationPrivateEndpointConfigPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const config = useAtomValue(configAtom);
  const [cloudProvider, setCloudProvider] = useState("");
  const [region, setRegion] = useState("");

  const { data, error, isLoading, isValidating, mutate } =
    useOrganizationPrivateEndpointConfig(
      id || "",
      config || { keyId: "", keySecret: "" },
      {
        cloudProvider: cloudProvider || undefined,
        region: region || undefined,
      }
    );

  if (!config) {
    return (
      <div>
        <h2>Not configured</h2>
        <p>
          Please go to the <Link to="/config">Configuration</Link> page and
          enter your credentials.
        </p>
      </div>
    );
  }

  return (
    <section className="private-endpoint-config-section">
      <h2>Private Endpoint Config</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutate();
        }}
        className="form-inline"
      >
        <label>
          Cloud Provider:
          <input
            type="text"
            value={cloudProvider}
            onChange={(e) => setCloudProvider(e.target.value)}
            className="input-inline"
          />
        </label>
        <label>
          Region:
          <input
            type="text"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="input-inline"
          />
        </label>
        <button type="submit" disabled={isValidating}>
          {isValidating ? "Loading..." : "Refresh"}
        </button>
      </form>
      {isLoading ? (
        <div>Loading private endpoint config...</div>
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
        <div>
          <p>
            <strong>Endpoint Service ID:</strong> {data.endpointServiceId}
          </p>
        </div>
      ) : (
        <div>No data</div>
      )}
      <p className="back-link">
        <Link to={`/org/${id}`}>Back to details</Link>
      </p>
    </section>
  );
};

export default OrganizationPrivateEndpointConfigPage;

