import React, { useState, useEffect } from "react";
import "../App.css";
import "./OrganizationDetailsPage.css";
import { useParams, Link } from "react-router-dom";
import {
  useOrganization,
  useUpdateOrganization,
  useOrganizationPrometheusMetrics,
  useServicePrometheusMetrics,
  useApiKeys,
  useCreateApiKey,
  useUpdateApiKey,
  useDeleteApiKey,
  type ApiKey,
  ClickHouseAPIError,
  ClickHouseConfig,
  useServices,
  useOrganizationMembers,
  useUpdateOrganizationMember,
  useDeleteOrganizationMember,
  useOrganizationInvitations,
  useCreateOrganizationInvitation,
  useDeleteOrganizationInvitation,
  type Member,
  type Invitation,
} from "clickhouse-cloud-react-hooks";
import { useAtomValue } from "jotai";
import { configAtom } from "../configAtoms";

function ServiceMetrics({
  organizationId,
  serviceId,
  config,
  filtered,
}: {
  organizationId: string;
  serviceId: string;
  config: ClickHouseConfig;
  filtered: boolean;
}) {
  const { data, error, isLoading } = useServicePrometheusMetrics(
    organizationId,
    serviceId,
    config,
    filtered
  );
  if (isLoading) {
    return <div>Loading service metrics...</div>;
  }
  if (error) {
    return (
      <div className="error">
        {error instanceof ClickHouseAPIError
          ? `ClickHouse API Error: ${error.error}`
          : `Error: ${(error as Error).message}`}
      </div>
    );
  }
  return <pre>{data}</pre>;
}

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

  const {
    data: servicesData,
    error: servicesError,
    isLoading: servicesLoading,
  } = useServices(id || "", config || { keyId: "", keySecret: "" });

  const { updateOrganization } = useUpdateOrganization(
    id || "",
    config || { keyId: "", keySecret: "" }
  );

  const {
    data: apiKeys,
    error: keysError,
    isLoading: keysLoading,
    mutate: mutateKeys,
  } = useApiKeys(id || "", config || { keyId: "", keySecret: "" });

  const { createApiKey } = useCreateApiKey(
    id || "",
    config || { keyId: "", keySecret: "" }
  );

  const {
    data: members,
    error: membersError,
    isLoading: membersLoading,
    mutate: mutateMembers,
  } = useOrganizationMembers(id || "", config || { keyId: "", keySecret: "" });

  const {
    data: invitations,
    error: invitationsError,
    isLoading: invitationsLoading,
    mutate: mutateInvitations,
  } = useOrganizationInvitations(
    id || "",
    config || { keyId: "", keySecret: "" }
  );

  const { createInvitation } = useCreateOrganizationInvitation(
    id || "",
    config || { keyId: "", keySecret: "" }
  );

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "developer">(
    "developer"
  );
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  function MemberItem({ member }: { member: Member }) {
    const { updateMember } = useUpdateOrganizationMember(
      id || "",
      member.userId,
      config || { keyId: "", keySecret: "" }
    );
    const { deleteMember } = useDeleteOrganizationMember(
      id || "",
      member.userId,
      config || { keyId: "", keySecret: "" }
    );
    const [role, setRole] = useState<"admin" | "developer">(member.role);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    return (
      <li key={member.userId} className="mb-05">
        <span className="mr-05">{member.email}</span>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as "admin" | "developer")}
          disabled={loading}
          className="mr-05"
        >
          <option value="admin">admin</option>
          <option value="developer">developer</option>
        </select>
        <button
          onClick={async () => {
            setLoading(true);
            setError(null);
            try {
              await updateMember({ role });
              mutateMembers();
            } catch (err: unknown) {
              setError(
                err && typeof err === "object" && "message" in err
                  ? String((err as { message?: unknown }).message)
                  : "Failed to update member"
              );
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
          className="mr-05"
        >
          {loading ? "Saving..." : "Save"}
        </button>
        <button
          onClick={async () => {
            setLoading(true);
            setError(null);
            try {
              await deleteMember();
              mutateMembers();
            } catch (err: unknown) {
              setError(
                err && typeof err === "object" && "message" in err
                  ? String((err as { message?: unknown }).message)
                  : "Failed to delete member"
              );
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
        >
          Delete
        </button>
        {error && <div className="error">Error: {error}</div>}
      </li>
    );
  }

  function InvitationItem({ invitation }: { invitation: Invitation }) {
    const { deleteInvitation } = useDeleteOrganizationInvitation(
      id || "",
      invitation.id,
      config || { keyId: "", keySecret: "" }
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    return (
      <li key={invitation.id} className="mb-05">
        <span className="mr-05">
          {invitation.email} - {invitation.role}
        </span>
        <button
          onClick={async () => {
            setLoading(true);
            setError(null);
            try {
              await deleteInvitation();
              mutateInvitations();
            } catch (err: unknown) {
              setError(
                err && typeof err === "object" && "message" in err
                  ? String((err as { message?: unknown }).message)
                  : "Failed to delete invitation"
              );
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
        >
          Delete
        </button>
        {error && <div className="error">Error: {error}</div>}
      </li>
    );
  } 
  // State for creating API keys
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyRoles, setNewKeyRoles] = useState("developer");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createdKey, setCreatedKey] = useState<
    { keyId?: string; keySecret?: string } | null
  >(null);

  // State for editing organization name
  const [editName, setEditName] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);

  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [filterOrgMetrics, setFilterOrgMetrics] = useState(false);
  const {
    data: orgMetrics,
    error: orgMetricsError,
    isLoading: orgMetricsLoading,
  } = useOrganizationPrometheusMetrics(
    id || "",
    config || { keyId: "", keySecret: "" },
    filterOrgMetrics
  );

  const [serviceIdInput, setServiceIdInput] = useState("");
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [filterServiceMetrics, setFilterServiceMetrics] = useState(false);
  function ApiKeyItem({ apiKey }: { apiKey: ApiKey }) {
    const { updateApiKey } = useUpdateApiKey(
      id || "",
      apiKey.id,
      config || { keyId: "", keySecret: "" }
    );
    const { deleteApiKey } = useDeleteApiKey(
      id || "",
      apiKey.id,
      config || { keyId: "", keySecret: "" }
    );

    return (
      <li key={apiKey.id} className="mb-05">
        <span>
          <strong>{apiKey.name}</strong> ({apiKey.state})
        </span>
        <button
          className="ml-05"
          onClick={async () => {
            await updateApiKey({
              state: apiKey.state === "enabled" ? "disabled" : "enabled",
            });
            mutateKeys();
          }}
        >
          Toggle State
        </button>
        <button
          className="ml-05"
          onClick={async () => {
            await deleteApiKey();
            mutateKeys();
          }}
        >
          Delete
        </button>
      </li>
    );
  }

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
        className="refresh-button mb-1"
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
        className="mb-1"
      >
        <label>
          <strong>Name:</strong>{" "}
          {isEditing ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              disabled={updateLoading}
              className="mr-05"
            />
          ) : (
            <span className="mr-05">{organization.name}</span>
          )}
        </label>
        {isEditing ? (
          <>
            <button
              type="submit"
              disabled={updateLoading || editName.trim() === ""}
              className="mr-05"
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
          <div className="error mt-05">Error: {updateError}</div>
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
        <strong>Members:</strong>
        {membersLoading ? (
          <div>Loading members...</div>
        ) : membersError ? (
          <div className="error">Error loading members</div>
        ) : !members || members.length === 0 ? (
          <span> None</span>
        ) : (
          <ul>
            {members.map((m) => (
              <MemberItem key={m.userId} member={m} />
            ))}
          </ul>
        )}
      </div>
      <div>
        <strong>Invitations:</strong>
        {invitationsLoading ? (
          <div>Loading invitations...</div>
        ) : invitationsError ? (
          <div className="error">Error loading invitations</div>
        ) : (
          <>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setInviteLoading(true);
                setInviteError(null);
                try {
                  await createInvitation({
                    email: inviteEmail,
                    role: inviteRole,
                  });
                  setInviteEmail("");
                  mutateInvitations();
                } catch (err: unknown) {
                  setInviteError(
                    err && typeof err === "object" && "message" in err
                      ? String((err as { message?: unknown }).message)
                      : "Failed to create invitation"
                  );
                } finally {
                  setInviteLoading(false);
                }
              }}
              className="mb-1"
            >
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Email"
                disabled={inviteLoading}
                className="mr-05"
              />
              <select
                value={inviteRole}
                onChange={(e) =>
                  setInviteRole(e.target.value as "admin" | "developer")
                }
                disabled={inviteLoading}
                className="mr-05"
              >
                <option value="developer">developer</option>
                <option value="admin">admin</option>
              </select>
              <button
                type="submit"
                disabled={inviteLoading || inviteEmail.trim() === ""}
              >
                {inviteLoading ? "Inviting..." : "Invite"}
              </button>
              {inviteError && (
                <div className="error mt-05">Error: {inviteError}</div>
              )}
            </form>
            {(!invitations || invitations.length === 0) ? (
              <span>No invitations</span>
            ) : (
              <ul>
                {invitations.map((inv) => (
                  <InvitationItem key={inv.id} invitation={inv} />
                ))}
              </ul>
            )}
          </>
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
      <div>
        <strong>Services:</strong>
        {servicesLoading ? (
          <span> Loading services...</span>
        ) : servicesError ? (
          <span className="error">Failed to load services</span>
        ) : servicesData && servicesData.result.length > 0 ? (
          <ul>
            {servicesData.result.map((svc: { id: string; name: string }) => (
              <li key={svc.id}>
                {svc.name} - {""}
                <Link to={`/org/${id}/service/${svc.id}/backups`}>
                  Backups
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <span> None</span>
        )}
      </div>
      <div>
        <h3>Organization Prometheus Metrics</h3>
        <label>
          <input
            type="checkbox"
            checked={filterOrgMetrics}
            onChange={(e) => setFilterOrgMetrics(e.target.checked)}
            style={{ marginRight: "0.5em" }}
          />
          Filter metrics
        </label>
        {orgMetricsLoading ? (
          <div>Loading metrics...</div>
        ) : orgMetricsError ? (
          <div className="error">
            {orgMetricsError instanceof ClickHouseAPIError
              ? `ClickHouse API Error: ${orgMetricsError.error}`
              : `Error: ${(orgMetricsError as Error).message}`}
          </div>
        ) : (
          <pre>{orgMetrics}</pre>
        )}
      </div>
      <div>
        <h3>Service Prometheus Metrics</h3>
        <input
          type="text"
          placeholder="Service ID"
          value={serviceIdInput}
          onChange={(e) => setServiceIdInput(e.target.value)}
          style={{ marginRight: "0.5em" }}
        />
        <label style={{ marginRight: "0.5em" }}>
          <input
            type="checkbox"
            checked={filterServiceMetrics}
            onChange={(e) => setFilterServiceMetrics(e.target.checked)}
            style={{ marginRight: "0.25em" }}
          />
          Filter
        </label>
        <button
          onClick={() => setServiceId(serviceIdInput)}
          disabled={serviceIdInput.trim() === ""}
          style={{ marginRight: "0.5em" }}
        >
          Load Metrics
        </button>
        {serviceId && config && (
          <ServiceMetrics
            organizationId={id || ""}
            serviceId={serviceId}
            config={config}
            filtered={filterServiceMetrics}
          />
        )}
      </div>
      <div className="mt-1">
        <h3>API Keys</h3>
        {keysLoading ? (
          <div>Loading API keys...</div>
        ) : keysError ? (
          <div className="error">Failed to load API keys</div>
        ) : (
          <ul>
            {apiKeys?.map((k) => (
              <ApiKeyItem apiKey={k} key={k.id} />
            ))}
          </ul>
        )}
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setCreateLoading(true);
            setCreateError(null);
            setCreatedKey(null);
            try {
              const result = await createApiKey({
                name: newKeyName,
                roles: newKeyRoles
                  .split(",")
                  .map((r) => r.trim())
                  .filter(Boolean),
              });
              setCreatedKey(result);
              setNewKeyName("");
              setNewKeyRoles("developer");
              mutateKeys();
            } catch (err: unknown) {
              setCreateError(
                err && typeof err === "object" && "message" in err
                  ? String((err as { message?: unknown }).message)
                  : "Failed to create key"
              );
            } finally {
              setCreateLoading(false);
            }
          }}
          className="mt-1"
        >
          <div>
            <input
              type="text"
              placeholder="Key name"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              className="mr-05"
            />
            <input
              type="text"
              placeholder="Roles (comma separated)"
              value={newKeyRoles}
              onChange={(e) => setNewKeyRoles(e.target.value)}
              className="mr-05"
            />
            <button
              type="submit"
              disabled={createLoading || newKeyName.trim() === ""}
            >
              {createLoading ? "Creating..." : "Create Key"}
            </button>
          </div>
          {createError && (
            <div className="error mt-05">Error: {createError}</div>
          )}
          {createdKey && createdKey.keySecret && (
            <div className="mt-05">
              <div>
                <strong>Key ID:</strong> {createdKey.keyId}
              </div>
              <div>
                <strong>Key Secret:</strong> {createdKey.keySecret}
              </div>
            </div>
          )}
        </form>
      </div>
      <Link to="/">Back to Organizations</Link>
    </section>
  );
};

export default OrganizationDetailsPage;
