import { useState } from "react";
import Header from "./components/header/header";
import Settings from "./components/settings/settings";
import Sidebar from "./components/main/sidebar/sidebar";

function App() {
  const [settingsIsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <Header
        settingsButtonAction={() => {
          setSettingsOpen(true);
        }}
      />
      {settingsIsOpen && (
        <Settings
          exitButtonAction={() => {
            setSettingsOpen(false);
          }}
        />
      )}
      <main className="main">
        <Sidebar />
      </main>
    </>
  );
}

export default App;
