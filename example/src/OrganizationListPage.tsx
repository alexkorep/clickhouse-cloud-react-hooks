
import React from 'react';
import { useOrganizations, ClickHouseAPIError, type Organization } from 'clickhouse-cloud-react-hooks';
import { useAtom } from 'jotai';
import { configAtom, keyIdAtom, keySecretAtom } from './configAtoms';
import "./App.css";
import { Link } from 'react-router-dom';

const OrganizationListPage: React.FC = () => {
  const [config] = useAtom(configAtom);
  const [, setKeyId] = useAtom(keyIdAtom);
  const [, setKeySecret] = useAtom(keySecretAtom);
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

  return (
    <section className="organizations-section">
      <h2>Organizations</h2>
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
        <div>
          {organizations.map((org: Organization) => (
            <div key={org.id} className="organization-card">
              <h3>{org.name}</h3>
              <p>
                <strong>ID:</strong> {org.id}
              </p>
              <p>
                <strong>Created:</strong> {new Date(org.createdAt).toLocaleDateString()}
              </p>
              <Link to={`/org/${org.id}`}>Details</Link>
            </div>
          ))}
        </div>
      ) : (
        <div>No organizations found</div>
      )}
      <button
        onClick={() => {
          setKeyId('');
          setKeySecret('');
          localStorage.removeItem('chc_keyId');
          localStorage.removeItem('chc_keySecret');
        }}
        className="reset-button"
      >
        Back to start
      </button>
    </section>
  );
};

export default OrganizationListPage;
