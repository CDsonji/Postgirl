import { useEffect, useState } from "react";
import { useStorage } from "../../../db/storage-context";
import {
  Theme,
  type HttpRequest,
} from "../../../db/data/data-manager-interface";
import "./request-form.css";
import MethodSelect from "./method-select/method-select";
import { useTheme } from "../../theme/theme-context";
import ParamsView from "./params-view/params-view";
import HeadersView from "./headers-view/headers-view";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";

const FormView = {
  HEADERS: "headers",
  PARAMS: "params",
  BODY: "body",
};

export type HttpResponse = {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  time: number;
  size: number;
  error?: string;
};

type RequestState = "idle" | "loading" | "success" | "error";

const METHODS_WITH_BODY = ["POST", "PUT", "PATCH"];

const RequestFrom = () => {
  const [db, refreshStorage] = useStorage();
  const { theme } = useTheme();
  const [view, setView] = useState(FormView.PARAMS);
  const [requestState, setRequestState] = useState<RequestState>("idle");
  const [response, setResponse] = useState<HttpResponse | null>(null);
  const tab = db.getData().activeTab;
  const tabRequest: HttpRequest | null = tab?.createdAt ? tab.request : null;

  const Themeee = EditorView.theme({
    "&": {
      backgroundColor: "var(--page-secondary-background)",
      color: "var(--text-color)",
      fontSize: "1.3rem",
      border: "0.2rem solid var(--component-border)",
    },
    ".cm-activeLine": {
      backgroundColor:
        theme === Theme.DARK
          ? "rgba(255, 255, 255, 0.03)"
          : "rgba(0, 0, 0, 0.1)",
    },
    ".cm-gutters": {
      backgroundColor: "var(--page-secondary-background)",
      color: "#858585",
      border: "none",
    },
    ".cm-content": {
      backgroundColor: "var(--page-primary-background)",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "transparent",
    },
    ".cm-cursor": {
      borderLeftColor: "var(--text-color)",
      borderLeftWidth: "0.2rem",
    },
  });

  const sendRequest = async () => {
    const req = tab?.request;
    if (!req) return;

    const errors: string[] = [];

    // Validate URL
    let url: URL | null = null;
    try {
      url = new URL(req.url);
    } catch {
      errors.push("not a valid url");
    }

    // Validate headers
    Object.entries(req.headers ?? {}).forEach(([k, v]) => {
      if (!k || !v) {
        errors.push("malformed header");
      }
    });

    // Validate query params
    if (url) {
      url.searchParams.forEach((value, key) => {
        if (!key || !value) {
          errors.push("malformed query param");
        }
      });
    }

    if (errors.length) {
      setRequestState("error");
      setResponse({
        status: 0,
        statusText: "",
        headers: {},
        body: "",
        time: 0,
        size: 0,
        error: errors.join(", "),
      });
      return;
    }

    try {
      setRequestState("loading");

      const start = performance.now();

      const res = await fetch(req.url, {
        method: req.method,
        headers: req.headers,
        body: req.body ?? undefined,
      });

      const text = await res.text();
      const end = performance.now();

      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
        body: text,
        time: Math.round(end - start),
        size: new Blob([text]).size,
      });

      setRequestState("success");
    } catch {
      setRequestState("error");

      setResponse({
        status: 0,
        statusText: "",
        headers: {},
        body: "",
        time: 0,
        size: 0,
        error: "server can't be reached",
      });
    }
  };

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
                  value={tabRequest.url}
                  placeholder="Enter the URL of the Request"
                  onChange={(e) => {
                    const newUrl = e.target.value;

                    try {
                      const url = new URL(newUrl);

                      const params: Record<string, string> = {};
                      url.searchParams.forEach((value, key) => {
                        params[key] = value;
                      });

                      db.updateTabForm(tabRequest.id, {
                        url: newUrl,
                        params,
                      });

                      refreshStorage();
                    } catch {
                      // if the URL is temporarily invalid while typing
                      db.updateTabForm(tabRequest.id, { url: newUrl });
                      refreshStorage();
                    }
                  }}
                />
              </div>
              <div className="form-header-buttons">
                <button
                  type="button"
                  className="send-button form-header-button"
                  onClick={sendRequest}
                >
                  Send
                </button>
                <button
                  type="button"
                  className="reset-button form-header-button"
                  onClick={() => {
                    db.updateTabForm(
                      tabRequest.id,
                      db.getRequestById(tabRequest.id)
                    );
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
                  type="button"
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
            <div className="form-view-buttons">
              <button
                type="button"
                className={`form-view-button ${
                  view === FormView.PARAMS && "form-active-view"
                }`}
                onClick={() => setView(FormView.PARAMS)}
              >
                Query Params
              </button>
              <button
                type="button"
                className={`form-view-button ${
                  view === FormView.HEADERS && "form-active-view"
                }`}
                onClick={() => setView(FormView.HEADERS)}
              >
                Headers
              </button>
              {METHODS_WITH_BODY.includes(tabRequest.method) && (
                <button
                  type="button"
                  className={`form-view-button ${
                    view === FormView.BODY && "form-active-view"
                  }`}
                  onClick={() => setView(FormView.BODY)}
                >
                  Body
                </button>
              )}
            </div>
            <div className="form-view">
              {view === FormView.PARAMS && <ParamsView request={tabRequest} />}
              {view === FormView.HEADERS && (
                <HeadersView request={tabRequest} />
              )}
              {view === FormView.BODY && (
                <CodeMirror
                  value={tabRequest.body ?? ""}
                  height="100%"
                  // theme="dark"
                  extensions={[Themeee]}
                  onChange={(value) => {
                    db.updateTabForm(tabRequest.id, { body: value });
                    refreshStorage();
                  }}
                />
              )}
            </div>
          </form>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default RequestFrom;
