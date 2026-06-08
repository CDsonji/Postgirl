import { useEffect, useState } from "react";
import { useStorage } from "../../../../db/storage-context";
import type { HttpRequest } from "../../../../db/data/data-manager-interface";

type Props = {
  request: HttpRequest;
};

const HeadersView = ({ request }: Props) => {
  const [db, refreshStorage] = useStorage();
  const [headers, setHeaders] = useState<[string, string][]>(
    Object.entries(request.headers ?? {})
  );

  useEffect(() => {
    setHeaders(Object.entries(request.headers ?? {}));
  }, [request]);

  const update = (pairs: [string, string][]) => {
    const obj: Record<string, string> = {};

    pairs.forEach(([k, v]) => {
      if (k) obj[k] = v;
    });

    db.updateTabForm(request.id, {
      headers: obj,
    });

    refreshStorage();
  };

  const changeKey = (i: number, val: string) => {
    const copy = [...headers];
    copy[i][0] = val;
    setHeaders(copy);
    update(copy);
  };

  const changeValue = (i: number, val: string) => {
    const copy = [...headers];
    copy[i][1] = val;
    setHeaders(copy);
    update(copy);
  };

  const addRow = () => {
    setHeaders([...headers, ["", ""]]);
  };

  return (
    <div className="params-view form-view-item">
      <div className="kvs-container">
        {headers.map(([k, v], i) => (
          <div className="kv-item" key={i}>
            <input
              className="kv-input"
              placeholder="key"
              value={k}
              onChange={(e) => changeKey(i, e.target.value)}
            />
            <input
              className="kv-input second-input"
              placeholder="value"
              value={v}
              onChange={(e) => changeValue(i, e.target.value)}
            />
          </div>
        ))}
      </div>
      <button type="button" className="add-kv" onClick={addRow}>
        Add Header
      </button>
    </div>
  );
};

export default HeadersView;
