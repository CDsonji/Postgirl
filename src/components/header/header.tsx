import { Theme } from "../../db/data/data-manager-interface";
import { useTheme } from "../theme/theme-context";
import "./header.css";
import "./../../index.css";

type HeaderProps = {
  settingsButtonAction: () => void;
};

const Header = ({ settingsButtonAction }: HeaderProps) => {
  const { theme } = useTheme();

  return (
    <header className="header">
      <div
        className="icon-button settings-button"
        onClick={() => {
          settingsButtonAction();
        }}
      >
        <img
          className="icon"
          src={`./src/assets/settings-${
            theme === Theme.LIGHT ? "light" : "dark"
          }.svg`}
          alt="settings-logo"
        />
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
