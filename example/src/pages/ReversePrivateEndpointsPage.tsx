import React, { useState } from "react";
import { useAtomValue } from "jotai";
import { configAtom } from "../configAtoms";
import {
  useClickpipesReversePrivateEndpoints,
  useClickpipesReversePrivateEndpoint,
  useCreateClickpipesReversePrivateEndpoint,
  useDeleteClickpipesReversePrivateEndpoint,
} from "clickhouse-cloud-react-hooks";

const ReversePrivateEndpointsPage: React.FC = () => {
  const config = useAtomValue(configAtom);
  const [organizationId, setOrganizationId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [reversePrivateEndpointId, setReversePrivateEndpointId] =
    useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("VPC_ENDPOINT_SERVICE");
  const [createResult, setCreateResult] = useState<string | null>(null);

  if (!config) {
    return (
      <div>
        <h2>Not configured</h2>
        <p>Please configure API credentials on the Configuration page.</p>
      </div>
    );
  }

  const {
    data: endpoints,
    error: listError,
    isLoading: listLoading,
    mutate: listMutate,
  } = useClickpipesReversePrivateEndpoints(
    organizationId || "",
    serviceId || "",
    config
  );

  const {
    data: endpoint,
    error: endpointError,
    isLoading: endpointLoading,
  } = useClickpipesReversePrivateEndpoint(
    organizationId || "",
    serviceId || "",
    reversePrivateEndpointId || "",
    config
  );

  const { createReversePrivateEndpoint } =
    useCreateClickpipesReversePrivateEndpoint(
      organizationId || "",
      serviceId || "",
      config
    );

  const { deleteReversePrivateEndpoint } =
    useDeleteClickpipesReversePrivateEndpoint(
      organizationId || "",
      serviceId || "",
      reversePrivateEndpointId || "",
      config
    );

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Reverse Private Endpoints</h2>
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", marginBottom: "0.5rem" }}>
          Organization ID:
          <input
            value={organizationId}
            onChange={(e) => setOrganizationId(e.target.value)}
            style={{ marginLeft: "0.5rem" }}
          />
        </label>
        <label style={{ display: "block", marginBottom: "0.5rem" }}>
          Service ID:
          <input
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            style={{ marginLeft: "0.5rem" }}
          />
        </label>
      </div>
      <div>
        <h3>Existing Endpoints</h3>
        {listLoading && <div>Loading...</div>}
        {listError && <div className="error">Failed to load endpoints</div>}
        {endpoints && (
          <ul>
            {endpoints.map((ep) => (
              <li key={ep.id}>
                {ep.description} ({ep.id})
              </li>
            ))}
          </ul>
        )}
        <button onClick={() => listMutate()}>Refresh</button>
      </div>
      <hr />
      <div>
        <h3>Create Endpoint</h3>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              const result = await createReversePrivateEndpoint({
                description,
                type: type as any,
              });
              setCreateResult(JSON.stringify(result, null, 2));
              setDescription("");
              listMutate();
            } catch (err: unknown) {
              setCreateResult(
                err && typeof err === "object" && "message" in err
                  ? String((err as { message?: unknown }).message)
                  : "Failed to create"
              );
            }
          }}
        >
          <div>
            <label>
              Description:
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ marginLeft: "0.5rem" }}
              />
            </label>
          </div>
          <div>
            <label>
              Type:
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                style={{ marginLeft: "0.5rem" }}
              >
                <option value="VPC_ENDPOINT_SERVICE">VPC_ENDPOINT_SERVICE</option>
                <option value="VPC_RESOURCE">VPC_RESOURCE</option>
                <option value="MSK_MULTI_VPC">MSK_MULTI_VPC</option>
              </select>
            </label>
          </div>
          <button type="submit" style={{ marginTop: "0.5rem" }}>
            Create
          </button>
        </form>
        {createResult && (
          <pre style={{ background: "#f4f4f4", padding: "0.5rem" }}>
            {createResult}
          </pre>
        )}
      </div>
      <hr />
      <div>
        <h3>Endpoint Details</h3>
        <label>
          Endpoint ID:
          <input
            value={reversePrivateEndpointId}
            onChange={(e) => setReversePrivateEndpointId(e.target.value)}
            style={{ marginLeft: "0.5rem" }}
          />
        </label>
        <button
          onClick={async () => {
            try {
              await deleteReversePrivateEndpoint();
              setReversePrivateEndpointId("");
              listMutate();
            } catch {
              // ignore
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
        {endpointLoading && <div>Loading endpoint...</div>}
        {endpointError && (
          <div className="error">Failed to load endpoint</div>
        )}
        {endpoint && (
          <pre style={{ background: "#f4f4f4", padding: "0.5rem" }}>
            {JSON.stringify(endpoint, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

export default ReversePrivateEndpointsPage;

