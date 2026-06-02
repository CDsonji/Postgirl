import type { Collection, Data, DataManager, HttpRequest } from "../data/data-manager-interface";


export interface LocalStorageManager {
  getStorageKey(): string;

  initialize(): void;
  getManager(): DataManager;
  getData(): Data;

  save(): void;
  // clear(): void;

  // addRequest(request: HttpRequest): void;
  // updateRequest(request: HttpRequest): void;
  // removeRequest(id: string): HttpRequest;

  // addCollection(collection: Collection): void;
  // updateCollection(collection: Collection): void;
  // removeCollection(id: string): Collection;
}
