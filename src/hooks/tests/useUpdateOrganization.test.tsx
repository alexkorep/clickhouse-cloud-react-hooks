import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockFetch } from "../../utils/testUtils";
import { useUpdateOrganization } from "../useOrganizations";

const organizationId = "550e8400-e29b-41d4-a716-446655440001";

const mockOrganizationResponse = {
  status: 200,
  requestId: "550e8400-e29b-41d4-a716-446655440000",
  result: {
    id: organizationId,
    createdAt: "2024-01-01T00:00:00Z",
    name: "Updated Organization",
    privateEndpoints: [],
    byocConfig: [],
  },
};

const config = {
  keyId: "test-key-id",
  keySecret: "test-key-secret",
  baseUrl: "https://api.clickhouse.cloud",
};

// Mock fetch
beforeEach(() => {
  vi.clearAllMocks();
  mockFetch<typeof mockOrganizationResponse>({
    response: mockOrganizationResponse,
  });
});

describe("useUpdateOrganization", () => {
  it("should update and return organization data", async () => {
    const { updateOrganization } = useUpdateOrganization(
      organizationId,
      config
    );
    const updateData = { name: "Updated Organization" };
    const result = await updateOrganization(updateData);
    expect(result).toEqual(mockOrganizationResponse.result);
    expect(global.fetch).toHaveBeenCalledWith(
      `${config.baseUrl}/v1/organizations/${organizationId}`,
      expect.objectContaining({ method: "PATCH" })
    );
  });

  it("should throw error on API failure", async () => {
    mockFetch<{ status: number; error: string }>({
      response: { status: 400, error: "Bad request" },
      ok: false,
      status: 400,
      statusText: "Bad Request",
      text: "Bad request",
    });
    const { updateOrganization } = useUpdateOrganization(
      organizationId,
      config
    );
    await expect(updateOrganization({ name: "fail" })).rejects.toThrow(
      "Bad request"
    );
  });
});
