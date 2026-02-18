"use client";

import {
  Users,
  Activity,
  ShieldCheck,
  DollarSign,
  LineChart,
} from "lucide-react";

import { motion } from "framer-motion";
import Link from "next/link";
import { useTradeAdminSummary } from "@/hooks/useTradeAdminSummary";
import { useDefaultWatchlist } from "@/queries/defaultWatchlist.queries";
import { useLiveQuotesBySymbols } from "@/hooks/useLiveQuotesBySymbols";
import { getAccessTokenFromCookie } from "@/services/marketSocket.service";
import { useInstrumentPrecisionMap } from "@/hooks/instruments/useInstrumentPrecisionMap";
import { formatPrice } from "@/utils/priceFormat";

// ================= MOCK DATA =================

// ================= ANIMATION =================

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

// ================= COMPONENT =================

export default function Overview() {
  const { data: summary, isLoading } = useTradeAdminSummary();
  const token = getAccessTokenFromCookie();
  const watchlistQuery = useDefaultWatchlist();
  const { map: precisionMap } = useInstrumentPrecisionMap();

  const safeSummary = summary ?? {
    activePositions: 0,
    activePendingOrders: 0,
    activeUsers: 0,
    activeTradingAccounts: 0,
  };

  // ================= KPI CARDS =================

  const cards = [
    {
      title: "Active Users",
      value: safeSummary.activeUsers,
      icon: Users,
      color: "text-blue-400",
    },
    {
      title: "Active Positions",
      value: safeSummary.activePositions,
      icon: Activity,
      color: "text-emerald-400",
    },
    {
      title: "Active Accounts",
      value: safeSummary.activeTradingAccounts,
      icon: ShieldCheck,
      color: "text-indigo-400",
    },
    {
      title: "Pending Orders",
      value: safeSummary.activePendingOrders,
      icon: DollarSign,
      color: "text-amber-400",
    },
  ];

  const watchRows = watchlistQuery.data?.data ?? [];
  const topRows = watchRows.slice(0, 5);
  const symbols = topRows.map((r) => r.code);
  const liveQuotes = useLiveQuotesBySymbols(token, symbols);

  // ================= UI =================

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-5 sm:space-y-8 pb-8 sm:pb-10"
    >
      {/* ================= HEADER ================= */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-3 sm:px-6 lg:px-0">

        <div>
          <h2 className="text-sm sm:text-base font-semibold tracking-wide text-[var(--text-muted)]">
            Dashboard
          </h2>
        </div>

        {/* PNL CARD REMOVED */}

      </div>

      {/* ================= LOADING ================= */}

      {isLoading && (
        <div className="px-4 sm:px-6 lg:px-0 text-sm opacity-70">
          Loading summary...
        </div>
      )}

      {/* ================= KPI GRID ================= */}

      <motion.section
        variants={container}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 px-3 sm:px-6 lg:px-0"
      >
        {cards.map((card, i) => (
          <motion.div
            key={i}
            variants={item}
            whileHover={{ y: -6 }}
            className="relative overflow-hidden bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-3.5 sm:p-5 ring-1 ring-white/5"
          >
            {/* Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/12 via-transparent to-transparent pointer-events-none" />

            <div className="flex items-center justify-between gap-3">

              <div>
                <p className="text-[10px] sm:text-xs text-[var(--text-muted)] leading-tight">
                  {card.title}
                </p>

                <p className="text-[15px] sm:text-2xl font-bold mt-0.5 leading-tight">
                  {card.value.toLocaleString()}
                </p>
              </div>

              <div
                className={`h-8 w-8 sm:h-12 sm:w-12 rounded-xl bg-black/5 flex items-center justify-center ${card.color}`}
              >
                <card.icon size={18} className="sm:hidden" />
                <card.icon size={26} className="hidden sm:block" />
              </div>

            </div>
          </motion.div>
        ))}
      </motion.section>

      {/* ================= MARKET WATCH (TOP 5) ================= */}
      <motion.section
        variants={container}
        className="px-3 sm:px-6 lg:px-0"
      >
        <motion.div
          variants={item}
          className="rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 sm:p-7 ring-1 ring-white/5"
        >
          <div className="flex items-start gap-3 mb-3 sm:mb-5">
            <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] flex items-center justify-center">
              <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white flex items-center justify-center">
                <LineChart size={14} className="sm:hidden" />
                <LineChart size={16} className="hidden sm:block" />
              </div>
            </div>
            <div>
              <p className="text-base sm:text-lg font-semibold text-[var(--foreground)]">
                Market Watchlist
              </p>
              <p className="text-xs sm:text-sm text-[var(--text-muted)]">
                Top 5 scripts from default watchlist
              </p>
            </div>
          </div>

          <div className="grid grid-cols-[1.2fr_0.9fr_0.9fr] text-[9px] sm:text-xs uppercase tracking-wider text-[var(--text-muted)] px-1.5 sm:px-3 pb-2 sm:pb-3">
            <div>Symbol</div>
            <div className="text-right">Bid</div>
            <div className="text-right">Ask</div>
          </div>

          {watchlistQuery.isLoading ? (
            <div className="text-sm text-[var(--text-muted)]">
              Loading watchlist...
            </div>
          ) : topRows.length === 0 ? (
            <div className="text-sm text-[var(--text-muted)]">
              No symbols found
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2 sm:gap-3">
              {topRows.map((row) => {
                const live = liveQuotes[row.code];
                const precision = precisionMap[row.code] ?? 2;
                const bidColor =
                  live?.bidDir === "up"
                    ? "text-emerald-500"
                    : live?.bidDir === "down"
                    ? "text-red-600"
                    : "text-[var(--foreground)]";
                const askColor =
                  live?.askDir === "up"
                    ? "text-emerald-500"
                    : live?.askDir === "down"
                    ? "text-red-600"
                    : "text-[var(--foreground)]";

                return (
                  <div
                    key={row.code}
                    className="grid grid-cols-[1.2fr_0.9fr_0.9fr] items-center rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] px-2.5 sm:px-4 py-2 sm:py-3 gap-2 sm:gap-0"
                  >
                    <div>
                      <p className="text-xs sm:text-base font-semibold">
                        {row.code}
                      </p>
                      <p className="text-[9px] sm:text-xs text-[var(--text-muted)]">
                        {row.name}
                      </p>
                    </div>

                    <div className="text-right">
                      <p
                        className={`text-[11px] sm:text-base font-semibold tracking-tight tabular-nums drop-shadow-[0_0_2px_rgba(0,0,0,0.18)] ${bidColor}`}
                      >
                        {formatPrice(live?.bid, precision)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p
                        className={`text-[11px] sm:text-base font-semibold tracking-tight tabular-nums drop-shadow-[0_0_2px_rgba(0,0,0,0.18)] ${askColor}`}
                      >
                        {formatPrice(live?.ask, precision)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-3 sm:mt-4 flex justify-end">
            <Link
              href="/admin/instruments/market-watch"
              className="text-xs sm:text-sm font-semibold text-[var(--primary)] hover:underline"
            >
              View All →
            </Link>
          </div>
        </motion.div>
      </motion.section>
    </motion.div>
  );
}
