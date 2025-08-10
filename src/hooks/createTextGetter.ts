import useSWR from "swr";
import type { ClickHouseConfig } from "../api/fetcher";
import { swrKey, authedJson } from "./_core";

export function createTextGetter<Ctx>(path: (ctx: Ctx) => string) {
  return function useText(ctx: Ctx, cfg: ClickHouseConfig) {
    const url = path(ctx);
    const { data, error, isLoading } = useSWR(swrKey(url, cfg), () =>
      authedJson<string>(cfg, url, undefined, true)
    );
    return { data, error, isLoading };
  };
}

