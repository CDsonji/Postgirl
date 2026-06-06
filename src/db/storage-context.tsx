import {
  createContext,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { BrowserLocalStorageManager } from "./local-storage/browser-local-storage-manager";
import type { Data } from "./data/data-manager-interface";

type StorageContextType = {
  data: Data;
  storage: BrowserLocalStorageManager;
  refreshStorage: () => void;
};

const StorageContext = createContext<StorageContextType | null>(null);

export function StorageProvider({ children }: { children: ReactNode }) {
  const storageRef = useRef<BrowserLocalStorageManager | null>(null);

  if (!storageRef.current) {
    storageRef.current = new BrowserLocalStorageManager();
    storageRef.current.initialize();
  }

  const [data, setData] = useState<Data>(storageRef.current.getData());

  const refreshStorage = () => {
    storageRef.current!.save();
    console.log(storageRef.current!.getData().collections);
    setData(storageRef.current!.getData());
  };

  return (
    <StorageContext.Provider
      value={{
        data,
        storage: storageRef.current,
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

  return [context.data, context.storage, context.refreshStorage] as const;
}
