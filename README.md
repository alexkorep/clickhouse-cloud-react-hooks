# ClickHouse Cloud React Hooks

A collection of reusable React hooks to interact with the ClickHouse Cloud API: https://clickhouse.com/docs/cloud/manage/api/api-overview

## Features

The project is under active development and aims to cover the following features:

### Organization

- [x] List all organizations
- [x] Fetch organization details
  - [ ] Private Endpoints
  - [ ] BYOC Config
- [ ] Update organization details
- [ ] List organization activities
- [ ] Fetch single activity
- [ ] Fetch usage costs
- [ ] Fetch private endpoint config
- [ ] List organization members
- [ ] Fetch member details
- [ ] Update member role
- [ ] Remove member
- [ ] List invitations
- [ ] Create invitation
- [ ] Fetch invitation details
- [ ] Delete invitation

### Services

- [ ] List all services in organization
- [ ] Create new service
- [ ] Fetch service details
- [ ] Update service details
- [ ] Delete service
- [ ] Get private endpoint configuration
- [ ] Manage service query endpoints
- [ ] Update service state (start/stop)
- [ ] Update service scaling settings
- [ ] Update service password
- [ ] Create private endpoint
- [ ] Get service metrics

### Backups

- [ ] List all backups for a service
- [ ] Fetch backup details
- [ ] Get backup configuration
- [ ] Update backup configuration

### API Keys

- [ ] List all API keys
- [ ] Create API key
- [ ] Fetch API key details
- [ ] Update API key
- [ ] Delete API key

### User Management

- [ ] List organization members
- [ ] Manage member roles
- [ ] Remove members
- [ ] Manage invitations

### ClickPipes

- [ ] List ClickPipes
- [ ] Create ClickPipe
- [ ] Fetch ClickPipe details
- [ ] Update ClickPipe
- [ ] Delete ClickPipe
- [ ] Manage ClickPipe scaling and state

### Prometheus Metrics

- [ ] Fetch organization metrics
- [ ] Fetch service metrics

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
