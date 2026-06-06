import { useStorage } from "../../../../db/storage-context";
import RequestItem from "../request-item/request-item";

const History = () => {
  const [data] = useStorage();

  return (
    <>
      <ul className="request-list">
        {Object.values(data.history).map((request) => {
          return <RequestItem key={request.id} request={request} />;
        })}
      </ul>
    </>
  );
};

export default History;
