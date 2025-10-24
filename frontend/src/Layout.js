// Layout.js
import React from "react";
import Header from "./Header";
import Navigation from "./Navigation";

const Layout = ({ children }) => {
  const layoutStyles = {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
  };

  const contentStyles = {
    display: "flex",
    flex: 1,
    overflow: "hidden",
  };

  const mainStyles = {
    flex: 1,
    overflowY: "auto",
    padding: "20px",
  };

  return (
    <div style={layoutStyles}>
      <Header />
      <div style={contentStyles}>
        <Navigation />
        <main style={mainStyles}>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
