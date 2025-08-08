import useSWR from "swr";
import { z } from "zod";
import { fetcher } from "../api/fetcher";
import type { ClickHouseConfig } from "../api/fetcher";

export function useClickHouseSWR<T extends { result: unknown }>(
  url: string,
  config: ClickHouseConfig,
  schema: z.ZodSchema<T>
) {
  const key = `${url}:${config.baseUrl}:${config.keyId}`;
  const { data, error, isLoading, isValidating, mutate } = useSWR(key, () =>
    fetcher<T>(url, config, schema)
  );
  return {
    data: data?.result,
    error,
    isLoading,
    isValidating,
    response: data,
    mutate,
  };
}

