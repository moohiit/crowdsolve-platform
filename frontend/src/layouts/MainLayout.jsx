import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Page content */}
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet /> {/* Render child routes (Home, Problems, ProblemDetail, etc.) */}
      </main>
    </div>
  );
};

export default MainLayout;
