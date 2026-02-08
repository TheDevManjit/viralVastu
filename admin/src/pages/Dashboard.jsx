import React from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import SideBar from "@/components/SideBar";

function Dashboard() {
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar - Fixed width on Desktop */}
            <SideBar />

            <div className="flex-1 flex flex-col min-w-0">
                <Navbar classes="sticky top-0 z-50 shadow-sm" />

                <main className="flex-1 p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default Dashboard;
