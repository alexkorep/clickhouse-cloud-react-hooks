import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  useServiceQueryEndpoint,
  useServicePrivateEndpointConfig,
  useCreateServicePrivateEndpoint,
} from "clickhouse-cloud-react-hooks";
import { useAtomValue } from "jotai";
import { configAtom } from "../../configAtoms";

const ServiceEndpointsPage: React.FC = () => {
  const { id, serviceId } = useParams<{ id: string; serviceId: string }>();
  const config = useAtomValue(configAtom)!;
  const { data: queryEndpoint, createQueryEndpoint, deleteQueryEndpoint } =
    useServiceQueryEndpoint(id!, serviceId!, config);
  const { data: peConfig } = useServicePrivateEndpointConfig(id!, serviceId!, config);
  const { createPrivateEndpoint } = useCreateServicePrivateEndpoint(id!, serviceId!, config);
  const [queryData, setQueryData] = useState("{}");
  const [peData, setPeData] = useState("{}");
  const [error, setError] = useState<string | null>(null);

  return (
    <section className="space-y-6">
      {error && <div className="error">{error}</div>}
      <div>
        <h3 className="text-lg font-semibold mb-2">Query Endpoint</h3>
        {queryEndpoint ? (
          <pre>{JSON.stringify(queryEndpoint, null, 2)}</pre>
        ) : (
          <div>No query endpoint</div>
        )}
        <textarea
          className="input w-full h-32"
          value={queryData}
          onChange={(e) => setQueryData(e.target.value)}
        />
        <div className="flex gap-2 mt-2">
          <button
            className="btn"
            onClick={async () => {
              try {
                await createQueryEndpoint(JSON.parse(queryData));
              } catch {
                setError("Failed to create query endpoint");
              }
            }}
          >
            Create
          </button>
          <button
            className="btn"
            onClick={async () => {
              try {
                await deleteQueryEndpoint();
              } catch {
                setError("Failed to delete query endpoint");
              }
            }}
          >
            Delete
          </button>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Private Endpoint Config</h3>
        {peConfig ? (
          <pre>{JSON.stringify(peConfig, null, 2)}</pre>
        ) : (
          <div>No config</div>
        )}
        <textarea
          className="input w-full h-32"
          value={peData}
          onChange={(e) => setPeData(e.target.value)}
        />
        <button
          className="btn mt-2"
          onClick={async () => {
            try {
              await createPrivateEndpoint(JSON.parse(peData));
            } catch {
              setError("Failed to create private endpoint");
            }
          }}
        >
          Create Private Endpoint
        </button>
      </div>
    </section>
  );
};
export default ServiceEndpointsPage;
