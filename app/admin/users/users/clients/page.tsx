"use client";

import { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateTradingClient() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);

  const tabs = [
    "Personal Details",
    "Configuration",
    "Equity Futures",
    "Options Config",
    "Options Shortselling Configuration",
    "MCX Futures",
    "Comex Config",
    "Forex Config",
    "Crypto Config",
    "US Stocks & Indices Config",
  ];

  const [activeTab, setActiveTab] = useState(0);

  // STATES
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [initialBalance, setInitialBalance] = useState("");
  const [city, setCity] = useState("");

  const [demoAccount, setDemoAccount] = useState(false);
  const [allowHighLow, setAllowHighLow] = useState(true);
  const [accountStatus, setAccountStatus] = useState(true);
  const [allowFreshEntryAboveBelow, setAllowFreshEntryAboveBelow] = useState(true);
  const [tradeEquityAsUnits, setTradeEquityAsUnits] = useState(false);
  const [autoCloseTradesIfConditionMet, setAutoCloseTradesIfConditionMet] = useState(true);

  const [autoCloseLossPercent, setAutoCloseLossPercent] = useState("90");
  const [minTimeToBookProfitSeconds, setMinTimeToBookProfitSeconds] = useState("120");
  const [notifyLossPercent, setNotifyLossPercent] = useState("70");

  const handleCreate = () => {
    alert("Create User Triggered!");
  };

  return (
    <div>
      {/* BACK BUTTON */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 mb-6 text-[var(--text-muted)] hover:text-[var(--foreground)]"
      >
        <ArrowLeft size={20} /> Back
      </button>

      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-6">Create Trading Users</h1>

      {/* MAIN CARD */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-6 w-full overflow-x-hidden">

        {/* TABS */}
        <div className="flex flex-wrap gap-2 pb-3 border-b border-[var(--card-border)]">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`px-4 py-2 rounded-md text-sm ${
                activeTab === index
                  ? "bg-[var(--input-bg)] text-[var(--foreground)]"
                  : "text-[var(--text-muted)] hover:bg-[var(--hover-bg)]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* -------------------- PERSONAL DETAILS TAB -------------------- */}
        {activeTab === 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label>First Name</label>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter first name"
                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] px-4 py-2 rounded-md"
              />
            </div>

            <div>
              <label>Last Name</label>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter last name"
                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] px-4 py-2 rounded-md"
              />
            </div>

            <div>
              <label>Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] px-4 py-2 rounded-md"
              />
            </div>

            <div>
              <label>Mobile</label>
              <input
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter phone"
                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] px-4 py-2 rounded-md"
              />
            </div>

            <div>
              <label>Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] px-4 py-2 rounded-md"
              />
            </div>

            <div>
              <label>Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] px-4 py-2 rounded-md"
                />
                <button
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-3 text-[var(--text-muted)]"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label>Initial Balance</label>
              <input
                type="number"
                value={initialBalance}
                onChange={(e) => setInitialBalance(e.target.value)}
                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] px-4 py-2 rounded-md"
              />
            </div>

            <div>
              <label>City</label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] px-4 py-2 rounded-md"
              />
            </div>

          </div>
        )}

        {/* ---------------------- CONFIGURATION TAB ---------------------- */}
        {activeTab === 1 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* LEFT SETTINGS */}
            <div>
              {[
                { label: "Demo Account?", val: demoAccount, setter: setDemoAccount },
                { label: "Allow orders between High - Low?", val: allowHighLow, setter: setAllowHighLow },
                { label: "Account Status", val: accountStatus, setter: setAccountStatus }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 mb-4">
                  <input
                    type="checkbox"
                    checked={item.val}
                    onChange={() => item.setter(!item.val)}
                    className="w-4 h-4 accent-[var(--primary)]"
                  />
                  <label>{item.label}</label>
                </div>
              ))}

              <label>Auto Close Loss %</label>
              <input
                type="number"
                value={autoCloseLossPercent}
                onChange={(e) => setAutoCloseLossPercent(e.target.value)}
                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] px-4 py-2 rounded-md"
              />
            </div>

            {/* RIGHT SETTINGS */}
            <div>
              {[
                { label: "Allow fresh entry above/below?", val: allowFreshEntryAboveBelow, setter: setAllowFreshEntryAboveBelow },
                { label: "Trade equity as units?", val: tradeEquityAsUnits, setter: setTradeEquityAsUnits },
                { label: "Auto close trades if condition met", val: autoCloseTradesIfConditionMet, setter: setAutoCloseTradesIfConditionMet }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 mb-4">
                  <input
                    type="checkbox"
                    checked={item.val}
                    onChange={() => item.setter(!item.val)}
                    className="w-4 h-4 accent-[var(--primary)]"
                  />
                  <label>{item.label}</label>
                </div>
              ))}

              <label>Min Time to Book Profit (sec)</label>
              <input
                value={minTimeToBookProfitSeconds}
                onChange={(e) => setMinTimeToBookProfitSeconds(e.target.value)}
                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] px-4 py-2 rounded-md"
              />
            </div>

          </div>
        )}

        {/* ------------------------- OTHER TABS ------------------------- */}
        {activeTab >= 2 && (
          <div className="mt-6 p-6 bg-[var(--input-bg)] border border-[var(--card-border)] rounded-lg w-full">
            <p className="text-lg font-medium">{tabs[activeTab]}</p>
            <p className="text-[var(--text-muted)]">This section will be added when you request it.</p>
          </div>
        )}
      </div>

      {/* CREATE BUTTON */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={handleCreate}
          className="px-6 py-3 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white shadow-lg"
        >
          Create
        </button>
      </div>

    </div>
  );
}
