import {
  Method,
  Theme,
  type Collection,
} from "../../../../db/data/data-manager-interface";
import { useTheme } from "../../../theme/theme-context";
import { useStorage } from "../../../../db/storage-context";
import RequestItem from "../../request-item/request-item";
import "./collection.css";
import { SidebarView } from "../../sidebar";

type CollectionProps = {
  collection: Collection;
  isActive: boolean;
};

const CollectionComponent = ({ collection, isActive }: CollectionProps) => {
  const { theme } = useTheme();
  const [db, refreshStorage] = useStorage();
  const isCollectionOpen = collection.isOpen;
  const activeId = db.getData().activeTab?.request.id;

  return (
    <>
      <li className="collection">
        <div
          className={`collection-item ${isActive ? "request-in-is-view" : ""}`}
        >
          <div
            className="icon-button folder-button"
            onClick={() => {
              db.updateCollection(collection.id, { isOpen: !isCollectionOpen });
              refreshStorage();
            }}
          >
            <img
              className="icon"
              src={`./../../../../../public/assets/${
                isCollectionOpen ? "open-" : ""
              }collection-${theme === Theme.LIGHT ? "light" : "dark"}.svg`}
              alt="settings-logo"
            />
          </div>
          <h3
            className="collection-title"
            contentEditable
            onBlur={(event) => {
              db.renameCollection(
                collection.id,
                event.currentTarget.textContent ?? ""
              );
              refreshStorage();
            }}
          >
            {collection.title}
          </h3>
          <div className="collection-item-buttons">
            <div
              title="Download Collection"
              className="collection-item-button download-button"
              onClick={() => {
                // 1. Get the JSON string from your data manager
                const jsonString = db.exportCollectionToJson(collection.id);

                if (jsonString) {
                  // 2. Create a Blob and a temporary URL to trigger the download
                  const blob = new Blob([jsonString], {
                    type: "application/json",
                  });
                  const url = URL.createObjectURL(blob);

                  const link = document.createElement("a");
                  link.href = url;
                  link.download = `${collection.title || "collection"}-${
                    collection.id
                  }.json`;
                  document.body.appendChild(link); // Required for some browsers
                  link.click();

                  // 3. Cleanup
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);
                } else {
                  alert("Could not export collection.");
                }
              }}
            >
              <img
                className="collection-item-button-icon"
                src={`./../../../../../public/assets/download-${
                  theme === Theme.LIGHT ? "light" : "dark"
                }.svg`}
                alt="add-logo"
              />
            </div>

            <div
              className="add-request-button collection-item-button"
              title="Add Request"
              onClick={(e) => {
                e.stopPropagation();
                const request = db.addRequest({
                  id: crypto.randomUUID(),
                  collectionId: collection.id,
                  url: "http://localhost:8000",
                  method: Method.GET,
                  params: {},
                  headers: {},
                });
                db.addTab(request.id);
                db.updateCurrentTab(request.id);
                refreshStorage();
              }}
            >
              <img
                className="collection-item-button-icon"
                src={`./../../../../../public/assets/add-request-${
                  theme === Theme.LIGHT ? "light" : "dark"
                }.svg`}
                alt="add-logo"
              />
            </div>
            <div
              className="collection-item-button delete-button"
              onClick={() => {
                db.removeCollection(collection.id);
                refreshStorage();
              }}
            >
              <img
                className="collection-item-button-icon"
                src={`./../../../../../public/assets/delete-${
                  theme === Theme.LIGHT ? "light" : "dark"
                }.svg`}
                alt="add-logo"
              />
            </div>
          </div>
        </div>
        {isCollectionOpen && (
          <ul className="request-list">
            {db.getRequestsFromCollectionById(collection.id).map((request) => {
              return (
                <RequestItem
                  key={request.id}
                  request={request}
                  isActive={activeId === request.id}
                  itemKey={`${SidebarView.COLLECTIONS}_${request.id}`}
                />
              );
            })}
          </ul>
        )}
      </li>
    </>
  );
};

export default CollectionComponent;
