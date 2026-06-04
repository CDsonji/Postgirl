import { useState } from "react";
import {
  Theme,
  type HttpRequest,
} from "../../../../db/data/data-manager-interface";
import { useTheme } from "../../../theme/theme-context";
import { useStorage } from "../../../../db/storage-context";
import "./request-item.css";

type RequestItemProps = {
  request: HttpRequest;
};

const RequestItem = ({ request }: RequestItemProps) => {
  const { theme } = useTheme();
  const storage = useStorage();

  const [openCollections, setOpenCollections] = useState(false);

  const toggleOpenCollections = () => {
    setOpenCollections(!openCollections);
  };

  return (
    <>
      <li className="request-item-container">
        <div className="request-item">
            <div className="request-item-method">
              <span className={`${request.method} method`}>
                {request.method}
              </span>
            </div>
            <div className="request-item-url">{request.url}</div>
          <div className="request-item-buttons">
            <div
              className={`request-item-button add-button ${
                openCollections ? "active" : ""
              }`}
              onClick={() => toggleOpenCollections}
            >
              <img
                className="request-item-button-icon"
                src={`./../../../../src/assets/add-${
                  theme === Theme.LIGHT ? "light" : "dark"
                }.svg`}
                alt="add-logo"
              />
            </div>
            <div className="request-item-button delete-button" onClick={() => {}}>
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
        <ul className="collection-dropdown">
          {storage
            .getManager()
            .getAllCollections()
            .map((collection) => {
              return (
                <li
                  className="collection-dropdown-item"
                  onClick={() => {
                    request.setCollectionId(collection.id);
                    storage.save();
                  }}
                >
                  {collection.title}
                </li>
              );
            })}
        </ul>
      </li>
    </>
  );
};

export default RequestItem;
