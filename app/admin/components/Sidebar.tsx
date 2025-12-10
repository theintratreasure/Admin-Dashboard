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
  X,
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
  { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
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
  const currentPath = normalize(pathname);

  // strict true: exact match (top-level links)
  const isActive = (href: string, strict = false) => {
    const target = normalize(href);
    if (strict) return currentPath === target;
    return currentPath === target || currentPath.startsWith(target + "/");
  };

  useEffect(() => {
    // sirf usi group ko open karo jiska child active hai (reload pe bhi)
    const parent = navItems.find(item =>
      item.children?.some(child => isActive(child.href)),
    );
    if (parent) setOpenDropdown(parent.label);
  }, [pathname]);

  const SidebarContent = () => (
    <nav className="flex h-full flex-col justify-between px-4 py-6 text-sm">
      {/* mobile drawer top row */}
      <div className="mb-3 flex items-center justify-between lg:hidden">
        <span className="text-sm font-semibold text-[var(--foreground)]">
          Admin Menu
        </span>
        <button
          onClick={() => setOpen(false)}
          className="rounded-md border border-[var(--card-border)] bg-[var(--card-bg)] p-1.5"
        >
          <X size={16} />
        </button>
      </div>

      {/* SCROLLABLE MENU */}
      <div className="flex-1 overflow-y-auto pr-1">
        <h3 className="mb-4 hidden text-xs font-semibold tracking-wide text-[var(--text-muted)] lg:block">
          Admin Menu
        </h3>

        {navItems.map(item =>
          item.children ? (
            <div key={item.label} className="mb-2">
              <button
                onClick={() =>
                  setOpenDropdown(prev => (prev === item.label ? null : item.label))
                }
                className={`
                  flex w-full items-center justify-between rounded-md px-3 py-2 
                  text-[var(--foreground)] transition-all duration-200
                  hover:bg-[var(--hover-bg)]
                `}
              >
                <span className="flex items-center gap-3">
                  {item.icon}
                  {item.label}
                </span>
                <ChevronDown
                  size={17}
                  className={`transition-transform ${
                    openDropdown === item.label ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {openDropdown === item.label && (
                  <motion.div
                    key={item.label}
                    initial={{ height: 0, opacity: 0, y: -4 }}
                    animate={{ height: "auto", opacity: 1, y: 0 }}
                    exit={{ height: 0, opacity: 0, y: -4 }}
                    transition={{ duration: 0.25, ease: [0.22, 0.61, 0.36, 1] }}
                    className="mt-1 flex flex-col gap-1 overflow-hidden pl-10"
                  >
                    {item.children.map(child => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`rounded-md px-3 py-1 ${
                          isActive(child.href)
                            ? "bg-[var(--primary)] text-[var(--foreground)] font-semibold"
                            : "text-[var(--text-muted)] hover:bg-[var(--hover-bg)] hover:text-[var(--foreground)]"
                        }`}
                        onClick={() => setOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              className={`mb-1 flex items-center gap-3 rounded-md px-3 py-2 ${
                isActive(item.href, true)
                  ? "bg-[var(--primary)] text-[var(--foreground)] font-semibold"
                  : "text-[var(--foreground)] hover:bg-[var(--hover-bg)]"
              }`}
              onClick={() => setOpen(false)}
            >
              {item.icon}
              {item.label}
            </Link>
          ),
        )}
      </div>

      {/* FOOTER LOGOUT FIXED */}
      <div className="border-t border-[var(--card-border)] pt-4">
        <button
          onClick={() => router.push("/")}
          className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-[var(--danger)] hover:bg-[var(--hover-bg)]"
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
        className="fixed left-4 top-4 z-[1100] rounded-md border border-[var(--card-border)] bg-[var(--card-bg)] p-2 lg:hidden"
      >
        <Menu size={20} />
      </button>

      {/* DESKTOP SIDEBAR */}
      <aside
        className="
          fixed left-0 top-[var(--topbar-height)] hidden
          h-[calc(100vh-var(--topbar-height))] w-[260px] flex-col
          border-r border-[var(--card-border)] bg-[var(--card-bg)]
          xl:w-[240px] lg:flex lg:w-[220px] md:w-[200px] sm:w-[180px]
        "
      >
        <SidebarContent />
      </aside>

      {/* MOBILE SIDEBAR WITH ANIMATION */}
      <AnimatePresence>
        {open && (
          <>
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ duration: 0.3 }}
              className="
                fixed left-0 top-0
                z-[1200] h-[100vh]
                w-[260px] overflow-y-auto border-r border-[var(--card-border)]
                bg-[var(--card-bg)] shadow-xl lg:hidden
              "
            >
              <SidebarContent />
            </motion.aside>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[900] bg-black/60 lg:hidden"
              onClick={() => setOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
}
