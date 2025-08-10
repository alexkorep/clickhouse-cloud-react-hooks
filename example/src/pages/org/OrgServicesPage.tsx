import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  useServices,
  useCreateService,
} from "clickhouse-cloud-react-hooks";
import { useAtomValue } from "jotai";
import { configAtom } from "../../configAtoms";

const OrgServicesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const config = useAtomValue(configAtom)!;
  const { data, isLoading, mutate } = useServices(id!, config);
  const { createService } = useCreateService(id!, config);

  const [name, setName] = useState("");
  const [provider, setProvider] = useState("");
  const [region, setRegion] = useState("");
  const [tier, setTier] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Services</h2>
        <button className="btn" onClick={() => mutate()}>Refresh</button>
      </div>
      {isLoading ? (
        <div>Loading services...</div>
      ) : !data?.length ? (
        <div className="text-gray-600">No services found</div>
      ) : (
        <table className="min-w-full border rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">ID</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((svc) => (
              <tr key={svc.id} className="border-t">
                <td className="p-2">{svc.name}</td>
                <td className="p-2">{svc.id}</td>
                <td className="p-2 text-right">
                  <Link to={`service/${svc.id}`} className="btn">Open</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="rounded-xl border p-4 bg-white">
        <h3 className="font-medium mb-2">Create Service</h3>
        <div className="flex flex-wrap gap-2">
          <input className="input" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />
          <input className="input" placeholder="Provider" value={provider} onChange={(e)=>setProvider(e.target.value)} />
          <input className="input" placeholder="Region" value={region} onChange={(e)=>setRegion(e.target.value)} />
          <input className="input" placeholder="Tier" value={tier} onChange={(e)=>setTier(e.target.value)} />
          <button className="btn"
            disabled={!name || !provider || !region || !tier}
            onClick={async () => {
              setError(null);
              try {
                await createService({ name, provider, region, tier });
                setName(""); setProvider(""); setRegion(""); setTier("");
                mutate();
              } catch (err: unknown) {
                setError(
                  err && typeof err === "object" && "message" in err
                    ? String((err as { message?: unknown }).message)
                    : "Failed to create service"
                );
              }
            }}
          >Create</button>
        </div>
        {error && <div className="error mt-2">Error: {error}</div>}
      </div>
    </section>
  );
};
export default OrgServicesPage;
