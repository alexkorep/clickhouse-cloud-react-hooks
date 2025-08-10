
import React from "react";
import { useAtom } from "jotai";

import { useNavigate } from 'react-router-dom';
import { keyIdAtom, keySecretAtom } from '../configAtoms';

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
    <section className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Configuration</h2>
      <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4 text-sm">
        Enter your <span className="text-blue-700 font-semibold">ClickHouse Cloud API credentials</span> to test the hooks.
        <br />
        <br />
        You can find your <b>API Key ID</b> and <b>Secret</b> in your ClickHouse Cloud Console:
        <br />
        <span className="font-mono">https://console.clickhouse.cloud/organizations/[your-organization-id]/keys</span>
        <br />
        <span className="text-gray-600 text-xs">Replace <b>[your-organization-id]</b> with your actual organization ID.</span>
      </div>
      <div className="space-y-4 mb-4">
        <div>
          <label className="block mb-1 font-medium">
            Key ID:
            <input
              type="text"
              value={keyId}
              onChange={(e) => setKeyId(e.target.value)}
              placeholder="Your ClickHouse API Key ID"
              className="input w-full mt-1"
            />
          </label>
        </div>
        <div>
          <label className="block mb-1 font-medium">
            Key Secret:
            <input
              type="password"
              value={keySecret}
              onChange={(e) => setKeySecret(e.target.value)}
              placeholder="Your ClickHouse API Key Secret"
              className="input w-full mt-1"
            />
          </label>
        </div>
        <button
          onClick={handleSetCredentials}
          disabled={!keyId || !keySecret}
          className="btn"
        >
          Connect
        </button>
      </div>
      <p className="text-sm text-red-700 font-semibold">
        Warning: This demo may destroy or modify data in your ClickHouse Cloud account. Do NOT use production credentials.
      </p>
    </section>
  );
};

export default ConfigurationPage;
