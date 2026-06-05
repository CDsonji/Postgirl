import type { DataManager } from "../data/data-manager-interface";

export interface LocalStorageManager {
  initialize(): void;
  getManager(): DataManager;
  getData(): unknown;
  save(): void;
}
