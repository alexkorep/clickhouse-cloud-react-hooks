import { z } from "zod";
import { ClickHouseErrorResponseSchema } from "../schemas/schemas";

export type ClickHouseConfig = {
  keyId: string;
  keySecret: string;
  baseUrl?: string;
};

const DEFAULT_BASE_URL = "https://api.clickhouse.cloud";

export class ClickHouseAPIError extends Error {
  public status: number;
  public error: string;
  public requestId?: string;

  constructor(status: number, error: string, requestId?: string) {
    super(`ClickHouse API Error (${status}): ${error}`);
    this.name = "ClickHouseAPIError";
    this.status = status;
    this.error = error;
    this.requestId = requestId;
  }
}

export async function fetcher<T>(
  url: string,
  config: ClickHouseConfig,
  schema?: z.ZodSchema<T>,
  responseType: "json" | "text" = "json"
): Promise<T> {
  const { keyId, keySecret, baseUrl = DEFAULT_BASE_URL } = config;
  const auth = btoa(`${keyId}:${keySecret}`);
  const fullUrl = `${baseUrl}${url}`;

  const res = await fetch(fullUrl, {
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
  });

  const responseData =
    responseType === "text" ? await res.text() : await res.json();

  if (!res.ok) {
    if (responseType === "text") {
      try {
        const errorResponse = ClickHouseErrorResponseSchema.parse(
          JSON.parse(responseData as string)
        );
        throw new ClickHouseAPIError(errorResponse.status, errorResponse.error);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (parseError) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
    } else {
      try {
        const errorResponse = ClickHouseErrorResponseSchema.parse(
          responseData
        );
        throw new ClickHouseAPIError(errorResponse.status, errorResponse.error);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (parseError) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
    }
  }

  // If schema is provided, validate the response
  if (schema) {
    try {
      return schema.parse(responseData);
    } catch (validationError) {
      console.warn(
        "ClickHouse API response validation failed:",
        validationError
      );
      console.warn("Response data:", responseData);
      // Return unvalidated data as fallback, but log the issue
      return responseData as T;
    }
  }

  return responseData as T;
}
