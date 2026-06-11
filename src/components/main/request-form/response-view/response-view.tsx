import { useState } from "react";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import type { HttpResponse } from "../request-form/request-form";
import "./response-view.css";

type ResponseViewProps = {
  response: HttpResponse;
};

const ResponseView = ({ response }: ResponseViewProps) => {
  const [view, setView] = useState<"body" | "headers">("body");

  const ReadOnlyTheme = EditorView.theme({
    "&": {
      backgroundColor: "var(--page-secondary-background)",
      color: "var(--text-color)",
      fontSize: "1.3rem",
    },
    ".cm-content": {
      backgroundColor: "var(--page-primary-background)",
    },
    ".cm-gutters": {
      backgroundColor: "var(--page-secondary-background)",
      color: "#858585",
      border: "none",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "transparent",
    },
    ".cm-activeLine": {
      backgroundColor: "transparent",
    },
  });

  const sizeInB = response.size;

  if (response.error) {
    return (
      <div className="response-view error-response">
        <h3>Error</h3>
        <p className="error-message">{response.error}</p>
      </div>
    );
  }

  return (
    <div className="response-view">
      {/* Header Part */}
      <div className="response-header">
        {/* Header Part 1: Buttons */}
        <div className="response-view-buttons">
          <button
            type="button"
            className={`form-view-button ${
              view === "body" ? "form-active-view" : ""
            }`}
            onClick={() => setView("body")}
          >
            Body
          </button>
          <button
            type="button"
            className={`form-view-button ${
              view === "headers" ? "form-active-view" : ""
            }`}
            onClick={() => setView("headers")}
          >
            Headers
          </button>
        </div>

        {/* Header Part 2: Meta Info */}
        <div className="response-meta">
          <span>
            Status:{" "}
            <span
              className={`status-code ${
                response.status >= 400 ? "error" : "success"
              }`}
            >
              {response.status} {response.statusText}
            </span>
          </span>
          <span>
            Time: <span className="time">{response.time} ms</span>
          </span>
          <span>
            Size: <span className="size">{sizeInB} B</span>
          </span>
        </div>
      </div>

      {/* Main Part */}
      <div className="response-body-container">
        {view === "body" && (
          <CodeMirror
            value={response.body}
            height="100%"
            extensions={[ReadOnlyTheme, EditorView.lineWrapping, json()]}
            readOnly={true}
            editable={false}
          />
        )}

        {view === "headers" && (
          <div className="kvs-container">
            {response.headers &&
              Object.entries(response.headers).map(([k, v], i) => (
                <div className="kv-item" key={i}>
                  <input
                    className="kv-input"
                    placeholder="key"
                    value={k}
                    readOnly
                  />
                  <input
                    className="kv-input second-input"
                    placeholder="value"
                    value={v}
                    readOnly
                  />
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponseView;
