export const Method = {
  GET: "GET",
  HEAD: "HEAD",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  CONNECT: "CONNECT",
  OPTIONS: "OPTIONS",
  TRACE: "TRACE",
  PATCH: "PATCH",
} as const;

export type Method = (typeof Method)[keyof typeof Method];

export const Theme = {
  DARK: "Dark-Mode",
  LIGHT: "Light-Mode",
} as const;

export type Theme = (typeof Theme)[keyof typeof Theme];

export interface HttpRequest {
  id: string;
  collectionId?: string;
  url: string;
  method: Method;
  params: Record<string, string>;
  headers: Record<string, string>;
  body?: string;
}

export interface HttpResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  time: number;
  size: number;
  error?: string;
}

export interface Collection {
  id: string;
  title: string;
  isOpen: boolean;
}

export interface Data {
  requests: Record<string, HttpRequest>;
  collections: Record<string, Collection>;
  history: Record<string, HttpRequest>;
  tabs: Record<string, Tab>;
  activeTab: Tab | null;
  theme: Theme;
}

export interface Tab {
  createdAt: string;
  request: HttpRequest;
  response: HttpResponse | null;
}

export interface DataManager {
  getData(): Data;

  getRequestById(id: string): HttpRequest;
  getCollectionById(id: string): Collection;

  getAllRequests(): HttpRequest[];
  getAllCollections(): Collection[];
  getRequestsFromCollectionById(collectionId: string): HttpRequest[];

  getRequestHistory(): [timestamp: string, request: HttpRequest][];
  // getPartialRequestHistory(start: number, end: number): HttpRequest[];
  addRequestToHistory(request: HttpRequest): void;
  removeRequestFromHistory(timestamp: string): HttpRequest;

  hasRequest(id: string): boolean;
  hasCollection(id: string): boolean;

  addRequest(request: HttpRequest): HttpRequest;
  updateRequest(
    requestId: string,
    updates: Partial<Omit<HttpRequest, "collectionId">>
  ): void;
  addRequestToCollection(requestId: string, collectionId: string): void;
  removeRequest(id: string): HttpRequest;

  addCollection(collection: Collection): void;
  exportCollectionToJson(collectionId: string): string | null;
  importCollectionFromJson(json: string): boolean;
  updateCollection(
    collectionId: string,
    updates: Partial<Omit<Collection, "id">>
  ): void;
  renameCollection(collectionId: string, title: string): void;
  removeCollection(id: string): Collection;

  getTabs(): Tab[];
  addTab(requestId: string): void;
  updateCurrentTab(requestId: string): void;
  updateTabForm(
    requestId: string,
    updates: Partial<Omit<HttpRequest, "collectionId">>
  ): void;

  setTabResponse(requestId: string, response: HttpResponse): void;
  removeTab(requestId: string): Tab;

  // clearRequests(): void;
  // clearCollections(): void;
  // clearAll(): void;

  toggleTheme(): void;
}
