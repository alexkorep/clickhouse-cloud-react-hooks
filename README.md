# ClickHouse Cloud React Hooks

A collection of reusable React hooks to interact with the ClickHouse Cloud API: https://clickhouse.com/docs/cloud/manage/api/api-overview

## Features

The project is under active development and aims to cover the following features. Each feature lists the hook that implements it (if available). Missing endpoints from the OpenAPI spec are listed below with their URLs for completeness:

### Organization

- [x] List all organizations (`useOrganizations`)
- [x] Fetch organization details (`useOrganization`)
  - [ ] Private Endpoints (`useOrganizationPrivateEndpointConfig`)
    - `/v1/organizations/{organizationId}/privateEndpointConfig`
  - [ ] BYOC Config
    - `/v1/organizations/{organizationId}/byocConfig`
  - [ ] Organization Cloud Region Private Endpoint Config
    - `/v1/organizations/{organizationId}/privateEndpointConfig`
  - [ ] Patch Organization Private Endpoint
    - `/v1/organizations/{organizationId}/privateEndpointConfig` (PATCH)
  - [ ] Organization Private Endpoints Patch
    - `/v1/organizations/{organizationId}/privateEndpointConfig` (PATCH)
- [x] Update organization details (`useUpdateOrganization`)
- [ ] List organization activities (`useOrganizationActivities`)
- [ ] Fetch single activity (`useOrganizationActivity`)
- [ ] Fetch usage costs (`useOrganizationUsageCost`)
- [ ] Fetch private endpoint config (`useOrganizationPrivateEndpointConfig`)
- [ ] List organization members (`useOrganizationMembers`)
- [ ] Fetch member details (`useOrganizationMember`)
- [ ] Update member role (`useUpdateOrganizationMember`)
- [ ] Remove member (`useDeleteOrganizationMember`)

### Services

- [ ] List all services in organization (`useServices`)
- [ ] Create new service (`useCreateService`)
- [ ] Fetch service details (`useService`)
- [ ] Update service details (`useUpdateService`)
- [ ] Delete service (`useDeleteService`)
- [ ] Get private endpoint configuration (`useServicePrivateEndpointConfig`)
- [ ] Create private endpoint (`useCreateServicePrivateEndpoint`)
  - [ ] Manage service query endpoints (`useServiceQueryEndpoint`)
    - `/v1/organizations/{organizationId}/services/{serviceId}/serviceQueryEndpoint` (GET, POST, DELETE)
  - [ ] Service Endpoint Change
    - `/v1/organizations/{organizationId}/services/{serviceId}/serviceEndpointChange`
  - [ ] Instance Private Endpoints Patch
    - `/v1/organizations/{organizationId}/services/{serviceId}/privateEndpointConfig` (PATCH)
  - [ ] Instance Private Endpoint
    - `/v1/organizations/{organizationId}/services/{serviceId}/privateEndpointConfig` (GET)
- [ ] Update service state (start/stop) (`useServiceState`)
- [ ] Update service scaling settings (`useServiceScaling`, `useServiceReplicaScaling`)
- [ ] Update service password (`useServicePassword`)
- [ ] Get service metrics (`useServicePrometheus`)

### Backups

- [ ] List all backups for a service (`useServiceBackups`)
- [ ] Fetch backup details (`useServiceBackup`)
- [ ] Delete backup (`useDeleteServiceBackup`)
- [ ] Get backup configuration (`useServiceBackupConfiguration`)
- [ ] Update backup configuration (`useUpdateServiceBackupConfiguration`)
- [ ] Manage backup buckets (AWS/GCP/Azure)
  - `/v1/organizations/{organizationId}/services/{serviceId}/backupBucket` (GET, POST, PATCH)
  - `/v1/organizations/{organizationId}/services/{serviceId}/backupBucket/aws` (GET, POST, PATCH)
  - `/v1/organizations/{organizationId}/services/{serviceId}/backupBucket/gcp` (GET, POST, PATCH)
  - `/v1/organizations/{organizationId}/services/{serviceId}/backupBucket/azure` (GET, POST, PATCH)

### API Keys

- [ ] List all API keys (`useApiKeys`)
- [ ] Create API key (`useCreateApiKey`)
- [ ] Fetch API key details (`useApiKey`)
- [ ] Update API key (`useUpdateApiKey`)
- [ ] Delete API key (`useDeleteApiKey`)

### User Management

- [ ] List organization members (`useOrganizationMembers`)
- [ ] Fetch member details (`useOrganizationMember`)
- [ ] Update member role (`useUpdateOrganizationMember`)
- [ ] Remove member (`useDeleteOrganizationMember`)

### Invitations

- [ ] List invitations (`useInvitations`)
- [ ] Create invitation (`useCreateInvitation`)
- [ ] Fetch invitation details (`useInvitation`)
- [ ] Delete invitation (`useDeleteInvitation`)

### ClickPipes

