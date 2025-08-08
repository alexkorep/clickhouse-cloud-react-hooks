

import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import OrganizationListPage from "./pages/OrganizationListPage";
import ConfigurationPage from "./pages/ConfigurationPage";
import OrganizationDetailsPage from "./pages/OrganizationDetailsPage";
import OrganizationUsageCostPage from "./pages/OrganizationUsageCostPage";
import OrganizationPrivateEndpointConfigPage from "./pages/OrganizationPrivateEndpointConfigPage";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>ClickHouse Cloud React Hooks Example</h1>
          <p>This example demonstrates ClickHouse Cloud API responses.</p>
        </header>
        <nav className="main-nav">
          <Link to="/">Organizations</Link>
          <Link to="/config">Configuration</Link>
        </nav>
        <main>
          <Routes>
            <Route path="/" element={<OrganizationListPage />} />
            <Route path="/config" element={<ConfigurationPage />} />
            <Route path="/org/:id" element={<OrganizationDetailsPage />} />
            <Route
              path="/org/:id/usage-cost"
              element={<OrganizationUsageCostPage />}
            />
            <Route
              path="/org/:id/private-endpoint-config"
              element={<OrganizationPrivateEndpointConfigPage />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
