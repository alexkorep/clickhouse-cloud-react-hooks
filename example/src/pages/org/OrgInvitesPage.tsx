import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  useOrganizationInvitations,
  useCreateOrganizationInvitation,
  useDeleteOrganizationInvitation,
  type Invitation,
  type ClickHouseConfig,
} from "clickhouse-cloud-react-hooks";
import { useAtomValue } from "jotai";
import { configAtom } from "../../configAtoms";

const InviteItem: React.FC<{ invite: Invitation; orgId: string; config: ClickHouseConfig; onChange: () => void; }> = ({ invite, orgId, config, onChange }) => {
  const { deleteInvitation } = useDeleteOrganizationInvitation(orgId, invite.id, config);
  return (
    <li className="p-3 flex items-center justify-between">
      <div>
        <div className="font-medium">{invite.email}</div>
        <div className="text-xs text-gray-500">role: {invite.role}</div>
      </div>
      <button className="btn" onClick={async () => { await deleteInvitation(); onChange(); }}>Remove</button>
    </li>
  );
};

const OrgInvitesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const config = useAtomValue(configAtom)!;
  const { data, isLoading, mutate } = useOrganizationInvitations(id!, config);
  const { createInvitation } = useCreateOrganizationInvitation(id!, config);

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "developer">("developer");
  const [error, setError] = useState<string | null>(null);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Invites</h2>
        <button className="btn" onClick={() => mutate()}>Refresh</button>
      </div>
      <div className="rounded-xl border p-4 bg-white">
        <h3 className="font-medium mb-2">Send Invite</h3>
        <div className="flex flex-wrap gap-2">
          <input className="input" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <select className="input" value={role} onChange={(e)=>setRole(e.target.value as "admin"|"developer") }>
            <option value="admin">admin</option>
            <option value="developer">developer</option>
          </select>
          <button className="btn" disabled={!email}
            onClick={async () => {
              setError(null);
              try {
                await createInvitation({ email, role });
                setEmail(""); setRole("developer");
                mutate();
              } catch (err: unknown) {
                setError(
                  err && typeof err === "object" && "message" in err
                    ? String((err as { message?: unknown }).message)
                    : "Failed to invite"
                );
              }
            }}
          >Invite</button>
        </div>
        {error && <div className="error mt-2">Error: {error}</div>}
      </div>
      {isLoading ? (
        <div>Loading invitations...</div>
      ) : !data?.length ? (
        <div className="text-gray-600">No pending invites.</div>
      ) : (
        <ul className="divide-y rounded-xl border bg-white">
          {data.map((inv) => (
            <InviteItem key={inv.id} invite={inv} orgId={id!} config={config} onChange={mutate} />
          ))}
        </ul>
      )}
    </section>
  );
};
export default OrgInvitesPage;
