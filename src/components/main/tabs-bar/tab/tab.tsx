import { Link } from "react-router-dom";
import {
  Theme,
  type HttpRequest,
} from "../../../../db/data/data-manager-interface";
import "./tab.css";
import { useTheme } from "../../../theme/theme-context";

type TabProps = {
  request: HttpRequest;
  isActive: boolean;
};

const Tab = ({ request, isActive }: TabProps) => {
  const { theme } = useTheme();

  return (
    <li className={`tab ${isActive ? "active-tab" : ""}`}>
      {/* <Link to={`/tabs/${request.id}`} className="tab-link"> */}
      <h4 className="tab-title">
        <span className={`${request.method} method`}>{request.method}</span>{" "}
        {request.url}
      </h4>
      <div
        className="tab-button tab-exit-button"
        onClick={() => {}}
      >
        <img
          className="tab-button-icon"
          src={`./../../../../src/assets/exit-${
            theme === Theme.LIGHT ? "light" : "dark"
          }.svg`}
          alt="exit-logo"
        />
      </div>
      {/* </Link> */}
    </li>
  );
};

export default Tab;
