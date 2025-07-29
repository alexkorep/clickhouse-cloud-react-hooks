import { useApiKeys, useServices, useOrganizations } from 'clickhouse-cloud-react-hooks'
import './App.css'

function App() {
  // Example usage of your hooks (currently they're just placeholders)
  const apiKeysResult = useApiKeys()
  const servicesResult = useServices()
  const organizationsResult = useOrganizations()

  return (
    <div className="App">
      <header className="App-header">
        <h1>ClickHouse Cloud React Hooks Example</h1>
        <p>
          This example demonstrates the usage of clickhouse-cloud-react-hooks.
        </p>
        <p>
          Edit <code>src/hooks/useApiKeys.ts</code> in the parent directory and save to test HMR.
        </p>
      </header>

      <main>
        <section className="hooks-demo">
          <h2>Available Hooks</h2>
          <p>The following hooks are imported from your package:</p>
          <ul>
            <li><code>useApiKeys()</code> - {typeof apiKeysResult}</li>
            <li><code>useServices()</code> - {typeof servicesResult}</li>
            <li><code>useOrganizations()</code> - {typeof organizationsResult}</li>
          </ul>
          <p className="read-the-docs">
            Implement these hooks in <code>../src/hooks/</code> to see them in action!
          </p>
        </section>
      </main>
    </div>
  )
}

export default App
