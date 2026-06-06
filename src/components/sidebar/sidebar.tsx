import { useState } from "react";
import History from "./history/history";
import Collections from "./collections/collections";
import "./sidebar.css";
import Requests from "./requests/request";

const SidebarView = {
  COLLECTIONS: "collections",
  HISTORY: "history",
  REQUESTS: "requests",
};

const Sidebar = () => {
  const [view, setView] = useState(SidebarView.HISTORY);

  return (
    <>
      <aside>
        <div className="sidebar-view-buttons">
          <button
            className={`sidebar-view-button sidebar-requests-button ${
              view === SidebarView.REQUESTS && "sidebar-active-view"
            }`}
            onClick={() => setView(SidebarView.REQUESTS)}
          >
            Requests
          </button>
          <button
            className={`sidebar-view-button sidebar-history-button ${
              view === SidebarView.HISTORY && "sidebar-active-view"
            }`}
            onClick={() => setView(SidebarView.HISTORY)}
          >
            History
          </button>
          <button
            className={`sidebar-view-button sidebar-collections-button ${
              view === SidebarView.COLLECTIONS && "sidebar-active-view"
            }`}
            onClick={() => setView(SidebarView.COLLECTIONS)}
          >
            Collections
          </button>
        </div>
        <div className="view-container">
          {view === SidebarView.REQUESTS ? (
            <Requests />
          ) : view === SidebarView.HISTORY ? (
            <History />
          ) : (
            <Collections />
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
