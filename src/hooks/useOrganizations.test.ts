import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react-hooks';
import { useOrganizations } from './useOrganizations';

const mockOrganizationsResponse = {
  status: 200,
  requestId: '550e8400-e29b-41d4-a716-446655440000',
  result: [
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      createdAt: '2024-01-01T00:00:00Z',
      name: 'Test Organization',
      privateEndpoints: [],
      byocConfig: []
    }
  ]
};

const config = {
  keyId: 'test-key-id',
  keySecret: 'test-key-secret',
  baseUrl: 'https://api.clickhouse.cloud',
};

// Mock fetch with proper type
global.fetch = vi.fn().mockImplementation(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockOrganizationsResponse),
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

describe('useOrganizations', () => {
  it('should fetch and return organizations data', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useOrganizations(config));
    await waitForNextUpdate();
    expect(result.current.data).toEqual(mockOrganizationsResponse.result);
    expect(result.current.error).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.response).toEqual(mockOrganizationsResponse);
  });

  it('should handle API error', async () => {
    vi.mocked(global.fetch).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: () => Promise.resolve({ status: 400, error: 'Bad request' }),
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
    const { result, waitForNextUpdate } = renderHook(() => useOrganizations(config));
    await waitForNextUpdate();
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeDefined();
    expect(result.current.isLoading).toBe(false);
  });
});
