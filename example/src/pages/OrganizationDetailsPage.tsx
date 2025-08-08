import React, { useState, useEffect } from "react";
import "../App.css";
import "./OrganizationDetailsPage.css";
import { useParams, Link } from "react-router-dom";
import {
  useOrganization,
  useUpdateOrganization,
  ClickHouseAPIError,
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
        className="form-inline"
      >
        <label>
          <strong>Name:</strong>{" "}
          {isEditing ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              disabled={updateLoading}
              className="mr-sm"
            />
          ) : (
            <span className="mr-sm">{organization.name}</span>
          )}
        </label>
        {isEditing ? (
          <>
            <button
              type="submit"
              disabled={updateLoading || editName.trim() === ""}
              className="mr-sm"
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
          <div className="error error-spacing">Error: {updateError}</div>
        )}
        {updateSuccess && (
          <div className="success-message">Organization updated!</div>
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
      <div className="link-container">
        <Link to={`/org/${id}/usage-cost`}>Usage Cost</Link>
        <Link to={`/org/${id}/private-endpoint-config`}>
          Private Endpoint Config
        </Link>
      </div>
      <Link to="/">Back to Organizations</Link>
    </section>
  );
};

export default OrganizationDetailsPage;
