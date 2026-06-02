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

export interface HttpRequest {
  id: string;
  collectionId?: string;
  url: string;
  method: Method;
  params: Record<string, string | number>;
  headers: Record<string, string | number>;
  body?: Record<string, unknown>;
  setCollectionId(collectionId: string): void;
  setUrl(url: string): void;
  setMethod(method: Method): void;
  getParam(key: string): string | number;
  addParam(key: string, value: string | number): void;
  removeParam(key: string): string | number;
  getHeader(key: string): string | number;
  addHeader(key: string, value: string | number): void;
  removeHeader(key: string): string | number;
  getBody(): Record<string, unknown>;
  setBody(body: Record<string, unknown>): void;
}

export interface Collection {
  id: string;
  title: string;
}

export interface Data {
  requests: Record<string, HttpRequest>;
  collections: Record<string, Collection>;
  history: Record<string, HttpRequest>;
}

export interface DataManager {
  getData(): Data;

  getRequestById(id: string): HttpRequest;
  getCollectionById(id: string): Collection;

  getAllRequests(): HttpRequest[];
  getAllCollections(): Collection[];
  getRequestsFromCollectionById(collectionId: string): HttpRequest[];

  getRequestHistory(): HttpRequest[];
  getPartialRequestHistory(start: number, end: number): HttpRequest[];
  addRequestToHistory(request: HttpRequest): void;
  removeRequestFromHistory(timestamp: number): HttpRequest;

  hasRequest(id: string): boolean;
  hasCollection(id: string): boolean;

  addRequest(request: HttpRequest): void;
  updateRequest(request: HttpRequest): void;
  removeRequest(id: string): HttpRequest;

  addCollection(collection: Collection): void;
  updateCollection(collection: Collection): void;
  removeCollection(id: string): Collection;

  clearRequests(): void;
  clearCollections(): void;
  clearAll(): void;
}
