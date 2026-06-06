import type { DataManager } from "../data/data-manager-interface";

export interface LocalStorageManager {
  initialize(): DataManager;
  save(manager: DataManager): DataManager;
}
