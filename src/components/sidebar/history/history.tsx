import { useStorage } from "../../../db/storage-context";
import RequestItem from "../request-item/request-item";
import { SidebarView } from "../sidebar";

const History = () => {
  const [db] = useStorage();

  return (
    <>
      <ul className="request-list history-list">
        {db.getRequestHistory().map(([timestamp, request]) => {
          return (
            <RequestItem
              key={timestamp} // See warning below about using timestamps as keys
              request={request}
              isActive={false}
              itemKey={`${SidebarView.HISTORY}_${timestamp}`}
            />
          );
        })}
      </ul>
    </>
  );
};

export default History;
