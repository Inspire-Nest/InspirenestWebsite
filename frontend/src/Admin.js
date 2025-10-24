import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Companies from "./components/Companies";
import Navigation from "./components/Navigation";
import Vendor from "./components/vendor";
import AdminScreen from "./components/AdminScreen";
import OpsView from "./components/OpsView";
function Admin() {
  return (
    <div style={{ display: "flex" }}>
      <Navigation userRole="Operation Manager" />
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="companies" element={<Companies />} />
          <Route path="opsView" element={<OpsView />} />
          <Route path="vendor" element={<Vendor />} />
          <Route path="settings" element={<AdminScreen />} />
        </Routes>
      </div>
    </div>
  );
}

export default Admin;
