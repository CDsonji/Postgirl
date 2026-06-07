import { Method, Theme } from "../../../db/data/data-manager-interface";
import { useStorage } from "../../../db/storage-context";
import { useTheme } from "../../theme/theme-context";
import TabComponent from "./tab/tab";
import "./tabs-bar.css";

const TabsBar = () => {
  const [db, refreshStorage] = useStorage();
  const { theme } = useTheme();
  const activeId = db.getData().activeTab?.requestId;
  `active tab: ${activeId}`;

  return (
    <div className="tabs-container">
      <ul className="tabs-list">
        {db.getTabs().map((tab) => {
          return (
            <TabComponent
              key={tab.requestId}
              tab={tab}
              isActive={activeId === tab.requestId}
            />
          );
        })}
      </ul>
      <div className="add-tab-button-container">
        <div
          className="add-tab-button"
          title="Add Request"
          onClick={() => {
            const request = db.addRequest({
              id: crypto.randomUUID(),
              url: "http://localhost:8000",
              method: Method.GET,
              params: {},
              headers: {},
            });
            db.addTab(request.id);
            refreshStorage();
          }}
        >
          <img
            className="add-tab-button-icon"
            src={`./../../../../../src/assets/add-tab-${
              theme === Theme.LIGHT ? "light" : "dark"
            }.svg`}
            alt="add-logo"
          />
        </div>
      </div>
    </div>
  );
};

export default TabsBar;
