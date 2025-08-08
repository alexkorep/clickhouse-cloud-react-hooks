import React, { useState, useEffect } from "react";
import "../App.css";
import { useParams, Link } from "react-router-dom";
import {
  useOrganization,
  useUpdateOrganization,
  useInvitations,
  useCreateInvitation,
  useInvitation,
  useDeleteInvitation,
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

  const {
    data: invitations,
    error: invitationsError,
    isLoading: invitationsLoading,
    mutate: invitationsMutate,
  } = useInvitations(id || "", config || { keyId: "", keySecret: "" });

  const { createInvitation } = useCreateInvitation(
    id || "",
    config || { keyId: "", keySecret: "" }
  );

  const [invEmail, setInvEmail] = useState("");
  const [invRole, setInvRole] = useState("developer");
  const [invLoading, setInvLoading] = useState(false);
  const [invError, setInvError] = useState<string | null>(null);
  const [selectedInvitationId, setSelectedInvitationId] = useState<string | null>(null);

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

  function InvitationDetails({ invitationId }: { invitationId: string }) {
    const {
      data: invitation,
      error,
      isLoading,
    } = useInvitation(id || "", invitationId, config || { keyId: "", keySecret: "" });
    const { deleteInvitation } = useDeleteInvitation(
      id || "",
      invitationId,
      config || { keyId: "", keySecret: "" }
    );
    if (isLoading) return <div>Loading invitation...</div>;
    if (error)
      return (
        <div className="error">Error loading invitation details</div>
      );
    if (!invitation) return null;
    return (
      <div className="invitation-details" style={{ marginTop: "1em" }}>
        <p>
          <strong>Email:</strong> {invitation.email}
        </p>
        <p>
          <strong>Role:</strong> {invitation.role}
        </p>
        <p>
          <strong>Created:</strong> {new Date(invitation.createdAt).toLocaleString()}
        </p>
        <p>
          <strong>Expires:</strong> {new Date(invitation.expireAt).toLocaleString()}
        </p>
        <button
          onClick={async () => {
            await deleteInvitation();
            setSelectedInvitationId(null);
            invitationsMutate();
          }}
        >
          Delete Invitation
        </button>
        <button
          style={{ marginLeft: "0.5em" }}
          onClick={() => setSelectedInvitationId(null)}
        >
          Close
        </button>
      </div>
    );
  }

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
      <div style={{ marginTop: "2em" }}>
        <h3>Invitations</h3>
        {invitationsLoading ? (
          <div>Loading invitations...</div>
        ) : invitationsError ? (
          <div className="error">Error loading invitations</div>
        ) : invitations && invitations.length > 0 ? (
          <ul>
            {invitations.map((inv) => (
              <li key={inv.id}>
                {inv.email} - {inv.role}
                <button
                  style={{ marginLeft: "0.5em" }}
                  onClick={() => setSelectedInvitationId(inv.id)}
                >
                  View Details
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No invitations</p>
        )}

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setInvError(null);
            setInvLoading(true);
            try {
              await createInvitation({ email: invEmail, role: invRole });
              setInvEmail("");
              setInvRole("developer");
              invitationsMutate();
            } catch (err: unknown) {
              setInvError(
                err && typeof err === "object" && "message" in err
                  ? String((err as { message?: unknown }).message)
                  : "Failed to create invitation"
              );
            } finally {
              setInvLoading(false);
            }
          }}
          style={{ marginTop: "1em" }}
        >
          <input
            type="email"
            placeholder="Email"
            value={invEmail}
            onChange={(e) => setInvEmail(e.target.value)}
            required
            style={{ marginRight: "0.5em" }}
          />
          <select
            value={invRole}
            onChange={(e) => setInvRole(e.target.value)}
            style={{ marginRight: "0.5em" }}
          >
            <option value="admin">admin</option>
            <option value="developer">developer</option>
          </select>
          <button type="submit" disabled={invLoading}>
            {invLoading ? "Sending..." : "Invite"}
          </button>
        </form>
        {invError && (
          <div className="error" style={{ marginTop: "0.5em" }}>
            Error: {invError}
          </div>
        )}
        {selectedInvitationId && (
          <InvitationDetails invitationId={selectedInvitationId} />
        )}
      </div>
      <Link to="/">Back to Organizations</Link>
    </section>
  );
};

export default OrganizationDetailsPage;
