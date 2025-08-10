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
import "../App.css";

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
  const { deleteBackup } = useDeleteServiceBackup(
    id || "",
    serviceId || "",
    config || { keyId: "", keySecret: "" }
  );

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
    <section className="backups-section">
      <h2>Service Backups</h2>
      <Link to={`/org/${id}`}>Back to Organization</Link>

      <h3>Backup Configuration</h3>
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
          <div>
            <label>
              Period (hours):{" "}
              <input
                type="number"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              Retention (hours):{" "}
              <input
                type="number"
                value={retention}
                onChange={(e) => setRetention(e.target.value)}
              />
            </label>
          </div>
          <button type="submit" disabled={updating}>
            {updating ? "Saving..." : "Save"}
          </button>
          {updateError && <div className="error">Error: {updateError}</div>}
        </form>
      ) : null}

      <h3>Backups</h3>
      <button
        onClick={() => mutateBackups()}
        className="refresh-button"
        style={{ marginBottom: "1em" }}
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
              <button
                onClick={async () => {
                  try {
                    await deleteBackup(b.id);
                    await mutateBackups();
                  } catch {
                    // ignore error
                  }
                }}
              >
                Delete
              </button>
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
