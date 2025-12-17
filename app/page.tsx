"use client";

import { useQuery } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import AdminLogin from "./Components/LoginCard";
import "./globals.css";

export default function Home() {
  const { data: hasToken, isLoading } = useQuery<boolean>({
    queryKey: ["check-admin-auth"],
    queryFn: async () => {
      return document.cookie
        .split("; ")
        .some((row) => row.startsWith("accessToken="));
    },
    staleTime: Infinity,
  });

  // ✅ SAFE: redirect() is allowed during render
  if (!isLoading && hasToken) {
    redirect("/admin");
  }

  return <AdminLogin />;
}
