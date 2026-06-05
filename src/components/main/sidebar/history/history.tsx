import { useStorage } from "../../../../db/storage-context";
import RequestItem from "../request-item/request-item";

const History = () => {
  const [storage] = useStorage();

  return (
    <>
      <ul className="request-list">
        {storage
          .getManager()
          .getRequestHistory()
          .map((request) => (
            <RequestItem request={request} />
          ))}
      </ul>
    </>
  );
};

export default History;
