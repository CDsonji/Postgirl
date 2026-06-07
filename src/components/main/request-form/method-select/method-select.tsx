import { useState } from "react";
import { Method, Theme } from "../../../../db/data/data-manager-interface";
import "./method-select.css";
import { useTheme } from "../../../theme/theme-context";

type Props = {
  value: Method;
  onChange: (method: Method) => void;
};

export default function MethodSelect({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const { theme } = useTheme();

  const methods = Object.values(Method);

  const select = (m: Method) => {
    onChange(m);
    setOpen(false);
  };

  return (
    <div className="method-select">
      <button
        type="button"
        className={`method-btn ${value}`}
        onClick={() => setOpen(!open)}
      >
        <div className="method-dropdown-text-container">
          <span className={`method ${value}`}>{value}</span>
          <img className="dropdown-logo"
            src={`./../../../../src/assets/dropdown-${
              theme === Theme.DARK ? "dark" : "light"
            }.svg`}
            alt="dropdown-logo"
          />
        </div>
      </button>
      {open && (
        <div className="method-menu">
          {methods.map((m) => (
            <div
              className={`method-option ${m === value ? "active-method" : ""}`}
              key={m}
              onClick={() => select(m)}
            >
              <span className={`method ${m}`}>{m}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
