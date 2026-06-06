import { use, useState } from "react";
import Header from "./components/header/header";
import Settings from "./components/settings/settings";
import Sidebar from "./components/main/sidebar/sidebar";
import { useMediaQuery } from "./utils/media-query";
import { useStorage } from "./db/storage-context";

function App() {
  const [settingsIsOpen, setSettingsOpen] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 1237px)");
  const [asideIsOpen, setAsideOpen] = useState(false);
  console.log("📊 App component rendered!");
  useStorage();

  return (
    <>
      <Header
        settingsButtonAction={() => {
          setSettingsOpen(true);
        }}
        sidebarButtonAction={
          isSmallScreen
            ? () => {
                setAsideOpen((prev) => !prev);
              }
            : undefined
        }
      />

      {settingsIsOpen && (
        <Settings
          exitButtonAction={() => {
            setSettingsOpen(false);
          }}
        />
      )}
      <main className="main">
        {(!isSmallScreen || asideIsOpen) && <Sidebar />}
      </main>
    </>
  );
}

export default App;
