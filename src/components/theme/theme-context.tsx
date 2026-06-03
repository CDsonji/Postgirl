import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useCallback,
  useState,
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
  const storage = useStorage();
  const [theme, setTheme] = useState<Theme>(storage.getData().theme);

  const toggleTheme = useCallback(() => {
    storage.getManager().toggleTheme();
    setTheme(storage.getData().theme);
  }, [storage]);

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
