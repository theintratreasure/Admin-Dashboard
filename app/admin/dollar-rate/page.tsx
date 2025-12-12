"use client";

import { useState } from "react";

export default function DollarRatePage() {
  const [rate, setRate] = useState<number>(83.20); // Default USD rate
  const [usd, setUsd] = useState<string>("");
  const [inr, setInr] = useState<string>("");

  // USD → INR
  const convertToINR = (value: string) => {
    setUsd(value);
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setInr((num * rate).toFixed(2));
    } else {
      setInr("");
    }
  };

  // INR → USD
  const convertToUSD = (value: string) => {
    setInr(value);
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setUsd((num / rate).toFixed(2));
    } else {
      setUsd("");
    }
  };

  return (
    <div className="p-8 text-[var(--foreground)] space-y-8">

      <h1 className="text-2xl font-bold">Dollar Rate Converter</h1>
      <p className="text-sm text-[var(--text-muted)]">
        Convert USD and INR using live rate manually entered by admin.
      </p>

      {/* CARD */}
      <div className="
        bg-[var(--card-bg)] border border-[var(--card-border)]
        p-6 rounded-xl shadow-md max-w-2xl
      ">

        {/* RATE INPUT */}
        <div className="mb-6">
          <label className="text-sm text-[var(--text-muted)] block mb-1">
            Current USD Rate (INR)
          </label>

          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
            className="
              w-full px-4 py-2 bg-[var(--input-bg)]
              border border-[var(--input-border)] rounded-lg
              focus:ring-2 focus:ring-[var(--primary)]
            "
            step="0.01"
          />
        </div>

        {/* USD → INR */}
        <div className="mb-6">
          <label className="text-sm text-[var(--text-muted)] block mb-1">
            USD Amount
          </label>

          <input
            type="number"
            value={usd}
            onChange={(e) => convertToINR(e.target.value)}
            className="
              w-full px-4 py-2 bg-[var(--input-bg)]
              border border-[var(--input-border)] rounded-lg
              focus:ring-2 focus:ring-[var(--primary)]
            "
            placeholder="Enter USD"
          />
        </div>

        {/* INR → USD */}
        <div className="mb-6">
          <label className="text-sm text-[var(--text-muted)] block mb-1">
            INR Amount
          </label>

          <input
            type="number"
            value={inr}
            onChange={(e) => convertToUSD(e.target.value)}
            className="
              w-full px-4 py-2 bg-[var(--input-bg)]
              border border-[var(--input-border)] rounded-lg
              focus:ring-2 focus:ring-[var(--primary)]
            "
            placeholder="Enter INR"
          />
        </div>

        {/* RESULTS */}
        <div className="mt-4 p-4 bg-[var(--hover-bg)] rounded-lg text-black">
          <p className="text-lg font-semibold">Converted Results</p>
          <p>USD → INR: <strong>{usd || 0} USD = {inr || 0} INR</strong></p>
          <p>INR → USD: <strong>{inr || 0} INR = {usd || 0} USD</strong></p>
        </div>

      </div>
    </div>
  );
}
