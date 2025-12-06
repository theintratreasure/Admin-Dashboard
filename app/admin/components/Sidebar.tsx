"use client";

import React, { JSX, useEffect, useRef, useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart2,
  CreditCard,
  Menu,
  LogOut,
  X,
  User,
  BringToFront,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
  href: string;
  label: string;
  icon: JSX.Element;
}

const navItems: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={16} /> },

  // Trading Core
  { href: "/admin/instruments", label: "Instruments", icon: <BarChart2 size={16} /> },
  { href: "/admin/live-trades", label: "Live Trades", icon: <ShoppingCart size={16} /> },
  { href: "/admin/orders", label: "Orders", icon: <ShoppingCart size={16} /> },
  { href: "/admin/positions", label: "Positions", icon: <Package size={16} /> },

  // Finance
  { href: "/admin/deposits", label: "Deposits", icon: <CreditCard size={16} /> },
  { href: "/admin/transactions", label: "Transactions", icon: <CreditCard size={16} /> },
  { href: "/admin/payouts", label: "Payouts", icon: <CreditCard size={16} /> },

  // Users
  { href: "/admin/users", label: "Users", icon: <User size={16} /> },
  { href: "/admin/user_kyc ", label: "User KYC", icon: <User size={16} /> },

  // Analytics / Reports
  { href: "/admin/reports", label: "Reports", icon: <BarChart2 size={16} /> },
  { href: "/admin/analytics", label: "Analytics", icon: <BarChart2 size={16} /> },

  // Settings / Controls

  { href: "/admin/brokage", label: "Brokage", icon: <BringToFront size={16} /> },
  { href: "/admin/settings", label: "Settings", icon: <LayoutDashboard size={16} /> },
  { href: "/admin/system-logs", label: "System Logs", icon: <LayoutDashboard size={16} /> },
];

const AdminSidebar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  const pathname = usePathname() ?? "/";
  const router = useRouter();

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const normalizePath = (p: string) => {
    const cleaned = p.replace(/\/+$/, "");
    return cleaned === "" ? "/" : cleaned;
  };

  const isActive = (href: string) => {
    const current = normalizePath(pathname);
    const target = normalizePath(href);

    if (target === "/admin") return current === "/admin";
    return current === target || current.startsWith(target + "/");
  };

  const linkClass = (href: string) =>
    `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition
  ${
    isActive(href)
      ? "bg-[var(--primary)] text-black shadow-[0_0_10px_var(--glow)]"
      : "text-[var(--foreground)] opacity-75 hover:opacity-100 hover:bg-[var(--card-border)]"
  }`;

  const handleLogout = () => {
    router.push("/");
  };

  const SidebarContent = () => (
    <nav className="px-4 py-6 h-[90vh] flex flex-col overflow-y-auto">
      <div className="mb-5">
        <h3 className="text-xs font-semibold text-[var(--foreground)] opacity-80 mb-2">
          Admin Menu
        </h3>

        <div className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={linkClass(item.href)}>
              {item.icon}
              <span className="truncate">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[var(--danger)]
          hover:bg-[var(--input-border)] rounded-md transition"
        >
          <LogOut size={16} />
          Logout
        </button>

        <div className="mt-4 text-xs text-[var(--foreground)] opacity-40">
          © {new Date().getFullYear()} BlackOS Admin
        </div>
      </div>
    </nav>
  );

  return (
    <>
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setOpen((s) => !s)}
          className="p-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-md shadow"
          aria-label="Open Menu"
        >
          <Menu size={20} />
        </button>
      </div>

      <aside
        className="hidden lg:flex flex-col w-64 bg-[var(--card-bg)]
        border-r border-[var(--card-border)] min-h-screen fixed"
      >
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {open && (
          <>
            <motion.aside
              ref={sidebarRef}
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", stiffness: 90, damping: 20 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-[var(--card-bg)]
              border-r border-[var(--card-border)] shadow-xl flex flex-col"
            >
              <div className="px-4 py-4 border-b border-[var(--card-border)] flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[var(--primary)]">Admin</h2>
                  <p className="text-xs opacity-60 text-[var(--foreground)]">Trading Control</p>
                </div>
                <button onClick={() => setOpen(false)} className="p-1" aria-label="Close">
                  <X size={18} />
                </button>
              </div>

              <SidebarContent />
            </motion.aside>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.35 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminSidebar;
