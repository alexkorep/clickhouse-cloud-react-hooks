export type ClickHouseConfig = {
  keyId: string;
  keySecret: string;
  baseUrl?: string;
};

const DEFAULT_BASE_URL = "https://api.clickhouse.cloud";

export async function fetcher(url: string, config: ClickHouseConfig) {
  const { keyId, keySecret, baseUrl = DEFAULT_BASE_URL } = config;
  const auth = btoa(`${keyId}:${keySecret}`);
  const fullUrl = `${baseUrl}${url}`;
  const res = await fetch(fullUrl, {
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
