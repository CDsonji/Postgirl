import { useStorage } from "../../../db/storage-context";
import Tab from "./tab/tab";
import "./tabs-bar.css";

const TabsBar = () => {
  const [db] = useStorage();

  return (
    <ul className="tabs-list">
      {db.getRequestTabs().map((request) => {
        const activeId = db.getData().activeTab?.id;
        return (
          <Tab
            key={request.id}
            request={request}
            isActive={activeId === request.id}
          />
        );
      })}
    </ul>
  );
};

export default TabsBar;
