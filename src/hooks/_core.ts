import type { ClickHouseConfig } from "../api/fetcher";

export const swrKey = (url: string, cfg: ClickHouseConfig) =>
  `${url}:${cfg.baseUrl}:${cfg.keyId}`;

export async function authedJson<T>(
  cfg: ClickHouseConfig,
  url: string,
  init?: RequestInit,
  asText = false
): Promise<T> {
  const { keyId, keySecret, baseUrl = "https://api.clickhouse.cloud" } = cfg;
  const auth = btoa(`${keyId}:${keySecret}`);
  const res = await fetch(`${baseUrl}${url}`, {
    ...init,
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return (asText ? (res.text() as unknown as T) : res.json()) as Promise<T>;
}

