import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import OrganizationListPage from "./pages/OrganizationListPage";
import ConfigurationPage from "./pages/ConfigurationPage";
import ClickpipesPage from "./pages/ClickpipesPage";
import ReversePrivateEndpointsPage from "./pages/ReversePrivateEndpointsPage";
import OrganizationLayout from "./pages/org/OrganizationLayout";
import OrganizationOverviewPage from "./pages/org/OrganizationOverviewPage";
import OrgServicesPage from "./pages/org/OrgServicesPage";
import OrgMembersPage from "./pages/org/OrgMembersPage";
import OrgInvitesPage from "./pages/org/OrgInvitesPage";
import OrgApiKeysPage from "./pages/org/OrgApiKeysPage";
import OrgNetworkingPage from "./pages/org/OrgNetworkingPage";
import OrgMetricsPage from "./pages/org/OrgMetricsPage";
import OrganizationUsageCostPage from "./pages/OrganizationUsageCostPage";
import OrgActivitiesPage from "./pages/org/OrgActivitiesPage";
import ActivityDetailsPage from "./pages/ActivityDetailsPage";
import ServiceLayout from "./pages/service/ServiceLayout";
import ServiceOverviewPage from "./pages/service/ServiceOverviewPage";
import ServiceScalingPage from "./pages/service/ServiceScalingPage";
import ServiceEndpointsPage from "./pages/service/ServiceEndpointsPage";
import ServiceBackupsPage from "./pages/ServiceBackupsPage";
import ServiceMetricsPage from "./pages/service/ServiceMetricsPage";
import ServiceSettingsPage from "./pages/service/ServiceSettingsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<OrganizationListPage />} />
          <Route path="config" element={<ConfigurationPage />} />
          <Route path="org/:id" element={<OrganizationLayout />}>
            <Route index element={<OrganizationOverviewPage />} />
            <Route path="services" element={<OrgServicesPage />} />
            <Route path="members" element={<OrgMembersPage />} />
            <Route path="invites" element={<OrgInvitesPage />} />
            <Route path="api-keys" element={<OrgApiKeysPage />} />
            <Route path="networking" element={<OrgNetworkingPage />} />
            <Route path="metrics" element={<OrgMetricsPage />} />
            <Route path="billing" element={<OrganizationUsageCostPage />} />
            <Route path="activities" element={<OrgActivitiesPage />} />
            <Route path="activities/:activityId" element={<ActivityDetailsPage />} />
            <Route path="service/:serviceId" element={<ServiceLayout />}>
              <Route index element={<ServiceOverviewPage />} />
              <Route path="scaling" element={<ServiceScalingPage />} />
              <Route path="endpoints" element={<ServiceEndpointsPage />} />
              <Route path="backups" element={<ServiceBackupsPage />} />
              <Route path="metrics" element={<ServiceMetricsPage />} />
              <Route path="settings" element={<ServiceSettingsPage />} />
            </Route>
          </Route>
          <Route path="clickpipes" element={<ClickpipesPage />} />
          <Route path="reverse-private-endpoints" element={<ReversePrivateEndpointsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
