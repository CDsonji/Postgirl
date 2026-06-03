import { Theme } from "../../db/data/data-manager-interface";
import { useTheme } from "../theme/theme-context";
import "./header.css";
import "./header.css";

const Header = () => {
  const { theme } = useTheme();

  let src;
  theme === Theme.LIGHT
    ? (src = "./src/assets/settings-light.svg")
    : (src = "./src/assets/settings-dark.svg");

  return (
    <header className="header">
      <div className="settings-button">
        <img className="settings-logo" src={src} alt="settings-logo" />
      </div>
      <div className="page-title">
        <img
          className="page-title-logo"
          src="./src/assets/postgirl.svg"
          alt="logo"
        />
        <h1 className="page-title-heading">Postgirl</h1>
      </div>
    </header>
  );
};

export default Header;
