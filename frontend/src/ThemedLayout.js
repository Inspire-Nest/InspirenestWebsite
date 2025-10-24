// src/ThemedLayout.js
import React, { useState } from "react";
import { ThemeProvider } from "./ThemeContext";
import Sidebar from "./Sidebar";
import ThemeSelector from "./ThemeSelector";
import Header from "./Header";

const ThemedLayout = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <ThemeProvider>
      <Header onSettingsClick={() => setShowSidebar(true)} />
      <Sidebar isOpen={showSidebar} onClose={() => setShowSidebar(false)}>
        <ThemeSelector />
      </Sidebar>
      <div>{children}</div>
    </ThemeProvider>
  );
};

export default ThemedLayout;
