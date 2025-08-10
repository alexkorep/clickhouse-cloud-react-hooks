import React from "react";
import { NavLink, Outlet, useParams, Link } from "react-router-dom";
import { useAtomValue } from "jotai";
import { configAtom } from "../../configAtoms";

const Tab = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `px-3 py-2 rounded-md text-sm font-medium ${
        isActive ? "bg-blue-600 text-white" : "text-blue-700 hover:bg-blue-50"
      }`
    }
    end
  >
    {children}
  </NavLink>
);

const OrganizationLayout: React.FC = () => {
  const { id } = useParams();
  const config = useAtomValue(configAtom);

  if (!config) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold">Not configured</h2>
        <p>
          Please go to the <Link className="text-blue-600" to="/config">Configuration</Link> page.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <nav className="text-sm text-gray-600">
        <Link to="/" className="hover:underline">Organizations</Link>
        <span className="mx-2">/</span>
        <span className="font-medium">Org {id}</span>
      </nav>
      <div className="flex flex-wrap gap-2 border-b pb-3">
        <Tab to=".">Overview</Tab>
        <Tab to="services">Services</Tab>
        <Tab to="members">Members</Tab>
        <Tab to="invites">Invites</Tab>
        <Tab to="api-keys">API Keys</Tab>
        <Tab to="networking">Networking</Tab>
        <Tab to="metrics">Metrics</Tab>
        <Tab to="billing">Billing</Tab>
        <Tab to="activities">Activities</Tab>
      </div>
      <Outlet />
    </div>
  );
};
export default OrganizationLayout;
