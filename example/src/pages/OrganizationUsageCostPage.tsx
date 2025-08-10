import React, { useState } from "react";
import "../App.css";
import { useParams, Link } from "react-router-dom";
import {
  useOrganizationUsageCost,
  ClickHouseAPIError,
} from "clickhouse-cloud-react-hooks";
import { useAtomValue } from "jotai";
import { configAtom } from "../configAtoms";

const OrganizationUsageCostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const config = useAtomValue(configAtom);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data, error, isLoading, isValidating, mutate } =
    useOrganizationUsageCost(
      id || "",
      config || { keyId: "", keySecret: "" },
      { startDate: startDate || undefined, endDate: endDate || undefined }
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
    <section className="usage-cost-section">
      <h2>Usage Cost</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutate();
        }}
        className="form-inline"
      >
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="input-inline"
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="input-inline"
          />
        </label>
        <button type="submit" disabled={isValidating}>
          {isValidating ? "Loading..." : "Refresh"}
        </button>
      </form>
      {isLoading ? (
        <div>Loading usage cost...</div>
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
            <strong>Grand Total CHC:</strong> {data.grandTotalCHC}
          </p>
          <div>
            <strong>Cost Record:</strong>
            <div>
              <strong>Date:</strong> {data.costs.date}
            </div>
            <div>
              <strong>Entity Name:</strong> {data.costs.entityName}
            </div>
            <div>
              <strong>Total CHC:</strong> {data.costs.totalCHC}
            </div>
          </div>
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

export default OrganizationUsageCostPage;

