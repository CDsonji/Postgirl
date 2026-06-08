import { useEffect, useState } from "react";
import { useStorage } from "../../../../db/storage-context";
import type { HttpRequest } from "../../../../db/data/data-manager-interface";
import "./params-view.css";
type Props = {
  request: HttpRequest;
};

const ParamsView = ({ request }: Props) => {
  const [db, refreshStorage] = useStorage();
  const [params, setParams] = useState<[string, string][]>(
    Object.entries(request.params ?? {})
  );

  // sync when request changes
  useEffect(() => {
    setParams(Object.entries(request.params ?? {}));
  }, [request]);

  const update = (newParams: [string, string][]) => {
    const obj: Record<string, string> = {};

    newParams.forEach(([k, v]) => {
      if (k) obj[k] = v;
    });

    const url = new URL(request.url);
    url.search = new URLSearchParams(params).toString();

    console.log(url);

    db.updateTabForm(request.id, {
      params: obj,
      url: url.toString(),
    });
    refreshStorage();
  };

  const changeKey = (index: number, value: string) => {
    const copy = [...params];
    copy[index][0] = value;
    setParams(copy);
    update(copy);
  };

  const changeValue = (index: number, value: string) => {
    const copy = [...params];
    copy[index][1] = value;
    setParams(copy);
    update(copy);
  };

  const addRow = () => {
    setParams([...params, ["", ""]]);
  };

  return (
    <div className="params-view form-view-item">
      <div className="kvs-container">
        {params.map(([k, v], i) => (
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
        Add Param
      </button>
    </div>
  );
};

export default ParamsView;
