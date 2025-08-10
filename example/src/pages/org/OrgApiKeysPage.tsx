import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useAtomValue } from "jotai";
import { configAtom } from "../../configAtoms";
import {
  useApiKeys,
  useCreateApiKey,
  useUpdateApiKey,
  useDeleteApiKey,
  type ApiKey,
  type ClickHouseConfig,
} from "clickhouse-cloud-react-hooks";

const ApiKeyItem: React.FC<{ apiKey: ApiKey; orgId: string; config: ClickHouseConfig; onChange: () => void; }> = ({ apiKey, orgId, config, onChange }) => {
  const { updateApiKey } = useUpdateApiKey(orgId, apiKey.id, config);
  const { deleteApiKey } = useDeleteApiKey(orgId, apiKey.id, config);
  return (
    <li className="p-3 flex items-center justify-between">
      <div>
        <div className="font-medium">{apiKey.name}</div>
        <div className="text-xs text-gray-500">state: {apiKey.state}</div>
      </div>
      <div className="flex gap-2">
        <button
          className="btn"
          onClick={async () => {
            await updateApiKey({ state: apiKey.state === "enabled" ? "disabled" : "enabled" });
            onChange();
          }}
        >
          Toggle
        </button>
        <button
          className="btn btn-danger"
          onClick={async () => {
            await deleteApiKey();
            onChange();
          }}
        >
          Delete
        </button>
      </div>
    </li>
  );
};

const OrgApiKeysPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const config = useAtomValue(configAtom)!;
  const keys = useApiKeys(id!, config);
  const create = useCreateApiKey(id!, config);

  const [name, setName] = useState("");
  const [roles, setRoles] = useState("developer");

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">API Keys</h2>
        <button className="btn" onClick={() => keys.mutate()}>Refresh</button>
      </div>
      <div className="rounded-xl border p-4 bg-white">
        <h3 className="font-medium mb-2">Create Key</h3>
        <div className="flex gap-2 flex-wrap">
          <input className="input" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />
          <input className="input" placeholder="Roles (comma separated)" value={roles} onChange={(e)=>setRoles(e.target.value)} />
          <button
            className="btn"
            disabled={!name}
            onClick={async () => {
              await create.createApiKey({
                name,
                roles: roles.split(",").map(r=>r.trim()).filter(Boolean) as ("admin"|"developer"|"query_endpoints")[]
              });
              setName(""); setRoles("developer"); keys.mutate();
            }}
          >Create</button>
        </div>
      </div>
      {!keys.data?.length ? (
        <div className="text-gray-600">No keys yet.</div>
      ) : (
        <ul className="divide-y rounded-xl border bg-white">
          {keys.data.map((k) => (
            <ApiKeyItem key={k.id} apiKey={k} orgId={id!} config={config} onChange={keys.mutate} />
          ))}
        </ul>
      )}
    </section>
  );
};
export default OrgApiKeysPage;
