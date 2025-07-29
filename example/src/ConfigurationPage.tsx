
import React from 'react';
import "./App.css";
import { useAtom } from 'jotai';

import { useNavigate } from 'react-router-dom';
import { keyIdAtom, keySecretAtom } from './configAtoms';

const ConfigurationPage: React.FC = () => {

  const [keyId, setKeyId] = useAtom(keyIdAtom);
  const [keySecret, setKeySecret] = useAtom(keySecretAtom);
  const navigate = useNavigate();

  const handleSetCredentials = () => {
    if (keyId && keySecret) {
      localStorage.setItem('chc_keyId', keyId);
      localStorage.setItem('chc_keySecret', keySecret);
      navigate('/');
    }
  };

  return (
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
  );
};

export default ConfigurationPage;
