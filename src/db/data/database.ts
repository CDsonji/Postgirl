import type { Collection, Data, DataManager, HttpRequest } from "./data-manager-interface";

export class Database implements DataManager {
  private data: Data;

  constructor(data: Data = { requests: {}, collections: {} }) {
    this.data = {
      requests: { ...data.requests },
      collections: { ...data.collections },
    };
  }

  getData(): Data {
    return {
      requests: { ...this.data.requests },
      collections: { ...this.data.collections },
    };
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

  getCollectionById(id: string): Collection {
    if (!id.trim()) {
      throw new Error("Collection id cannot be empty");
    }

    const collection = this.findCollectionById(id);

    if (!collection) {
      throw new Error(`Collection with id "${id}" not found`);
    }

    return collection;
  }

  findCollectionById(id: string): Collection | undefined {
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

  getAllCollections(): Collection[] {
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

  updateRequest(request: HttpRequest): void {
    if (!this.hasRequest(request.id)) {
      throw new Error(`Request with id "${request.id}" does not exist`);
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

  addCollection(collection: Collection): void {
    if (this.hasCollection(collection.id)) {
      throw new Error(`Collection with id "${collection.id}" already exists`);
    }

    this.data.collections[collection.id] = collection;
  }

  updateCollection(collection: Collection): void {
    if (!this.hasCollection(collection.id)) {
      throw new Error(`Collection with id "${collection.id}" does not exist`);
    }

    this.data.collections[collection.id] = collection;
  }

  removeCollection(id: string): Collection {
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
