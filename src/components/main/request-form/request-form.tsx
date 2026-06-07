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
  const request: HttpRequest | null = tab
    ? db.getRequestById(tab.requestId)
    : null;
  const [form, setForm] = useState<HttpRequest | null>(request);
  console.log(form);

  useEffect(() => {
    setForm(request);
  }, [tab]);

  //   const UpdateForm = (updates: Partial<HttpRequest | null>) => {
  //     return {
  //       ...form,
  //       ...updates,
  //     };
  //   };

  return (
    <>
      <div className="requet-form-container">
        {form ? (
          <form className="request-form">
            <div className="form-header">
              <div className="url-container">
                <MethodSelect
                  value={form.method}
                  onChange={(m) => setForm({ ...form, method: m })}
                />
                <input
                  type="text"
                  className="url-input"
                  defaultValue={form.url}
                  placeholder="Enter the URL of the Request"
                  onChange={(e) => {
                    setForm({ ...form, url: e.target.value });
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
                  className="save-button form-header-button"
                  onClick={() => {
                    db.updateRequest(form.id, { ...form });
                    refreshStorage();
                  }}
                >
                  <div className="save-button-container">
                    <img
                      className="save-logo"
                      src={`./../../../src/assets/save-${
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
