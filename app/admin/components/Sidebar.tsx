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
  User,
  BringToFront,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
  href?: string;
  label: string;
  icon: JSX.Element;
  children?: { href: string; label: string }[];
}

const navItems: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
  { href: "/admin/instruments", label: "Instruments", icon: <BarChart2 size={16} /> },
  { href: "/admin/live-trades", label: "Live Trades", icon: <ShoppingCart size={16} /> },

  {
    label: "Payment",
    icon: <CreditCard size={16} />,
    children: [
      { href: "#", label: "Deposit" },
      { href: "/admin/transaction", label: "Transaction" },
      { href: "/admin/pay", label: "Pay" },
      { href: "/admin/all-deposit", label: "All Deposit" },
    ],
  },

  { href: "/admin/positions", label: "Positions", icon: <Package size={16} /> },
  { href: "/admin/deposits", label: "Deposits", icon: <CreditCard size={16} /> },
  { href: "/admin/transactions", label: "Transactions", icon: <CreditCard size={16} /> },
  { href: "/admin/payouts", label: "Payouts", icon: <CreditCard size={16} /> },
  { href: "/admin/users", label: "Users", icon: <User size={16} /> },
  { href: "/admin/user_kyc", label: "User KYC", icon: <User size={16} /> },
  { href: "/admin/reports", label: "Reports", icon: <BarChart2 size={16} /> },
  { href: "/admin/analytics", label: "Analytics", icon: <BarChart2 size={16} /> },
  { href: "/admin/brokage", label: "Brokage", icon: <BringToFront size={16} /> },
  { href: "/admin/settings", label: "Settings", icon: <LayoutDashboard size={16} /> },
  { href: "/admin/system-logs", label: "System Logs", icon: <LayoutDashboard size={16} /> },
];

const AdminSidebar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  const pathname = usePathname() ?? "/";
  const router = useRouter();


  useEffect(() => {
    const dropdown = navItems.find((item) =>
      item.children?.some((child) => pathname.startsWith(child.href))
    );

    if (dropdown) setOpenDropdown(dropdown.label);
  }, [pathname]);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const normalizePath = (p: string) => p.replace(/\/+$/, "") || "/";
  const isActive = (href: string) => {
    const current = normalizePath(pathname);
    const target = normalizePath(href);
    if (target === "/admin") return current === "/admin";
    return current === target || current.startsWith(target + "/");
  };

  const linkClass = (href: string) =>
    `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition
     ${isActive(href)
      ? "bg-[var(--primary)] text-black shadow-[0_0_10px_var(--glow)]"
      : "text-[var(--foreground)] opacity-75 hover:opacity-100 hover:bg-[var(--card-border)]"
    }`;

  const handleLogout = () => router.push("/");

  const SidebarContent = () => (
    <nav className="px-4 py-6 h-[90vh] flex flex-col overflow-y-auto">
      <h3 className="text-xs font-semibold text-[var(--foreground)] opacity-80 mb-3">
        Admin Menu
      </h3>

      <div className="flex flex-col gap-1">
        {navItems.map((item) =>
          item.children ? (
            <div
              key={item.label}
              className="relative"
              onClick={() =>
                setOpenDropdown((prev) => (prev === item.label ? null : item.label))
              }
            >
              <button
                className={`flex items-center justify-between w-full px-3 py-2 rounded-md text-sm transition
                  ${openDropdown === item.label
                    ? "bg-[var(--primary)] text-black shadow-[0_0_10px_var(--glow)]"
                    : "text-[var(--foreground)] opacity-75 hover:opacity-100 hover:bg-[var(--card-border)]"
                  }`}
              >
                <span className="flex items-center gap-3">
                  {item.icon} {item.label}
                </span>
                <span>{openDropdown === item.label ? "^" : "v"}</span>
              </button>

              {openDropdown === item.label && (
                <div className="pl-10 flex flex-col gap-1 py-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={`px-3 py-1 text-sm rounded-md transition
                        ${pathname.startsWith(child.href)
                          ? "text-[var(--primary)] font-semibold bg-[var(--card-border)]"
                          : "text-[var(--foreground)] opacity-70 hover:opacity-100"
                        }`}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Link key={item.href} href={item.href} className={linkClass(item.href)}>
              {item.icon} <span>{item.label}</span>
            </Link>
          )
        )}
      </div>

      {/* LOGOUT BUTTON */}
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[var(--danger)]
          hover:bg-[var(--input-border)] rounded-md transition"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </nav>
  );

  return (
    <>
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setOpen(!open)}
          className="p-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-md shadow"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-64 bg-[var(--card-bg)] border-r border-[var(--card-border)] min-h-screen fixed">
        <SidebarContent />
      </aside>

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {open && (
          <>
            <motion.aside
              ref={sidebarRef}
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-[var(--card-bg)]
              border-r border-[var(--card-border)] shadow-xl flex flex-col"
            >
              <SidebarContent />
            </motion.aside>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black"
              onClick={() => setOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminSidebar;
