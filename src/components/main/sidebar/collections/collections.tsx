import { useStorage } from "../../../../db/storage-context";
import CollectionComponent from "./collection/collection";
import "./collections.css"

const Collections = () => {
  const [storage] = useStorage();

  return (
    <>
      <ul className="collections-list">
        {storage
          .getManager()
          .getAllCollections()
          .map((collection) => {
            return <CollectionComponent collection={collection} />;
          })}
      </ul>
    </>
  );
};
export default Collections;
