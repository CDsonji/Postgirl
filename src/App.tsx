import { useState } from "react";
import Header from "./components/header/header";
import Settings from "./components/settings/settings";
import Sidebar from "./components/main/sidebar/sidebar";
import { useMediaQuery } from "./utils/media-query";

function App() {
  const [settingsIsOpen, setSettingsOpen] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 1237px)");
  const [asideIsOpen, setAsideOpen] = useState(false);

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
