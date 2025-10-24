import React from "react";
import { Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Employees from "./components/Employees";
import EmpDashboard from "./components/EmpDashboard";
import Subscription from "./components/Subscription";
import Customization from "./components/Customization";
import SelectedEvents from "./components/SelectedEvents";
function Hr() {
  return (
    <div style={{ display: "flex" }}>
      <Navigation userRole="HR" />
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<EmpDashboard />} />
          <Route path="empDashboard" element={<EmpDashboard />} />
          <Route path="employees" element={<Employees />} />
          <Route path="calender" element={<Subscription />} />
          <Route path="customization" element={<Customization />} />
          <Route path="events" element={<SelectedEvents />} />
        </Routes>
      </div>
    </div>
  );
}

export default Hr;
