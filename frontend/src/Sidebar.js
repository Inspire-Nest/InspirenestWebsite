// src/components/Sidebar.js
import React from "react";

const sidebarStyles = {
  container: {
    position: "fixed",
    top: 0,
    right: 0,
    width: "300px",
    height: "100%",
    backgroundColor: "#fff",
    boxShadow: "-2px 0 5px rgba(0,0,0,0.3)",
    zIndex: 999,
    padding: "20px",
    transition: "transform 0.3s ease-in-out",
  },
  closeBtn: {
    background: "none",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    position: "absolute",
    top: "10px",
    right: "10px",
  },
};

const Sidebar = ({ isOpen, onClose, children }) => {
  return (
    <div
      style={{
        ...sidebarStyles.container,
        transform: isOpen ? "translateX(0)" : "translateX(100%)",
      }}
    >
      <button style={sidebarStyles.closeBtn} onClick={onClose}>
        ❌
      </button>
      {children}
    </div>
  );
};

export default Sidebar;
