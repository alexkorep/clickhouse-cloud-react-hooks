import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  useService,
  useUpdateService,
  useDeleteService,
  useServiceState,
  useServiceReplicaScaling,
  useServicePassword,
  useServicePrivateEndpointConfig,
  useServiceQueryEndpoint,
  useServicePrometheus,
  useCreateServicePrivateEndpoint,
  useServiceScaling,
  ClickHouseAPIError,
} from "clickhouse-cloud-react-hooks";
import { useAtomValue } from "jotai";
import { configAtom } from "../configAtoms";

const ServiceDetailsPage: React.FC = () => {
  const { orgId, serviceId } = useParams<{ orgId: string; serviceId: string }>();
  const navigate = useNavigate();
  const config = useAtomValue(configAtom);

  const {
    data: service,
    error: serviceError,
    isLoading: serviceLoading,
    mutate: serviceMutate,
  } = useService(orgId || "", serviceId || "", config || { keyId: "", keySecret: "" });

  const { updateService } = useUpdateService(
    orgId || "",
    serviceId || "",
    config || { keyId: "", keySecret: "" }
  );
  const { deleteService } = useDeleteService(
    orgId || "",
    serviceId || "",
    config || { keyId: "", keySecret: "" }
  );
  const { updateServiceState } = useServiceState(
    orgId || "",
    serviceId || "",
    config || { keyId: "", keySecret: "" }
  );
  const { updateServiceScaling: updateReplicaScaling } = useServiceReplicaScaling(
    orgId || "",
    serviceId || "",
    config || { keyId: "", keySecret: "" }
  );
  const { updateServicePassword } = useServicePassword(
    orgId || "",
    serviceId || "",
    config || { keyId: "", keySecret: "" }
  );
  const {
    data: queryEndpoint,
    createQueryEndpoint,
    deleteQueryEndpoint,
  } = useServiceQueryEndpoint(orgId || "", serviceId || "", config || { keyId: "", keySecret: "" });
  const { data: metrics } = useServicePrometheus(
    orgId || "",
    serviceId || "",
    config || { keyId: "", keySecret: "" }
  );
  const { data: peConfig } = useServicePrivateEndpointConfig(
    orgId || "",
    serviceId || "",
    config || { keyId: "", keySecret: "" }
  );
  const { createPrivateEndpoint } = useCreateServicePrivateEndpoint(
    orgId || "",
    serviceId || "",
    config || { keyId: "", keySecret: "" }
  );
  const { updateServiceScaling } = useServiceScaling(
    orgId || "",
    serviceId || "",
    config || { keyId: "", keySecret: "" }
  );

  const [newName, setNewName] = useState("");
  const [password, setPassword] = useState("");
  const [replicaScaling, setReplicaScaling] = useState("{}");
  const [scaling, setScaling] = useState("{}");
  const [queryEndpointData, setQueryEndpointData] = useState("{}");
  const [privateEndpointData, setPrivateEndpointData] = useState("{}");
  const [error, setError] = useState<string | null>(null);

  if (!config) {
    return (
      <div>
        <h2>Not configured</h2>
        <p>
          Please go to the <Link to="/config">Configuration</Link> page and
          enter your credentials.
        </p>
      </div>
    );
  }

  if (serviceLoading) {
    return <div>Loading service...</div>;
  }

  if (serviceError) {
    return (
      <div className="error">
        {serviceError instanceof ClickHouseAPIError
          ? serviceError.error
          : String(serviceError)}
      </div>
    );
  }

  if (!service) {
    return <div>Service not found</div>;
  }

  return (
    <section className="service-details-section">
      <h2>Service Details</h2>
      <p>
        <strong>ID:</strong> {service.id}
      </p>
      <p>
        <strong>Name:</strong> {service.name}
      </p>
      <button
        onClick={() => serviceMutate()}
        className="refresh-button"
        style={{ marginBottom: "1em" }}
      >
        Refresh
      </button>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setError(null);
          try {
            await updateService({ name: newName });
            setNewName("");
            serviceMutate();
          } catch (err: unknown) {
            setError(
              err && typeof err === "object" && "message" in err
                ? String((err as { message?: unknown }).message)
                : "Failed to update service"
            );
          }
        }}
      >
        <h3>Update Name</h3>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button type="submit" disabled={!newName}>
          Save
        </button>
      </form>

      <div style={{ marginTop: "1em" }}>
        <h3>State</h3>
        <button onClick={() => updateServiceState({ command: "start" })}>
          Start
        </button>
        <button onClick={() => updateServiceState({ command: "stop" })}>
          Stop
        </button>
      </div>

      <div style={{ marginTop: "1em" }}>
        <h3>Password</h3>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              await updateServicePassword({ newPassword: password });
              setPassword("");
            } catch (err: unknown) {
              setError(
                err && typeof err === "object" && "message" in err
                  ? String((err as { message?: unknown }).message)
                  : "Failed to update password"
              );
            }
          }}
        >
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
          />
          <button type="submit" disabled={!password}>
            Update
          </button>
        </form>
      </div>

      <div style={{ marginTop: "1em" }}>
        <h3>Replica Scaling</h3>
        <textarea
          value={replicaScaling}
          onChange={(e) => setReplicaScaling(e.target.value)}
          rows={3}
        />
        <button
          onClick={async () => {
            try {
              await updateReplicaScaling(JSON.parse(replicaScaling));
            } catch {
              setError("Failed to update replica scaling");
            }
          }}
        >
          Update
        </button>
      </div>

      <div style={{ marginTop: "1em" }}>
        <h3>Service Scaling</h3>
        <textarea
          value={scaling}
          onChange={(e) => setScaling(e.target.value)}
          rows={3}
        />
        <button
          onClick={async () => {
            try {
              await updateServiceScaling(JSON.parse(scaling));
            } catch {
              setError("Failed to update scaling");
            }
          }}
        >
          Update
        </button>
      </div>

      <div style={{ marginTop: "1em" }}>
        <h3>Query Endpoint</h3>
        {queryEndpoint ? (
          <pre>{JSON.stringify(queryEndpoint, null, 2)}</pre>
        ) : (
          <div>No query endpoint</div>
        )}
        <textarea
          value={queryEndpointData}
          onChange={(e) => setQueryEndpointData(e.target.value)}
          rows={3}
        />
        <button
          onClick={async () => {
            try {
              await createQueryEndpoint(JSON.parse(queryEndpointData));
              serviceMutate();
            } catch {
              setError("Failed to create query endpoint");
            }
          }}
        >
          Create
        </button>
        <button
          onClick={async () => {
            try {
              await deleteQueryEndpoint();
              serviceMutate();
            } catch {
              setError("Failed to delete query endpoint");
            }
          }}
        >
          Delete
        </button>
      </div>

      <div style={{ marginTop: "1em" }}>
        <h3>Prometheus Metrics</h3>
        {metrics ? <pre>{metrics}</pre> : <div>No metrics</div>}
      </div>

      <div style={{ marginTop: "1em" }}>
        <h3>Private Endpoint Config</h3>
        {peConfig ? (
          <pre>{JSON.stringify(peConfig, null, 2)}</pre>
        ) : (
          <div>No config</div>
        )}
        <textarea
          value={privateEndpointData}
          onChange={(e) => setPrivateEndpointData(e.target.value)}
          rows={3}
        />
        <button
          onClick={async () => {
            try {
              await createPrivateEndpoint(JSON.parse(privateEndpointData));
            } catch {
              setError("Failed to create private endpoint");
            }
          }}
        >
          Create Private Endpoint
        </button>
      </div>

      <div style={{ marginTop: "1em" }}>
        <button
          className="delete-button"
          onClick={async () => {
            try {
              await deleteService();
              navigate(`/org/${orgId}`);
            } catch {
              setError("Failed to delete service");
            }
          }}
        >
          Delete Service
        </button>
      </div>

      {error && (
        <div className="error" style={{ marginTop: "0.5em" }}>
          Error: {error}
        </div>
      )}

      <Link to={`/org/${orgId}`}>Back to Organization</Link>
    </section>
  );
};

export default ServiceDetailsPage;
