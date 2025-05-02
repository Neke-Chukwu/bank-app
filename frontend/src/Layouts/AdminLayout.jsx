import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavBar from "../Components/AdminNavBar";

const AdminLayout = () => {
  return (
    <div className="d-flex flex-column">
      {/* Navbar */}
      <AdminNavBar />

      {/* Main Content */}
      <div className="flex-grow-1 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;