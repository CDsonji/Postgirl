import { Theme } from "../../db/data/data-manager-interface";
import { useTheme } from "../theme/theme-context";
import "./settings.css";

type SettingsProps = {
  exitButtonAction: () => void;
};

const Settings = ({ exitButtonAction }: SettingsProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="settings-blur-container">
      <div className="settings-window">
        <div
          className="icon-button exit-button"
          onClick={() => {
            exitButtonAction();
          }}
        >
          <img
            className="icon"
            src={`./public/assets/exit-${
              theme === Theme.LIGHT ? "light" : "dark"
            }.svg`}
            alt="exit-logo"
          />
        </div>
        <div className="page-theme-container">
          <h3 className="theme-toggle-title">
            {theme === Theme.LIGHT ? "Dark Mode" : "Light Mode"}
          </h3>
          <label className="toggle">
            <input
              className="toggle-input"
              type="checkbox"
              checked={theme === Theme.DARK}
              onChange={toggleTheme}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Settings;
