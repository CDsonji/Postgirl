import { Theme } from "../../db/data/data-manager-interface";
import { useTheme } from "../theme/theme-context";
import "./header.css";
import "./../../index.css";

type HeaderProps = {
  settingsButtonAction: () => void;
  sidebarButtonAction?: () => void;
};

const Header = ({ settingsButtonAction, sidebarButtonAction }: HeaderProps) => {
  const { theme } = useTheme();

  return (
    <header className="header">
      {sidebarButtonAction && (
        <div
          className="icon-button aside-button"
          onClick={() => {
            sidebarButtonAction?.();
          }}
        >
          <img
            className="icon"
            src={`./public/assets/aside-${
              theme === Theme.LIGHT ? "light" : "dark"
            }.svg`}
            alt="aside-logo"
          />
        </div>
      )}
      <div
        className="icon-button settings-button"
        onClick={() => {
          settingsButtonAction();
        }}
      >
        <img
          className="icon"
          src={`./public/assets/settings-${
            theme === Theme.LIGHT ? "light" : "dark"
          }.svg`}
          alt="settings-logo"
        />
      </div>
      <div className="page-title">
        <img
          className="page-title-logo"
          src="./public/assets/postgirl.svg"
          alt="logo"
        />
        <h1 className="page-title-heading">Postgirl</h1>
      </div>
    </header>
  );
};

export default Header;
