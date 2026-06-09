import "./internal-error-view.css";

type InternalErrorViewProps = {
  error: string;
};

export const InternalErrorView = ({ error }: InternalErrorViewProps) => {
  // The error string might contain multiple errors joined by ", " (based on your sendRequest logic)
  const errorList = error.split(", ");

  return (
    <div className="error-response-container">
      <img
        className="postgirl-img"
        src="/assets/spacegirl.svg"
        alt="Postgirl"
      />

      <div className="error-messages" style={{ textAlign: "center" }}>
        <h2>Request Failed</h2>
        {errorList.map((err, index) => (
          <h3 className="internal-error-text" key={index}>
            {err}
          </h3>
        ))}
      </div>
    </div>
  );
};

export default InternalErrorView;
