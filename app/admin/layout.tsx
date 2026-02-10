"use client";

import "../globals.css";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Topbar from "./components/Topbar";
import AdminSidebar from "./components/Sidebar";
import { useAdminMe } from "@/hooks/useAdmin";
import GlobalLoader from "./components/ui/GlobalLoader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isLoading, isError, error } = useAdminMe();

  // 🔴 LOGOUT SIDE-EFFECT (SAFE)
  useEffect(() => {
    if (!isError) return;

    const status = (error as any)?.response?.status;

    if (status === 401) {
      localStorage.removeItem("accessToken");
      document.cookie = "accessToken=; path=/; max-age=0";

      router.replace("/admin/login");
    }
  }, [isError, error, router]);

  // ⏳ loading
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <GlobalLoader />
      </div>
    );
  }

  // ⛔ while redirecting → blank screen
  if (isError) {
    return null;
  }

  // ✅ AUTH OK
  return (
    <div className="min-h-screen flex flex-col text-[var(--foreground)] bg-[var(--background)]">
      <Topbar />

      <div className="flex min-w-0 flex-1">
        <AdminSidebar />

        <main
          className="min-w-0 flex-1 overflow-x-hidden p-4 sm:p-6 transition-all duration-300"
          style={{
            marginLeft: "var(--sidebar-width)",
            width: "calc(100% - var(--sidebar-width))",
          }}
        >
          <div className="min-w-0 w-full max-w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
