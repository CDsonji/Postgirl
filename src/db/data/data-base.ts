import {
  Theme,
  type Collection,
  type Data,
  type DataManager,
  type HttpRequest,
} from "./data-manager-interface";

export class Database implements DataManager {
  private data: Data;

  constructor(
    data: Data = {
      requests: {},
      collections: {},
      history: {},
      theme: Theme.DARK,
    }
  ) {
    this.data = {
      requests: { ...data.requests },
      collections: { ...data.collections },
      history: { ...data.history },
      theme: data.theme ?? Theme.DARK,
    };
  }

  // -------------------------
  // helpers
  // -------------------------
  private cloneData(overrides: Partial<Data> = {}): void {
    this.data = {
      requests: overrides.requests ?? this.data.requests,
      collections: overrides.collections ?? this.data.collections,
      history: overrides.history ?? this.data.history,
      theme: overrides.theme ?? this.data.theme,
    };
  }

  private cloneRequest(request: HttpRequest): HttpRequest {
    return {
      ...request,
      params: { ...request.params },
      headers: { ...request.headers },
      body: request.body ? { ...request.body } : undefined,
    };
  }

  private cloneCollection(collection: Collection): Collection {
    return { ...collection };
  }

  // -------------------------
  // read
  // -------------------------
  getData(): Data {
    return {
      requests: { ...this.data.requests },
      collections: { ...this.data.collections },
      history: { ...this.data.history },
      theme: this.data.theme,
    };
  }

  getRequestById(id: string): HttpRequest {
    if (!id.trim()) {
      throw new Error("Request id cannot be empty");
    }

    const request = this.data.requests[id];
    if (!request) {
      throw new Error(`Request with id "${id}" not found`);
    }

    return request;
  }

  getCollectionById(id: string): Collection {
    if (!id.trim()) {
      throw new Error("Collection id cannot be empty");
    }

    const collection = this.data.collections[id];
    if (!collection) {
      throw new Error(`Collection with id "${id}" not found`);
    }

    return collection;
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

    if (!this.data.collections[collectionId]) {
      throw new Error(`Collection with id "${collectionId}" not found`);
    }

    return Object.values(this.data.requests).filter(
      (request) => request.collectionId === collectionId
    );
  }

  getRequestHistory(): HttpRequest[] {
    return Object.keys(this.data.history)
      .sort((a, b) => Number(a) - Number(b))
      .map((timestamp) => this.data.history[timestamp]);
  }

  getPartialRequestHistory(start: number = 0, end: number): HttpRequest[] {
    return Object.keys(this.data.history)
      .sort((a, b) => Number(a) - Number(b))
      .slice(start, end)
      .map((timestamp) => this.data.history[timestamp]);
  }

  hasRequest(id: string): boolean {
    return !!this.data.requests[id];
  }

  hasCollection(id: string): boolean {
    return !!this.data.collections[id];
  }

  // -------------------------
  // history
  // -------------------------
  addRequestToHistory(request: HttpRequest): void {
    const timestamp = Date.now().toString();
    this.data = {
      ...this.data,
      history: {
        ...this.data.history,
        [timestamp]: this.cloneRequest(request),
      },
    };
  }

  removeRequestFromHistory(timestamp: number): HttpRequest {
    const key = timestamp.toString();
    const request = this.data.history[key];

    if (!request) {
      throw new Error(`No request found in history for timestamp ${timestamp}`);
    }

    const newHistory = { ...this.data.history };
    delete newHistory[key];

    this.data = {
      ...this.data,
      history: newHistory,
    };

    return request;
  }

  // -------------------------
  // requests
  // -------------------------
  addRequest(request: HttpRequest): void {
    if (!request.id.trim()) {
      throw new Error("Request id cannot be empty");
    }

    if (this.hasRequest(request.id)) {
      throw new Error(`Request with id "${request.id}" already exists`);
    }

    if (request.collectionId && !this.hasCollection(request.collectionId)) {
      throw new Error(
        `Collection with id "${request.collectionId}" does not exist`
      );
    }

    this.data = {
      ...this.data,
      requests: {
        ...this.data.requests,
        [request.id]: this.cloneRequest(request),
      },
    };
  }

