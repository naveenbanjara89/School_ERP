"use client";

import { useState } from "react";
import AccountantSidebar from "./accountantSidebar";
import TopBar from "./topBar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: DashboardLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      
      {/* Sidebar */}
      <AccountantSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* Main Section */}
      <div className="flex-1 flex flex-col transition-all duration-300">
        <TopBar />
        <main className="flex-1 p-6 space-y-6">
          {children}
        </main>
      </div>

    </div>
  );
};

export default Layout;