- [ ] List ClickPipes (`useClickpipes`)
- [ ] Create ClickPipe (`useCreateClickpipe`)
- [ ] Fetch ClickPipe details (`useClickpipe`)
- [ ] Update ClickPipe (`useUpdateClickpipe`)
- [ ] Delete ClickPipe (`useDeleteClickpipe`)
- [ ] Update ClickPipe scaling (`useClickpipeScaling`)
- [ ] Update ClickPipe state (`useClickpipeState`)
- [ ] Manage reverse private endpoints for ClickPipes
  - `/v1/organizations/{organizationId}/services/{serviceId}/clickpipesReversePrivateEndpoints` (GET, POST)
  - `/v1/organizations/{organizationId}/services/{serviceId}/clickpipesReversePrivateEndpoints/{reversePrivateEndpointId}` (GET, DELETE)

### Prometheus Metrics

- [ ] Fetch organization metrics (`useOrganizationPrometheusMetrics`)
- [ ] Fetch service metrics (`useServicePrometheusMetrics`)

### Miscellaneous

- [ ] Organization Activity by ID
  - `/v1/organizations/{organizationId}/activities/{activityId}` (GET)
- [ ] Usage Cost Metrics/Records
  - `/v1/organizations/{organizationId}/usageCost` (GET)

## Installation

```bash
npm install clickhouse-cloud-react-hooks
```

or

```bash
yarn add clickhouse-cloud-react-hooks
```

## Usage

### Basic Example

```tsx
import {
  useOrganizations,
  type ClickHouseConfig,
  type Organization,
  ClickHouseAPIError,
} from "clickhouse-cloud-react-hooks";

const OrganizationsList = () => {
  const config: ClickHouseConfig = {
    keyId: process.env.REACT_APP_CLICKHOUSE_KEY_ID!,
    keySecret: process.env.REACT_APP_CLICKHOUSE_KEY_SECRET!,
  };

  const { data: organizations, error, isLoading } = useOrganizations(config);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    if (error instanceof ClickHouseAPIError) {
      return (
        <div>
          ClickHouse API Error: {error.error} (Status: {error.status})
        </div>
      );
    }
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Organizations</h1>
      <ul>
        {organizations?.map((org: Organization) => (
          <li key={org.id}>
            <h3>{org.name}</h3>
            <p>Created: {new Date(org.createdAt).toLocaleDateString()}</p>
            <p>ID: {org.id}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrganizationsList;
```

### Advanced Usage with Activities

```tsx
import {
  useOrganizationActivities,
  type Activity,
  type ClickHouseConfig,
} from "clickhouse-cloud-react-hooks";

const ActivityLog = ({ organizationId }: { organizationId: string }) => {
  const config: ClickHouseConfig = {
    keyId: process.env.REACT_APP_CLICKHOUSE_KEY_ID!,
    keySecret: process.env.REACT_APP_CLICKHOUSE_KEY_SECRET!,
  };

  const {
    data: activities,
    error,
    isLoading,
  } = useOrganizationActivities(organizationId, config);

  if (isLoading) return <div>Loading activities...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Recent Activities</h2>
      <ul>
        {activities?.map((activity: Activity) => (
          <li key={activity.id}>
            <strong>{activity.type}</strong> - {activity.actorType}
            <small>
              {" "}
              ({new Date(activity.createdAt).toLocaleDateString()})
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
};
```

## Available Hooks

### Organizations

- `useOrganizations(config)` - Fetch all organizations
- `useOrganization(organizationId, config)` - Fetch single organization
- `useUpdateOrganization(organizationId, config)` - Update organization
- `useOrganizationActivities(organizationId, config)` - Fetch organization activities
- `useOrganizationActivity(organizationId, activityId, config)` - Fetch single activity
- `useOrganizationUsageCost(organizationId, config, params?)` - Fetch usage costs
- `useOrganizationPrivateEndpointConfig(organizationId, config, params?)` - Fetch private endpoint config

### Services

- `useServices(organizationId, config)` - Manage services
- (Additional service hooks to be documented)

### API Keys

- `useApiKeys(organizationId, config)` - Manage API keys
- (Additional API key hooks to be documented)

### Backups

- `useBackups(organizationId, serviceId, config)` - Manage backups
- (Additional backup hooks to be documented)

### ClickPipes

- `useClickpipes(organizationId, serviceId, config)` - Manage ClickPipes
- (Additional ClickPipe hooks to be documented)

### User Management

- `useUserManagement(organizationId, config)` - Manage users and roles
- (Additional user management hooks to be documented)

## Configuration

### ClickHouse Config

```typescript
type ClickHouseConfig = {
  keyId: string; // Your ClickHouse API Key ID
  keySecret: string; // Your ClickHouse API Key Secret
  baseUrl?: string; // Optional: Custom API base URL (defaults to https://api.clickhouse.cloud)
};
```

## Development

To run the example application:

```bash
# Install dependencies
yarn

# Navigate to the example directory
cd example

# Install example dependencies
yarn

# Start the development server
yarn dev
```

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all existing tests pass
5. Submit a pull request

## License

This project is licensed under the MIT License.
