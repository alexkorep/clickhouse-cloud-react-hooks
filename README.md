# ClickHouse Cloud React Hooks

A collection of reusable React hooks to interact with the ClickHouse Cloud API: https://clickhouse.com/docs/cloud/manage/api/api-overview

## Roadmap

The project is under active development and aims to cover the following ClickHouse Cloud API endpoints.

- [ ] `GET /v1/organizations` — `useOrganizations`  
      _Returns a list with a single organization associated with the API key in the request._
- [ ] `GET /v1/organizations/{organizationId}` — `useOrganization`  
      _Returns details of a single organization. In order to get the details, the auth key must belong to the organization._
- [ ] `PATCH /v1/organizations/{organizationId}` — `useUpdateOrganization`  
      _Updates organization fields. Requires ADMIN auth key role._
- [ ] `GET /v1/organizations/{organizationId}/prometheus` — `usePrometheusMetrics`  
      _Returns prometheus metrics for all services in an organization._
- [ ] `GET /v1/organizations/{organizationId}/services` — `useServices`  
      _Returns a list of all services in the organization._
- [ ] `POST /v1/organizations/{organizationId}/services` — `useCreateService`  
      _Creates a new service in the organization, and returns the current service state and a password to access the service. The service is started asynchronously._
- [ ] `GET /v1/organizations/{organizationId}/services/{serviceId}` — `useService`  
      _Returns a service that belongs to the organization._
- [ ] `PATCH /v1/organizations/{organizationId}/services/{serviceId}` — `useUpdateService`  
      _Updates basic service details like service name or IP access list._
- [ ] `DELETE /v1/organizations/{organizationId}/services/{serviceId}` — `useDeleteService`  
      _Deletes the service. The service must be in stopped state and is deleted asynchronously after this method call._
- [ ] `GET /v1/organizations/{organizationId}/services/{serviceId}/privateEndpointConfig` — (no hook)  
      _Information required to set up a private endpoint._
- [ ] `GET /v1/organizations/{organizationId}/services/{serviceId}/serviceQueryEndpoint` — (no hook)  
      _Get the service query endpoint for a given instance. Experimental feature._
- [ ] `DELETE /v1/organizations/{organizationId}/services/{serviceId}/serviceQueryEndpoint` — (no hook)  
      _Delete the service query endpoint for a given instance. Experimental feature._
- [ ] `POST /v1/organizations/{organizationId}/services/{serviceId}/serviceQueryEndpoint` — (no hook)  
      _Upsert the service query endpoint for a given instance. Experimental feature._
- [ ] `PATCH /v1/organizations/{organizationId}/services/{serviceId}/state` — `useUpdateServiceState`  
      _Starts or stops service._
- [ ] `PATCH /v1/organizations/{organizationId}/services/{serviceId}/scaling` — `useUpdateServiceTier`  
      _Updates minimum and maximum total memory limits and idle mode scaling behavior for the service. Deprecated._
- [ ] `PATCH /v1/organizations/{organizationId}/services/{serviceId}/replicaScaling` — (no hook)  
      _Updates minimum and maximum memory limits per replica and idle mode scaling behavior for the service._
- [ ] `PATCH /v1/organizations/{organizationId}/services/{serviceId}/password` — `useResetServicePassword`  
      _Sets a new password for the service._
- [ ] `POST /v1/organizations/{organizationId}/services/{serviceId}/privateEndpoint` — (no hook)  
      _Create a new private endpoint. The private endpoint will be associated with this service and organization._
- [ ] `GET /v1/organizations/{organizationId}/services/{serviceId}/prometheus` — `useServicePrometheusMetrics`  
      _Returns prometheus metrics for a service._
- [ ] `GET /v1/organizations/{organizationId}/services/{serviceId}/backups` — `useBackups`  
      _Returns a list of all backups for the service. The most recent backups comes first in the list._
- [ ] `GET /v1/organizations/{organizationId}/services/{serviceId}/backups/{backupId}` — `useBackup`  
      _Returns a single backup info._
- [ ] `DELETE /v1/organizations/{organizationId}/services/{serviceId}/backups/{backupId}` — `useDeleteBackup`  
      _Deletes a backup._
- [ ] `GET /v1/organizations/{organizationId}/services/{serviceId}/backupConfiguration` — `useBackupConfiguration`  
      _Returns the service backup configuration._
- [ ] `PATCH /v1/organizations/{organizationId}/services/{serviceId}/backupConfiguration` — `useUpdateBackupConfiguration`  
      _Updates service backup configuration. Requires ADMIN auth key role. Setting the properties with null value will reset the properties to their default values._
