"use client";

import {
  Users,
  Activity,
  ShieldCheck,
  IndianRupee,
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

import { Bar, Doughnut } from "react-chartjs-2";
import { motion } from "framer-motion";

// REGISTER CHART MODULES
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

// ================= MOCK DATA =================
const mockStats = {
  totalUsers: 1280,
  liveTrades: 87,
  totalKyc: 945,
  totalProfit: 4523,
  totalLoss: 1235,
  subscribers: 24473,
};

const COLORS = ["#6A5EF9", "#50C4ED", "#7DE5ED", "#4E89FF"];

// ANIMATION VARIANTS
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 35, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1 },
};

export default function Overview() {
  const netPnL = mockStats.totalProfit - mockStats.totalLoss;
  const pnlIcon = netPnL >= 0 ? TrendingUp : TrendingDown;
  const pnlColor = netPnL >= 0 ? "text-emerald-400" : "text-red-400";

  // TOP CARD DATA WITH CUSTOM P&L BLOCK
  const features = [
    {
      title: "Total Users",
      value: mockStats.totalUsers.toLocaleString(),
      icon: Users,
      color: "text-[var(--primary)]",
      glow: "shadow-[0_0_20px_var(--glow)]",
      footer: "+32 new today",
    },
    {
      title: "Live Trades",
      value: mockStats.liveTrades,
      icon: Activity,
      color: "text-emerald-400",
      glow: "shadow-[0_0_15px_rgba(16,185,129,0.4)]",
      footer: "12 running now",
    },
    {
      title: "KYC Completed",
      value: mockStats.totalKyc.toLocaleString(),
      icon: ShieldCheck,
      color: "text-sky-400",
      glow: "shadow-[0_0_15px_rgba(56,189,248,0.4)]",
      footer: "24 pending",
    },

    // CUSTOM CARD: NET PROFIT & LOSS
    {
      isCustom: true,
      icon: IndianRupee,
      glow: "shadow-[0_0_18px_var(--glow)]",
      block: (
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-wide opacity-70">
            Net P&L (Today)
          </span>
          <span
            className={`text-xl font-semibold flex items-center gap-1 ${pnlColor}`}
          >
            {netPnL >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
            ₹{Math.abs(netPnL).toLocaleString()}
          </span>
          <span className="text-xs opacity-70 mt-1">
            Profit: ₹{mockStats.totalProfit.toLocaleString()} · Loss: ₹
            {mockStats.totalLoss.toLocaleString()}
          </span>
        </div>
      ),
    },
  ];

  const salesData = {
    labels: ["Oct", "Nov", "Dec"],
    datasets: [
      { label: "Deposit", data: [2988, 1765, 4005], backgroundColor: COLORS[0], borderRadius: 12 },
      { label: " kyc pending", data: [1500, 990, 2200], backgroundColor: COLORS[1], borderRadius: 12 },
      { label: "Total Profile", data: [900, 700, 1800], backgroundColor: COLORS[2], borderRadius: 12 },
    ],
  };

  const subscriberChart = {
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [{ data: [1200, 2370, 3874, 2100, 3200, 2900, 2800], backgroundColor: COLORS[0], borderRadius: 12 }],
  };

  const donutChart = {
    labels: ["Website", "Mobile App", "Other"],
    datasets: [{ data: [374.82, 241.6, 213.42], backgroundColor: COLORS }],
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">

      {/* ================= TOP FEATURE CARDS ================= */}
      <motion.section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {features.map((stat, i) => (
          <motion.div
            key={i}
            variants={item}
            whileHover={{ scale: 1.05, translateY: -6 }}
            className={`bg-[var(--card-bg)] border border-[var(--border)] p-5 rounded-xl shadow-sm hover:shadow-xl cursor-pointer transition-all`}
          >
            <div className={`h-12 w-12 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center ${stat.glow}`}>
              <stat.icon size={30} className={stat.color} />
            </div>

            {stat.isCustom ? (
              stat.block
            ) : (
              <div className="mt-2">
                <p className="text-xs text-[var(--text-muted)]">{stat.title}</p>
                <p className={`text-2xl font-semibold mt-1 ${stat.color ?? ""}`}>{stat.value}</p>
                <p className="text-xs opacity-70 mt-1">{stat.footer}</p>
              </div>
            )}
          </motion.div>
        ))}
      </motion.section>

      {/* ================= SALES + SUBSCRIBER ================= */}
      <motion.section className="grid grid-cols-1 lg:grid-cols-3 gap-6" variants={container}>
        <motion.div variants={item} className="bg-[var(--card-bg)]  border-[var(--border)] p-6 rounded-xl shadow-sm col-span-2">
          <p className="text-sm text-[var(--text-muted)]">Sales Overview</p>
          
          <div className="relative h-64 sm:h-72 md:h-80">
  <Bar data={salesData} options={{ responsive: true, maintainAspectRatio: false }} />
</div>



        </motion.div>

        <motion.div variants={item} className="bg-[var(--card-bg)] border border-[var(--border)] p-6 rounded-xl shadow-sm">
          <p className="text-sm text-[var(--text-muted)]">Total viwers</p>
          <p className="text-2xl font-bold">{mockStats.subscribers.toLocaleString()}</p>
          <p className="text-xs text-green-600 mb-2">+749 increased</p>
          <Bar data={subscriberChart} />
        </motion.div>
      </motion.section>

      {/* ================= DONUT + SUMMARY ================= */}
      <motion.section className="grid grid-cols-1 md:grid-cols-3 gap-6" variants={container}>
       

        <motion.div
  variants={item}
  className="
    col-span-2 
    bg-[var(--card-bg)] 
    border border-[var(--border)] 
    p-6 rounded-xl shadow-sm 
    transition-all duration-300 
    hover:shadow-xl hover:border-[var(--primary)]
  "
>
  <p className="text-sm text-[var(--text-muted)] mb-4 font-semibold">Quick Summary</p>

  <ul className="text-sm space-y-3">

    {/* ROW 1 */}
    <li
      className="
        flex items-center justify-between 
        px-3 py-3 rounded-lg border border-[var(--border)]
        transition-all duration-300
        hover:bg-[var(--primary)]/10 hover:text-[var(--primary)]
        cursor-pointer
      "
    >
      <span>Active Users</span>
      <span className="font-semibold">{mockStats.totalUsers - 120}</span>
    </li>

    {/* ROW 2 */}
    <li
      className="
        flex items-center justify-between 
        px-3 py-3 rounded-lg border border-[var(--border)]
        transition-all duration-300
        hover:bg-[var(--primary)]/10 hover:text-amber-400
        cursor-pointer
      "
    >
      <span>KYC Pending</span>
      <span className="font-semibold text-amber-400">24</span>
    </li>

    {/* ROW 3 */}
    <li
      className="
        flex items-center justify-between 
        px-3 py-3 rounded-lg border border-[var(--border)]
        transition-all duration-300
        hover:bg-[var(--primary)]/10 hover:text-red-400
        cursor-pointer
      "
    >
      <span>High Risk Accounts</span>
      <span className="font-semibold text-red-400">5</span>
    </li>

    {/* ROW 4 */}
    <li
      className="
        flex items-center justify-between 
        px-3 py-3 rounded-lg border border-[var(--border)]
        transition-all duration-300
        hover:bg-[var(--primary)]/10 hover:text-[var(--primary)]
        cursor-pointer
      "
    >
      <span>Average Trade Size</span>
      <span className="font-semibold">₹18,500</span>
    </li>

  </ul>
</motion.div>


         <motion.div variants={item}  className="bg-[var(--card-bg)] border border-[var(--border)] p-6 rounded-xl shadow-sm transition-all duration-300 
    hover:shadow-xl ">
          <p className="text-sm text-[var(--text-muted)] mb-2">Sales Distribution</p>
          <Doughnut data={donutChart} />
        </motion.div>
      </motion.section>
    </motion.div>
  );
}
