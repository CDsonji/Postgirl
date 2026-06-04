import { Method } from "../../../../db/data/data-manager-interface";
import { Request } from "../../../../db/data/request";
import RequestItem from "../request-item/request-item";

const History = () => {
  return (
    <>
      {/* testing request-item */}
      <ul className="request-list">
        <RequestItem
          request={new Request("https://localhost:8000", Method.GET)}
        />
        <RequestItem
          request={new Request("https://localhost:8000/products", Method.PATCH)}
        />
        <RequestItem
          request={new Request("https://localhost:8000/studetnssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss", Method.HEAD)}
        />
        <RequestItem
          request={new Request("https://localhost:8000/teachers", Method.OPTIONS)}
        />
      </ul>
    </>
  );
};

export default History
