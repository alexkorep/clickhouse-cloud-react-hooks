import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { waitFor } from '@testing-library/dom';
import React from 'react';
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

const errorConfig = {
  keyId: 'error-key-id',
  keySecret: 'error-key-secret',
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
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset fetch mock to default successful response
    vi.mocked(global.fetch).mockImplementation(() =>
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
  });

  function HookTest({ 
    onResult, 
    config: testConfig 
  }: { 
    onResult: (result: ReturnType<typeof useOrganizations>) => void;
    config: typeof config;
  }) {
    const result = useOrganizations(testConfig);
    React.useEffect(() => {
      onResult(result);
    }, [result, onResult]);
    return null;
  }

  it('should fetch and return organizations data', async () => {
    let hookResult: ReturnType<typeof useOrganizations> | undefined;
    render(<HookTest config={config} onResult={r => (hookResult = r)} />);
    await waitFor(() => expect(hookResult?.isLoading).toBe(false));
    expect(hookResult?.data).toEqual(mockOrganizationsResponse.result);
    expect(hookResult?.error).toBeUndefined();
    expect(hookResult?.response).toEqual(mockOrganizationsResponse);
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
    let hookResult: ReturnType<typeof useOrganizations> | undefined;
    render(<HookTest config={errorConfig} onResult={r => (hookResult = r)} />);
    await waitFor(() => expect(hookResult?.isLoading).toBe(false));
    expect(hookResult?.data).toBeUndefined();
    expect(hookResult?.error).toBeDefined();
  });
});
