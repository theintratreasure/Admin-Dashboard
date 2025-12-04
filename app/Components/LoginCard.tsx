"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLogin() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
    const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">

      {/* Background Gradient Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-1/4 h-full w-px bg-[var(--primary)] blur-sm" />
        <div className="absolute top-0 left-2/3 h-full w-px bg-[var(--primary-dark)] blur-sm" />
      </div>

      {/* Glowing Center Circle */}
      <div className="absolute w-72 h-72 bg-[var(--glow)] blur-[130px] rounded-full"></div>

      <div className="relative w-full max-w-md p-8 rounded-2xl shadow-xl border border-[var(--card-border)] bg-[var(--card-bg)]">
        <h1 className="text-3xl font-bold text-center mb-8 text-[var(--primary)] tracking-wide">
          Admin Login
        </h1>

        {/* Email Field */}
        <div className="mb-5">
          <label className="block mb-2 text-sm">Email</label>
          <input
            type="email"
            value={email}
            autoComplete="off"
            placeholder="admin@gmail.com"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--foreground)]
              focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>

        {/* Password Field */}
        <div className="mb-6">
          <label className="block mb-2 text-sm">Password</label>
          <input
            type="password"
            placeholder="**********"
            value={password}
            autoComplete="off"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--foreground)]
              focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>

        {/* Login Button */}
        <button
            onClick={() => router.push("/admin")}
          type="button"
          className="w-full py-2 rounded-lg font-semibold text-black bg-[var(--primary)] 
            hover:bg-[var(--primary-dark)] transition shadow-[0_0_15px_var(--glow)]"
        >
          Login
        </button>

        {/* Footer */}
        <p className="text-center mt-6 text-xs opacity-70">
          Secure Admin Access • Trading Control Panel
        </p>
      </div>
    </div>
  );
}
