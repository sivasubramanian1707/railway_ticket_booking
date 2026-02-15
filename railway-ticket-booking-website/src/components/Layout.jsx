import React from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import "../styles/ui-components.css";
import Navbar from "../app/layout/Navbar";
import Footer from "./Footer";

const Layout = () => {
  const user = useSelector((state) => state.auth?.user);
  return (
    <div className="app-layout">
      <Navbar
        user={user}
        onLogout={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}
      />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
