"use client";

import {
  Users,
  Activity,
  ShieldCheck,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";
import { motion } from "framer-motion";

// REGISTER CHART MODULES
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

// ================= MOCK DATA =================
const mockStats = {
  totalUsers: 1280,
  liveTrades: 87,
  totalKyc: 945,
  totalProfit: 4523,
  totalLoss: 1235,
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const item = {
  hidden: { opacity: 0, y: 35 },
  show: { opacity: 1, y: 0 },
};

export default function Overview() {
  const netPnL = mockStats.totalProfit - mockStats.totalLoss;
  const pnlColor = netPnL >= 0 ? "text-emerald-400" : "text-red-400";

  // TOP CARD DATA
  const features = [
    {
      title: "Total Users",
      value: mockStats.totalUsers.toLocaleString(),
      icon: Users,
      color: "text-[var(--primary)]",
      footer: "+32 new today",
    },
    {
      title: "Live Trades",
      value: mockStats.liveTrades,
      icon: Activity,
      color: "text-emerald-400",
      footer: "12 running now",
    },
    {
      title: "KYC Completed",
      value: mockStats.totalKyc.toLocaleString(),
      icon: ShieldCheck,
      color: "text-sky-400",
      footer: "24 pending",
    },
    {
      isCustom: true,
      icon: DollarSign,
      block: (
        <div className="flex flex-col">
          <span className="text-xs mt-3 opacity-70">Net P&L (Today)</span>
          <span className={`text-xl font-semibold flex items-center gap-1 ${pnlColor}`}>
            {netPnL >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
            ${Math.abs(netPnL).toLocaleString()}
          </span>
          <span className="text-xs opacity-70 mt-1">
            Profit: ${mockStats.totalProfit.toLocaleString()} · Loss: $
            {mockStats.totalLoss.toLocaleString()}
          </span>
        </div>
      ),
    },
  ];

  // SCREENSHOT CHART DATA
  const buyData = {
    labels: [ "Forex", "US Stocks", "Indices","Comex", "Crypto"],
    datasets: [
      {
        label: "Buy Turnover",
        data: [1400000, 350000, 120000, 100000, 800000,],
        backgroundColor: "#f87171",
        borderRadius: 10,
      },
    ],
  };

  const sellData = {
    labels: ["Forex", "US Stocks", "Indices","Comex", "Crypto"],
    datasets: [
      {
        label: "Sell Turnover",
        data: [1200000, 300000, 150000, 90000, 850000,],
        backgroundColor: "#f87171",
        borderRadius: 10,
      },
    ],
  };

  const totalData = {
    labels: ["Forex", "US Stocks", "Indices","Comex","Crypto"],
    datasets: [
      {
        label: "Total Turn Over",
        data: [4, 3, 2, 1, 2,],
        backgroundColor: "#60a5fa",
        borderRadius: 10,
      },
    ],
  };

  const activeUserData = {
    labels: ["Forex", "US Stocks", "Indices","Comex","Crypto"],
    datasets: [
      {
        label: "Active Users",
        data: [72, 70, 69, 70, 68],
        backgroundColor: "#3b82f6",
        borderRadius: 10,
      },
    ],
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">

      {/* ================= TOP FEATURE CARDS ================= */}
      <motion.section
  className="grid grid-cols-1 md:grid-cols-4 gap-6 px-4 sm:px-6 md:px-8 lg:px-0"
>
  {features.map((stat, i) => (
    <motion.div
      key={i}
      variants={item}
      whileHover={{ scale: 1.05, translateY: -6 }}
      className="bg-[var(--card-bg)] border border-[var(--border)] p-5 rounded-xl shadow-sm hover:shadow-xl transition-all"
    >
      <div className="h-12 w-12 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center mb-2">
        <stat.icon size={30} className={stat.color} />
      </div>

      {stat.isCustom ? (
        stat.block
      ) : (
        <>
          <p className="text-xs opacity-70">{stat.title}</p>
          <p className={`text-2xl font-semibold mt-1 ${stat.color}`}>{stat.value}</p>
          <p className="text-xs opacity-70 mt-1">{stat.footer}</p>
        </>
      )}
    </motion.div>
  ))}
</motion.section>


      {/* ================= 4 GRID CHARTS ================= */}
     <motion.section
  className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 sm:px-6 md:px-8 lg:px-0"
  variants={container}
>

  {/* BUY */}
  <motion.div variants={item} className="bg-[var(--card-bg)] border p-6 rounded-xl shadow-sm">
    <p className="font-semibold">Buy Turn Over</p>
    <p className="text-xs opacity-70">Buy turnover by market category</p>
    <div className="h-72 mt-4">
      <Bar data={buyData} options={{ responsive: true, maintainAspectRatio: false }} />
    </div>
  </motion.div>

  {/* SELL */}
  <motion.div variants={item} className="bg-[var(--card-bg)] border p-6 rounded-xl shadow-sm">
    <p className="font-semibold">Sell Turn Over</p>
    <p className="text-xs opacity-70">Sell turnover by market category</p>
    <div className="h-72 mt-4">
      <Bar data={sellData} options={{ responsive: true, maintainAspectRatio: false }} />
    </div>
  </motion.div>

  {/* TOTAL TURNOVER */}
  <motion.div variants={item} className="bg-[var(--card-bg)] border p-6 rounded-xl shadow-sm">
    <p className="font-semibold">Total Turn Over</p>
    <p className="text-xs opacity-70">Total turnover by market category</p>
    <div className="h-72 mt-4">
      <Bar data={totalData} options={{ responsive: true, maintainAspectRatio: false }} />
    </div>
  </motion.div>

  {/* ACTIVE USERS */}
  <motion.div variants={item} className="bg-[var(--card-bg)] border p-6 rounded-xl shadow-sm">
    <p className="font-semibold">Active Users</p>
    <p className="text-xs opacity-70">Active users by market category</p>
    <div className="h-72 mt-4">
      <Bar data={activeUserData} options={{ responsive: true, maintainAspectRatio: false }} />
    </div>
  </motion.div>

</motion.section>

      {/* ================= QUICK SUMMARY ================= */}
      <motion.section variants={container} className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 sm:px-6 md:px-8 lg:px-0">

        <motion.div
          variants={item}
          className="col-span-2 bg-[var(--card-bg)] border p-6 rounded-xl shadow-sm hover:shadow-xl"
        >
          <p className="text-sm opacity-70 mb-4 font-semibold">Quick Summary</p>

          <ul className="text-sm space-y-3">
            <li className="flex justify-between px-3 py-3 border rounded-lg hover:bg-[var(--primary)]/10 cursor-pointer">
              <span>Active Users</span>
              <span className="font-semibold">{mockStats.totalUsers - 120}</span>
            </li>

            <li className="flex justify-between px-3 py-3 border rounded-lg hover:bg-[var(--primary)]/10 cursor-pointer">
              <span>KYC Pending</span>
              <span className="font-semibold text-amber-400">24</span>
            </li>

            <li className="flex justify-between px-3 py-3 border rounded-lg hover:bg-[var(--primary)]/10 cursor-pointer">
              <span>High Risk Accounts</span>
              <span className="font-semibold text-red-400">5</span>
            </li>

            <li className="flex justify-between px-3 py-3 border rounded-lg hover:bg-[var(--primary)]/10 cursor-pointer">
              <span>Average Trade Size</span>
              <span className="font-semibold">$18,500</span>
            </li>
          </ul>
        </motion.div>

      </motion.section>
    </motion.div>
  );
}
