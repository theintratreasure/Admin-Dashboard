// src/app/admin/layout.tsx
import "../globals.css";
import React from "react";
import Topbar from "./components/Topbar";
import AdminSidebar from "./components/Sidebar";

export const metadata = {
  title: "Admin Panel | BlackOSInventory",
  description: "Admin dashboard",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-neutral)]">
      <Topbar />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-6 lg:ml-64 overflow-y-auto bg-[var(--color-neutral)]">
          {children}
        </main>
      </div>
    </div>
  );
}
