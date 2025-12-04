"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] text-[var(--foreground)] px-6">
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-10 rounded-xl shadow-lg text-center max-w-md w-full">
        <h1 className="text-5xl font-bold text-[var(--primary)] mb-4">404</h1>
        <p className="text-lg opacity-80 mb-8">This page does not exist.</p>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] hover:bg-[var(--input-border)] transition text-[var(--foreground)]"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <button
            onClick={() => router.push('/admin')}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[var(--primary)] text-black hover:bg-[var(--primary-dark)] transition"
          >
            <Home size={18} />
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
