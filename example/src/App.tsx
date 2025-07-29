

import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import OrganizationListPage from "./OrganizationListPage";
import ConfigurationPage from "./ConfigurationPage";
import OrganizationDetailsPage from "./OrganizationDetailsPage";

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
          <Link to="/config">Configuration</Link>
        </nav>
        <main>
          <Routes>
            <Route path="/" element={<OrganizationListPage />} />
            <Route path="/config" element={<ConfigurationPage />} />
            <Route path="/org/:id" element={<OrganizationDetailsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
