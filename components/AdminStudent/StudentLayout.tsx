"use client";

import { ReactNode } from "react";
import { AdminSidebar } from "../layout/AdminSidebar";


export function StudentLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-muted/40">
      <AdminSidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
