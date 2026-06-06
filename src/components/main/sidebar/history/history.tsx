import { useStorage } from "../../../../db/storage-context";
import RequestItem from "../request-item/request-item";

const History = () => {
  const [db] = useStorage();

  return (
    <>
      <ul className="request-list">
        {db.getRequestHistory().map((request) => {
          return <RequestItem key={request.id} request={request} />;
        })}
      </ul>
    </>
  );
};

export default History;
