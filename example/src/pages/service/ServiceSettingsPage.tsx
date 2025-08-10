import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useService,
  useUpdateService,
  useServicePassword,
  useDeleteService,
  useServiceState,
  ClickHouseAPIError,
} from "clickhouse-cloud-react-hooks";
import { useAtomValue } from "jotai";
import { configAtom } from "../../configAtoms";

const ServiceSettingsPage: React.FC = () => {
  const { id, serviceId } = useParams<{ id: string; serviceId: string }>();
  const navigate = useNavigate();
  const config = useAtomValue(configAtom)!;
  const svc = useService(id!, serviceId!, config);
  const { updateService } = useUpdateService(id!, serviceId!, config);
  const { updateServicePassword } = useServicePassword(id!, serviceId!, config);
  const { deleteService } = useDeleteService(id!, serviceId!, config);
  const { updateServiceState } = useServiceState(id!, serviceId!, config);
  const [newName, setNewName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (svc.isLoading) return <div>Loading service...</div>;
  if (svc.error) {
    return (
      <div className="error">
        {svc.error instanceof ClickHouseAPIError ? svc.error.error : String(svc.error)}
      </div>
    );
  }

  return (
    <section className="space-y-6">
      {error && <div className="error">{error}</div>}
      <div>
        <h3 className="text-lg font-semibold mb-2">Rename Service</h3>
        <input
          className="input mr-2"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder={svc.data?.name}
        />
        <button
          className="btn"
          disabled={!newName}
          onClick={async () => {
            setError(null);
            try {
              await updateService({ name: newName });
              setNewName("");
              svc.mutate();
            } catch {
              setError("Failed to update service");
            }
          }}
        >
          Save
        </button>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Password</h3>
        <input
          className="input mr-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password"
        />
        <button
          className="btn"
          disabled={!password}
          onClick={async () => {
            setError(null);
            try {
              await updateServicePassword({ newPassword: password });
              setPassword("");
            } catch {
              setError("Failed to update password");
            }
          }}
        >
          Update
        </button>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">State</h3>
        <button className="btn mr-2" onClick={() => updateServiceState({ command: "start" })}>Start</button>
        <button className="btn" onClick={() => updateServiceState({ command: "stop" })}>Stop</button>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Danger Zone</h3>
        <button
          className="btn btn-danger"
          onClick={async () => {
            try {
              await deleteService();
              navigate(`/org/${id}`);
            } catch {
              setError("Failed to delete service");
            }
          }}
        >
          Delete Service
        </button>
      </div>
    </section>
  );
};
export default ServiceSettingsPage;
