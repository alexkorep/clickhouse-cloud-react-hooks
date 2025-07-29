import React from "react";
import "../App.css";
import { useParams, Link } from "react-router-dom";
import {
  useOrganization,
  ClickHouseAPIError,
} from "clickhouse-cloud-react-hooks";
import { useAtomValue } from "jotai";
import { configAtom } from "../configAtoms";

const OrganizationDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const config = useAtomValue(configAtom);
  const {
    data: organization,
    error: orgError,
    isLoading: orgLoading,
    mutate,
  } = useOrganization(id || "", config || { keyId: "", keySecret: "" });

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

  if (orgLoading) {
    return <div>Loading organization details...</div>;
  }

  if (orgError) {
    return (
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
    );
  }

  if (!organization) {
    return <div>Organization not found</div>;
  }

  return (
    <section className="organization-details-section">
      <h2>Organization Details</h2>
      <button
        onClick={() => mutate()}
        className="refresh-button"
        style={{ marginBottom: '1em' }}
      >
        Refresh
      </button>
      <p>
        <strong>Name:</strong> {organization.name}
      </p>
      <p>
        <strong>ID:</strong> {organization.id}
      </p>
      <p>
        <strong>Created:</strong> {new Date(organization.createdAt).toLocaleString()}
      </p>
      <div>
        <strong>Private Endpoints:</strong>
        {organization.privateEndpoints.length === 0 ? (
          <span> None</span>
        ) : (
          <ul>
            {organization.privateEndpoints.map((pe) => (
              <li key={pe.id}>
                <div><strong>ID:</strong> {pe.id}</div>
                <div><strong>Description:</strong> {pe.description}</div>
                <div><strong>Cloud Provider:</strong> {pe.cloudProvider}</div>
                <div><strong>Region:</strong> {pe.region}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <strong>BYOC Config:</strong>
        {organization.byocConfig.length === 0 ? (
          <span> None</span>
        ) : (
          <ul>
            {organization.byocConfig.map((byoc) => (
              <li key={byoc.id}>
                <div><strong>ID:</strong> {byoc.id}</div>
                <div><strong>State:</strong> {byoc.state}</div>
                <div><strong>Account Name:</strong> {byoc.accountName}</div>
                <div><strong>Region ID:</strong> {byoc.regionId}</div>
                <div><strong>Cloud Provider:</strong> {byoc.cloudProvider}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Link to="/">Back to Organizations</Link>
    </section>
  );
};

export default OrganizationDetailsPage;
