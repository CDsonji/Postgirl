import { useStorage } from "../../../db/storage-context";
import RequestItem from "../request-item/request-item";

const History = () => {
  const [db] = useStorage();

  return (
    <>
      <ul className="request-list history-list">
        {db
          .getRequestHistory()
          .map(([timestamp, request]) => {
            return (
              <RequestItem
                key={timestamp} // See warning below about using timestamps as keys
                request={request}
                isActive={false}
              />
            );
          })}
      </ul>
    </>
  );
};

export default History;
