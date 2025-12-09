"use client";

import { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateTrade() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);

  // FORM DATA STATES
  const [form, setForm] = useState({
    segment: "",
    searchScrip: "",
    searchUser: "",
    lotSize: "",
    scrip: "",
    user: "",
    orderType: "BUY",
    price: "",
    password: "",
  });

  const onChange = (e) => {
  setForm({ ...form, [e.target.name]: e.target.value });
};


  const handleSubmit = () => {
    // VALIDATION
    if (
      !form.segment ||
      !form.searchScrip ||
      !form.searchUser ||
      !form.lotSize ||
      !form.scrip ||
      !form.user ||
      !form.orderType ||
      !form.price ||
      !form.password
    ) {
      alert("⚠️ Please fill all fields before submit!");
      return;
    }

    // SUCCESS
    alert("🎉 Trade Created Successfully!");
    router.push("/admin/modules/trades/live"); // redirect back to list
  };

  return (
    <div className="p-6 space-y-6">

      {/* BACK BUTTON */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 bg-[var(--card-bg)] border border-[var(--card-border)] px-4 py-2 rounded-md text-[var(--foreground)] hover:bg-[var(--hover-bg)]"
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* TITLE */}
      <h1 className="text-2xl font-semibold text-[var(--foreground)]">Create Trade</h1>

      {/* FORM CONTAINER */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6 space-y-6">

        {/* ROW 1 */}
        <div className="grid sm:grid-cols-3 gap-6">
          <div>
            <label className="text-sm text-[var(--text-muted)]">Segment *</label>
            <select
              name="segment"
              onChange={onChange}
              className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-md p-3 mt-1 text-[var(--foreground)]"
            >
              <option value="">Select a segment</option>
              <option value="Equity">Equity</option>
              <option value="Future">Future</option>
              <option value="Options">Options</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-[var(--text-muted)]">Search Scrip *</label>
            <input
              name="searchScrip"
              placeholder="Type to search scrips..."
              onChange={onChange}
              className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-md p-3 mt-1 text-[var(--foreground)]"
            />
          </div>

          <div>
            <label className="text-sm text-[var(--text-muted)]">Search User *</label>
            <input
              name="searchUser"
              placeholder="Search by name or ID..."
              onChange={onChange}
              className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-md p-3 mt-1 text-[var(--foreground)]"
            />
          </div>
        </div>

        {/* ROW 2 */}
        <div className="grid sm:grid-cols-3 gap-6">
          <div>
            <label className="text-sm text-[var(--text-muted)]">Lot Size *</label>
            <input
              name="lotSize"
              placeholder="Enter lot size"
              onChange={onChange}
              className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-md p-3 mt-1 text-[var(--foreground)]"
            />
          </div>

          <div>
            <label className="text-sm text-[var(--text-muted)]">Select a scrip *</label>
            <select
              name="scrip"
              onChange={onChange}
              className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-md p-3 mt-1 text-[var(--foreground)]"
            >
              <option value="">Select a scrip</option>
              <option value="RELIANCE">RELIANCE</option>
              <option value="TCS">TCS</option>
              <option value="INFY">INFY</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-[var(--text-muted)]">Select a user *</label>
            <select
              name="user"
              onChange={onChange}
              className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-md p-3 mt-1 text-[var(--foreground)]"
            >
              <option value="">Select a user</option>
              <option value="User 1">User 1</option>
              <option value="User 2">User 2</option>
            </select>
          </div>
        </div>

        {/* ROW 3 */}
        <div className="grid sm:grid-cols-3 gap-6">
          <div>
            <label className="text-sm text-[var(--text-muted)]">Order Type *</label>
            <select
              name="orderType"
              onChange={onChange}
              className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-md p-3 mt-1 text-[var(--foreground)]"
            >
              <option value="BUY">BUY</option>
              <option value="SELL">SELL</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-[var(--text-muted)]">Enter Price *</label>
            <input
              name="price"
              placeholder="Enter price"
              onChange={onChange}
              className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-md p-3 mt-1 text-[var(--foreground)]"
            />
          </div>
        </div>

        {/* PASSWORD */}
        <div>
          <label className="text-sm text-[var(--text-muted)]">Transaction Password *</label>
          <div className="relative">
            <input
              name="password"
              type={showPass ? "text" : "password"}
              placeholder="Enter transaction password"
              onChange={onChange}
              className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-md p-3 mt-1 text-[var(--foreground)]"
            />
            <button
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-4 text-[var(--text-muted)]"
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            className="bg-[var(--primary)] text-black px-10 py-2 rounded-md font-medium hover:opacity-90 transition"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
