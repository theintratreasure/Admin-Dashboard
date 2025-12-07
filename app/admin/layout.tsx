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
    <div className="min-h-screen flex flex-col bg-[var(--card-bg)] text-[var(--foreground)]">
     
      <Topbar />

      
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <AdminSidebar />

        {/* Main Content Area */}
        <main
          className="flex-1 w-full bg-[var(--card-bg)] text-[var(--foreground)] p-0 sm:pl-6 sm:pr-6 sm:pt-4 transition-all duration-300"
          style={{
            marginLeft: "var(--sidebar-width)",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
