import {
  createContext,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { BrowserLocalStorageManager } from "./local-storage/browser-local-storage-manager";
import type { Data, DataManager } from "./data/data-manager-interface";

type StorageContextType = {
  db: DataManager;
  refreshStorage: () => void;
};

const StorageContext = createContext<StorageContextType | null>(null);

export function StorageProvider({ children }: { children: ReactNode }) {
  const storageRef = useRef<BrowserLocalStorageManager | null>(null);

  let manager: DataManager;
  if (!storageRef.current) {
    storageRef.current = new BrowserLocalStorageManager();
    manager = storageRef.current.initialize();
  }

  const [db, setDb] = useState<DataManager>(manager!);

  const refreshStorage = () => {
    const manager = storageRef.current!.save(db);
    // console.log(storageRef.current!.getData().collections);
    setDb(manager);
  };

  return (
    <StorageContext.Provider
      value={{
        db,
        refreshStorage,
      }}
    >
      {children}
    </StorageContext.Provider>
  );
}

export function useStorage() {
  const context = useContext(StorageContext);

  if (!context) {
    throw new Error("useStorage must be used inside StorageProvider");
  }

  return [context.db, context.refreshStorage] as const;
}
