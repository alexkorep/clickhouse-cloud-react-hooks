import React, { useState } from "react";
import {
  useOrganizationMembers,
  useUpdateOrganizationMember,
  useDeleteOrganizationMember,
  type Member,
  type ClickHouseConfig,
} from "clickhouse-cloud-react-hooks";
import { useParams } from "react-router-dom";
import { useAtomValue } from "jotai";
import { configAtom } from "../../configAtoms";

const MemberRow: React.FC<{ member: Member; orgId: string; config: ClickHouseConfig; onChange: () => void; }> = ({ member, orgId, config, onChange }) => {
  const { updateMember } = useUpdateOrganizationMember(orgId, member.userId, config);
  const { deleteMember } = useDeleteOrganizationMember(orgId, member.userId, config);
  const [saving, setSaving] = useState(false);
  return (
    <tr className="border-t">
      <td className="p-2">{member.email}</td>
      <td className="p-2">
        <select
          defaultValue={member.role}
          className="input"
          onChange={async (e) => {
            setSaving(true);
            await updateMember({ role: e.target.value as "admin" | "developer" });
            setSaving(false);
            onChange();
          }}
        >
          <option value="admin">admin</option>
          <option value="developer">developer</option>
        </select>
      </td>
      <td className="p-2 text-right">
        <button
          className="btn"
          onClick={async () => {
            setSaving(true);
            await deleteMember();
            setSaving(false);
            onChange();
          }}
          disabled={saving}
        >
          {saving ? "Working..." : "Remove"}
        </button>
      </td>
    </tr>
  );
};

const OrgMembersPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const config = useAtomValue(configAtom)!;
  const { data, isLoading, mutate } = useOrganizationMembers(id!, config);

  if (isLoading) return <div>Loading members...</div>;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Members</h2>
      {!data?.length ? (
        <div className="text-gray-600">No members yet.</div>
      ) : (
        <table className="min-w-full border rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-2">Email</th>
              <th className="text-left p-2">Role</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((m) => (
              <MemberRow key={m.userId} member={m} orgId={id!} config={config} onChange={mutate} />
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
};
export default OrgMembersPage;
