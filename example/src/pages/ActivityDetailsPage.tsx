import React from "react";
import "../App.css";
import { useParams, Link } from "react-router-dom";
import { useOrganizationActivity, ClickHouseAPIError } from "clickhouse-cloud-react-hooks";
import { useAtomValue } from "jotai";
import { configAtom } from "../configAtoms";

const ActivityDetailsPage: React.FC = () => {
  const { id, activityId } = useParams<{ id: string; activityId: string }>();
  const config = useAtomValue(configAtom);

  const { data, error, isLoading } = useOrganizationActivity(
    id || "",
    activityId || "",
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
    <section className="activities-section">
      <h2>Activity Details</h2>
      {isLoading ? (
        <div>Loading activity...</div>
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
        <Link to={`/org/${id}`}>Back to details</Link>
      </p>
    </section>
  );
};

export default ActivityDetailsPage;
