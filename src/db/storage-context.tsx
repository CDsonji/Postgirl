import {
  createContext,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Collection, Data, HttpRequest } from "./data/data-manager-interface";
import { BrowserLocalStorageManager } from "./local-storage/local-storage-manager";


type StorageContextType = {
  data: Data;

  getManager: () => BrowserLocalStorageManager;

  addRequest: (request: HttpRequest) => void;
  updateRequest: (request: HttpRequest) => void;
  removeRequest: (id: string) => void;

  addCollection: (collection: Collection) => void;
  updateCollection: (collection: Collection) => void;
  removeCollection: (id: string) => void;

  clearAll: () => void;
};

const StorageContext = createContext<StorageContextType | null>(null);

export function StorageProvider({ children }: { children: ReactNode }) {
  const managerRef = useRef<BrowserLocalStorageManager | null>(null);

  if (!managerRef.current) {
    managerRef.current = new BrowserLocalStorageManager();
    managerRef.current.initialize();
  }

  const storageManager = managerRef.current;
  const [data, setData] = useState<Data>(storageManager.getData());

  const refreshData = () => {
    setData(storageManager.getData());
  };

  const addRequest = (request: HttpRequest) => {
    storageManager.addRequest(request);
    refreshData();
  };

  const updateRequest = (request: HttpRequest) => {
    storageManager.updateRequest(request);
    refreshData();
  };

  const removeRequest = (id: string) => {
    storageManager.removeRequest(id);
    refreshData();
  };

  const addCollection = (collection: Collection) => {
    storageManager.addCollection(collection);
    refreshData();
  };

  const updateCollection = (collection: Collection) => {
    storageManager.updateCollection(collection);
    refreshData();
  };

  const removeCollection = (id: string) => {
    storageManager.removeCollection(id);
    refreshData();
  };

  const clearAll = () => {
    storageManager.clear();
    refreshData();
  };

  return (
    <StorageContext.Provider
      value={{
        data,
        getManager: () => storageManager,
        addRequest,
        updateRequest,
        removeRequest,
        addCollection,
        updateCollection,
        removeCollection,
        clearAll,
      }}
    >
      {children}
    </StorageContext.Provider>
  );
}

export function useStorage(): StorageContextType {
  const context = useContext(StorageContext);

  if (!context) {
    throw new Error("useStorage must be used inside a StorageProvider");
  }

  return context;
}
