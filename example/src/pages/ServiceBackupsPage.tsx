import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAtomValue } from "jotai";
import {
  useServiceBackups,
  useServiceBackupConfiguration,
  useUpdateServiceBackupConfiguration,
  useDeleteServiceBackup,
  ClickHouseAPIError,
} from "clickhouse-cloud-react-hooks";
import { configAtom } from "../configAtoms";

const ServiceBackupsPage: React.FC = () => {
  const { id, serviceId } = useParams<{ id: string; serviceId: string }>();
  const config = useAtomValue(configAtom);

  const {
    data: backups,
    error: backupsError,
    isLoading: backupsLoading,
    isValidating,
    mutate: mutateBackups,
  } = useServiceBackups(id || "", serviceId || "", config || { keyId: "", keySecret: "" });

  const {
    data: backupConfig,
    error: configError,
    isLoading: configLoading,
    mutate: mutateConfig,
  } = useServiceBackupConfiguration(id || "", serviceId || "", config || { keyId: "", keySecret: "" });

  const { updateBackupConfiguration } = useUpdateServiceBackupConfiguration(
    id || "",
    serviceId || "",
    config || { keyId: "", keySecret: "" }
  );
  const DeleteButton: React.FC<{ backupId: string }> = ({ backupId }) => {
    const { deleteBackup } = useDeleteServiceBackup(
      id || "",
      serviceId || "",
      backupId,
      config || { keyId: "", keySecret: "" }
    );
    return (
      <button
        onClick={async () => {
          try {
            await deleteBackup();
            await mutateBackups();
          } catch {
            // ignore error
          }
        }}
      >
        Delete
      </button>
    );
  };

  const [period, setPeriod] = useState("");
  const [retention, setRetention] = useState("");
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  useEffect(() => {
    if (backupConfig) {
      setPeriod(
        backupConfig.backupPeriodInHours !== undefined
          ? String(backupConfig.backupPeriodInHours)
          : ""
      );
      setRetention(
        backupConfig.backupRetentionPeriodInHours !== undefined
          ? String(backupConfig.backupRetentionPeriodInHours)
          : ""
      );
    }
  }, [backupConfig]);

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

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Service Backups</h2>
      <Link to={`/org/${id}`} className="text-blue-600 hover:underline">
        Back to Organization
      </Link>

      <h3 className="text-xl font-semibold">Backup Configuration</h3>
      {configLoading ? (
        <div>Loading configuration...</div>
      ) : configError ? (
        <div className="error">
          {configError instanceof ClickHouseAPIError
            ? configError.error
            : configError.message}
        </div>
      ) : backupConfig ? (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setUpdating(true);
            setUpdateError(null);
            try {
              await updateBackupConfiguration({
                backupPeriodInHours: period ? Number(period) : undefined,
                backupRetentionPeriodInHours: retention
                  ? Number(retention)
                  : undefined,
              });
              await mutateConfig();
            } catch (err: unknown) {
              setUpdateError(
                err && typeof err === "object" && "message" in err
                  ? String((err as { message?: unknown }).message)
                  : "Failed to update configuration"
              );
            } finally {
              setUpdating(false);
            }
          }}
        >
          <div className="mb-2">
            <label>
              Period (hours):{" "}
              <input
                type="number"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="input ml-2"
              />
            </label>
          </div>
          <div className="mb-2">
            <label>
              Retention (hours):{" "}
              <input
                type="number"
                value={retention}
                onChange={(e) => setRetention(e.target.value)}
                className="input ml-2"
              />
            </label>
          </div>
          <button type="submit" disabled={updating} className="btn">
            {updating ? "Saving..." : "Save"}
          </button>
          {updateError && <div className="error">Error: {updateError}</div>}
        </form>
      ) : null}

      <h3 className="text-xl font-semibold">Backups</h3>
      <button
        onClick={() => mutateBackups()}
        className="btn mb-4"
        disabled={isValidating}
      >
        {isValidating ? "Loading..." : "Refresh"}
      </button>
      {backupsLoading ? (
        <div>Loading backups...</div>
      ) : backupsError ? (
        <div className="error">
          {backupsError instanceof ClickHouseAPIError
            ? backupsError.error
            : backupsError.message}
        </div>
      ) : backups && backups.length > 0 ? (
        <ul>
          {backups.map((b) => (
            <li key={b.id}>
              <div>
                <strong>{b.id}</strong> - {b.status}
              </div>
              <DeleteButton backupId={b.id} />
            </li>
          ))}
        </ul>
      ) : (
        <div>No backups found</div>
      )}
    </section>
  );
};

export default ServiceBackupsPage;
