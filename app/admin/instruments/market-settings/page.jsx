"use client";

import { useState } from "react";

const markets = [
  { name: "COMEX Market", from: "09:00", to: "23:59", enabled: true },
  { name: "CRYPTO Market", from: "09:00", to: "23:59", enabled: false },
  { name: "FOREX Market", from: "03:30", to: "02:30", enabled: false },
  { name: "US_INDICES Market", from: "19:01", to: "01:30", enabled: false },
  { name: "US_STOCKS Market", from: "19:01", to: "01:30", enabled: false },
];

export default function MarketSettingsPage() {
  const [form, setForm] = useState(markets);

  const updateField = (index, key, value) => {
    const updated = [...form];
    updated[index][key] = value;
    setForm(updated);
  };

  const handleSave = () => {
    alert("Settings saved (dummy only)");
  };

  return (
    <div className="p-6 space-y-8">

      <h1 className="text-2xl font-bold">Market Settings (24 hours format)</h1>

      {/* General Settings */}
      <div className="
        bg-[var(--card-bg)] 
        p-6 rounded-xl shadow
        border border-[var(--card-border)]
        
      ">
        <h2 className="text-lg font-semibold mb-4">General Settings</h2>

        <label className="text-sm opacity-80">Minimum profit booking seconds :</label>

        <input
          type="number"
          defaultValue="120"
          className="
            mt-2 bg-[var(--input-bg)]  ml-3
            border border-[var(--input-border)] 
            px-3 py-2 rounded-lg text-sm w-40
            focus:ring-2 focus:ring-[var(--primary)]
          "
        />
      </div>

      {/* Market Settings */}
      <div className="
        bg-[var(--card-bg)] 
        p-6 rounded-xl shadow
        border border-[var(--card-border)]
        
      ">
        <h2 className="text-lg font-semibold mb-6">Market Settings</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {form.map((market, index) => (
            <div
              key={index}
              className="
                rounded-xl p-5 bg-[var(--card-bg)]
                shadow border border-[var(--card-border)]
               
              "
            >
              {/* Title + Switch */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">{market.name}</h3>

                {/* Toggle */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={market.enabled}
                    onChange={(e) =>
                      updateField(index, "enabled", e.target.checked)
                    }
                    className="sr-only"
                  />

                  <div
                    className={`
                      w-12 h-6 rounded-full transition-all 
                      ${market.enabled ? "bg-[var(--primary)]" : "bg-gray-600"}
                    `}
                  ></div>

                  <span
                    className={`
                      absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow 
                      transition-all duration-300
                      ${market.enabled ? "translate-x-6" : ""}
                    `}
                  ></span>
                </label>
              </div>

              {/* Time Inputs */}
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <label className="text-xs opacity-70">From</label>
                  <input
                    type="time"
                    value={market.from}
                    onChange={(e) => updateField(index, "from", e.target.value)}
                    className="
                      mt-1 w-full bg-[var(--input-bg)] 
                      border border-[var(--input-border)]
                      rounded-lg p-2 text-sm 
                      focus:ring-2 focus:ring-[var(--primary)]
                    "
                  />
                </div>

                <div>
                  <label className="text-xs opacity-70">To</label>
                  <input
                    type="time"
                    value={market.to}
                    onChange={(e) => updateField(index, "to", e.target.value)}
                    className="
                      mt-1 w-full bg-[var(--input-bg)] 
                      border border-[var(--input-border)]
                      rounded-lg p-2 text-sm 
                      focus:ring-2 focus:ring-[var(--primary)]
                    "
                  />
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="
            bg-[var(--primary)] text-white 
            px-6 py-2 rounded-lg shadow-md 
            hover:opacity-90 transition
          "
        >
          Update Settings
        </button>
      </div>

    </div>
  );
}
