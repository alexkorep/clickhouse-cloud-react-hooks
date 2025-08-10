import React from "react";
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
    data,
    error,
    isLoading,
  } = useOrganizationActivity(
    id || "",
    activityId || "",
    config || { keyId: "", keySecret: "" }
  );

  const activity = data;

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
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Activity Details</h2>
      <pre className="bg-gray-100 p-4 rounded overflow-auto">
        {JSON.stringify(activity, null, 2)}
      </pre>
      <Link to={`/org/${id}`} className="text-blue-600 hover:underline">
        Back to Organization
      </Link>
    </section>
  );
};

export default ActivityDetailsPage;
