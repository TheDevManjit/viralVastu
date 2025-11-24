import React from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import SideBar from "@/components/SideBar";





function Dashboard() {
  return (
    <>
      <SideBar />

      <div className="ml-[15%] w-[85%]">
        <Navbar classes="sticky top-0 z-50" />

        <div className="p-4 bg-gray-200">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Dashboard;


