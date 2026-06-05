import { useStorage } from "../../../../db/storage-context";
import CollectionComponent from "./collection/collection";

const Collections = () => {
  const [storage] = useStorage();

  return (
    <>
      <ul>
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
