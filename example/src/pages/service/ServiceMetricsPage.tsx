import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useServicePrometheus } from "clickhouse-cloud-react-hooks";
import { useAtomValue } from "jotai";
import { configAtom } from "../../configAtoms";

const ServiceMetricsPage: React.FC = () => {
  const { id, serviceId } = useParams<{ id: string; serviceId: string }>();
  const config = useAtomValue(configAtom)!;
  const [filtered, setFiltered] = useState(false);
  const { data, error, isLoading, mutate } = useServicePrometheus(id!, serviceId!, config, filtered);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Metrics</h2>
        <button className="btn" onClick={() => mutate()}>Refresh</button>
      </div>
      <label className="flex items-center">
        <input type="checkbox" className="mr-2" checked={filtered} onChange={(e)=>setFiltered(e.target.checked)} />
        Filter metrics
      </label>
      {isLoading ? (
        <div>Loading metrics...</div>
      ) : error ? (
        <div className="error">{String(error)}</div>
      ) : (
        <pre>{data}</pre>
      )}
    </section>
  );
};
export default ServiceMetricsPage;
