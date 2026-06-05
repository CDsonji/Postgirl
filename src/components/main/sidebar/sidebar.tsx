import { useState } from "react";
import History from "./history/history";
import Collections from "./collections/collections";
import "./sidebar.css";

const SidebarView = {
  COLLECTIONS: "collections",
  HISTORY: "history",
};

const Sidebar = () => {
  const [view, setView] = useState(SidebarView.HISTORY);

  return (
    <>
      <aside>
        <div className="sidebar-view-buttons">
          <button
            className={`sidebar-view-button ${
              view === SidebarView.HISTORY && "sidebar-active-view"
            }`}
            onClick={() => setView(SidebarView.HISTORY)}
          >
            History
          </button>
          <button
            className={`sidebar-view-button ${
              view === SidebarView.COLLECTIONS && "sidebar-active-view"
            }`}
            onClick={() => setView(SidebarView.COLLECTIONS)}
          >
            Collections
          </button>
        </div>
        <div className="view-conatainer">
          {view === SidebarView.HISTORY ? <History /> : <Collections />}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
