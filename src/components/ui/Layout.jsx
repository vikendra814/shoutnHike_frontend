import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => (
  <div className="flex min-h-screen bg-gray-950">
    <Sidebar />
    <main className="flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto p-6 md:p-8">{children}</div>
    </main>
  </div>
);

export default Layout;
