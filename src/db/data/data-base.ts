import {
  Theme,
  type Collection,
  type Data,
  type DataManager,
  type Request,
} from "./data-manager-interface";
import { PageData } from "./page-data";
import type { HttpRequest } from "./http-request";
import type { RequestCollection } from "./request-collection";

export class Database implements DataManager {
  private data: PageData;

  constructor(
    data: Data = {
      requests: {},
      collections: {},
      history: {},
      theme: Theme.DARK,
    }
  ) {
    this.data = new PageData(
      data.requests,
      data.collections,
      data.history,
      data.theme
    );
  }

  toggleTheme(): void {
    this.data.theme === Theme.DARK
      ? (this.data.theme = Theme.LIGHT)
      : (this.data.theme = Theme.DARK);
  }

  getRequestHistory(): HttpRequest[] {
    return Object.keys(this.data.history)
      .sort((a, b) => Number(a) - Number(b))
      .map((time) => this.data.history[time]);
  }

  getPartialRequestHistory(start: number = 0, end: number): HttpRequest[] {
    return Object.keys(this.data.history)
      .sort((a, b) => Number(a) - Number(b))
      .slice(start, end)
      .map((time) => this.data.history[time]);
  }

  addRequestToHistory(request: HttpRequest): void {
    const timestamp = Date.now().toString();
    this.data.history[timestamp] = request;
  }

  removeRequestFromHistory(timestamp: number): HttpRequest {
    const key = timestamp.toString();
    const request = this.data.history[key];

    if (!request) {
      throw new Error(`No request found in history for timestamp ${timestamp}`);
    }

    delete this.data.history[key];
    return request;
  }

  getData(): Data {
    return this.data;
  }

  getRequestById(id: string): HttpRequest {
    if (!id.trim()) {
      throw new Error("Request id cannot be empty");
    }

    const request = this.findRequestById(id);

    if (!request) {
      throw new Error(`Request with id "${id}" not found`);
    }

    return request;
  }

  findRequestById(id: string): HttpRequest | undefined {
    if (!id.trim()) {
      return undefined;
    }

    return this.data.requests[id];
  }

  hasRequest(id: string): boolean {
    return this.findRequestById(id) !== undefined;
  }

  getCollectionById(id: string): RequestCollection {
    if (!id.trim()) {
      throw new Error("Collection id cannot be empty");
    }

    const collection = this.findCollectionById(id);

    if (!collection) {
      throw new Error(`Collection with id "${id}" not found`);
    }

    return collection;
  }

  findCollectionById(id: string): RequestCollection | undefined {
    if (!id.trim()) {
      return undefined;
    }

    return this.data.collections[id];
  }

  hasCollection(id: string): boolean {
    return this.findCollectionById(id) !== undefined;
  }

  getAllRequests(): HttpRequest[] {
    return Object.values(this.data.requests);
  }

  getAllCollections(): RequestCollection[] {
    return Object.values(this.data.collections);
  }

  getRequestsFromCollectionById(collectionId: string): HttpRequest[] {
    if (!collectionId.trim()) {
      throw new Error("Collection id cannot be empty");
    }

    this.getCollectionById(collectionId);

    return Object.values(this.data.requests).filter(
      (request) => request.collectionId === collectionId
    );
  }

  addRequest(request: HttpRequest): void {
    if (this.hasRequest(request.id)) {
      throw new Error(`Request with id "${request.id}" already exists`);
    }

    if (request.collectionId && !this.hasCollection(request.collectionId)) {
      throw new Error(
        `Collection with id "${request.collectionId}" does not exist`
      );
    }

    this.data.requests[request.id] = request;
  }

  removeRequest(id: string): HttpRequest {
    const request = this.getRequestById(id);

    delete this.data.requests[id];

    return request;
  }

  addCollection(collection: RequestCollection): void {
    if (this.hasCollection(collection.id)) {
      throw new Error(`Collection with id "${collection.id}" already exists`);
    }

    this.data.collections[collection.id] = collection;
  }

  renameCollection(collectionId: string, title: string): void {
    const collections = Object.values(this.data.collections);

    const count = collections.filter((c) => c.title === title).length;

    const collection = this.data.collections[collectionId];
    if (!collection) return;

    collection.title = `${title} (${count + 1})`;
  }

  removeCollection(id: string): RequestCollection {
    const collection = this.getCollectionById(id);

    const requestsInCollection = this.getRequestsFromCollectionById(id);

    for (const request of requestsInCollection) {
      delete this.data.requests[request.id];
    }

    delete this.data.collections[id];

    return collection;
  }

  clearRequests(): void {
    this.data.requests = {};
  }

  clearCollections(): void {
    this.data.requests = {};
    this.data.collections = {};
  }

  clearAll(): void {
    this.data.requests = {};
    this.data.collections = {};
  }
}
