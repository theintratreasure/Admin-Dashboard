"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function Topbar() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    return localStorage.theme === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.theme = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <header className="w-full sticky top-0 z-50 border-b border-[var(--card-border)] bg-[var(--card-bg)]">
      <div className="flex items-center justify-between px-4 md:px-6 py-3 flex-wrap gap-3">

        {/* Branding */}
        <div className="ml-12 lg:ml-0 flex items-center gap-3">
          <h1 className="text-xl font-bold tracking-wide">
            Trading <span className="text-[var(--primary)]">Admin</span>
          </h1>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4 flex-shrink-0">

          {/* Search Box */}
          {/* <div className="relative w-40 sm:w-52 md:w-60">
            <Search className="absolute left-3 top-2.5 w-4 h-4 opacity-70 text-[var(--primary)]" />
            <input
              type="text"
              placeholder="Search markets, users, logs..."
              className="pl-9 pr-4 py-2 text-sm rounded-lg border bg-[var(--input-bg)] border-[var(--input-border)]
              w-full focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition"
            />
          </div> */}

          {/*Theme Toggle Button — ADDED HERE */}
          <button
            onClick={toggleTheme}
            className="h-10 w-10 rounded-full flex items-center justify-center 
            border border-[var(--input-border)] bg-[var(--input-bg)] 
            hover:scale-105 transition-transform shadow-sm"
          >
            {theme === "light" ? <Moon size={18}  /> : <Sun size={18} />}
          </button>

        </div>

      </div>
    </header>
  );
}
