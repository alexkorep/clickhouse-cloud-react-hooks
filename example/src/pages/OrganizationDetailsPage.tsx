import React, { useState, useEffect } from "react";
import "../App.css";
import { useParams, Link } from "react-router-dom";
import {
  useOrganization,
  useUpdateOrganization,
  ClickHouseAPIError,
  useServices,
  useCreateService,
} from "clickhouse-cloud-react-hooks";
import { useAtomValue } from "jotai";
import { configAtom } from "../configAtoms";

const OrganizationDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const config = useAtomValue(configAtom);
  const {
    data: organization,
    error: orgError,
    isLoading: orgLoading,
    isValidating,
    mutate,
  } = useOrganization(id || "", config || { keyId: "", keySecret: "" });

  const { updateOrganization } = useUpdateOrganization(
    id || "",
    config || { keyId: "", keySecret: "" }
  );

  const {
    data: services,
    error: servicesError,
    isLoading: servicesLoading,
    isValidating: servicesValidating,
    mutate: servicesMutate,
  } = useServices(id || "", config || { keyId: "", keySecret: "" });

  const { createService } = useCreateService(
    id || "",
    config || { keyId: "", keySecret: "" }
  );

  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceProvider, setNewServiceProvider] = useState("");
  const [newServiceRegion, setNewServiceRegion] = useState("");
  const [newServiceTier, setNewServiceTier] = useState("");
  const [createServiceError, setCreateServiceError] = useState<string | null>(
    null
  );

  // State for editing organization name
  const [editName, setEditName] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);

  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Set initial editName when organization loads
  useEffect(() => {
    if (organization && !isEditing) {
      setEditName(organization.name);
    }
  }, [organization, isEditing]);

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

  if (orgLoading) {
    return <div>Loading organization details...</div>;
  }

  if (orgError) {
    return (
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
    );
  }

  if (!organization) {
    return <div>Organization not found</div>;
  }

  return (
    <section className="organization-details-section">
      <h2>Organization Details</h2>
      <button
        onClick={() => {
          mutate();
          setUpdateSuccess(false);
        }}
        className="refresh-button"
        style={{ marginBottom: "1em" }}
        disabled={isValidating}
      >
        {isValidating ? "Loading..." : "Refresh"}
      </button>

      {/* Editable Name Form */}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setUpdateLoading(true);
          setUpdateError(null);
          setUpdateSuccess(false);
          try {
            await updateOrganization({ name: editName });
            setUpdateSuccess(true);
            setIsEditing(false);
            mutate(); // Refresh organization data
          } catch (err: unknown) {
            setUpdateError(
              err && typeof err === "object" && "message" in err
                ? String((err as { message?: unknown }).message)
                : "Failed to update organization"
            );
          } finally {
            setUpdateLoading(false);
          }
        }}
        style={{ marginBottom: "1em" }}
      >
        <label>
          <strong>Name:</strong>{" "}
          {isEditing ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              disabled={updateLoading}
              style={{ marginRight: "0.5em" }}
            />
          ) : (
            <span style={{ marginRight: "0.5em" }}>{organization.name}</span>
          )}
        </label>
        {isEditing ? (
          <>
            <button
              type="submit"
              disabled={updateLoading || editName.trim() === ""}
              style={{ marginRight: "0.5em" }}
            >
              {updateLoading ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setEditName(organization.name);
              }}
              disabled={updateLoading}
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => {
              setIsEditing(true);
              setUpdateSuccess(false);
            }}
          >
            Edit
          </button>
        )}
        {updateError && (
          <div className="error" style={{ marginTop: "0.5em" }}>
            Error: {updateError}
          </div>
        )}
        {updateSuccess && (
          <div style={{ color: "green", marginTop: "0.5em" }}>
            Organization updated!
          </div>
        )}
      </form>

      <p>
        <strong>ID:</strong> {organization.id}
      </p>
      <p>
        <strong>Created:</strong>{" "}
        {new Date(organization.createdAt).toLocaleString()}
      </p>
      <div>
        <strong>Private Endpoints:</strong>
        {organization.privateEndpoints.length === 0 ? (
          <span> None</span>
        ) : (
          <ul>
            {organization.privateEndpoints.map((pe) => (
              <li key={pe.id}>
                <div>
                  <strong>ID:</strong> {pe.id}
                </div>
                <div>
                  <strong>Description:</strong> {pe.description}
                </div>
                <div>
                  <strong>Cloud Provider:</strong> {pe.cloudProvider}
                </div>
                <div>
                  <strong>Region:</strong> {pe.region}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <strong>BYOC Config:</strong>
        {organization.byocConfig.length === 0 ? (
          <span> None</span>
        ) : (
          <ul>
            {organization.byocConfig.map((byoc) => (
              <li key={byoc.id}>
                <div>
                  <strong>ID:</strong> {byoc.id}
                </div>
                <div>
                  <strong>State:</strong> {byoc.state}
                </div>
                <div>
                  <strong>Account Name:</strong> {byoc.accountName}
                </div>
                <div>
                  <strong>Region ID:</strong> {byoc.regionId}
                </div>
                <div>
                  <strong>Cloud Provider:</strong> {byoc.cloudProvider}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <section style={{ marginTop: "1em" }}>
        <h3>Services</h3>
        <button
          onClick={() => servicesMutate()}
          className="refresh-button"
          style={{ marginBottom: "1em" }}
          disabled={servicesValidating}
        >
          {servicesValidating ? "Loading..." : "Refresh"}
        </button>
        {servicesLoading ? (
          <div>Loading services...</div>
        ) : servicesError ? (
          <div className="error">
            {servicesError instanceof ClickHouseAPIError
              ? servicesError.error
              : String(servicesError)}
          </div>
        ) : services && services.length > 0 ? (
          <ul>
            {services.map((svc) => (
              <li key={svc.id}>
                <Link to={`/org/${id}/service/${svc.id}`}>{svc.name}</Link>
              </li>
            ))}
          </ul>
        ) : (
          <div>No services found</div>
        )}

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setCreateServiceError(null);
            try {
              await createService({
                name: newServiceName,
                provider: newServiceProvider,
                region: newServiceRegion,
                tier: newServiceTier,
              });
              setNewServiceName("");
              setNewServiceProvider("");
              setNewServiceRegion("");
              setNewServiceTier("");
              servicesMutate();
            } catch (err: unknown) {
              setCreateServiceError(
                err && typeof err === "object" && "message" in err
                  ? String((err as { message?: unknown }).message)
                  : "Failed to create service"
              );
            }
          }}
          style={{ marginTop: "1em" }}
        >
          <h4>Create Service</h4>
          <div>
            <input
              type="text"
              placeholder="Name"
              value={newServiceName}
              onChange={(e) => setNewServiceName(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Provider"
              value={newServiceProvider}
              onChange={(e) => setNewServiceProvider(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Region"
              value={newServiceRegion}
              onChange={(e) => setNewServiceRegion(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Tier"
              value={newServiceTier}
              onChange={(e) => setNewServiceTier(e.target.value)}
            />
          </div>
          <button type="submit" disabled={!newServiceName || !newServiceProvider || !newServiceRegion || !newServiceTier}>
            Create
          </button>
          {createServiceError && (
            <div className="error" style={{ marginTop: "0.5em" }}>
              Error: {createServiceError}
            </div>
          )}
        </form>
      </section>

      <Link to="/">Back to Organizations</Link>
    </section>
  );
};

export default OrganizationDetailsPage;
