import "./App.css";
import Header from "./Header";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";
import { useEffect } from "react";

function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [pathname, search]);

  return null;
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
