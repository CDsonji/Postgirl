import {
  Theme,
  type Collection,
  type Data,
  type DataManager,
  type HttpRequest,
  type Tab,
} from "../data/data-manager-interface";
import { Database } from "../data/data-base";
import type { LocalStorageManager } from "./browser-local-storage-manager-interface";
import type { HttpResponse } from "../../components/main/request-form/request-form";

function normalizeTab(raw: any): Tab {
  return {
    createdAt: raw?.createdAt,
    request: normalizeHttpRequest(raw?.request, raw?.request.id),
    response: raw?.response ? normalizeHttpResponse(raw?.response) : null,
  };
}

function normalizeHttpResponse(raw: any): HttpResponse {
  return {
    status: raw?.status,
    statusText: raw?.statusText,
    headers: raw?.headers,
    body: raw?.body,
    time: raw?.time,
    size: raw?.time,
    error: raw?.error,
  };
}

function normalizeHttpRequest(raw: any, fallbackId: string): HttpRequest {
  return {
    id: raw?.id ?? fallbackId,
    collectionId: raw?.collectionId,
    url: String(raw?.url ?? ""),
    method: raw?.method,
    params: raw?.params ?? {},
    headers: raw?.headers ?? {},
    body: raw?.body,
  };
}

function normalizeCollection(
  raw: any,
  fallbackId: string | undefined
): Collection {
  return {
    id: raw?.id ?? fallbackId,
    title: String(raw?.title ?? ""),
    isOpen: Boolean(raw?.isOpen),
  };
}

function normalizeData(parsed: Partial<Data>): Data {
  const requests: Record<string, HttpRequest> = {};
  const collections: Record<string, Collection> = {};
  const history: Record<string, HttpRequest> = {};
  const tabs: Record<string, Tab> = {};

  for (const [id, rawRequest] of Object.entries(parsed.requests ?? {})) {
    requests[id] = normalizeHttpRequest(rawRequest, id);
  }

  for (const [id, rawCollection] of Object.entries(parsed.collections ?? {})) {
    collections[id] = normalizeCollection(rawCollection, id);
  }

  for (const [timestamp, rawHistoryRequest] of Object.entries(
    parsed.history ?? {}
  )) {
    history[timestamp] = normalizeHttpRequest(rawHistoryRequest, timestamp);
  }

  for (const [id, rawTab] of Object.entries(parsed.tabs ?? {})) {
    tabs[id] = normalizeTab(rawTab);
  }

  return {
    requests,
    collections,
    history,
    tabs,
    activeTab: normalizeTab(parsed.activeTab) ?? null,
    theme: parsed.theme ?? Theme.DARK,
  };
}

export class BrowserLocalStorageManager implements LocalStorageManager {
  private readonly storageKey: string;

  constructor(storageKey: string = "postgirl_database") {
    this.storageKey = storageKey;
  }

  getStorageKey(): string {
    return this.storageKey;
  }

  initialize(): DataManager {
    let manager: DataManager;

    const rawData = localStorage.getItem(this.storageKey) || "";
    // typeof localStorage !== "undefined"
    //   ? localStorage.getItem(this.storageKey)
    //   : "";

    try {
      const parsedData = JSON.parse(rawData) as Partial<Data>;
      const normalized = normalizeData(parsedData);

      manager = new Database(normalized);
    } catch (error) {
      manager = new Database();
    }

    return manager;
  }

  save(manager: DataManager): DataManager {
    if (typeof localStorage === "undefined") return new Database();
    const data = manager.getData();
    localStorage.setItem(this.storageKey, JSON.stringify(manager.getData()));
    return new Database({
      ...data,
    });
  }
}
