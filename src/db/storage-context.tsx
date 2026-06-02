import { createContext, useContext, useRef, type ReactNode } from "react";
import { BrowserLocalStorageManager } from "./local-storage/local-storage-manager";

type StorageContextType = {
  storage: BrowserLocalStorageManager;
};

const StorageContext = createContext<StorageContextType | null>(null);

export function StorageProvider({ children }: { children: ReactNode }) {
  const storageRef = useRef<BrowserLocalStorageManager | null>(null);

  if (!storageRef.current) {
    storageRef.current = new BrowserLocalStorageManager();
    storageRef.current.initialize();
  }

  return (
    <StorageContext.Provider value={{ storage: storageRef.current }}>
      {children}
    </StorageContext.Provider>
  );
}

export function useStorage() {
  const context = useContext(StorageContext);

  if (!context) {
    throw new Error("useStorage must be used inside StorageProvider");
  }

  return context.storage;
}
