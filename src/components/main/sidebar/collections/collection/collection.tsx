import { useState } from "react";
import {
  Theme,
  type Collection,
} from "../../../../../db/data/data-manager-interface";
import { useTheme } from "../../../../theme/theme-context";
import { useStorage } from "../../../../../db/storage-context";
import RequestItem from "../../request-item/request-item";

type CollectionProps = {
  collection: Collection;
};

const CollectionComponent = ({ collection }: CollectionProps) => {
  const [isCollectionOpen, setCollectionOpen] = useState(collection.isOpen);
  const { theme } = useTheme();
  const [storage, refeshStorage] = useStorage();

  return (
    <>
      <li className="collection-item">
        <div className="collection">
          <div
            className="icon-button folder-button"
            onClick={() => {
              setCollectionOpen((prev) => {
                const next = !prev;
                try {
                  storage
                    .getManager()
                    .getCollectionById(collection.id)
                    .setOpen(next);
                } catch (error) {
                  console.error(error);
                }

                refeshStorage();

                return next;
              });
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
              storage
                .getManager()
                .renameCollection(
                  collection.id,
                  event.currentTarget.textContent ?? ""
                );
              refeshStorage;
            }}
          >
            {collection.title}
          </h3>
          <ul className="request-list">
            {storage
              .getManager()
              .getRequestsFromCollectionById(collection.id)
              .map((request) => {
                return <RequestItem request={request} />;
              })}
          </ul>
        </div>
      </li>
    </>
  );
};

export default CollectionComponent;
