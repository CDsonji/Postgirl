import type { Data, DataManager } from "../data/data-manager-interface";
import { Database } from "../data/data-base";
import type { LocalStorageManager } from "./browser-local-storage-manager-interface";
import { PageData } from "../data/page-data";

export class BrowserLocalStorageManager implements LocalStorageManager {
  private readonly storageKey: string;
  private manager: DataManager | null = null;

  constructor(storageKey: string = "postgirl_database") {
    this.storageKey = storageKey;
  }

  getStorageKey(): string {
    return this.storageKey;
  }

  initialize(): void {
    const rawData = localStorage.getItem(this.storageKey);

    if (!rawData) {
      this.manager = new Database(new PageData());
      return;
    }

    try {
      const parsedData = JSON.parse(rawData) as Partial<Data>;

      this.manager = new Database(
        new PageData(
          parsedData.requests ?? {},
          parsedData.collections ?? {},
          parsedData.history ?? {},
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
