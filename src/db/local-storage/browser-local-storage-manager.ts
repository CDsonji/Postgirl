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

const sample = `{
  "requests": {
    "req-1": {
      "id": "req-1",
      "collectionId": "col-1",
      "url": "https://api.example.com/users",
      "method": "GET",
      "params": {
        "page": 1,
        "limit": 10
      },
      "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer token123"
      },
      "body": {
        "name": "Alice",
        "age": 25
      }
    },
    "req-2": {
      "id": "req-2",
      "collectionId": "col-1",
      "url": "https://api.example.com/users",
      "method": "POST",
      "params": {},
      "headers": {
        "Content-Type": "application/json"
      },
      "body": {
        "name": "Bob"
      }
    },
    "req-3": {
      "id": "req-3",
      "collectionId": "col-1",
      "url": "https://api.example.com/users",
      "method": "OPTIONS",
      "params": {},
      "headers": {
        "Content-Type": "application/json"
      },
      "body": {
        "name": "Bob"
      }
    },
    "req-4": {
      "id": "req-4",
      "collectionId": "col-1",
      "url": "https://api.example.com/users",
      "method": "HEAD",
      "params": {},
      "headers": {
        "Content-Type": "application/json"
      },
      "body": {
        "name": "Bob"
      }
    }
  },
  "collections": {
    "col-1": {
      "id": "col-1",
      "title": "Users",
      "isOpen": true
    },
    "col-2": {
      "id": "col-2",
      "title": "Auth",
      "isOpen": false
    }
  },
  "history": {
    "1710000000000": {
      "id": "req-1",
      "collectionId": "col-1",
      "url": "https://api.example.com/users",
      "method": "GET",
      "params": {
        "page": 1
      },
      "headers": {
        "Content-Type": "application/json"
      },
      "body": {
        "name": "Alice"
      }
    }
  },
  "tabs": {
    "req-1": {
      "createdAt": "1",
      "request": {
        "id": "req-1",
        "collectionId": "col-1",
        "url": "https://api.example.com/users",
        "method": "GET",
        "params": {
          "page": 1,
          "limit": 10
        },
        "headers": {
          "Content-Type": "application/json",
          "Authorization": "Bearer token123"
        },
        "body": {
          "name": "Alice",
          "age": 25
        }
      }
    },
    "req-2": {
      "createdAt": "2",
      "request": {
        "id": "req-2",
        "collectionId": "col-1",
        "url": "https://api.example.com/users",
        "method": "POST",
        "params": {},
        "headers": {
          "Content-Type": "application/json"
        },
        "body": {
          "name": "Bob"
        }
      }
    },
    "req-3": {
      "createdAt": "3",
      "request": {
        "id": "req-3",
        "collectionId": "col-1",
        "url": "https://api.example.com/users",
        "method": "OPTIONS",
        "params": {},
        "headers": {
          "Content-Type": "application/json"
        },
        "body": {
          "name": "Bob"
        }
      }
    },
    "req-4": {
        "createdAt": "4",
        "request": {
        "id": "req-4",
        "collectionId": "col-1",
        "url": "https://api.example.com/users",
        "method": "HEAD",
        "params": {},
        "headers": {
          "Content-Type": "application/json"
        },
        "body": {
          "name": "Bob"
        }
      } 
    }
  },
  "activeTab": {
      "createdAt": "2",
      "request": {
        "id": "req-2",
        "collectionId": "col-1",
        "url": "https://api.example.com/users",
        "method": "POST",
        "params": {},
        "headers": {
          "Content-Type": "application/json"
        },
        "body": {
          "name": "Bob"
        }
      }
    },
  "theme": "Light-Mode"
}`;

function normalizeTab(raw: any): Tab {
  return {
    createdAt: raw?.createdAt,
    request: normalizeHttpRequest(raw?.request, raw?.request.id),
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

function normalizeCollection(raw: any, fallbackId: string | undefined): Collection {
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

    const rawData =
      typeof localStorage !== "undefined"
        ? localStorage.getItem(this.storageKey) ?? sample
        : sample;

    try {
      const parsedData = JSON.parse(rawData) as Partial<Data>;
      const normalized = normalizeData(parsedData);

      manager = new Database(normalized);
    } catch (error) {
      console.error("Failed to parse storage data:", error);
      manager = new Database();
    }

    return manager;
  }

  save(manager: DataManager): DataManager {
    // if (typeof localStorage === "undefined") return;
    const data = manager.getData();
    localStorage.setItem(this.storageKey, JSON.stringify(manager.getData()));
    return new Database({
      ...data,
    });
  }
}
