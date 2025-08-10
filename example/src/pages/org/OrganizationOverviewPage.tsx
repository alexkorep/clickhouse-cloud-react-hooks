import React from "react";
import { Link, useParams } from "react-router-dom";
import {
  useOrganization,
  useServices,
  useOrganizationMembers,
  useOrganizationInvitations,
} from "clickhouse-cloud-react-hooks";
import { useAtomValue } from "jotai";
import { configAtom } from "../../configAtoms";

const StatCard = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="rounded-xl border p-4 bg-white shadow-sm">
    <div className="text-sm text-gray-500">{label}</div>
    <div className="text-2xl font-semibold mt-1">{value}</div>
  </div>
);

const OrganizationOverviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const config = useAtomValue(configAtom)!;

  const org = useOrganization(id!, config);
  const services = useServices(id!, config);
  const members = useOrganizationMembers(id!, config);
  const invites = useOrganizationInvitations(id!, config);

  if (org.isLoading) return <div>Loading organization...</div>;
  if (!org.data) return <div>Organization not found</div>;

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{org.data.name}</h1>
          <p className="text-gray-600 text-sm">ID: {org.data.id}</p>
        </div>
        <button onClick={() => org.mutate()} className="btn">Refresh</button>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Services" value={services.data?.length ?? 0} />
        <StatCard label="Members" value={members.data?.length ?? 0} />
        <StatCard label="Pending Invites" value={invites.data?.length ?? 0} />
        <StatCard label="Created" value={new Date(org.data.createdAt).toLocaleString()} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border bg-white p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Recent Activities</h3>
            <Link className="text-blue-600 text-sm" to="activities">View all</Link>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Jump to Activities to see audit events.
          </p>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Quick Actions</h3>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link to="services" className="btn">Create service</Link>
            <Link to="members" className="btn">Add member</Link>
            <Link to="api-keys" className="btn">Create API key</Link>
          </div>
        </div>
      </div>
    </section>
  );
};
export default OrganizationOverviewPage;
