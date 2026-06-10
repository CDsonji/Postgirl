import { useStorage } from "../../../db/storage-context";
import RequestItem from "../request-item/request-item";
import { SidebarView } from "../sidebar";

const Requests = () => {
  const [db] = useStorage();
  const activeId = db.getData().activeTab?.request.id;

  return (
    <>
      <ul className="request-list sidebar-requests-list">
        {db.getAllRequests().map((request) => {
          return (
            <RequestItem
              key={request.id}
              request={request}
              isActive={activeId === request.id}
              itemKey={`${SidebarView.REQUESTS}_${request.id}`}
            />
          );
        })}
      </ul>
    </>
  );
};

export default Requests;
