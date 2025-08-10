import React from "react";
import "../App.css";
import { useParams, Link } from "react-router-dom";
import {
  useOrganizationActivity,
  ClickHouseAPIError,
} from "clickhouse-cloud-react-hooks";
import { useAtomValue } from "jotai";
import { configAtom } from "../configAtoms";

const ActivityDetailsPage: React.FC = () => {
  const { id, activityId } = useParams<{ id: string; activityId: string }>();
  const config = useAtomValue(configAtom);
  const {
    data: activity,
    error,
    isLoading,
  } = useOrganizationActivity(
    id || "",
    activityId || "",
    config || { keyId: "", keySecret: "" }
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

  if (isLoading) {
    return <div>Loading activity...</div>;
  }

  if (error) {
    return (
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
    );
  }

  if (!activity) {
    return <div>Activity not found</div>;
  }

  return (
    <section className="activity-details-section">
      <h2>Activity Details</h2>
      <p>
        <strong>ID:</strong> {activity.id}
      </p>
      <p>
        <strong>Type:</strong> {activity.type}
      </p>
      <p>
        <strong>Created:</strong> {new Date(activity.createdAt).toLocaleString()}
      </p>
      <p>
        <strong>Actor Type:</strong> {activity.actorType}
      </p>
      <p>
        <strong>Actor ID:</strong> {activity.actorId}
      </p>
      <p>
        <strong>Actor Details:</strong> {activity.actorDetails}
      </p>
      {activity.actorIpAddress && (
        <p>
          <strong>Actor IP:</strong> {activity.actorIpAddress}
        </p>
      )}
      {activity.serviceId && (
        <p>
          <strong>Service ID:</strong> {activity.serviceId}
        </p>
      )}
      <Link to={`/org/${id}`}>Back to Organization</Link>
    </section>
  );
};

export default ActivityDetailsPage;

