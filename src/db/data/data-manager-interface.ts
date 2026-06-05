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

export interface Request {
  id: string;
  collectionId?: string;
  url: string;
  method: Method;
  params: Record<string, string | number>;
  headers: Record<string, string | number>;
  body?: Record<string, unknown>;
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
  isOpen: boolean;
  setTitle(title: string): void;
  setOpen(state: boolean): void;
}

export interface Data {
  requests: Record<string, Request>;
  collections: Record<string, Collection>;
  history: Record<string, Request>;
  theme: Theme;
}

export interface DataManager {
  getData(): Data;

  getRequestById(id: string): Request;
  getCollectionById(id: string): Collection;

  getAllRequests(): Request[];
  getAllCollections(): Collection[];
  getRequestsFromCollectionById(collectionId: string): Request[];

  getRequestHistory(): Request[];
  getPartialRequestHistory(start: number, end: number): Request[];
  addRequestToHistory(request: Request): void;
  removeRequestFromHistory(timestamp: number): Request;

  hasRequest(id: string): boolean;
  hasCollection(id: string): boolean;

  addRequest(request: Request): void;
  removeRequest(id: string): Request;

  addCollection(collection: Collection): void;
  renameCollection(collectionId: string, title: string): void;
  removeCollection(id: string): Collection;

  clearRequests(): void;
  clearCollections(): void;
  clearAll(): void;

  toggleTheme(): void;
}
