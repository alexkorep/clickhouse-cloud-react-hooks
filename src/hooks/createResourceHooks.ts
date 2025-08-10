import useSWR, { mutate } from "swr";
import { z } from "zod";
import { swrKey, authedJson } from "./_core";
import type { ClickHouseConfig } from "../api/fetcher";

type PathFn<C> = (ctx: C) => string;

type ListSpec<TList> = {
  path: PathFn<any>;
  schema: z.ZodSchema<TList>;
};

type ItemSpec<TItem> = {
  path: PathFn<any>;
  schema: z.ZodSchema<TItem>;
};

type ActionSpec<TResp> = {
  method: "POST" | "PATCH" | "DELETE" | "PUT";
  path: PathFn<any>;
  schema?: z.ZodSchema<TResp>;
  asText?: boolean;
};

type ResourceSpec<
  TList,
  TItem,
  TCreate = TItem,
  TUpdate = TItem,
  TActions extends Record<string, ActionSpec<any>> = Record<string, ActionSpec<any>>
> = {
  list: ListSpec<TList>;
  item: ItemSpec<TItem>;
  create?: ActionSpec<TCreate>;
  update?: ActionSpec<TUpdate>;
  remove?: ActionSpec<any>;
  actions?: TActions;
  invalidate?: (ctx: any) => string[];
};

export function createResourceHooks<
  TList extends { result: any },
  TItem extends { result: any },
  Ctx,
  TCreate = TItem,
  TUpdate = TItem,
  TActions extends Record<string, ActionSpec<any>> = Record<string, ActionSpec<any>>
>(spec: ResourceSpec<TList, TItem, TCreate, TUpdate, TActions>) {
  function useList(ctx: Ctx, cfg: ClickHouseConfig) {
    const url = spec.list.path(ctx);
    const { data, error, isLoading, isValidating, mutate } = useSWR(
      swrKey(url, cfg),
      () => authedJson<TList>(cfg, url).then(spec.list.schema.parse)
    );
    return { data: data?.result, response: data, error, isLoading, isValidating, mutate };
  }

  function useOne(ctx: Ctx, cfg: ClickHouseConfig) {
    const url = spec.item.path(ctx);
    const { data, error, isLoading, isValidating, mutate } = useSWR(
      swrKey(url, cfg),
      () => authedJson<TItem>(cfg, url).then(spec.item.schema.parse)
    );
    return { data: data?.result, response: data, error, isLoading, isValidating, mutate };
  }

  function makeMutation<TResp>(action: ActionSpec<TResp> | undefined) {
    return (ctx: Ctx, cfg: ClickHouseConfig) => {
      if (!action) return undefined as any;
      return async (body?: unknown) => {
        const url = action.path(ctx);
        const resp = await authedJson<any>(
          cfg,
          url,
          { method: action.method, body: body ? JSON.stringify(body) : undefined },
          action.asText
        );
        const parsed = action.schema ? action.schema.parse(resp) : resp;
        const keys = spec.invalidate
          ? spec.invalidate(ctx)
          : [spec.list.path(ctx), spec.item.path(ctx)];
        await Promise.all(keys.map((k) => mutate(swrKey(k, cfg))));
        return parsed?.result ?? parsed;
      };
    };
  }

  const useCreate = makeMutation<TCreate>(spec.create);
  const useUpdate = makeMutation<TUpdate>(spec.update);
  const useDelete = makeMutation(spec.remove);

  function useActions(ctx: Ctx, cfg: ClickHouseConfig) {
    const result: Record<string, any> = {};
    for (const [name, act] of Object.entries(spec.actions ?? {})) {
      result[name] = makeMutation(act as ActionSpec<any>)(ctx, cfg);
    }
    return result as {
      [K in keyof TActions]: ReturnType<ReturnType<typeof makeMutation>>;
    };
  }

  return { useList, useOne, useCreate, useUpdate, useDelete, useActions };
}

