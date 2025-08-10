import React, { useState } from "react";
import { useAtomValue } from "jotai";
import type { ClickHouseConfig } from "clickhouse-cloud-react-hooks";
import { configAtom } from "../configAtoms";
import {
  useClickpipesReversePrivateEndpoints,
  useClickpipesReversePrivateEndpoint,
  useCreateClickpipesReversePrivateEndpoint,
  useDeleteClickpipesReversePrivateEndpoint,
} from "clickhouse-cloud-react-hooks";

const ReversePrivateEndpointsContent: React.FC<{ config: ClickHouseConfig }> = ({
  config,
}) => {
  const [organizationId, setOrganizationId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [reversePrivateEndpointId, setReversePrivateEndpointId] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<
    "VPC_ENDPOINT_SERVICE" | "VPC_RESOURCE" | "MSK_MULTI_VPC"
  >("VPC_ENDPOINT_SERVICE");
  const [createResult, setCreateResult] = useState<string | null>(null);

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
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Reverse Private Endpoints</h2>
      <div className="flex flex-wrap gap-4 mb-4">
        <label className="flex items-center">
          Organization ID:
          <input
            value={organizationId}
            onChange={(e) => setOrganizationId(e.target.value)}
            className="input ml-2 mr-4"
          />
        </label>
        <label className="flex items-center">
          Service ID:
          <input
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            className="input ml-2 mr-4"
          />
        </label>
      </div>
      <div>
        <h3 className="text-xl font-semibold">Existing Endpoints</h3>
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
        <button onClick={() => listMutate()} className="btn mt-2">
          Refresh
        </button>
      </div>
      <hr />
      <div>
        <h3 className="text-xl font-semibold">Create Endpoint</h3>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              const result = await createReversePrivateEndpoint({
                description,
                type,
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
            <label className="flex items-center mb-2">
              Description:
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input ml-2"
              />
            </label>
          </div>
          <div>
            <label className="flex items-center mb-2">
              Type:
              <select
                value={type}
                onChange={(e) => setType(e.target.value as typeof type)}
                className="input ml-2"
              >
                <option value="VPC_ENDPOINT_SERVICE">VPC_ENDPOINT_SERVICE</option>
                <option value="VPC_RESOURCE">VPC_RESOURCE</option>
                <option value="MSK_MULTI_VPC">MSK_MULTI_VPC</option>
              </select>
            </label>
          </div>
          <button type="submit" className="btn mt-2">
            Create
          </button>
        </form>
        {createResult && (
          <pre className="bg-gray-100 p-4 rounded overflow-auto mt-2">
            {createResult}
          </pre>
        )}
      </div>
      <hr />
      <div>
        <h3 className="text-xl font-semibold">Endpoint Details</h3>
        <label className="flex items-center mb-2">
          Endpoint ID:
          <input
            value={reversePrivateEndpointId}
            onChange={(e) => setReversePrivateEndpointId(e.target.value)}
            className="input ml-2"
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
          className="btn ml-2"
        >
          Delete
        </button>
        {endpointLoading && <div>Loading endpoint...</div>}
        {endpointError && <div className="error">Failed to load endpoint</div>}
        {endpoint && (
          <pre className="bg-gray-100 p-4 rounded overflow-auto mt-2">
            {JSON.stringify(endpoint, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

const ReversePrivateEndpointsPage: React.FC = () => {
  const config = useAtomValue(configAtom);
  if (!config) {
    return (
      <div>
        <h2>Not configured</h2>
        <p>Please configure API credentials on the Configuration page.</p>
      </div>
    );
  }
  return <ReversePrivateEndpointsContent config={config} />;
};

export default ReversePrivateEndpointsPage;
