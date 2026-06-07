import "./main.css";
import RequestForm from "./request-form/request-form";
import TabsBar from "./tabs-bar/tabs-bar";

const Main = () => {
  return (
    <>
      <main className="main">
        <TabsBar />
        <RequestForm/>
      </main>
    </>
  );
};

export default Main;
