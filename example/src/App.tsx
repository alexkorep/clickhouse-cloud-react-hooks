import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import OrganizationListPage from "./pages/OrganizationListPage";
import ConfigurationPage from "./pages/ConfigurationPage";
import OrganizationDetailsPage from "./pages/OrganizationDetailsPage";
import OrganizationUsageCostPage from "./pages/OrganizationUsageCostPage";
import OrganizationPrivateEndpointConfigPage from "./pages/OrganizationPrivateEndpointConfigPage";
import ClickpipesPage from "./pages/ClickpipesPage";
import ActivityDetailsPage from "./pages/ActivityDetailsPage";
import ServiceDetailsPage from "./pages/ServiceDetailsPage";
import ServiceBackupsPage from "./pages/ServiceBackupsPage";
import ReversePrivateEndpointsPage from "./pages/ReversePrivateEndpointsPage";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <header className="bg-blue-800 text-white p-6 mb-8">
          <h1 className="text-3xl font-bold mb-2">ClickHouse Cloud React Hooks Example</h1>
          <p className="opacity-90">This example demonstrates ClickHouse Cloud API responses.</p>
        </header>
        <nav className="p-4 border-b mb-6 flex space-x-4">
          <Link to="/" className="text-blue-600 hover:underline">Organizations</Link>
          <Link to="/clickpipes" className="text-blue-600 hover:underline">
            ClickPipes
          </Link>
          <Link to="/config" className="text-blue-600 hover:underline">
            Configuration
          </Link>
          <Link
            to="/reverse-private-endpoints"
            className="text-blue-600 hover:underline"
          >
            Reverse Private Endpoints
          </Link>
        </nav>
        <main className="p-4 max-w-4xl mx-auto">
          <Routes>
            <Route path="/" element={<OrganizationListPage />} />
            <Route path="/config" element={<ConfigurationPage />} />
            <Route path="/clickpipes" element={<ClickpipesPage />} />
            <Route path="/org/:id" element={<OrganizationDetailsPage />} />
            <Route
              path="/org/:id/usage-cost"
              element={<OrganizationUsageCostPage />}
            />
            <Route
              path="/org/:id/private-endpoint-config"
              element={<OrganizationPrivateEndpointConfigPage />}
            />
            <Route
              path="/org/:id/service/:serviceId/backups"
              element={<ServiceBackupsPage />}
            />
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
