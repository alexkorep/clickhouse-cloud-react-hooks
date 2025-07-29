
import React from 'react';
import "../App.css";
import { useParams, Link } from 'react-router-dom';
import { useOrganizations, ClickHouseAPIError, type Organization } from 'clickhouse-cloud-react-hooks';
import { useAtom } from 'jotai';
import { configAtom } from '../configAtoms';

const OrganizationDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [config] = useAtom(configAtom);
  const {
    data: organizations,
    error: orgError,
    isLoading: orgLoading,
  } = useOrganizations(config || { keyId: '', keySecret: '' });

  if (!config) {
    return (
      <div>
        <h2>Not configured</h2>
        <p>Please go to the <Link to="/config">Configuration</Link> page and enter your credentials.</p>
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

  const org = organizations?.find((o: Organization) => o.id === id);

  if (!org) {
    return <div>Organization not found</div>;
  }

  return (
    <section className="organization-details-section">
      <h2>Organization Details</h2>
      <p><strong>Name:</strong> {org.name}</p>
      <p><strong>ID:</strong> {org.id}</p>
      <p><strong>Created:</strong> {new Date(org.createdAt).toLocaleDateString()}</p>
      {/* Add more details as needed */}
      <Link to="/">Back to Organizations</Link>
    </section>
  );
};

export default OrganizationDetailsPage;
