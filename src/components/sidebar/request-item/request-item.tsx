import { useState } from "react";
import {
  Theme,
  type HttpRequest,
} from "../../../db/data/data-manager-interface";
import { useTheme } from "../../theme/theme-context";
import { useStorage } from "../../../db/storage-context";
import "./request-item.css";

type RequestItemProps = {
  request: HttpRequest;
};

const RequestItem = ({ request }: RequestItemProps) => {
  const { theme } = useTheme();
  const [db, refreshStorage] = useStorage();

  const [openCollections, setOpenCollections] = useState(false);

  return (
    <>
      <li className="request-item-container">
        <div className="request-item">
          <div className="request-item-method">
            <span className={`${request.method} method`}>{request.method}</span>
          </div>
          <div className="request-item-url">{request.url}</div>
          <div className="request-item-buttons">
            <div
              className="request-item-button add-button-wrapper"
              onMouseEnter={() => setOpenCollections(true)}
              onMouseLeave={() => setOpenCollections(false)}
            >
              <div className="add-button" title="Add To Collection">
                <img
                  className="request-item-button-icon"
                  src={`./../../../../src/assets/add-${
                    theme === Theme.LIGHT ? "light" : "dark"
                  }.svg`}
                  alt="add-logo"
                />
              </div>
              {openCollections && (
                <ul className="collection-dropdown">
                  {db.getAllCollections().map((collection) => (
                    <li
                      key={collection.id}
                      className="collection-dropdown-item"
                      onClick={() => {
                        db.updateRequest(request.id, {
                          collectionId: collection.id,
                        });
                        setOpenCollections(false);
                        refreshStorage();
                      }}
                    >
                      {collection.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div
              className="request-item-button delete-button"
              onClick={() => {
                db.removeRequest(request.id);
                setOpenCollections(false);
                refreshStorage();
              }}
            >
              <img
                className="request-item-button-icon"
                src={`./../../../../src/assets/delete-${
                  theme === Theme.LIGHT ? "light" : "dark"
                }.svg`}
                alt="add-logo"
              />
            </div>
          </div>
        </div>
      </li>
    </>
  );
};

export default RequestItem;
