import type { Tab } from "../../../db/data/data-manager-interface";
import { useStorage } from "../../../db/storage-context";
import CollectionComponent from "./collection/collection";
import "./collections.css";

const Collections = () => {
  const [db, refreshStorage] = useStorage();
  const currentTab = db.getData().activeTab as Tab;
  let collectionId: string | undefined;
  currentTab
    ? (collectionId = db.getRequestById(currentTab.requestId).collectionId)
    : "";

  return (
    <>
      <ul className="collections-list collections-list">
        {db.getAllCollections().map((collection) => {
          return (
            <CollectionComponent
              key={collection.id}
              collection={collection}
              isActive={currentTab ? collectionId === collection.id : false}
            />
          );
        })}
      </ul>
      <div className="add-collection">
        <button
          className="add-collection-button"
          onClick={() => {
            db.addCollection({
              id: crypto.randomUUID(),
              title: "Untitled Collection",
              isOpen: false,
            });
            refreshStorage();
          }}
        >
          Add Collection
        </button>
      </div>
    </>
  );
};
export default Collections;
