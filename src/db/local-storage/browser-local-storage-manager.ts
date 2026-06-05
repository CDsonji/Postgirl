import { type Data, type DataManager, type HttpRequest } from "../data/data-manager-interface";
import { Database } from "../data/data-base";
import type { LocalStorageManager } from "./browser-local-storage-manager-interface";
import { PageData } from "../data/page-data";
import { RequestCollection } from "../data/request-collection";
import { Request } from "../data/request";


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
    }
  },
  "collections": {
    "col-1": {
      "id": "col-1",
      "title": "Users",
      "isOpen": "true"
    },
    "col-2": {
      "id": "col-2",
      "title": "Auth",
      "isOpen": "false"
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
  "theme": "Light-Mode"
}`;

export class BrowserLocalStorageManager implements LocalStorageManager {
  private readonly storageKey: string;
  private manager: DataManager | null = null;

  constructor(storageKey: string = "postgirl_database") {
    this.storageKey = storageKey;
  }

  getStorageKey(): string {
    return this.storageKey;
  }

  rehydrateCollections(
    raw: Record<string, any> = {}
  ): Record<string, RequestCollection> {
    const collections: Record<string, RequestCollection> = {};

    for (const [id, c] of Object.entries(raw)) {
      const collection = new RequestCollection(c.title, c.isOpen);
      (collection as any).id = id;
      collections[id] = collection;
    }

    return collections;
  }

  rehydrateRequests(
    raw: Record<string, any> = {}
  ): Record<string, HttpRequest> {
    const requests: Record<string, HttpRequest> = {};

    for (const [id, r] of Object.entries(raw)) {
      const request = new Request(
        r.id ?? id,
        r.url,
        r.method,
        r.params ?? {},
        r.headers ?? {},
        r.body,
        r.collectionId
      );

      requests[id] = request;
    }

    return requests;
  }

  initialize(): void {
    // const rawData = localStorage.getItem(this.storageKey);

    const rawData = sample;

    if (!rawData) {
      this.manager = new Database(new PageData());
      return;
    }

    try {
      const parsedData = JSON.parse(rawData) as Partial<Data>;

      const history = this.rehydrateRequests(parsedData.history);
      const collections = this.rehydrateCollections(parsedData.collections);
      const requests = this.rehydrateRequests(parsedData.requests);

      this.manager = new Database(
        new PageData(
          requests ?? {},
          collections ?? {},
          history ?? {},
          parsedData.theme
        )
      );
    } catch (error) {
      console.error("Failed to parse localStorage data:", error);

      this.manager = new Database(new PageData());
    }
  }

  getManager(): DataManager {
    if (!this.manager) {
      this.initialize();
    }

    return this.manager as DataManager;
  }

  getData(): Data {
    return this.getManager().getData();
  }

  save(): void {
    localStorage.setItem(
      this.storageKey,
      JSON.stringify(this.getManager().getData())
    );
  }

  // clear(): void {
  //   localStorage.removeItem(this.storageKey);
  //   this.manager = new Database({
  //     requests: {},
  //     collections: {},
  //     history: {},
  //   });
  // }

  // addRequest(request: HttpRequest): void {
  //   this.getManager().addRequest(request);
  //   this.save();
  // }

  // updateRequest(request: HttpRequest): void {
  //   this.getManager().updateRequest(request);
  //   this.save();
  // }

  // removeRequest(id: string): HttpRequest {
  //   const removed = this.getManager().removeRequest(id);
  //   this.save();
  //   return removed;
  // }

  // addCollection(collection: Collection): void {
  //   this.getManager().addCollection(collection);
  //   this.save();
  // }

  // updateCollection(collection: Collection): void {
  //   this.getManager().updateCollection(collection);
  //   this.save();
  // }

  // removeCollection(id: string): Collection {
  //   const removed = this.getManager().removeCollection(id);
  //   this.save();
  //   return removed;
  // }
}
