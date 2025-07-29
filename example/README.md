# ClickHouse Cloud React Hooks Example

This example demonstrates how to use the `clickhouse-cloud-react-hooks` package in a React application with live reload during development.

## Features

- **Live Reload**: Changes to the parent package source code (`../src/hooks/`) automatically update the example app
- **Hot Module Replacement (HMR)**: React components update without losing state
- **TypeScript Support**: Full TypeScript support with proper path mapping

## Getting Started

### 1. Install Dependencies

```bash
cd example
yarn install
```

### 2. Start Development Server

```bash
yarn dev
```

This will start the Vite development server on `http://localhost:5173`

## How Live Reload Works

The example app is configured to:

1. **Direct Source Import**: Instead of importing the built package, it imports directly from `../src/main.ts`
2. **Path Mapping**: TypeScript and Vite are configured to resolve `clickhouse-cloud-react-hooks` to the source files
3. **File Watching**: Vite watches the parent `../src/` directory for changes
4. **Dependency Exclusion**: The package is excluded from Vite's dependency optimization to enable live reloading

## Testing Live Reload

1. Start the example app with `yarn dev`
2. Open the app in your browser
3. Edit any file in `../src/hooks/` (e.g., add a console.log to `useApiKeys.ts`)
4. Save the file
5. The example app should automatically update without a full page refresh

## Configuration Files

- **`vite.config.ts`**: Configures the alias and file watching
- **`tsconfig.json`**: Sets up path mapping for TypeScript
- **`package.json`**: Contains development dependencies and scripts

## Available Scripts

- `yarn dev` - Start development server with HMR
- `yarn build` - Build the example for production
- `yarn preview` - Preview the production build locally
- `yarn lint` - Run ESLint on the example code
