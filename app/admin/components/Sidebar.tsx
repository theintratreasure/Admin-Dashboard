"use client";

import React, { JSX, useEffect, useState } from "react";
import {
  LayoutDashboard,
  CandlestickChart,
  ShoppingCart,
  Users,
  ShieldCheck,
  CreditCard,
  Bell,
  DollarSign,
  Gift,
  Settings,
  Lock,
  Menu,
  LogOut,
  ChevronDown,
  X,
  Activity,
  Wallet,
  FileText,
  UserCheck,
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
  {
    href: "/admin",
    label: "Dashboard",
    icon: <LayoutDashboard size={18} />,
  },
  {
    href: "/admin/instruments",
    label: "Instruments",
    icon: <CandlestickChart size={18} />,
    children: [
      { href: "/admin/instruments/market-watch", label: "Market Watch", icon: <Activity size={14} /> },
      { href: "/admin/instruments/market-settings", label: "Market Settings", icon: <Settings size={14} /> },
      { href: "/admin/instruments/manage-scrips", label: "Manage Scrips", icon: <FileText size={14} /> },
      { href: "/admin/instruments/action-ledger", label: "Action Ledger", icon: <Wallet size={14} /> },
    ],
  },
  {
    href: "/admin/trades",
    label: "Trades",
    icon: <ShoppingCart size={18} />,
    children: [
      { href: "/admin/trades/live", label: "Trades List", icon: <FileText size={14} /> },
      { href: "/admin/trades/active-positions", label: "Active Positions", icon: <Activity size={14} /> },
      { href: "/admin/trades/close-positions", label: "Close Positions", icon: <X size={14} /> },
      { href: "/admin/trades/close-trades", label: "Closed Trades", icon: <UserCheck size={14} /> },
      { href: "/admin/trades/pending-orders", label: "Pending Orders", icon: <ClockIcon /> },
    ],
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: <Users size={18} />,
    children: [
      { href: "/admin/users/users", label: "All Users", icon: <Users size={14} /> },
      { href: "/admin/users/users-funds", label: "User Funds", icon: <Wallet size={14} /> },
    ],
  },
  {
    href: "/admin/verification",
    label: "Verification",
    icon: <ShieldCheck size={18} />,
    children: [
      { href: "/admin/verification/pending-kyc", label: "Pending KYC", icon: <ClockIcon /> },
      { href: "/admin/verification/kyc", label: "KYC Completed", icon: <UserCheck size={14} /> },
    ],
  },
  {
    href: "/admin/transactions",
    label: "Transactions",
    icon: <CreditCard size={18} />,
    children: [
      { href: "/admin/transactions/bank-details", label: "Bank Details", icon: <Wallet size={14} /> },
      { href: "/admin/transactions/withdraw-request", label: "Withdraw Requests", icon: <DollarSign size={14} /> },
      { href: "/admin/transactions/deposit-request", label: "Deposit Requests", icon: <DollarSign size={14} /> },
      { href: "/admin/transactions/all-deposit", label: "All Deposits", icon: <FileText size={14} /> },
    ],
  },
  { href: "/admin/notifications/notification", label: "Notifications", icon: <Bell size={18} /> },
  { href: "/admin/dollar-rate", label: "Dollar Rate", icon: <DollarSign size={18} /> },
  { href: "/admin/referral", label: "Referral Management", icon: <Gift size={18} /> },
  {
    href: "/admin/settings",
    label: "Admin Config",
    icon: <Settings size={18} />,
    children: [{ href: "/admin/enquiries", label: "Enquiries", icon: <FileText size={14} /> }],
  },
  {
    href: "/admin/account-security",
    label: "Account & Security",
    icon: <Lock size={18} />,
    children: [{ href: "/admin/account-security/change-password", label: "Change Password", icon: <Lock size={14} /> }],
  },
];

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const pathname = usePathname() ?? "/";
  const router = useRouter();

  const normalize = (p: string) => p.replace(/\/+$/, "");
  const currentPath = normalize(pathname);

  const isActive = (href: string, strict = false) => {
    const target = normalize(href);
    if (strict) return currentPath === target;
    return currentPath === target || currentPath.startsWith(target + "/");
  };

  useEffect(() => {
    const parent = navItems.find(item =>
      item.children?.some(child => isActive(child.href)),
    );
    if (parent) setOpenDropdown(parent.label);
  }, [pathname]);

  const SidebarContent = () => (
    <nav className="flex h-full flex-col px-4 py-5 text-sm">
      <div className="mb-4 flex items-center justify-between lg:hidden">
        <span className="font-semibold">Admin Panel</span>
        <button onClick={() => setOpen(false)} className="rounded-md p-1">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto">
        {navItems.map(item =>
          item.children ? (
            <div key={item.label}>
              <button
                onClick={() => setOpenDropdown(v => (v === item.label ? null : item.label))}
                className="flex w-full items-center justify-between rounded-md px-0 py-2 hover:bg-[var(--hover-bg)]"
              >
                <span className="flex items-center gap-3">
                  {item.icon}
                  {item.label}
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${openDropdown === item.label ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {openDropdown === item.label && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{
                      duration: 0.18,
                      ease: "easeOut",
                    }}
                    className="ml-8 mt-1 space-y-1 overflow-hidden"
                  >

                    {item.children.map(child => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs ${isActive(child.href)
                            ? "bg-[var(--primary)] font-semibold"
                            : "text-[var(--text-muted)] hover:bg-[var(--hover-bg)]"
                          }`}
                        onClick={() => setOpen(false)}
                      >
                        {child.icon}
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
              className={`flex items-center gap-3 rounded-md px-0 py-2 ${isActive(item.href, true)
                  ? "bg-[var(--primary)] font-semibold"
                  : "hover:bg-[var(--hover-bg)]"
                }`}
              onClick={() => setOpen(false)}
            >
              {item.icon}
              {item.label}
            </Link>
          ),
        )}
      </div>

      <div className="mt-4 border-t pt-4">
        <button
          onClick={() => router.push("/")}
          className="flex w-full items-center gap-3 rounded-md px-0 py-2 text-red-500 hover:bg-red-500/10"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </nav>
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-[1100] rounded-md p-2 lg:hidden"
      >
        <Menu size={20} />
      </button>

      <aside className="fixed left-0 top-[var(--topbar-height)] hidden h-[calc(100vh-var(--topbar-height))] w-[250px] border-r lg:flex">
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {open && (
          <>
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              className="fixed left-0 top-0 z-[1200] h-full w-[260px] border-r bg-[var(--card-bg)] lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
            <motion.div
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[900] bg-black/50 lg:hidden"
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function ClockIcon() {
  return <span className="inline-block h-2 w-2 rounded-full bg-yellow-500" />;
}
