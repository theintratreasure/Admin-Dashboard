"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLogin } from "@/hooks/useAuth";
import { jwtDecode } from "jwt-decode";

type DecodedToken = {
  uid: string;
  userType: "ADMIN" | "USER";
  exp: number;
};

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const { mutate, isPending } = useLogin();

  const handleLogin = () => {
    setErrorMsg("");

    mutate(
      {
        email,
        password,
        fcmToken: null,
      },
      {
                onSuccess: (res) => {
          const { accessToken, role } = res.data;

          // 🔒 STRICT ADMIN CHECK
          if (role !== "ADMIN") {
            setErrorMsg("Access denied. Admin only.");
            return;
          }

          document.cookie = `accessToken=${accessToken}; path=/;`;
          localStorage.setItem("token", accessToken);
          router.push("/admin");
        },
        onError: () => {
          setErrorMsg("Invalid email or password");
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-1/4 h-full w-px bg-[var(--primary)] blur-sm" />
        <div className="absolute top-0 left-2/3 h-full w-px bg-[var(--primary-dark)] blur-sm" />
      </div>

      <div className="absolute w-72 h-72 bg-[var(--glow)] blur-[130px] rounded-full"></div>

      <div className="relative w-full max-w-md p-8 rounded-2xl shadow-xl border border-[var(--card-border)] bg-[var(--card-bg)]">
        <h1 className="text-3xl font-bold text-center mb-8 text-[var(--primary)]">
          Admin Login
        </h1>

        <div className="mb-5">
          <label className="block mb-2 text-sm">Email</label>
          <input
            type="email"
            value={email}
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border bg-[var(--input-bg)] border-[var(--input-border)]"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm">Password</label>
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border bg-[var(--input-bg)] border-[var(--input-border)]"
          />
        </div>

        {errorMsg && (
          <p className="text-red-500 text-sm mb-4 text-center">
            {errorMsg}
          </p>
        )}

        <button
          onClick={handleLogin}
          disabled={isPending}
          className="w-full py-2 rounded-lg font-semibold text-black bg-[var(--primary)]
          hover:bg-[var(--primary-dark)] transition disabled:opacity-60"
        >
          {isPending ? "Verifying Admin..." : "Login"}
        </button>
      </div>
    </div>
  );
}
