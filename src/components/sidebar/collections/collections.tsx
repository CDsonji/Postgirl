import type { Tab } from "../../../db/data/data-manager-interface";
import { useStorage } from "../../../db/storage-context";
import CollectionComponent from "./collection/collection";
import "./collections.css";

const Collections = () => {
  const [db, refreshStorage] = useStorage();
  const currentTab = db.getData().activeTab as Tab;
  let collectionId: string | undefined;
  currentTab
    ? (collectionId = db.getRequestById(currentTab.request.id).collectionId)
    : "";

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target?.result as string;

      // Call the import method you implemented in your DataManager
      const success = db.importCollectionFromJson(content);

      if (success) {
        refreshStorage();
      } else {
        alert("Failed to import collection. Please check the JSON format.");
      }
    };

    reader.readAsText(file);
    // Reset the input value so the same file can be selected again if needed
    event.target.value = "";
  };

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
      <div className="collection-opearation-buttons">
        <button
          className="add-collection-button collection-opearation-button"
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
        <button
          className="import-collection-button collection-opearation-button"
          onClick={() => {
            // Create a temporary hidden input to trigger the file picker
            const input = document.createElement("input");
            input.type = "file";
            input.accept = ".json";
            input.onchange = (e) => handleImport(e as any);
            input.click();
          }}
        >
          Import Collection
        </button>
      </div>
    </>
  );
};
export default Collections;
