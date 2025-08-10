import React from "react";
import { useParams, Link } from "react-router-dom";
import { useService } from "clickhouse-cloud-react-hooks";
import { useAtomValue } from "jotai";
import { configAtom } from "../../configAtoms";

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="grid grid-cols-3 gap-2 py-2 border-b last:border-none">
    <div className="text-gray-500">{label}</div>
    <div className="col-span-2 font-medium">{value}</div>
  </div>
);

const ServiceOverviewPage: React.FC = () => {
  const { id, serviceId } = useParams<{ id: string; serviceId: string }>();
  const config = useAtomValue(configAtom)!;
  const svc = useService(id!, serviceId!, config);

  if (svc.isLoading) return <div>Loading service...</div>;
  if (!svc.data) return <div>Service not found</div>;

  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{svc.data.name}</h2>
        <button className="btn" onClick={() => svc.mutate()}>Refresh</button>
      </header>
      <div className="rounded-xl border bg-white p-4">
        <Row label="ID" value={svc.data.id} />
        <Row label="Tier" value={svc.data.tier} />
        <Row label="Region" value={svc.data.region} />
        <Row label="Provider" value={svc.data.provider} />
        <Row label="Created" value={new Date(svc.data.createdAt).toLocaleString()} />
      </div>
      <div className="flex flex-wrap gap-2">
        <Link to="scaling" className="btn">Adjust Scaling</Link>
        <Link to="endpoints" className="btn">Manage Endpoints</Link>
        <Link to="backups" className="btn">Backups</Link>
        <Link to="metrics" className="btn">Metrics</Link>
        <Link to="settings" className="btn">Settings</Link>
      </div>
    </section>
  );
};
export default ServiceOverviewPage;
