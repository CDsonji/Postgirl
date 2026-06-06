import {
  Theme,
  type Collection,
} from "../../../../../db/data/data-manager-interface";
import { useTheme } from "../../../../theme/theme-context";
import { useStorage } from "../../../../../db/storage-context";
import RequestItem from "../../request-item/request-item";
import "./collection.css";

type CollectionProps = {
  collection: Collection;
};

const CollectionComponent = ({ collection }: CollectionProps) => {
  const { theme } = useTheme();
  const [db, refeshStorage] = useStorage();
  const isCollectionOpen = collection.isOpen;
  console.log(collection);

  // console.log("📊 Collection componen rendered!");

  return (
    <>
      <li className="collection-item">
        <div className="collection">
          <div
            className="icon-button folder-button"
            onClick={() => {
              db.updateCollection(collection.id, { isOpen: !isCollectionOpen });
              refeshStorage();
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
            onInput={(event) => {
              db.renameCollection(
                collection.id,
                event.currentTarget.textContent ?? ""
              );
              refeshStorage();
            }}
          >
            {collection.title}
          </h3>
        </div>
        {isCollectionOpen && (
          <ul className="request-list">
            {db.getRequestsFromCollectionById(collection.id).map((request) => {
              return <RequestItem key={request.id} request={request} />;
            })}
          </ul>
        )}
      </li>
    </>
  );
};

export default CollectionComponent;
