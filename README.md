# ClickHouse Cloud React Hooks

A collection of reusable React hooks to easily interact with the ClickHouse Cloud API. Simplifies authentication, querying, and managing resources via the official OpenAPI interface.

## Installation

```bash
npm install clickhouse-cloud-react-hooks
```

or

```bash
yarn add clickhouse-cloud-react-hooks
```

## Usage

Here's a basic example of how to use the `useServices` hook to fetch a list of services:

```tsx
import { ClickHouseProvider, useServices } from "clickhouse-cloud-react-hooks";

const ServicesList = () => {
  const { data: services, error, isLoading } = useServices();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Services</h1>
      <ul>
        {services?.map((service) => (
          <li key={service.id}>{service.name}</li>
        ))}
      </ul>
    </div>
  );
};

const App = () => {
  return <ServicesList />;
};

export default App;
```

## Available Hooks

This package provides a set of hooks to interact with different resources of the ClickHouse Cloud API:

- `useApiKeys`: Manage API keys.
- `useBackups`: Manage backups.
- `useClickpipes`: Manage ClickPipes.
- `useOrganizations`: Fetch organization details.
- `useServices`: Manage services.
- `useUserManagement`: Manage users and roles.

## Authentication

TBD

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
