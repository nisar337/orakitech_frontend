import "./App.css";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

function App() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
