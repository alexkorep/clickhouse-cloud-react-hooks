import { vi } from "vitest";

/**
 * Mocks the global fetch function for testing purposes.
 *
 * @param response The response object to return from fetch.
 * @param ok Whether the response should be ok (default: true).
 * @param status HTTP status code (default: 200).
 * @param statusText HTTP status text (default: 'OK').
 * @param text Optional string to return from response.text().
 */
export function mockFetch<T>({
  response,
  ok = true,
  status = 200,
  statusText = "OK",
  text,
}: {
  response: T;
  ok?: boolean;
  status?: number;
  statusText?: string;
  text?: string;
}) {
  global.fetch = vi.fn().mockImplementation(() =>
    Promise.resolve({
      ok,
      status,
      statusText,
      json: () => Promise.resolve(response),
      headers: new Headers(),
      redirected: false,
      type: "basic",
      url: "",
      clone: () => ({} as Response),
      body: null,
      bodyUsed: false,
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      blob: () => Promise.resolve(new Blob()),
      formData: () => Promise.resolve(new FormData()),
      text: () =>
        Promise.resolve(text ?? (typeof response === "string" ? response : "")),
    } as Response)
  );
}
