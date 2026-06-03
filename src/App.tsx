import { useState } from "react";
import Header from "./components/header/header";
import Settings from "./components/settings/settings";

function App() {
  const [settingsIsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <Header settingsButtonAction={setSettingsOpen} />
      {settingsIsOpen && <Settings exitButtonAction={setSettingsOpen} />}
    </>
  );
}

export default App;
