import { useStorage } from "../../../db/storage-context";
import CollectionComponent from "./collection/collection";
import "./collections.css";

const Collections = () => {
  const [db, refreshStorage] = useStorage();
  console.log("📊 Collections component rendered!");

  return (
    <>
      <ul className="collections-list collections-list">
        {db.getAllCollections().map((collection) => {
          return (
            <CollectionComponent key={collection.id} collection={collection} />
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
