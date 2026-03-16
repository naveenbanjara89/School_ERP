"use client";

import { ReactNode, useState } from "react";
import Topbar from "./topBar";
import Sidebar from "./sideBar";

interface HRLayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: HRLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">

      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col transition-all duration-300">
        <Topbar />

        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>

    </div>
  );
}