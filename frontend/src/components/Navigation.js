import React, { useState, useEffect } from "react";
import {
  FaTachometerAlt,
  FaBox,
  FaBuilding,
  FaWarehouse,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";
import { MdEmojiEvents } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { HiUserGroup } from "react-icons/hi";
import { IoSettings } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { FaPalette } from "react-icons/fa6";
import { MdMailOutline } from "react-icons/md";

const Navigation = ({ userRole }) => {
  const [active, setActive] = useState("Dashboard");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  // ✅ Fetch companyId from localStorage
  const companyId = localStorage.getItem("companyId");

  let menuItems = [];

  if (userRole === "Operation Manager") {
    menuItems = [
      {
        name: "Dashboard",
        icon: <FaTachometerAlt />,
        path: "/admin/dashboard",
      },
      { name: "Companies", icon: <FaBuilding />, path: "/admin/companies" },
      { name: "Ops View", icon: <FaBox />, path: "/admin/opsView" },
      { name: "Vendors", icon: <FaWarehouse />, path: "/admin/vendor" },
      { name: "Admin", icon: <IoSettings />, path: "/admin/settings" },
    ];
  } else if (userRole === "HR") {
    menuItems = [
      {
        name: "Dashboard",
        icon: <FaTachometerAlt />,
        path: "/hr/empDashboard",
      },
      {
        name: "Employee List",
        icon: <HiUserGroup />,
        path: "/hr/employees",
      },
      {
        name: "Subscription / Calender of events",
        icon: <SlCalender />,
        path: "/hr/calender",
      },
      {
        name: "Customization",
        icon: <FaPalette />,
        path: "/hr/customization",
      },
      {
        name: "SMTP Settings",
        icon: <MdMailOutline />,
        path: "/hr/settings",
      },
      {
        name: "My Selected Events",
        icon: <MdEmojiEvents />,
        path: "/hr/events",
      },
    ];
  }

  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        width: isCollapsed ? "60px" : "220px",
        background: "0 0% 98%",
        padding: "20px 15px",
        borderRight: "1px solid #e0e0e0",
        transition: "width 0.3s ease",
        height: "100vh",
      }}
    >
      {/* Toggle Button */}
      <div style={{ textAlign: isCollapsed ? "center" : "right" }}>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            fontSize: "18px",
            marginBottom: "30px",
            color: "#3f3f3f",
          }}
        >
          <FaBars />
        </button>
      </div>

      {!isCollapsed && (
        <div
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            color: "#4e5d78",
            marginBottom: "20px",
            letterSpacing: "1px",
          }}
        >
          MAIN NAVIGATION
        </div>
      )}

      {/* Navigation Links */}
      <nav>
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => {
              setActive(item.name);
              // ✅ Pass companyId as query param
              navigate(`${item.path}?companyId=${companyId}`);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 12px",
              borderRadius: "8px",
              backgroundColor: active === item.name ? "#f7f8fc" : "transparent",
              color: active === item.name ? "#000" : "#3f3f3f",
              fontWeight: active === item.name ? "600" : "normal",
              border: "none",
              width: "100%",
              cursor: "pointer",
              fontSize: "18px",
              marginBottom: "10px",
              gap: "15px",
            }}
          >
            <span style={{ fontSize: "23px" }}>{item.icon}</span>
            {!isCollapsed && <span>{item.name}</span>}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Navigation;
