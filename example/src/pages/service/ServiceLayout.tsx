import React from "react";
import { NavLink, Outlet, useParams, Link } from "react-router-dom";

const Tab = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      `px-3 py-2 rounded-md text-sm font-medium ${
        isActive ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"
      }`
    }
  >
    {children}
  </NavLink>
);

const ServiceLayout: React.FC = () => {
  const { id, serviceId } = useParams();

  return (
    <div className="space-y-4">
      <nav className="text-sm text-gray-600">
        <Link to="/" className="hover:underline">Organizations</Link>
        <span className="mx-2">/</span>
        <Link to={`/org/${id}`} className="hover:underline">Org {id}</Link>
        <span className="mx-2">/</span>
        <span className="font-medium">Service {serviceId}</span>
      </nav>
      <div className="flex flex-wrap gap-2 border-b pb-3">
        <Tab to=".">Overview</Tab>
        <Tab to="scaling">Scaling</Tab>
        <Tab to="endpoints">Endpoints</Tab>
        <Tab to="backups">Backups</Tab>
        <Tab to="metrics">Metrics</Tab>
        <Tab to="settings">Settings</Tab>
      </div>
      <Outlet />
    </div>
  );
};
export default ServiceLayout;
