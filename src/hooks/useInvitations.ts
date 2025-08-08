/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWR from "swr";
import { fetcher } from "../api/fetcher";
import type { ClickHouseConfig } from "../api/fetcher";

export function useInvitations(
  organizationId: string,
  config: ClickHouseConfig
) {
  const { data, error, isLoading } = useSWR(
    [`/v1/organizations/${organizationId}/invitations`, config],
    ([url, cfg]: [string, ClickHouseConfig]) => fetcher(url, cfg)
  );
  return { data, error, isLoading };
}

export function useCreateInvitation(
  organizationId: string,
  config: ClickHouseConfig
) {
  const createInvitation = async (invitationData: any) => {
    const {
      keyId,
      keySecret,
      baseUrl = "https://api.clickhouse.cloud",
    } = config;
    const auth = btoa(`${keyId}:${keySecret}`);
    const response = await fetch(
      `${baseUrl}/v1/organizations/${organizationId}/invitations`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invitationData),
      }
    );
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  };
  return { createInvitation };
}

export function useInvitation(
  organizationId: string,
  invitationId: string,
  config: ClickHouseConfig
) {
  const { data, error, isLoading } = useSWR(
    [`/v1/organizations/${organizationId}/invitations/${invitationId}`, config],
    ([url, cfg]: [string, ClickHouseConfig]) => fetcher(url, cfg)
  );
  return { data, error, isLoading };
}

export function useDeleteInvitation(
  organizationId: string,
  invitationId: string,
  config: ClickHouseConfig
) {
  const deleteInvitation = async () => {
    const {
      keyId,
      keySecret,
      baseUrl = "https://api.clickhouse.cloud",
    } = config;
    const auth = btoa(`${keyId}:${keySecret}`);
    const response = await fetch(
      `${baseUrl}/v1/organizations/${organizationId}/invitations/${invitationId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  };
  return { deleteInvitation };
}
