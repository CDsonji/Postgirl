import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useCallback,
  type PropsWithChildren,
} from "react";
import { useStorage } from "../../db/storage-context";
import type { Theme } from "../../db/data/data-manager-interface";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: PropsWithChildren) {
  const [db, refreshStorage] = useStorage();

  const theme = db.getData().theme;

  const toggleTheme = useCallback(() => {
    db.toggleTheme();
    refreshStorage();
  }, [db, refreshStorage]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}
