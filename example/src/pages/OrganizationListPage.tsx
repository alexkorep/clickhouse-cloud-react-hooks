import React from "react";
import {
  useOrganizations,
  ClickHouseAPIError,
  type Organization,
} from "clickhouse-cloud-react-hooks";
import { useAtom } from "jotai";
import { configAtom, keyIdAtom, keySecretAtom } from "../configAtoms";
import { Link } from "react-router-dom";

const OrganizationListPage: React.FC = () => {
  const [config] = useAtom(configAtom);
  const [, setKeyId] = useAtom(keyIdAtom);
  const [, setKeySecret] = useAtom(keySecretAtom);
  const {
    data: organizations,
    error: orgError,
    isLoading: orgLoading,
    isValidating,
    mutate,
  } = useOrganizations(config || { keyId: '', keySecret: '' });

  if (!config) {
    return (
      <div>
        <h2>Not configured</h2>
        <p>Please go to the <Link to="/config">Configuration</Link> page and enter your credentials.</p>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Organizations</h2>
      <button onClick={() => mutate()} className="btn" disabled={isValidating}>
        {isValidating ? "Loading..." : "Refresh"}
      </button>
      {orgLoading ? (
        <div>Loading organizations...</div>
      ) : orgError ? (
        <div className="error">
          {orgError instanceof ClickHouseAPIError ? (
            <div>
              <strong>ClickHouse API Error:</strong> {orgError.error}
              <br />
              <small>Status: {orgError.status}</small>
            </div>
          ) : (
            <div>Error: {orgError.message}</div>
          )}
        </div>
      ) : organizations && organizations.length > 0 ? (
        <div className="space-y-4">
          {organizations.map((org: Organization) => (
            <div key={org.id} className="card">
              <h3 className="text-xl font-semibold">{org.name}</h3>
              <p>
                <span className="font-semibold">ID:</span> {org.id}
              </p>
              <p>
                <span className="font-semibold">Created:</span> {new Date(
                  org.createdAt
                ).toLocaleDateString()}
              </p>
              <Link
                to={`/org/${org.id}`}
                className="text-blue-600 hover:underline"
              >
                Details
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div>No organizations found</div>
      )}
      <button
        onClick={() => {
          setKeyId("");
          setKeySecret("");
          localStorage.removeItem("chc_keyId");
          localStorage.removeItem("chc_keySecret");
        }}
        className="btn btn-danger mt-8"
      >
        Back to start
      </button>
    </section>
  );
};

export default OrganizationListPage;
