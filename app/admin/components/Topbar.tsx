"use client";

import { Search, User, Sun, Moon } from "lucide-react";
import React, { useState, useEffect } from "react";

const Topbar: React.FC = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    if (localStorage.theme === "dark") {
      document.documentElement.classList.add("dark");
      setTheme("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (theme === "light") {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
      setTheme("dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
      setTheme("light");
    }
  };

  return (
    <header className="w-full sticky top-0 z-50 border-b border-[var(--card-border)] bg-[var(--card-bg)] shadow-[0_2px_8px_rgba(0,0,0,0.25)]">
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

          {/* Profile */}
          <div className="h-10 w-10 rounded-full flex items-center justify-center 
            bg-[var(--primary)] text-black shadow-[0_0_12px_var(--glow)] hover:scale-105 transition-transform">
            <User size={20} />
          </div>

        </div>

      </div>
    </header>
  );
};

export default Topbar;
