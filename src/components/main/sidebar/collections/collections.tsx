import { useStorage } from "../../../../db/storage-context";
import CollectionComponent from "./collection/collection";
import "./collections.css";

const Collections = () => {
  const [data] = useStorage();
  console.log("📊 Collections component rendered!");

  return (
    <>
      <ul className="collections-list">
        {Object.values(data.collections).map((collection) => {
          return (
            <CollectionComponent key={collection.id} collection={collection} />
          );
        })}
      </ul>
    </>
  );
};
export default Collections;
