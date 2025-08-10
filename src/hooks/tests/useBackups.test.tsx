import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockFetch } from "../../utils/testUtils";
import { render } from "@testing-library/react";
import { waitFor } from "@testing-library/dom";
import React from "react";
import {
  useServiceBackups,
  useServiceBackup,
  useServiceBackupConfiguration,
  useUpdateServiceBackupConfiguration,
  useDeleteServiceBackup,
} from "../useBackups";

const organizationId = "550e8400-e29b-41d4-a716-446655440001";
const serviceId = "550e8400-e29b-41d4-a716-446655440002";
const backupId = "550e8400-e29b-41d4-a716-446655440003";

const config = {
  keyId: "test-key-id",
  keySecret: "test-key-secret",
  baseUrl: "https://api.clickhouse.cloud",
};

const mockBackupsResponse = {
  status: 200,
  requestId: "550e8400-e29b-41d4-a716-446655440000",
  result: [
    {
      id: backupId,
      status: "done",
      serviceId,
      startedAt: "2024-01-01T00:00:00Z",
      finishedAt: "2024-01-01T01:00:00Z",
      type: "full",
      sizeInBytes: 1024,
      durationInSeconds: 60,
    },
  ],
};

const mockBackupResponse = {
  status: 200,
  requestId: "550e8400-e29b-41d4-a716-446655440010",
  result: mockBackupsResponse.result[0],
};

const mockBackupConfigResponse = {
  status: 200,
  requestId: "550e8400-e29b-41d4-a716-446655440020",
  result: {
    backupPeriodInHours: 24,
    backupRetentionPeriodInHours: 48,
    backupStartTime: "00:00",
  },
};

beforeEach(() => {
  vi.clearAllMocks();
  mockFetch({ response: mockBackupsResponse });
});

describe("useServiceBackups", () => {
  function HookTest({ onResult }: { onResult: (r: ReturnType<typeof useServiceBackups>) => void }) {
    const result = useServiceBackups(organizationId, serviceId, config);
    React.useEffect(() => {
      onResult(result);
    }, [result, onResult]);
    return null;
  }

  it("should fetch and return service backups", async () => {
    let hookResult: ReturnType<typeof useServiceBackups> | undefined;
    render(<HookTest onResult={(r) => (hookResult = r)} />);
    await waitFor(() => expect(hookResult?.isLoading).toBe(false));
    expect(hookResult?.data).toEqual(mockBackupsResponse.result);
    expect(hookResult?.response).toEqual(mockBackupsResponse);
  });
});

describe("useServiceBackup", () => {
  beforeEach(() => {
    mockFetch({ response: mockBackupResponse });
  });

  function HookTest({ onResult }: { onResult: (r: ReturnType<typeof useServiceBackup>) => void }) {
    const result = useServiceBackup(organizationId, serviceId, backupId, config);
    React.useEffect(() => {
      onResult(result);
    }, [result, onResult]);
    return null;
  }

  it("should fetch and return service backup", async () => {
    let hookResult: ReturnType<typeof useServiceBackup> | undefined;
    render(<HookTest onResult={(r) => (hookResult = r)} />);
    await waitFor(() => expect(hookResult?.isLoading).toBe(false));
    expect(hookResult?.data).toEqual(mockBackupResponse.result);
    expect(hookResult?.response).toEqual(mockBackupResponse);
  });
});

describe("useServiceBackupConfiguration", () => {
  beforeEach(() => {
    mockFetch({ response: mockBackupConfigResponse });
  });

  function HookTest({ onResult }: { onResult: (r: ReturnType<typeof useServiceBackupConfiguration>) => void }) {
    const result = useServiceBackupConfiguration(organizationId, serviceId, config);
    React.useEffect(() => {
      onResult(result);
    }, [result, onResult]);
    return null;
  }

  it("should fetch and return backup configuration", async () => {
    let hookResult: ReturnType<typeof useServiceBackupConfiguration> | undefined;
    render(<HookTest onResult={(r) => (hookResult = r)} />);
    await waitFor(() => expect(hookResult?.isLoading).toBe(false));
    expect(hookResult?.data).toEqual(mockBackupConfigResponse.result);
    expect(hookResult?.response).toEqual(mockBackupConfigResponse);
  });
});

describe("useUpdateServiceBackupConfiguration", () => {
  beforeEach(() => {
    mockFetch({ response: mockBackupConfigResponse });
  });

  function HookTest({ onResult }: { onResult: (r: ReturnType<typeof useUpdateServiceBackupConfiguration>) => void }) {
    const result = useUpdateServiceBackupConfiguration(organizationId, serviceId, config);
    React.useEffect(() => {
      onResult(result);
    }, [result, onResult]);
    return null;
  }

  it("should update backup configuration", async () => {
    let hookResult: ReturnType<typeof useUpdateServiceBackupConfiguration> | undefined;
    render(<HookTest onResult={(r) => (hookResult = r)} />);
    await waitFor(() => expect(hookResult).toBeDefined());
    const result = await hookResult!.updateBackupConfiguration({ backupPeriodInHours: 12 });
    expect(result).toEqual(mockBackupConfigResponse.result);
    expect(global.fetch).toHaveBeenCalledWith(
      `${config.baseUrl}/v1/organizations/${organizationId}/services/${serviceId}/backupConfiguration`,
      expect.objectContaining({ method: "PATCH" })
    );
  });

  it("should throw error on API failure", async () => {
    mockFetch({
      response: { status: 400, error: "Bad request" },
      ok: false,
      status: 400,
      statusText: "Bad Request",
      text: "Bad request",
    });
    let hookResult: ReturnType<typeof useUpdateServiceBackupConfiguration> | undefined;
    render(<HookTest onResult={(r) => (hookResult = r)} />);
    await waitFor(() => expect(hookResult).toBeDefined());
    await expect(hookResult!.updateBackupConfiguration({})).rejects.toThrow("Bad request");
  });
});

describe("useDeleteServiceBackup", () => {
  beforeEach(() => {
    mockFetch({ response: { status: 200, requestId: "1", result: {} } });
  });

  function HookTest({ onResult }: { onResult: (r: ReturnType<typeof useDeleteServiceBackup>) => void }) {
    const result = useDeleteServiceBackup(organizationId, serviceId, config);
    React.useEffect(() => {
      onResult(result);
    }, [result, onResult]);
    return null;
  }

  it("should delete backup", async () => {
    let hookResult: ReturnType<typeof useDeleteServiceBackup> | undefined;
    render(<HookTest onResult={(r) => (hookResult = r)} />);
    await waitFor(() => expect(hookResult).toBeDefined());
    await hookResult!.deleteBackup(backupId);
    expect(global.fetch).toHaveBeenCalledWith(
      `${config.baseUrl}/v1/organizations/${organizationId}/services/${serviceId}/backups/${backupId}`,
      expect.objectContaining({ method: "DELETE" })
    );
  });

  it("should throw error on API failure", async () => {
    mockFetch({
      response: { status: 404, error: "Not found" },
      ok: false,
      status: 404,
      statusText: "Not Found",
      text: "Not found",
    });
    let hookResult: ReturnType<typeof useDeleteServiceBackup> | undefined;
    render(<HookTest onResult={(r) => (hookResult = r)} />);
    await waitFor(() => expect(hookResult).toBeDefined());
    await expect(hookResult!.deleteBackup(backupId)).rejects.toThrow("Not found");
  });
});
