import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import OrganizationListPage from "./pages/OrganizationListPage";
import ConfigurationPage from "./pages/ConfigurationPage";
import OrganizationDetailsPage from "./pages/OrganizationDetailsPage";
import ActivityDetailsPage from "./pages/ActivityDetailsPage";
import ServiceDetailsPage from "./pages/ServiceDetailsPage";
import ReversePrivateEndpointsPage from "./pages/ReversePrivateEndpointsPage";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>ClickHouse Cloud React Hooks Example</h1>
          <p>This example demonstrates ClickHouse Cloud API responses.</p>
        </header>
        <nav style={{ padding: "1rem", borderBottom: "1px solid #eee" }}>
          <Link to="/" style={{ marginRight: "1rem" }}>Organizations</Link>
          <Link to="/config" style={{ marginRight: "1rem" }}>
            Configuration
          </Link>
          <Link to="/reverse-private-endpoints">Reverse Private Endpoints</Link>
        </nav>
        <main>
          <Routes>
            <Route path="/" element={<OrganizationListPage />} />
            <Route path="/config" element={<ConfigurationPage />} />
            <Route path="/org/:id" element={<OrganizationDetailsPage />} />
            <Route
              path="/org/:id/activities/:activityId"
              element={<ActivityDetailsPage />}
            />
            <Route
              path="/org/:orgId/service/:serviceId"
              element={<ServiceDetailsPage />}
            />
            <Route
              path="/reverse-private-endpoints"
              element={<ReversePrivateEndpointsPage />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
