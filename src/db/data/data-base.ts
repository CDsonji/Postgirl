import {
  Theme,
  type Collection,
  type Data,
  type DataManager,
  type HttpRequest,
  type HttpResponse,
  type Tab,
} from "./data-manager-interface";

export class Database implements DataManager {
  private data: Data;

  constructor(
    data: Data = {
      requests: {},
      collections: {},
      history: {},
      tabs: {},
      activeTab: null,
      theme: Theme.DARK,
    }
  ) {
    this.data = {
      requests: { ...data.requests },
      collections: { ...data.collections },
      history: { ...data.history },
      tabs: { ...data.tabs },
      activeTab: data.activeTab ? { ...data.activeTab } : null,
      theme: data.theme ?? Theme.DARK,
    };
  }
  setTabResponse(requestId: string, response: HttpResponse): void {
    const tab = this.data.tabs[requestId];
    if (!tab) {
      throw new Error(`tab with request id "${requestId}" not found`);
    }

    const updatedTab = {
      ...tab,
      response: { ...response },
    };

    console.log(updatedTab);

    this.data = {
      ...this.data,
      tabs: {
        ...this.data.tabs,
        [requestId]: updatedTab,
      },
      activeTab: {...updatedTab},
    };
  }

  updateTabForm(
    requestId: string,
    updates: Partial<Omit<HttpRequest, "collectionId">>
  ): void {
    const tab = this.data.tabs[requestId];
    if (!tab) {
      throw new Error(`tab with request id "${requestId}" not found`);
    }

    const existing = tab.request;

    const updatedTab = {
      ...tab,
      request: {
        ...existing,
        ...updates,
        params: updates.params ? { ...updates.params } : existing.params,
        headers: updates.headers ? { ...updates.headers } : existing.headers,
        body: updates.body,
      },
    };

    this.data = {
      ...this.data,
      tabs: {
        ...this.data.tabs,
        [requestId]: updatedTab,
      },
      activeTab: updatedTab,
    };
  }

  getTabs(): Tab[] {
    return Object.values(this.data.tabs)
      .sort((a, b) => Number(a.createdAt) - Number(b.createdAt))
      .map((tab) => this.cloneTab(tab));
  }

  addTab(requestId: string): void {
    const request = this.getRequestById(requestId);
    const tab = this.data.tabs[requestId];
    if (!tab) {
      const newTab: Tab = {
        createdAt: String(Date.now()),
        request: request,
        response: null,
      };

      this.data = {
        ...this.data,
        tabs: {
          ...this.data.tabs,
          [request.id]: newTab,
        },
      };
    }
    this.updateCurrentTab(requestId);
  }

  updateCurrentTab(requestId: string = ""): void {
    const tab = this.data.tabs[requestId];

    this.data = {
      ...this.data,
      activeTab: tab ? { ...tab } : null,
    };
  }

  removeTab(requestId: string): Tab {
    const tab = this.data.tabs[requestId];

    if (!tab) {
      throw new Error(`No Tab with current request id ${requestId} found`);
    }
    const tabs = this.getTabs();
    let index = tabs.findIndex((t) => t.request.id === requestId);
    let current = tabs.findIndex(
      (t) => t.request.id === this.data.activeTab?.request.id
    );
    // console.log(`current: ${current}`);
    // console.log(`index: ${index} ${index===0} ${index + 1 < tabs.length}`);
    if (current === index) {
      if (index === 0) {
        if (index + 1 < tabs.length) {
          // console.log("next");
          this.updateCurrentTab(tabs[index + 1].request.id);
        } else {
          // console.log("null");
          this.updateCurrentTab();
        }
      } else {
        // console.log("previous");
        this.updateCurrentTab(tabs[index! - 1].request.id);
      }
    }

    const newTabs = { ...this.data.tabs };
    delete newTabs[requestId];

    this.data = {
      ...this.data,
      tabs: newTabs,
    };

    return tab;
  }

  private cloneRequest(request: HttpRequest): HttpRequest {
    return {
      ...request,
      params: { ...request.params },
      headers: { ...request.headers },
      body: request.body,
    };
  }

  private cloneTab(tab: Tab): Tab {
    return {
      ...tab,
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
      tabs: { ...this.data.tabs },
      activeTab: this.data.activeTab ? { ...this.data.activeTab } : null,
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

  getRequestHistory(): [timestamp:string,request:HttpRequest][] {
    return Object.entries(this.data.history)
      .sort((a, b) => Number(b[0]) - Number(a[0]))
      // .map((timestamp) => this.data.history[timestamp]);
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
  addRequest(request: HttpRequest): HttpRequest {
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

    const newRequest = this.cloneRequest(request);

    this.data = {
      ...this.data,
      requests: {
        ...this.data.requests,
        [request.id]: newRequest,
      },
    };

    return newRequest;
  }

  updateRequest(requestId: string, updates: Partial<HttpRequest>): void {
    const existing = this.data.requests[requestId];

    if (!existing) {
      throw new Error(`Request with id "${requestId}" not found`);
    }

    const updatedRequest: HttpRequest = {
      ...existing,
      ...updates,
      params: updates.params ? { ...updates.params } : existing.params,
      headers: updates.headers ? { ...updates.headers } : existing.headers,
      body: updates.body,
    };

    this.data = {
      ...this.data,
      requests: {
        ...this.data.requests,
        [requestId]: updatedRequest,
      },
    };
  }

  addRequestToCollection(requestId: string, collectionId: string): void {
    const request = this.data.requests[requestId];

    if (!request) {
      throw new Error(`request with id ${requestId} not found`);
    }

    const tab = this.data.tabs[requestId];

    if (tab) {
      this.data = {
        ...this.data,
        tabs: {
          ...this.data.tabs,
          [requestId]: {
            ...tab,
            request: {
              ...tab.request,
              collectionId: collectionId,
            },
          },
        },
      };
    }

    this.data = {
      ...this.data,
      requests: {
        ...this.data.requests,
        [requestId]: {
          ...request,
          collectionId: collectionId,
        },
      },
    };
  }

  removeRequest(id: string): HttpRequest {
    const request = this.getRequestById(id);
    const tab = this.data.tabs[id];
    if (tab) {
      this.removeTab(id);
    }

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
      throw new Error(`Collection with id "${collection.id}" already exists`);
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
      tabs: {},
      activeTab: null,
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
