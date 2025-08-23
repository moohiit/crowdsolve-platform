import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 to-dark-800">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>
      <div className="relative z-10">
        <Navbar />
        <main className="pt-16 pb-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;