import React, { useState } from "react";
import {
  useOrganizations,
  type ClickHouseConfig,
  type Organization,
  ClickHouseAPIError,
} from "clickhouse-cloud-react-hooks";
import "./App.css";

function App() {
  const [config, setConfig] = useState<ClickHouseConfig | null>(null);
  const [keyId, setKeyId] = useState("");
  const [keySecret, setKeySecret] = useState("");

  // Load credentials from localStorage on mount
  React.useEffect(() => {
    const savedKeyId = localStorage.getItem("chc_keyId") || "";
    const savedKeySecret = localStorage.getItem("chc_keySecret") || "";
    if (savedKeyId && savedKeySecret) {
      setKeyId(savedKeyId);
      setKeySecret(savedKeySecret);
      // setConfig({ keyId: savedKeyId, keySecret: savedKeySecret });
    }
  }, []);

  // Use validated hooks with proper TypeScript types
  const {
    data: organizations,
    error: orgError,
    isLoading: orgLoading,
  } = useOrganizations(config || { keyId: "", keySecret: "" });

  const handleSetCredentials = () => {
    if (keyId && keySecret) {
      localStorage.setItem("chc_keyId", keyId);
      localStorage.setItem("chc_keySecret", keySecret);
      setConfig({ keyId, keySecret });
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>ClickHouse Cloud React Hooks Example</h1>
        <p>This example demonstrates ClickHouse Cloud API responses.</p>
      </header>

      <main>
        {!config ? (
          <section className="config-section">
            <h2>Configuration</h2>
            <div className="config-info">
              Enter your <span className="chc-blue">ClickHouse Cloud API credentials</span> to test the hooks.<br /><br />
              <span className="config-desc">You can find your <b>API Key ID</b> and <b>Secret</b> in your ClickHouse Cloud Console:</span>
              <br />
              <span className="config-console-url">
                https://console.clickhouse.cloud/organizations/[your-organization-id]/keys
              </span>
              <br />
              <span className="config-org-id">Replace <b>[your-organization-id]</b> with your actual organization ID.</span>
            </div>
            <div className="config-form">
              <div>
                <label>
                  Key ID:
                  <input
                    type="text"
                    value={keyId}
                    onChange={(e) => setKeyId(e.target.value)}
                    placeholder="Your ClickHouse API Key ID"
                  />
                </label>
              </div>
              <div>
                <label>
                  Key Secret:
                  <input
                    type="password"
                    value={keySecret}
                    onChange={(e) => setKeySecret(e.target.value)}
                    placeholder="Your ClickHouse API Key Secret"
                  />
                </label>
              </div>
              <button
                onClick={handleSetCredentials}
                disabled={!keyId || !keySecret}
              >
                Connect
              </button>
            </div>
            <p className="warning">
              <span className="warning-text">Warning: This demo may destroy or modify data in your ClickHouse Cloud account. Do NOT use production credentials.</span>
            </p>
          </section>
        ) : (
          <div>
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
                        <strong>Created:</strong>{" "}
                        {new Date(org.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div>No organizations found</div>
              )}
            </section>

            <button
              onClick={() => {
                setConfig(null);
              }}
              className="reset-button"
            >
              Back to start
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