- [ ] `GET /v1/organizations/{organizationId}/keys` — `useApiKeys`  
      _Returns a list of all keys in the organization._
- [ ] `POST /v1/organizations/{organizationId}/keys` — `useCreateApiKey`  
      _Creates new API key._
- [ ] `GET /v1/organizations/{organizationId}/keys/{keyId}` — `useApiKey`  
      _Returns a single key details._
- [ ] `PATCH /v1/organizations/{organizationId}/keys/{keyId}` — `useUpdateApiKey`  
      _Updates API key properties._
- [ ] `DELETE /v1/organizations/{organizationId}/keys/{keyId}` — `useDeleteApiKey`  
      _Deletes API key. Only a key not used to authenticate the active request can be deleted._
- [ ] `GET /v1/organizations/{organizationId}/members` — `useMembers`  
      _Returns a list of all members in the organization._
- [ ] `GET /v1/organizations/{organizationId}/members/{userId}` — (no hook)  
      _Returns a single organization member details._
- [ ] `PATCH /v1/organizations/{organizationId}/members/{userId}` — (no hook)  
      _Updates organization member role._
- [ ] `DELETE /v1/organizations/{organizationId}/members/{userId}` — `useDeleteMember`  
      _Removes a user from the organization._
- [ ] `GET /v1/organizations/{organizationId}/invitations` — `useInvitations`  
      _Returns list of all organization invitations._
- [ ] `POST /v1/organizations/{organizationId}/invitations` — `useCreateInvitation`  
      _Creates organization invitation._
- [ ] `GET /v1/organizations/{organizationId}/invitations/{invitationId}` — `useInvitation`  
      _Returns details for a single organization invitation._
- [ ] `DELETE /v1/organizations/{organizationId}/invitations/{invitationId}` — `useDeleteInvitation`  
      _Deletes a single organization invitation._
- [ ] `GET /v1/organizations/{organizationId}/activities` — (no hook)  
      _Returns a list of all organization activities._
- [ ] `GET /v1/organizations/{organizationId}/activities/{activityId}` — (no hook)  
      _Returns a single organization activity by ID._
- [ ] `GET /v1/organizations/{organizationId}/usageCost` — (no hook)  
      _Returns a grand total and a list of daily, per-entity organization usage cost records for the organization in the queried time period (maximum 31 days)._
- [ ] `GET /v1/organizations/{organizationId}/privateEndpointConfig` — (no hook)  
      _Information required to set up a private endpoint for region within cloud provider for an organization._
- [ ] `GET /v1/organizations/{organizationId}/services/{serviceId}/clickpipesReversePrivateEndpoints` — (no hook)  
      _Returns a list of reverse private endpoints for the specified service._
- [ ] `POST /v1/organizations/{organizationId}/services/{serviceId}/clickpipesReversePrivateEndpoints` — (no hook)  
      _Create a new reverse private endpoint._
- [ ] `GET /v1/organizations/{organizationId}/services/{serviceId}/clickpipesReversePrivateEndpoints/{reversePrivateEndpointId}` — (no hook)  
      _Returns the reverse private endpoint with the specified ID._
- [ ] `DELETE /v1/organizations/{organizationId}/services/{serviceId}/clickpipesReversePrivateEndpoints/{reversePrivateEndpointId}` — (no hook)  
      _Delete the reverse private endpoint with the specified ID._
- [ ] `GET /v1/organizations/{organizationId}/services/{serviceId}/clickpipes` — `useClickpipes`  
      _Returns a list of ClickPipes._
- [ ] `POST /v1/organizations/{organizationId}/services/{serviceId}/clickpipes` — `useCreateClickpipe`  
      _Create a new ClickPipe._
- [ ] `GET /v1/organizations/{organizationId}/services/{serviceId}/clickpipes/{clickPipeId}` — `useClickpipe`  
      _Returns the specified ClickPipe._
- [ ] `PATCH /v1/organizations/{organizationId}/services/{serviceId}/clickpipes/{clickPipeId}` — `useUpdateClickpipe`  
      _Update the specified ClickPipe._
- [ ] `DELETE /v1/organizations/{organizationId}/services/{serviceId}/clickpipes/{clickPipeId}` — `useDeleteClickpipe`  
      _Delete the specified ClickPipe._
- [ ] `PATCH /v1/organizations/{organizationId}/services/{serviceId}/clickpipes/{clickPipeId}/scaling` — `useUpdateClickpipeTier`  
      _Change scaling settings for the specified ClickPipe._
- [ ] `PATCH /v1/organizations/{organizationId}/services/{serviceId}/clickpipes/{clickPipeId}/state` — `useUpdateClickpipeState`  
      _Start, stop or resync ClickPipe._

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
