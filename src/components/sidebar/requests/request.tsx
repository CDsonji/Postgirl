import { useStorage } from "../../../db/storage-context";
import RequestItem from "../request-item/request-item";

const Requests = () => {
  const [db] = useStorage();

  return (
    <>
      <ul className="request-list">
        {db.getAllRequests().map((request) => {
          const activeId = db.getData().activeTab?.id;
          return <RequestItem key={request.id} request={request} isActive={activeId===request.id}
           />;
        })}
      </ul>
    </>
  );
};

export default Requests;