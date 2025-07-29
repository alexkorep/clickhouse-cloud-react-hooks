# ClickHouse Cloud React Hooks

A collection of reusable React hooks to easily interact with the ClickHouse Cloud API. Simplifies authentication, querying, and managing resources via the official OpenAPI interface with **built-in Zod validation** for runtime type safety.

## Features

- 🚀 **Easy-to-use React hooks** for ClickHouse Cloud API
- 🛡️ **Runtime type validation** with Zod schemas
- 📝 **Full TypeScript support** with auto-generated types
- 🔍 **Automatic error handling** with structured error responses
- ⚡ **SWR integration** for efficient data fetching and caching
- 📊 **Complete API coverage** for all ClickHouse Cloud endpoints

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
  ClickHouseAPIError 
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
      return <div>ClickHouse API Error: {error.error} (Status: {error.status})</div>;
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
  type ClickHouseConfig 
} from "clickhouse-cloud-react-hooks";

const ActivityLog = ({ organizationId }: { organizationId: string }) => {
  const config: ClickHouseConfig = {
    keyId: process.env.REACT_APP_CLICKHOUSE_KEY_ID!,
    keySecret: process.env.REACT_APP_CLICKHOUSE_KEY_SECRET!,
  };

  const { data: activities, error, isLoading } = useOrganizationActivities(
    organizationId, 
    config
  );

  if (isLoading) return <div>Loading activities...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Recent Activities</h2>
      <ul>
        {activities?.map((activity: Activity) => (
          <li key={activity.id}>
            <strong>{activity.type}</strong> - {activity.actorType}
            <small> ({new Date(activity.createdAt).toLocaleDateString()})</small>
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

## Zod Validation

This library uses Zod schemas to validate all API responses at runtime, providing:

- **Type Safety**: Ensures data matches expected TypeScript types
- **Runtime Validation**: Catches API changes or unexpected responses
- **Error Logging**: Logs validation failures to console for debugging
- **Graceful Fallback**: Returns raw data if validation fails (with warnings)

### Validation Benefits

```tsx
import { OrganizationSchema } from "clickhouse-cloud-react-hooks";

// The response is automatically validated against this schema:
const OrganizationSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  name: z.string(),
  privateEndpoints: z.array(OrganizationPrivateEndpointSchema),
  byocConfig: z.array(ByocConfigSchema),
});
```

### Error Handling

The library provides structured error handling:

```tsx
import { ClickHouseAPIError } from "clickhouse-cloud-react-hooks";

// Errors are properly typed and include:
// - status: HTTP status code
// - error: Detailed error message
// - requestId: Optional request ID for debugging
```

## Configuration

### ClickHouse Config

```typescript
type ClickHouseConfig = {
  keyId: string;        // Your ClickHouse API Key ID
  keySecret: string;    // Your ClickHouse API Key Secret
  baseUrl?: string;     // Optional: Custom API base URL (defaults to https://api.clickhouse.cloud)
};
```

### Environment Variables

```bash
# .env.local
REACT_APP_CLICKHOUSE_KEY_ID=your_key_id_here
REACT_APP_CLICKHOUSE_KEY_SECRET=your_key_secret_here
```

## Types

All types are automatically exported and available for use:

```tsx
import type {
  Organization,
  Activity,
  UsageCost,
  UsageCostRecord,
  OrganizationPrivateEndpoint,
  ByocConfig,
  // ... and many more
} from "clickhouse-cloud-react-hooks";
```

## Development

To run the example application:

```bash
# Install dependencies
npm install

# Run the example
npm run example

# Build the library
npm run build
```

The example application demonstrates all features including Zod validation, error handling, and proper TypeScript usage.

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all existing tests pass
5. Submit a pull request

## License

This project is licensed under the MIT License.
