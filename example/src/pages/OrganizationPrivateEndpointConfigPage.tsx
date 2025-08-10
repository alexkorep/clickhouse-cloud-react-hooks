import React, { useState } from "react";
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
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Private Endpoint Config</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutate();
        }}
        className="flex flex-wrap items-center gap-4 mb-4"
      >
        <label className="flex items-center">
          Cloud Provider:
          <input
            type="text"
            value={cloudProvider}
            onChange={(e) => setCloudProvider(e.target.value)}
            className="input ml-2 mr-4"
          />
        </label>
        <label className="flex items-center">
          Region:
          <input
            type="text"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="input ml-2 mr-4"
          />
        </label>
        <button type="submit" disabled={isValidating} className="btn">
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
      <p className="mt-4">
        <Link to={`/org/${id}`} className="text-blue-600 hover:underline">
          Back to details
        </Link>
      </p>
    </section>
  );
};

export default OrganizationPrivateEndpointConfigPage;

