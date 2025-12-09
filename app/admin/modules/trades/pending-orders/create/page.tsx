"use client";

import { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreatePendingOrder() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);

  const [form, setForm] = useState({
    segment: "",
    lotSize: "",
    scrip: "",
    user: "",
    orderType: "BUY",
    price: "",
    password: "",
  });

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (
      !form.segment ||
      !form.lotSize ||
      !form.scrip ||
      !form.user ||
      !form.price ||
      !form.password
    ) {
      alert("❌ Please fill all fields!");
      return;
    }

    alert("✅ Pending Order Created Successfully!");
    router.back();
  };

  return (
    <div className="p-6 space-y-6 text-[var(--foreground)]">
      {/* BACK BUTTON */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 bg-[var(--card-bg)] border border-[var(--card-border)] px-4 py-2 rounded-md hover:bg-[var(--hover-bg)] transition"
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* TITLE */}
      <h1 className="text-3xl font-semibold text-center">Create Pending Order</h1>

      {/* FORM CARD */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-8 rounded-xl space-y-6 max-w-4xl mx-auto">

        {/* ROW 1 */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label>Segment</label>
            <select
              name="segment"
              value={form.segment}
              onChange={onChange}
              className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] p-3 rounded-md mt-1"
            >
              <option value="">Select a segment</option>
              <option>Equity</option>
              <option>Commodity</option>
              <option>Forex</option>
            </select>
          </div>

          <div>
            <label>Lot Size</label>
            <input
              name="lotSize"
              value={form.lotSize}
              onChange={onChange}
              placeholder="Enter lot size"
              className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] p-3 rounded-md mt-1"
            />
          </div>
        </div>

        {/* ROW 2 */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label>Search Scrip</label>
            <select
              name="scrip"
              value={form.scrip}
              onChange={onChange}
              className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] p-3 rounded-md mt-1"
            >
              <option value="">Select a scrip</option>
              <option>TATA</option>
              <option>RELIANCE</option>
            </select>
          </div>

          <div>
            <label>Order Type</label>
            <select
              name="orderType"
              value={form.orderType}
              onChange={onChange}
              className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] p-3 rounded-md mt-1"
            >
              <option>BUY</option>
              <option>SELL</option>
            </select>
          </div>
        </div>

        {/* ROW 3 */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label>Search User</label>
            <select
              name="user"
              value={form.user}
              onChange={onChange}
              className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] p-3 rounded-md mt-1"
            >
              <option value="">Select a user</option>
              <option>User01</option>
              <option>User02</option>
            </select>
          </div>

          <div>
            <label>Price</label>
            <input
              name="price"
              value={form.price}
              onChange={onChange}
              placeholder="Enter price"
              className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] p-3 rounded-md mt-1"
            />
          </div>
        </div>

        {/* PASSWORD FIELD */}
        <div>
          <label>Transaction Password</label>
          <div className="relative">
            <input
              name="password"
              type={showPass ? "text" : "password"}
              value={form.password}
              onChange={onChange}
              placeholder="Enter transaction password"
              className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] p-3 rounded-md mt-1"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-4 text-[var(--text-muted)]"
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <p className="text-[var(--text-muted)] text-sm mt-1">
            Please enter your transaction password to proceed
          </p>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex justify-center pt-4">
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
