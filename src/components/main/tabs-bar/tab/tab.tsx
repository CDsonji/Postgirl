import { Link } from "react-router-dom";
import { Theme, type Tab } from "../../../../db/data/data-manager-interface";
import "./tab.css";
import { useTheme } from "../../../theme/theme-context";
import { useStorage } from "../../../../db/storage-context";

type TabProps = {
  tab: Tab;
  isActive: boolean;
};

const TabComponent = ({ tab, isActive }: TabProps) => {
  const { theme } = useTheme();
  const [db, refreshStorage] = useStorage();
  const request = db.getRequestById(tab.request.id);

  return (
    <li
      className={`tab ${isActive ? "active-tab" : ""}`}
      onClick={() => {
        db.updateCurrentTab(tab.request.id);
        refreshStorage();
      }}
    >
      {/* <Link to={`/tabs/${request.id}`} className="tab-link"> */}
      <h4 className="tab-title">
        <span className={`${request.method} method`}>{request.method}</span>{" "}
        {request.url || "untitled request"}
      </h4>
      <div
        className="tab-button tab-exit-button"
        title="Close Tab"
        onClick={(e) => {
          e.stopPropagation();
          db.removeTab(request.id);
          refreshStorage();
        }}
      >
        <img
          className="tab-button-icon"
          src={`./../../../../public/assets/exit-${
            theme === Theme.LIGHT ? "light" : "dark"
          }.svg`}
          alt="exit-logo"
        />
      </div>
      {/* </Link> */}
    </li>
  );
};

export default TabComponent;
