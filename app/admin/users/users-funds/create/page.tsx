"use client";

import { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateTraderFund() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="p-6 text-[var(--foreground)]">

      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--foreground)] mb-6"
      >
        <ArrowLeft size={20} /> Back
      </button>

      {/* Page Title */}
      <h1 className="text-3xl font-bold text-center mb-10">
        Create Trader Fund
      </h1>

      {/* Form Container */}
      <div className="
        max-w-4xl mx-auto 
        bg-[var(--card-bg)] 
        border border-[var(--card-border)]
        rounded-2xl p-10
      ">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* User */}
          <div>
            <label className="text-sm mb-1 block">User</label>
            <select className="
              w-full px-4 py-2 rounded-lg 
              bg-[var(--input-bg)] border border-[var(--input-border)]
            ">
              <option>Select a user</option>
              <option>Elon Musk</option>
              <option>Kashiram Shivaji</option>
              <option>Trader Sam</option>
            </select>
          </div>

          {/* Transaction Type */}
          <div>
            <label className="text-sm mb-1 block">Transaction Type</label>
            <select className="
              w-full px-4 py-2 rounded-lg 
              bg-[var(--input-bg)] border border-[var(--input-border)]
            ">
              <option>Deposit</option>
              <option>Withdrawal</option>
              <option>Deduct</option>
            </select>
          </div>

          {/* Transaction Mode */}
          <div>
            <label className="text-sm mb-1 block">Transaction Mode</label>
            <select className="
              w-full px-4 py-2 rounded-lg 
              bg-[var(--input-bg)] border border-[var(--input-border)]
            ">
              <option>Offline</option>
              <option>Online</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm mb-1 block">Notes</label>
            <textarea
              className="
                w-full px-4 py-2 h-24 rounded-lg 
                bg-[var(--input-bg)] border border-[var(--input-border)]
              "
              placeholder="Enter notes about this transaction"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="text-sm mb-1 block">Amount</label>
            <input
              type="number"
              className="
                w-full px-4 py-2 rounded-lg 
                bg-[var(--input-bg)] border border-[var(--input-border)]
              "
              placeholder="Enter amount"
            />
          </div>

          {/* Transaction Password */}
          <div>
            <label className="text-sm mb-1 block">Enter Your Transaction Password</label>

            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                className="
                  w-full px-4 py-2 rounded-lg 
                  bg-[var(--input-bg)] border border-[var(--input-border)]
                "
                placeholder="Enter transaction password"
              />
              <span
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-3 cursor-pointer"
              >
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>

            <p className="text-xs text-[var(--text-muted)] mt-1">
              Please enter your transaction password to proceed
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-10">
          <button className="
            px-10 py-3 rounded-lg 
            bg-[var(--primary)] hover:bg-[var(--primary-dark)] 
            text-white text-lg
          ">
            Submit
          </button>
        </div>

      </div>
    </div>
  );
}
