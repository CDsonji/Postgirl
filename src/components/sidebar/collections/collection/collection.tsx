import {
  Method,
  Theme,
  type Collection,
} from "../../../../db/data/data-manager-interface";
import { useTheme } from "../../../theme/theme-context";
import { useStorage } from "../../../../db/storage-context";
import RequestItem from "../../request-item/request-item";
import "./collection.css";

type CollectionProps = {
  collection: Collection;
  isActive: boolean;
};

const CollectionComponent = ({ collection, isActive }: CollectionProps) => {
  const { theme } = useTheme();
  const [db, refreshStorage] = useStorage();
  const isCollectionOpen = collection.isOpen;
  const activeId = db.getData().activeTab?.requestId;

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
              src={`./../../../../../src/assets/${
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
                src={`./../../../../../src/assets/add-request-${
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
                src={`./../../../../../src/assets/delete-${
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
