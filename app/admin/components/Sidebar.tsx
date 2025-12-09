"use client";

import React, { JSX, useEffect, useState } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  BarChart2,
  CreditCard,
  Menu,
  LogOut,
  User,
  BringToFront,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
  href: string;
  label: string;
  icon: JSX.Element;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { href: "/admin/modules/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { href: "/admin/modules/instruments", label: "Instruments", icon: <BarChart2 size={18} /> },

  {
    href: "/admin/modules/trades",
    label: "Trades",
    icon: <ShoppingCart size={18} />,
    children: [
      { href: "/admin/modules/trades/live", label: "Trades Live", icon: <></> },
      { href: "/admin/modules/trades/active-positions", label: "Active Positions", icon: <></> },
      { href: "/admin/modules/trades/close-positions", label: "Close Positions", icon: <></> },
      { href: "/admin/modules/trades/close-trades", label: "Closed Trades", icon: <></> },
      { href: "/admin/modules/trades/pending-orders", label: "Pending Orders", icon: <></> },
    ],
  },

  {
    href: "/admin/modules/users",
    label: "Users",
    icon: <User size={18} />,
    children: [
      { href: "/admin/modules/users/users-all", label: "Users All", icon: <></> },
      { href: "/admin/modules/users/users-found", label: "Users Found", icon: <></> },
    ],
  },

  {
    href: "/admin/modules/verification",
    label: "Verification",
    icon: <User size={18} />,
    children: [
      { href: "/admin/modules/verification/pending-kyc", label: "Pending KYC", icon: <></> },
      { href: "/admin/modules/verification/kyc", label: "KYC Completed", icon: <></> },
    ],
  },

  {
    href: "/admin/transactions",
    label: "Transactions",
    icon: <CreditCard size={18} />,
    children: [
      { href: "/admin/modules/transactions/bank-details", label: "Bank Details", icon: <></> },
      { href: "/admin/modules/transactions/withdraw-request", label: "Withdraw Request", icon: <></> },
      { href: "/admin/modules/transactions/deposit-request", label: "Deposit Request", icon: <></> },
      { href: "/admin/modules/transactions/all-deposit", label: "Deposit All", icon: <></> },
    ],
  },

  { href: "/admin/modules/notification", label: "Notification", icon: <LayoutDashboard size={18} /> },

  {
    href: "/admin/modules/account-security",
    label: "Account & Security",
    icon: <BringToFront size={18} />,
    children: [
      { href: "/admin/modules/account-security/change-password", label: "Change Login Password", icon: <></> },
    ],
  },
];

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const pathname = usePathname() ?? "/";
  const router = useRouter();

  const normalize = (p: string) => p.replace(/\/+$/, "");
  const isActive = (href: string) => {
    const current = normalize(pathname);
    href = normalize(href);
    return current === href || current.startsWith(href + "/");
  };

  useEffect(() => {
    const parent = navItems.find(item =>
      item.children?.some(child => isActive(child.href))
    );
    if (parent) setOpenDropdown(parent.label);
  }, [pathname]);

  const SidebarContent = () => (
    <nav className="flex flex-col justify-between h-full px-4 py-6 text-sm">

      {/* SCROLLABLE MENU */}
      <div className="flex-1 overflow-y-auto pr-1">
        <h3 className="text-xs font-semibold text-[var(--text-muted)] mb-4 tracking-wide">Admin Menu</h3>

        {navItems.map(item =>
          item.children ? (
            <div key={item.label} className="mb-2">
              <button
                onClick={() =>
                  setOpenDropdown(prev => (prev === item.label ? null : item.label))
                }
                className={`w-full flex justify-between items-center px-3 py-2 rounded-md transition-all duration-200 ${
                  openDropdown === item.label || isActive(item.href)
                    ? "bg-[var(--primary)] text-[var(--foreground)] font-semibold"
                    : "text-[var(--foreground)] hover:bg-[var(--hover-bg)]"
                }`}
              >
                <span className="flex items-center gap-3">{item.icon}{item.label}</span>
                <ChevronDown
                  size={17}
                  className={`transition-transform ${openDropdown === item.label ? "rotate-180" : ""}`}
                />
              </button>

              {openDropdown === item.label && (
                <div className="pl-10 mt-1 flex flex-col gap-1">
                  {item.children.map(child => (
                    <Link key={child.href} href={child.href}
                      className={`px-3 py-1 rounded-md ${
                        isActive(child.href)
                          ? "bg-[var(--primary)] text-[var(--foreground)] font-semibold"
                          : "text-[var(--text-muted)] hover:text-[var(--foreground)] hover:bg-[var(--hover-bg)]"
                      }`}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md mb-1 ${
                isActive(item.href)
                  ? "bg-[var(--primary)] text-[var(--foreground)] font-semibold"
                  : "text-[var(--foreground)] hover:bg-[var(--hover-bg)]"
              }`}
            >
              {item.icon}{item.label}
            </Link>
          )
        )}
      </div>

      {/* FOOTER LOGOUT FIXED */}
      <div className="border-t border-[var(--card-border)] pt-4">
        <button
          onClick={() => router.push("/")}
          className="w-full flex items-center gap-3 px-3 py-3 text-[var(--danger)] hover:bg-[var(--hover-bg)] rounded-md"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </nav>
  );

  return (
    <>
      {/* MOBILE MENU BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-[1100] p-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-md"
      >
        <Menu size={20} />
      </button>

      {/* DESKTOP SIDEBAR */}
      <aside className="
        hidden lg:flex fixed top-[var(--topbar-height)] left-0
        w-[260px] xl:w-[240px] lg:w-[220px] md:w-[200px] sm:w-[180px]
        h-[calc(100vh-var(--topbar-height))]
        bg-[var(--card-bg)] border-r border-[var(--card-border)] flex-col
      ">
        <SidebarContent />
      </aside>

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {open && (
          <>
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ duration: 0.3 }}
              className="
                fixed top-[var(--topbar-height)] left-0
                w-[240px] md:w-[220px] sm:w-[200px]
                h-[calc(100vh-var(--topbar-height))]
                bg-[var(--card-bg)]
                border-r border-[var(--card-border)]
                shadow-xl z-[1000] overflow-y-auto lg:hidden
              "
            >
              <SidebarContent />
            </motion.aside>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[900] lg:hidden"
              onClick={() => setOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
}
