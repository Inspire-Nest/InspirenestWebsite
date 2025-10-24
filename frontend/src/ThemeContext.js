import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

const themes = {
  default: { className: "theme-default", font: "Poppins" },
  theme1: { className: "theme-1", font: "Roboto" },
  theme2: { className: "theme-2", font: "Open Sans" },
  theme3: { className: "theme-3", font: "Montserrat" },
  theme4: { className: "theme-4", font: "Lato" },
  theme5: { className: "theme-5", font: "Raleway" },
  theme6: { className: "theme-6", font: "Nunito" },
  theme7: { className: "theme-7", font: "Ubuntu" },
  theme8: { className: "theme-8", font: "Quicksand" },
};

export const ThemeProvider = ({ children }) => {
  const savedTheme = localStorage.getItem("app-theme") || "default";
  const [theme, setTheme] = useState(savedTheme);

  useEffect(() => {
    const { className, font } = themes[theme];
    document.body.className = className;
    document.body.style.fontFamily = font;
    localStorage.setItem("app-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
