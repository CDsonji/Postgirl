import { useStorage } from "../../../../db/storage-context";
import type { HttpRequest } from "../../../../db/data/data-manager-interface";

type Props = {
  request: HttpRequest;
};

const BodyView = ({ request }: Props) => {
  const [db, refreshStorage] = useStorage();

  return (
    <textarea
      style={{ width: "100%", height: "200px" }}
      value={request.body ?? ""}
      onChange={(e) => {
        db.updateTabForm(request.id, {
          body: e.target.value,
        });
        refreshStorage();
      }}
    />
  );
};

export default BodyView;