  updateRequest(requestId: string, updates: Partial<HttpRequest>): void {
    const existing = this.data.requests[requestId];

    if (!existing) {
      throw new Error(`Request with id "${requestId}" not found`);
    }

    if (
      updates.collectionId !== undefined &&
      updates.collectionId !== "" &&
      !this.hasCollection(updates.collectionId)
    ) {
      throw new Error(
        `Collection with id "${updates.collectionId}" does not exist`
      );
    }

    const updatedRequest: HttpRequest = {
      ...existing,
      ...updates,
      params: updates.params ? { ...updates.params } : existing.params,
      headers: updates.headers ? { ...updates.headers } : existing.headers,
      body: updates.body
        ? { ...updates.body }
        : updates.body === undefined
          ? existing.body
          : undefined,
    };

    this.data = {
      ...this.data,
      requests: {
        ...this.data.requests,
        [requestId]: updatedRequest,
      },
    };
  }

  removeRequest(id: string): HttpRequest {
    const request = this.getRequestById(id);

    const newRequests = { ...this.data.requests };
    delete newRequests[id];

    this.data = {
      ...this.data,
      requests: newRequests,
    };

    return request;
  }

  // -------------------------
  // collections
  // -------------------------
  addCollection(collection: Collection): void {
    if (!collection.id.trim()) {
      throw new Error("Collection id cannot be empty");
    }

    if (this.hasCollection(collection.id)) {
      throw new Error(
        `Collection with id "${collection.id}" already exists`
      );
    }

    this.data = {
      ...this.data,
      collections: {
        ...this.data.collections,
        [collection.id]: this.cloneCollection(collection),
      },
    };
  }

  updateCollection(
    collectionId: string,
    updates: Partial<Omit<Collection, "id">>
  ): void {
    const existing = this.data.collections[collectionId];

    if (!existing) {
      throw new Error(`Collection with id "${collectionId}" not found`);
    }

    const updatedCollection: Collection = {
      ...existing,
      ...updates,
    };

    this.data = {
      ...this.data,
      collections: {
        ...this.data.collections,
        [collectionId]: updatedCollection,
      },
    };
  }

  renameCollection(collectionId: string, title: string): void {
    if (!title.trim()) {
      throw new Error("Collection title cannot be empty");
    }

    this.updateCollection(collectionId, { title });
  }

  removeCollection(id: string): Collection {
    const collection = this.getCollectionById(id);

    const newCollections = { ...this.data.collections };
    delete newCollections[id];

    const newRequests = Object.fromEntries(
      Object.entries(this.data.requests).map(([requestId, request]) => [
        requestId,
        request.collectionId === id
          ? { ...request, collectionId: undefined }
          : request,
      ])
    ) as Record<string, HttpRequest>;

    this.data = {
      ...this.data,
      collections: newCollections,
      requests: newRequests,
    };

    return collection;
  }

  clearRequests(): void {
    this.data = {
      ...this.data,
      requests: {},
    };
  }

  clearCollections(): void {
    const detachedRequests = Object.fromEntries(
      Object.entries(this.data.requests).map(([requestId, request]) => [
        requestId,
        { ...request, collectionId: undefined },
      ])
    ) as Record<string, HttpRequest>;

    this.data = {
      ...this.data,
      collections: {},
      requests: detachedRequests,
    };
  }

  clearAll(): void {
    this.data = {
      requests: {},
      collections: {},
      history: {},
      theme: this.data.theme,
    };
  }

  // -------------------------
  // theme
  // -------------------------
  toggleTheme(): void {
    this.data = {
      ...this.data,
      theme: this.data.theme === Theme.DARK ? Theme.LIGHT : Theme.DARK,
    };
  }
}
