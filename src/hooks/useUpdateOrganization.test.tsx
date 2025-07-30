import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useUpdateOrganization } from './useOrganizations';

const mockOrganizationResponse = {
  status: 200,
  requestId: '550e8400-e29b-41d4-a716-446655440000',
  result: {
    id: '550e8400-e29b-41d4-a716-446655440001',
    createdAt: '2024-01-01T00:00:00Z',
    name: 'Updated Organization',
    privateEndpoints: [],
    byocConfig: []
  }
};

const config = {
  keyId: 'test-key-id',
  keySecret: 'test-key-secret',
  baseUrl: 'https://api.clickhouse.cloud',
};

const organizationId = '550e8400-e29b-41d4-a716-446655440001';

// Mock fetch
beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(global, 'fetch').mockImplementation(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockOrganizationResponse),
      status: 200,
      statusText: 'OK',
      headers: new Headers(),
      redirected: false,
      type: 'basic',
      url: '',
      clone: () => ({} as Response),
      body: null,
      bodyUsed: false,
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      blob: () => Promise.resolve(new Blob()),
      formData: () => Promise.resolve(new FormData()),
      text: () => Promise.resolve(''),
    } as Response)
  );
});

describe('useUpdateOrganization', () => {
  it('should update and return organization data', async () => {
    const { updateOrganization } = useUpdateOrganization(organizationId, config);
    const updateData = { name: 'Updated Organization' };
    const result = await updateOrganization(updateData);
    expect(result).toEqual(mockOrganizationResponse.result);
    expect(global.fetch).toHaveBeenCalledWith(
      `${config.baseUrl}/v1/organizations/${organizationId}`,
      expect.objectContaining({ method: 'PATCH' })
    );
  });

  it('should throw error on API failure', async () => {
    vi.spyOn(global, 'fetch').mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: () => Promise.resolve({ status: 400, error: 'Bad request' }),
        text: () => Promise.resolve('Bad request'),
        headers: new Headers(),
        redirected: false,
        type: 'basic',
        url: '',
        clone: () => ({} as Response),
        body: null,
        bodyUsed: false,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
        blob: () => Promise.resolve(new Blob()),
        formData: () => Promise.resolve(new FormData()),
      } as Response)
    );
    const { updateOrganization } = useUpdateOrganization(organizationId, config);
    await expect(updateOrganization({ name: 'fail' })).rejects.toThrow('Bad request');
  });
});
