import React, { useState } from "react";
import {
  useClickpipes,
  useCreateClickpipe,
  useUpdateClickpipe,
  useDeleteClickpipe,
  useClickpipeScaling,
  useClickpipeState,
  ClickHouseAPIError,
} from "clickhouse-cloud-react-hooks";
import { useAtomValue } from "jotai";
import { configAtom } from "../configAtoms";

const ClickpipesPage: React.FC = () => {
  const config = useAtomValue(configAtom);
  const safeConfig = config || { keyId: "", keySecret: "" };
  const [organizationId, setOrganizationId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [clickPipeId, setClickPipeId] = useState("");
  const [createData, setCreateData] = useState("{}");
  const [updateData, setUpdateData] = useState("{}");
  const [scalingData, setScalingData] = useState("{}");
  const [stateCommand, setStateCommand] = useState<"start" | "stop" | "resync">("start");
  const [message, setMessage] = useState<string | null>(null);

  const list = useClickpipes(organizationId, serviceId, safeConfig);
  const { createClickpipe } = useCreateClickpipe(
    organizationId,
    serviceId,
    safeConfig
  );
  const { updateClickpipe } = useUpdateClickpipe(
    organizationId,
    serviceId,
    clickPipeId,
    safeConfig
  );
  const { deleteClickpipe } = useDeleteClickpipe(
    organizationId,
    serviceId,
    clickPipeId,
    safeConfig
  );
  const { updateClickpipeScaling } = useClickpipeScaling(
    organizationId,
    serviceId,
    clickPipeId,
    safeConfig
  );
  const { updateClickpipeState } = useClickpipeState(
    organizationId,
    serviceId,
    clickPipeId,
    safeConfig
  );

  if (!config) {
    return (
      <div>
        <h2>Not configured</h2>
        <p>Please go to the Configuration page and enter your credentials.</p>
      </div>
    );
  }

  const handle = async (
    fn: () => Promise<unknown>,
    success: string
  ) => {
    try {
      await fn();
      setMessage(success);
      list.mutate();
    } catch (err: unknown) {
      setMessage(
        err instanceof ClickHouseAPIError
          ? err.error
          : err instanceof Error
          ? err.message
          : "Error"
      );
    }
  };

  return (
    <section>
      <h2>ClickPipes</h2>
      <div style={{ marginBottom: "1em" }}>
        <label>
          Organization ID:{" "}
          <input
            value={organizationId}
            onChange={(e) => setOrganizationId(e.target.value)}
          />
        </label>
        <label style={{ marginLeft: "1em" }}>
          Service ID:{" "}
          <input
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
          />
        </label>
      </div>
      <button
        onClick={() => list.mutate()}
        disabled={list.isLoading}
        style={{ marginBottom: "1em" }}
      >
        {list.isLoading ? "Loading..." : "Load ClickPipes"}
      </button>
      {list.error && (
        <div className="error">Error loading ClickPipes: {String(list.error)}</div>
      )}
      {list.data && (
        <ul>
          {list.data.map((cp) => (
            <li key={cp.id}>
              {cp.name} - {cp.state}
            </li>
          ))}
        </ul>
      )}
      <hr />
      <div style={{ marginBottom: "1em" }}>
        <label>
          ClickPipe ID:{" "}
          <input
            value={clickPipeId}
            onChange={(e) => setClickPipeId(e.target.value)}
          />
        </label>
      </div>
      <div>
        <h3>Create ClickPipe</h3>
        <textarea
          value={createData}
          onChange={(e) => setCreateData(e.target.value)}
          rows={4}
          style={{ width: "100%" }}
        />
        <button
          onClick={() =>
            handle(() => createClickpipe(JSON.parse(createData)), "Created")
          }
          style={{ marginTop: "0.5em" }}
        >
          Create
        </button>
      </div>
      <div>
          <h3>Update ClickPipe</h3>
          <textarea
            value={updateData}
            onChange={(e) => setUpdateData(e.target.value)}
            rows={4}
            style={{ width: "100%" }}
          />
          <button
            onClick={() =>
              handle(
                () => updateClickpipe(JSON.parse(updateData)),
                "Updated"
              )
            }
            style={{ marginTop: "0.5em" }}
          >
            Update
          </button>
      </div>
      <div>
        <h3>Delete ClickPipe</h3>
        <button onClick={() => handle(deleteClickpipe, "Deleted")}>Delete</button>
      </div>
      <div>
        <h3>Update Scaling</h3>
        <textarea
          value={scalingData}
          onChange={(e) => setScalingData(e.target.value)}
          rows={4}
          style={{ width: "100%" }}
        />
        <button
          onClick={() =>
            handle(
              () => updateClickpipeScaling(JSON.parse(scalingData)),
              "Scaling Updated"
            )
          }
          style={{ marginTop: "0.5em" }}
        >
          Update Scaling
        </button>
      </div>
      <div>
        <h3>Update State</h3>
        <select
          value={stateCommand}
          onChange={(e) =>
            setStateCommand(e.target.value as "start" | "stop" | "resync")
          }
        >
          <option value="start">start</option>
          <option value="stop">stop</option>
          <option value="resync">resync</option>
        </select>
        <button
          onClick={() =>
            handle(
              () => updateClickpipeState({ command: stateCommand }),
              "State Updated"
            )
          }
          style={{ marginLeft: "0.5em" }}
        >
          Update State
        </button>
      </div>
      {message && <div style={{ marginTop: "1em" }}>{message}</div>}
    </section>
  );
};

export default ClickpipesPage;

