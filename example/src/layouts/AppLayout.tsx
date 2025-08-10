import React from "react";
import { Link, Outlet } from "react-router-dom";

const AppLayout: React.FC = () => (
  <div className="min-h-screen bg-gray-50 text-gray-900">
    <header className="bg-blue-800 text-white p-6 mb-8">
      <h1 className="text-3xl font-bold mb-2">ClickHouse Cloud React Hooks Example</h1>
      <p className="opacity-90">This example demonstrates ClickHouse Cloud API responses.</p>
    </header>
    <nav className="p-4 border-b mb-6 flex space-x-4">
      <Link to="/" className="text-blue-600 hover:underline">Organizations</Link>
      <Link to="/clickpipes" className="text-blue-600 hover:underline">ClickPipes</Link>
      <Link to="/config" className="text-blue-600 hover:underline">Configuration</Link>
    </nav>
    <main className="p-4 max-w-4xl mx-auto">
      <Outlet />
    </main>
  </div>
);

export default AppLayout;
