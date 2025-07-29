import { 
  useOrganizations, 
  useOrganizationActivities,
  useOrganizationUsageCost,
  type ClickHouseConfig,
  type Organization,
  type Activity,
  ClickHouseAPIError 
} from 'clickhouse-cloud-react-hooks'
import { useState } from 'react'
import './App.css'

function App() {
  const [config, setConfig] = useState<ClickHouseConfig | null>(null)
  const [keyId, setKeyId] = useState('')
  const [keySecret, setKeySecret] = useState('')

  // Use validated hooks with proper TypeScript types
  const { data: organizations, error: orgError, isLoading: orgLoading } = useOrganizations(
    config || { keyId: '', keySecret: '' }
  );
  
  const organizationId = organizations?.[0]?.id;
  
  const { 
    data: activities, 
    error: activitiesError, 
    isLoading: activitiesLoading 
  } = useOrganizationActivities(organizationId || '', config || { keyId: '', keySecret: '' });
  
  const { 
    data: usageCost, 
    error: usageError, 
    isLoading: usageLoading 
  } = useOrganizationUsageCost(
    organizationId || '', 
    config || { keyId: '', keySecret: '' }, 
    { 
      startDate: '2024-01-01', 
      endDate: '2024-01-31' 
    }
  );

  const handleSetCredentials = () => {
    if (keyId && keySecret) {
      setConfig({ keyId, keySecret });
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>ClickHouse Cloud React Hooks Example</h1>
        <p>
          This example demonstrates Zod validation with ClickHouse Cloud API responses.
        </p>
      </header>

      <main>
        {!config ? (
          <section className="config-section">
            <h2>Configuration</h2>
            <p>Enter your ClickHouse Cloud API credentials to test the hooks:</p>
            <div className="config-form">
              <div>
                <label>
                  Key ID:
                  <input 
                    type="text" 
                    value={keyId}
                    onChange={(e) => setKeyId(e.target.value)}
                    placeholder="Your ClickHouse API Key ID"
                  />
                </label>
              </div>
              <div>
                <label>
                  Key Secret:
                  <input 
                    type="password" 
                    value={keySecret}
                    onChange={(e) => setKeySecret(e.target.value)}
                    placeholder="Your ClickHouse API Key Secret"
                  />
                </label>
              </div>
              <button onClick={handleSetCredentials} disabled={!keyId || !keySecret}>
                Connect
              </button>
            </div>
            <p className="warning">
              <strong>Note:</strong> This is a demo. Never hardcode credentials in production!
            </p>
          </section>
        ) : (
          <div>
            <section className="organizations-section">
              <h2>Organizations (with Zod validation)</h2>
              {orgLoading ? (
                <div>Loading organizations...</div>
              ) : orgError ? (
                <div className="error">
                  {orgError instanceof ClickHouseAPIError ? (
                    <div>
                      <strong>ClickHouse API Error:</strong> {orgError.error} 
                      <br />
                      <small>Status: {orgError.status}</small>
                    </div>
                  ) : (
                    <div>Error: {orgError.message}</div>
                  )}
                </div>
              ) : organizations && organizations.length > 0 ? (
                <div>
                  {organizations.map((org: Organization) => (
                    <div key={org.id} className="organization-card">
                      <h3>{org.name}</h3>
                      <p><strong>ID:</strong> {org.id}</p>
                      <p><strong>Created:</strong> {new Date(org.createdAt).toLocaleDateString()}</p>
                      
                      {org.privateEndpoints.length > 0 && (
                        <div>
                          <h4>Private Endpoints:</h4>
                          <ul>
                            {org.privateEndpoints.map((endpoint) => (
                              <li key={endpoint.id}>
                                {endpoint.description} ({endpoint.cloudProvider} - {endpoint.region})
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {org.byocConfig.length > 0 && (
                        <div>
                          <h4>BYOC Configurations:</h4>
                          <ul>
                            {org.byocConfig.map((byoc) => (
                              <li key={byoc.id}>
                                {byoc.accountName} - {byoc.cloudProvider} ({byoc.regionId}) - {byoc.state}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div>No organizations found</div>
              )}
            </section>

            {organizationId && (
              <>
                <section className="activities-section">
                  <h2>Recent Activities (with Zod validation)</h2>
                  {activitiesLoading ? (
                    <div>Loading activities...</div>
                  ) : activitiesError ? (
                    <div className="error">Error loading activities: {activitiesError.message}</div>
                  ) : activities && activities.length > 0 ? (
                    <ul className="activities-list">
                      {activities.slice(0, 10).map((activity: Activity) => (
                        <li key={activity.id} className="activity-item">
                          <strong>{activity.type}</strong> - {activity.actorType} 
                          <small> ({new Date(activity.createdAt).toLocaleDateString()})</small>
                          {activity.actorDetails && <div className="actor-details">{activity.actorDetails}</div>}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div>No activities found</div>
                  )}
                </section>

                <section className="usage-section">
                  <h2>Usage Cost (with Zod validation)</h2>
                  {usageLoading ? (
                    <div>Loading usage cost...</div>
                  ) : usageError ? (
                    <div className="error">Error loading usage cost: {usageError.message}</div>
                  ) : usageCost ? (
                    <div className="usage-cost-card">
                      <h3>Total Cost: {usageCost.grandTotalCHC} CHC</h3>
                      <div className="usage-details">
                        <h4>Usage Details:</h4>
                        <p><strong>Entity:</strong> {usageCost.costs.entityName} ({usageCost.costs.entityType})</p>
                        <p><strong>Date:</strong> {usageCost.costs.date}</p>
                        <p><strong>Total CHC:</strong> {usageCost.costs.totalCHC}</p>
                        <p><strong>Locked:</strong> {usageCost.costs.locked ? 'Yes' : 'No'}</p>
                        
                        <h5>Metrics:</h5>
                        <ul>
                          {usageCost.costs.metrics.computeCHC && (
                            <li>Compute: {usageCost.costs.metrics.computeCHC} CHC</li>
                          )}
                          {usageCost.costs.metrics.storageCHC && (
                            <li>Storage: {usageCost.costs.metrics.storageCHC} CHC</li>
                          )}
                          {usageCost.costs.metrics.backupCHC && (
                            <li>Backup: {usageCost.costs.metrics.backupCHC} CHC</li>
                          )}
                          {usageCost.costs.metrics.dataTransferCHC && (
                            <li>Data Transfer: {usageCost.costs.metrics.dataTransferCHC} CHC</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div>No usage cost data available</div>
                  )}
                </section>
              </>
            )}

            <section className="validation-info">
              <h2>Zod Validation Benefits</h2>
              <ul>
                <li>✅ Runtime type checking of API responses</li>
                <li>✅ Automatic TypeScript types generation</li>
                <li>✅ Better error handling with structured error responses</li>
                <li>✅ Data transformation and normalization</li>
                <li>✅ Validation warnings logged to console for debugging</li>
              </ul>
              <p>
                Open your browser's developer tools to see validation logs and error details.
              </p>
            </section>

            <button onClick={() => setConfig(null)} className="reset-button">
              Reset Configuration
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
