import { useEffect, useState } from "react";
import { useStorage } from "../../../db/storage-context";
import {
  Theme,
  type HttpRequest,
} from "../../../db/data/data-manager-interface";
import "./request-form.css";
import MethodSelect from "./method-select/method-select";
import { useTheme } from "../../theme/theme-context";

const RequestFrom = () => {
  const [db, refreshStorage] = useStorage();
  const { theme } = useTheme();
  const tab = db.getData().activeTab;

  const tabRequest: HttpRequest | null = tab ? tab.request : null;
  // console.log(tabRequest);
  // const [form, setForm] = useState<HttpRequest | null>(request);
  // console.log(form);

  // useEffect(() => {
  //   setForm(request);
  // }, [tab]);

  return (
    <>
      <div className="requet-form-container">
        {tabRequest ? (
          <form className="request-form">
            <div className="form-header">
              <div className="url-container">
                <MethodSelect
                  value={tabRequest.method}
                  onChange={(m) => {
                    db.updateTabForm(tabRequest.id, {
                      method: m,
                    });
                    refreshStorage();
                  }}
                />
                <input
                  type="text"
                  className="url-input"
                  defaultValue={tabRequest.url}
                  placeholder="Enter the URL of the Request"
                  onChange={(e) => {
                    db.updateTabForm(tabRequest.id, {
                      ...tabRequest,
                      url: e.target.value,
                    });
                    refreshStorage();
                  }}
                />
              </div>
              <div className="form-header-buttons">
                <button
                  className="send-button form-header-button"
                  onClick={() => {}}
                >
                  Send
                </button>
                <button
                  className="reset-button form-header-button"
                  onClick={() => {
                    db.updateRequest(tabRequest.id, { ...tabRequest });
                    refreshStorage();
                  }}
                >
                  <div className="reset-button-container">
                    <img
                      className="reset-logo"
                      src={`./../../../public/assets/reset-${
                        theme === Theme.DARK ? "dark" : "light"
                      }.svg`}
                      alt="reset-logo"
                    />
                    <span>Reset</span>
                  </div>
                </button>
                <button
                  className="save-button form-header-button"
                  onClick={() => {
                    db.updateRequest(tabRequest.id, { ...tabRequest });
                    refreshStorage();
                  }}
                >
                  <div className="save-button-container">
                    <img
                      className="save-logo"
                      src={`./../../../public/assets/save-${
                        theme === Theme.DARK ? "dark" : "light"
                      }.svg`}
                      alt="save-logo"
                    />
                    <span>Save</span>
                  </div>
                </button>
              </div>
            </div>
          </form>
        ) : null}
      </div>
    </>
  );
};

export default RequestFrom;
