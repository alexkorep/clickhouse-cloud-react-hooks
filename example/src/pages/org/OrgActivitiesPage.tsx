import React from "react";
import { Link, useParams } from "react-router-dom";
import { useOrganizationActivities, ClickHouseAPIError } from "clickhouse-cloud-react-hooks";
import { useAtomValue } from "jotai";
import { configAtom } from "../../configAtoms";

const OrgActivitiesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const config = useAtomValue(configAtom)!;
  const { data, error, isLoading, isValidating, mutate } = useOrganizationActivities(id!, config);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Activities</h2>
        <button className="btn" onClick={() => mutate()} disabled={isValidating}>
          {isValidating ? "Loading..." : "Refresh"}
        </button>
      </div>
      {isLoading ? (
        <div>Loading activities...</div>
      ) : error ? (
        <div className="error">
          {error instanceof ClickHouseAPIError ? error.error : String(error)}
        </div>
      ) : !data?.length ? (
        <div className="text-gray-600">No activities found</div>
      ) : (
        <ul className="divide-y rounded-xl border bg-white">
          {data.map((act) => (
            <li key={act.id} className="p-3">
              <Link to={`${act.id}`} className="text-blue-600 hover:underline">
                {act.type}
              </Link>
              <div className="text-xs text-gray-500">
                {new Date(act.createdAt).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
export default OrgActivitiesPage;
