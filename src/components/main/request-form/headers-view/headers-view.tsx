import { useEffect, useState } from "react";
import { useStorage } from "../../../../db/storage-context";
import type { HttpRequest } from "../../../../db/data/data-manager-interface";
// import "./params-view.css";

type Props = {
  request: HttpRequest;
};

const HeadersView = ({ request }: Props) => {
  const [db, refreshStorage] = useStorage();
  const [headers, setHeaders] = useState<[string, string][]>([]);

  useEffect(() => {
    const entries = Object.entries(request.headers ?? {});
    setHeaders([...entries, ["", ""]]); // always keep empty row
  }, [request]);

  const update = (rows: [string, string][]) => {
    const valid = rows.filter(([k]) => k !== "");
    const obj = Object.fromEntries(valid);

    db.updateTabForm(request.id, {
      headers: obj,
    });

    refreshStorage();
  };

  const updateRow = (index: number, key?: string, value?: string) => {
    const copy = [...headers];

    if (key !== undefined) copy[index][0] = key;
    if (value !== undefined) copy[index][1] = value;

    let rows = copy.filter(
      ([k, v], i) => !(k === "" && v === "" && i !== copy.length - 1)
    );

    const last = rows[rows.length - 1];
    if (last[0] !== "" || last[1] !== "") {
      rows.push(["", ""]);
    }

    setHeaders(rows);
    update(rows);
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
              onChange={(e) => updateRow(i, e.target.value)}
            />

            <input
              className="kv-input second-input"
              placeholder="value"
              value={v}
              onChange={(e) => updateRow(i, undefined, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeadersView;
