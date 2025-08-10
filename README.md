# ClickHouse Cloud React Hooks

A collection of reusable React hooks for the ClickHouse Cloud API: [https://clickhouse.com/docs/cloud/manage/api/api-overview](https://clickhouse.com/docs/cloud/manage/api/api-overview)

- **Type-safe** responses (validated with Zod; schemas exported)
- **SWR**-powered caching & revalidation
- **Tiny config surface** (`keyId`, `keySecret`, optional `baseUrl`)
- **Unified API** for list/read/mutate across resources

## Installation

```bash
npm install clickhouse-cloud-react-hooks
# or
yarn add clickhouse-cloud-react-hooks
```

### Requirements

- React 18+
- Works with any bundler (Vite, CRA, Next.js, etc.)

> **Note (Vite):** environment vars must be prefixed with `VITE_...` (e.g. `VITE_CLICKHOUSE_KEY_ID`). In CRA they’re usually `REACT_APP_...`.

---

## Quick start

```tsx
import {
  useOrganizations,
  type ClickHouseConfig,
  type Organization,
} from "clickhouse-cloud-react-hooks";

export function OrganizationsList() {
  const config: ClickHouseConfig = {
    keyId: import.meta.env.VITE_CLICKHOUSE_KEY_ID!,
    keySecret: import.meta.env.VITE_CLICKHOUSE_KEY_SECRET!,
    // baseUrl: "https://api.clickhouse.cloud", // default
  };

  const { data, error, isLoading } = useOrganizations(config);

  if (isLoading) return <div>Loading…</div>;
  if (error)
    return <div>Failed: {String((error as Error).message || error)}</div>;

  return (
    <ul>
      {data?.map((org: Organization) => (
        <li key={org.id}>
          {org.name} — created {new Date(org.createdAt).toLocaleDateString()}
        </li>
      ))}
    </ul>
  );
}
```

### Common pattern for mutations

All mutation hooks return a callable you can `await`:

```tsx
import { useUpdateOrganization } from "clickhouse-cloud-react-hooks";

function RenameOrg({ organizationId }: { organizationId: string }) {
  const config = { keyId: "...", keySecret: "..." };
  const { updateOrganization } = useUpdateOrganization(organizationId, config);

  async function onRename() {
    try {
      const updated = await updateOrganization({ name: "New name" });
      console.log("Updated:", updated);
    } catch (err) {
      // Most mutations throw a regular Error with server text
      alert((err as Error).message);
    }
  }

  return <button onClick={onRename}>Rename</button>;
}
```

---

## Endpoint coverage (✅ implemented)

### Organizations & org-level data

- ✅ `GET /v1/organizations` — `useOrganizations`
- ✅ `GET /v1/organizations/{organizationId}` — `useOrganization`
- ✅ `PATCH /v1/organizations/{organizationId}` — `useUpdateOrganization`
- ✅ `GET /v1/organizations/{organizationId}/privateEndpointConfig` — `useOrganizationPrivateEndpointConfig`
- ✅ `GET /v1/organizations/{organizationId}/usageCost` — `useOrganizationUsageCost`

### Organization activities

- ✅ `GET /v1/organizations/{organizationId}/activities` — `useOrganizationActivities`
- ✅ `GET /v1/organizations/{organizationId}/activities/{activityId}` — `useOrganizationActivity`

### Prometheus (text responses)

- ✅ `GET /v1/organizations/{organizationId}/prometheus` — `useOrganizationPrometheusMetrics`
- ✅ `GET /v1/organizations/{organizationId}/services/{serviceId}/prometheus` — `useServicePrometheusMetrics`

### Services

- ✅ `GET /v1/organizations/{organizationId}/services` — `useServices`
- ✅ `POST /v1/organizations/{organizationId}/services` — `useCreateService`
- ✅ `GET /v1/organizations/{organizationId}/services/{serviceId}` — `useService`
- ✅ `PATCH /v1/organizations/{organizationId}/services/{serviceId}` — `useUpdateService`
- ✅ `DELETE /v1/organizations/{organizationId}/services/{serviceId}` — `useDeleteService`
- ✅ `GET /v1/organizations/{organizationId}/services/{serviceId}/privateEndpointConfig` — `useServicePrivateEndpointConfig`
- ✅ `GET|POST|DELETE /serviceQueryEndpoint` — `useServiceQueryEndpoint` (query + create + delete in one hook)
- ✅ `PATCH /services/{serviceId}/state` — `useServiceState`
- ✅ `PATCH /services/{serviceId}/scaling` — `useServiceScaling` (total memory / idle scaling)
- ✅ `PATCH /services/{serviceId}/replicaScaling` — `useServiceReplicaScaling` (per-replica memory / idle scaling)
- ✅ `PATCH /services/{serviceId}/password` — `useServicePassword`
- ✅ `POST /services/{serviceId}/privateEndpoint` — `useCreateServicePrivateEndpoint`

### Backups

- ✅ `GET /services/{serviceId}/backups` — `useServiceBackups`
- ✅ `GET /services/{serviceId}/backups/{backupId}` — `useServiceBackup`
- ✅ `DELETE /services/{serviceId}/backups/{backupId}` — `useDeleteServiceBackup`
- ✅ `GET /services/{serviceId}/backupConfiguration` — `useServiceBackupConfiguration`
- ✅ `PATCH /services/{serviceId}/backupConfiguration` — `useUpdateServiceBackupConfiguration`

### API Keys

- ✅ `GET /v1/organizations/{organizationId}/keys` — `useApiKeys`
- ✅ `POST /v1/organizations/{organizationId}/keys` — `useCreateApiKey`
- ✅ `GET /v1/organizations/{organizationId}/keys/{keyId}` — `useApiKey`
- ✅ `PATCH /v1/organizations/{organizationId}/keys/{keyId}` — `useUpdateApiKey`
- ✅ `DELETE /v1/organizations/{organizationId}/keys/{keyId}` — `useDeleteApiKey`

### Invitations (org)

- ✅ `GET /v1/organizations/{organizationId}/invitations` — `useInvitations` / `useOrganizationInvitations`
- ✅ `POST /v1/organizations/{organizationId}/invitations` — `useCreateInvitation` / `useCreateOrganizationInvitation`
- ✅ `GET /v1/organizations/{organizationId}/invitations/{invitationId}` — `useInvitation` / `useOrganizationInvitation`
- ✅ `DELETE /v1/organizations/{organizationId}/invitations/{invitationId}` — `useDeleteInvitation` / `useDeleteOrganizationInvitation`

### User management (members)

- ✅ `GET /v1/organizations/{organizationId}/members` — `useOrganizationMembers`
- ✅ `GET /v1/organizations/{organizationId}/members/{userId}` — `useOrganizationMember`
- ✅ `PATCH /v1/organizations/{organizationId}/members/{userId}` — `useUpdateOrganizationMember`
- ✅ `DELETE /v1/organizations/{organizationId}/members/{userId}` — `useDeleteOrganizationMember`

### ClickPipes

- ✅ `GET /services/{serviceId}/clickpipes` — `useClickpipes`
- ✅ `POST /services/{serviceId}/clickpipes` — `useCreateClickpipe`
- ✅ `GET /services/{serviceId}/clickpipes/{clickPipeId}` — `useClickpipe`
- ✅ `PATCH /services/{serviceId}/clickpipes/{clickPipeId}` — `useUpdateClickpipe`
- ✅ `DELETE /services/{serviceId}/clickpipes/{clickPipeId}` — `useDeleteClickpipe`
- ✅ `PATCH /clickpipes/{clickPipeId}/scaling` — `useClickpipeScaling`
- ✅ `PATCH /clickpipes/{clickPipeId}/state` — `useClickpipeState`

### ClickPipes Reverse Private Endpoints

- ✅ `GET /clickpipesReversePrivateEndpoints` — `useClickpipesReversePrivateEndpoints`
- ✅ `POST /clickpipesReversePrivateEndpoints` — `useCreateClickpipesReversePrivateEndpoint`
- ✅ `GET /clickpipesReversePrivateEndpoints/{endpointId}` — `useClickpipesReversePrivateEndpoint`
- ✅ `DELETE /clickpipesReversePrivateEndpoints/{endpointId}` — `useDeleteClickpipesReversePrivateEndpoint`

---

## Available hooks (by module)

### Organizations

- `useOrganizations(config)`
- `useOrganization(organizationId, config)`
- `useUpdateOrganization(organizationId, config)`
- `useOrganizationActivities(organizationId, config, { fromDate?, toDate? })`
- `useOrganizationActivity(organizationId, activityId, config)`
- `useOrganizationUsageCost(organizationId, config, { startDate?, endDate? })`
- `useOrganizationPrivateEndpointConfig(organizationId, config, { cloudProvider?, region? })`

### Services

- `useServices(organizationId, config)`
- `useService(organizationId, serviceId, config)`
- `useCreateService(organizationId, config)` → `{ createService(body) }`
- `useUpdateService(organizationId, serviceId, config)` → `{ updateService(body) }`
- `useDeleteService(organizationId, serviceId, config)` → `{ deleteService() }`
- `useServiceState(organizationId, serviceId, config)` → `{ updateServiceState(body) }`
- `useServiceScaling(organizationId, serviceId, config)` → `{ updateServiceScaling(body) }`
- `useServiceReplicaScaling(organizationId, serviceId, config)` → `{ updateServiceScaling(body) }`
- `useServicePassword(organizationId, serviceId, config)` → `{ updateServicePassword({ newPassword }) }`
- `useServicePrivateEndpointConfig(organizationId, serviceId, config)`
- `useServiceQueryEndpoint(organizationId, serviceId, config)` → `{ data, createQueryEndpoint(body), deleteQueryEndpoint() }`
- `useServicePrometheus(organizationId, serviceId, config, { filteredMetrics? })`

### Backups

- `useServiceBackups(organizationId, serviceId, config)`
- `useServiceBackup(organizationId, serviceId, backupId, config)`
- `useServiceBackupConfiguration(organizationId, serviceId, config)`
- `useUpdateServiceBackupConfiguration(organizationId, serviceId, config)` → `{ updateBackupConfiguration(body) }`
- `useDeleteServiceBackup(organizationId, serviceId, backupId, config)` → `{ deleteBackup() }`

### API Keys

- `useApiKeys(organizationId, config)`
- `useApiKey(organizationId, keyId, config)`
- `useCreateApiKey(organizationId, config)` → `{ createApiKey(body) }`
- `useUpdateApiKey(organizationId, keyId, config)` → `{ updateApiKey(body) }`
- `useDeleteApiKey(organizationId, keyId, config)` → `{ deleteApiKey() }`

### Invitations (org)

- `useInvitations(organizationId, config)` / `useOrganizationInvitations(...)`
- `useInvitation(organizationId, invitationId, config)` / `useOrganizationInvitation(...)`
- `useCreateInvitation(organizationId, config)` / `useCreateOrganizationInvitation(...)`
- `useDeleteInvitation(organizationId, invitationId, config)` / `useDeleteOrganizationInvitation(...)`

### User management (members)

- `useOrganizationMembers(organizationId, config)`
- `useOrganizationMember(organizationId, userId, config)`
- `useUpdateOrganizationMember(organizationId, userId, config)` → `{ updateMember(body) }`
- `useDeleteOrganizationMember(organizationId, userId, config)` → `{ deleteMember() }`

### ClickPipes

- `useClickpipes(organizationId, serviceId, config)`
- `useClickpipe(organizationId, serviceId, clickPipeId, config)`
- `useCreateClickpipe(organizationId, serviceId, config)` → `{ createClickpipe(body) }`
- `useUpdateClickpipe(organizationId, serviceId, clickPipeId, config)` → `{ updateClickpipe(body) }`
- `useDeleteClickpipe(organizationId, serviceId, clickPipeId, config)` → `{ deleteClickpipe() }`
- `useClickpipeScaling(organizationId, serviceId, clickPipeId, config)` → `{ updateClickpipeScaling(body) }`
- `useClickpipeState(organizationId, serviceId, clickPipeId, config)` → `{ updateClickpipeState(body) }`

### ClickPipes Reverse Private Endpoints

- `useClickpipesReversePrivateEndpoints(organizationId, serviceId, config)`
- `useClickpipesReversePrivateEndpoint(organizationId, serviceId, endpointId, config)`
- `useCreateClickpipesReversePrivateEndpoint(organizationId, serviceId, config)` → `{ createReversePrivateEndpoint(body) }`
- `useDeleteClickpipesReversePrivateEndpoint(organizationId, serviceId, endpointId, config)` → `{ deleteReversePrivateEndpoint() }`

### Prometheus (text)

- `useOrganizationPrometheusMetrics(organizationId, config, filteredMetrics?)`
- `useServicePrometheusMetrics(organizationId, serviceId, config, filteredMetrics?)`

---

## Error handling & validation

- **Validation**: When a Zod schema is wired for an endpoint, responses are parsed:

  - If validation **succeeds**, `data` is `response.result` (typed).
  - If validation **fails**, the hook **logs a warning** and returns the unvalidated data (fallback).

- **Errors**:

  - Most hooks use an internal fetcher (`authedJson`) and will throw a **plain `Error`** with the server’s message on non-2xx.
  - The lower-level `useClickHouseSWR` wrapper (exported) uses a different fetcher that may throw a `ClickHouseAPIError` when the server returns a structured error.

- **SWR**:

  - All hooks return `{ data, error, isLoading, isValidating, mutate }` (when applicable).
  - Mutations trigger **cache invalidation** for relevant keys automatically.

---

## Extra: Prometheus example (text endpoint)

```tsx
import { useServicePrometheusMetrics } from "clickhouse-cloud-react-hooks";

function Prom({ orgId, serviceId }: { orgId: string; serviceId: string }) {
  const cfg = { keyId: "...", keySecret: "..." };
  const { data, error, isLoading } = useServicePrometheusMetrics(
    orgId,
    serviceId,
    cfg,
    true // filteredMetrics
  );

  if (isLoading) return <pre>Loading…</pre>;
  if (error) return <pre>Error: {(error as Error).message}</pre>;

  return <pre>{data}</pre>; // plain text exposition format
}
```

---

## Types & schemas

Everything in `src/schemas/schemas.ts` is exported, including:

- **Entity types** (e.g., `Organization`, `Service`, `ClickPipe`, `Backup`, …)
- **Response types** (e.g., `OrganizationResponse`, `ServicesResponse`, …)
- **Request types** for mutations (e.g., `InvitationPostRequest`, `MemberPatchRequest`, …)
- **Schemas** themselves (Zod objects) if you need them downstream

---

## Development

```bash
# Install deps
yarn

# Run tests (Vitest)
yarn test
```

The library lives under `src/` and has comprehensive tests in `src/hooks/tests/`.
If you add a new endpoint, prefer using the internal meta-factory (`createResourceHooks`) for consistency and automatic invalidation.

### Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Add tests
4. Ensure all tests pass (`yarn test`)
5. Submit a pull request

## License

This project is licensed under the MIT License.
