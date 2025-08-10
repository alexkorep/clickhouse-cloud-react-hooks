import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useServiceReplicaScaling, useServiceScaling } from "clickhouse-cloud-react-hooks";
import { useAtomValue } from "jotai";
import { configAtom } from "../../configAtoms";

const ServiceScalingPage: React.FC = () => {
  const { id, serviceId } = useParams<{ id: string; serviceId: string }>();
  const config = useAtomValue(configAtom)!;
  const { updateServiceScaling: updateReplicaScaling } = useServiceReplicaScaling(id!, serviceId!, config);
  const { updateServiceScaling } = useServiceScaling(id!, serviceId!, config);
  const [replicaScaling, setReplicaScaling] = useState("{}");
  const [scaling, setScaling] = useState("{}");
  const [error, setError] = useState<string | null>(null);

  return (
    <section className="space-y-6">
      {error && <div className="error">{error}</div>}
      <div>
        <h3 className="text-lg font-semibold mb-2">Replica Scaling</h3>
        <textarea
          className="input w-full h-32"
          value={replicaScaling}
          onChange={(e) => setReplicaScaling(e.target.value)}
        />
        <button
          className="btn mt-2"
          onClick={async () => {
            try {
              await updateReplicaScaling(JSON.parse(replicaScaling));
            } catch {
              setError("Failed to update replica scaling");
            }
          }}
        >
          Update
        </button>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Service Scaling</h3>
        <textarea
          className="input w-full h-32"
          value={scaling}
          onChange={(e) => setScaling(e.target.value)}
        />
        <button
          className="btn mt-2"
          onClick={async () => {
            try {
              await updateServiceScaling(JSON.parse(scaling));
            } catch {
              setError("Failed to update scaling");
            }
          }}
        >
          Update
        </button>
      </div>
    </section>
  );
};
export default ServiceScalingPage;
