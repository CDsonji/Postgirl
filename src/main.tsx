import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { StorageProvider } from "./db/storage-context.tsx";
import { ThemeProvider } from "./components/theme/theme-context.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StorageProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </StorageProvider>
  </StrictMode>
);
