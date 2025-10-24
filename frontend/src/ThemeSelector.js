import React, { useContext } from "react";
import { ThemeContext } from "./ThemeContext";

const themes = [
  { key: "default", name: "Default" },
  { key: "theme1", name: "Theme 1" },
  { key: "theme2", name: "Theme 2" },
  { key: "theme3", name: "Theme 3" },
  { key: "theme4", name: "Theme 4" },
  { key: "theme5", name: "Theme 5" },
  { key: "theme6", name: "Theme 6" },
  { key: "theme7", name: "Theme 7" },
  { key: "theme8", name: "Theme 8" },
];

const ThemeSelector = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <div className="theme-selector" style={{color:"black"}}>
      <h3>Theme Customization</h3>
      <p>Choose your primary theme color</p>
      <div className="theme-options">
        {themes.map((t) => (
          <div
            key={t.key}
            className={`theme-tile ${theme === t.key ? "selected" : ""}`}
            onClick={() => setTheme(t.key)}
          >
            <div className={`theme-preview ${t.key}`}></div>
            <span>{t.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
