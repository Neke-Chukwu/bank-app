import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Components/SideBar";

const DashboardLayout = () => {
  return (
    <div className="d-flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="main-content flex-grow-1 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;