"use client";

import { useState } from "react";
import { Pencil, Power, Trash2, Plus, X } from "lucide-react";


interface BankType {
  id: number;
  bankName: string;
  status: string;
  accountHolder: string;
  accountNumber: string;
  ifsc: string;
  branch: string;
  phonepe: string;
  googlePay: string;
  paytm: string;
  upiId: string;
}

interface BankCardProps {
  data: BankType;
  onDelete: () => void;
  onActivate: () => void;
  onEdit: () => void;
}


const dummyData: BankType[] = [
  {
    id: 1,
    bankName: "Axis bank",
    status: "Inactive",
    accountHolder: "Nisheeta mulchandani patel",
    accountNumber: "9879855475",
    ifsc: "UTIB0000003",
    branch: "St. xaviours road",
    upiId: "harsh@okaxis",
    phonepe: "9879855785",
    googlePay: "9879855478",
    paytm: "9875477854",
  },
  {
    id: 2,
    bankName: "ICICI Bank",
    status: "Inactive",
    accountHolder: "Purvesh Patel",
    accountNumber: "789878547895",
    ifsc: "ICIC0000457",
    branch: "St. xaviours",
    upiId: "purvesh@upi",
    phonepe: "purvesh@ibl",
    googlePay: "purvesh@okicici",
    paytm: "9875477854",
  },
];

export default function BankAccounts() {
  const [accounts, setAccounts] = useState<BankType[]>(dummyData);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editBank, setEditBank] = useState<BankType | null>(null);

  const [newBank, setNewBank] = useState<Omit<BankType, "id" | "status">>({
    bankName: "",
    accountHolder: "",
    accountNumber: "",
    ifsc: "",
    branch: "",
    phonepe: "",
    googlePay: "",
    paytm: "",
    upiId: "",
  });

 
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setNewBank({ ...newBank, [e.target.name]: e.target.value });
  };

  
  const handleAddAccount = () => {
    setAccounts([
      ...accounts,
      { id: Date.now(), status: "Inactive", ...newBank },
    ]);
    setShowAddModal(false);

    setNewBank({
      bankName: "",
      accountHolder: "",
      accountNumber: "",
      ifsc: "",
      branch: "",
      phonepe: "",
      googlePay: "",
      paytm: "",
      upiId: "",
    });
  };

  
  const handleDelete = (id: number) => {
    setAccounts(accounts.filter((acc) => acc.id !== id));
  };

  const toggleActive = (id: number) => {
    setAccounts(
      accounts.map((acc) =>
        acc.id === id
          ? { ...acc, status: acc.status === "Active" ? "Inactive" : "Active" }
          : acc
      )
    );
  };

  /* ---------------------- SAVE EDIT ---------------------- */
  const handleSaveEdit = (updatedBank: BankType) => {
    setAccounts(
      accounts.map((acc) => (acc.id === updatedBank.id ? updatedBank : acc))
    );
    setEditBank(null);
  };

  return (
    <div className="p-8 text-[var(--foreground)] space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Bank Accounts</h1>
          <p className="text-sm text-[var(--text-muted)]">Manage company bank details.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary-dark)] rounded-lg flex items-center gap-2"
        >
          <Plus size={18} /> Add New Account
        </button>
      </div>

      {/* Bank Cards */}
      <div className="space-y-6">
        {accounts.map((acc) => (
          <BankCard
            key={acc.id}
            data={acc}
            onDelete={() => handleDelete(acc.id)}
            onActivate={() => toggleActive(acc.id)}
            onEdit={() => setEditBank(acc)}
          />
        ))}
      </div>

      {showAddModal && (
        <AddBankModal
          newBank={newBank}
          handleChange={handleChange}
          close={() => setShowAddModal(false)}
          add={handleAddAccount}
        />
      )}

      {editBank && (
        <EditBankModal
          bank={editBank}
          close={() => setEditBank(null)}
          save={handleSaveEdit}
        />
      )}

    </div>
  );
}


function BankCard({
  data,
  onDelete,
  onActivate,
  onEdit,
}: BankCardProps) {
  return (
    <div className="border border-[var(--card-border)] bg-[var(--card-bg)] p-6 rounded-xl">
      <div className="flex justify-between">

        <div>
          <h2 className="text-xl font-semibold flex items-center gap-3">
            {data.bankName}

            <span
              className={`text-xs px-2 py-1 rounded-md ${
                data.status === "Active"
                  ? "bg-[var(--success)] text-white"
                  : "bg-[var(--hover-bg)] text-black"
              }`}
            >
              {data.status}
            </span>
          </h2>

          <div className="mt-4 space-y-1 text-sm text-[var(--text-muted)]">
            <p><strong>Account Holder:</strong> {data.accountHolder}</p>
            <p><strong>Account Number:</strong> {data.accountNumber}</p>
            <p><strong>IFSC:</strong> {data.ifsc}</p>
            <p><strong>Branch:</strong> {data.branch}</p>
            <p><strong>UPI ID:</strong> {data.upiId}</p>

            <hr className="border-[var(--card-border)] my-3" />

            <p><strong>PhonePe:</strong> {data.phonepe}</p>
            <p><strong>Google Pay:</strong> {data.googlePay}</p>
            <p><strong>Paytm:</strong> {data.paytm}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 items-center">

          

          <button
            onClick={onActivate}
            className={`px-5 py-2 rounded-lg flex items-center gap-2 ${
              data.status === "Active"
                ? "bg-yellow-600 text-black"
                : "bg-[var(--hover-bg)] text-black"
            }`}
          >
            <Power size={16} /> {data.status === "Active" ? "Deactivate" : "Activate"}
          </button>

          <button
            onClick={onEdit}
            className="px-9 py-2 bg-[var(--hover-bg)]  gap-2 flex items-center rounded-lg text-black"
          >
            <Pencil size={16} /> Edit
          </button>

          <button
            onClick={onDelete}
            className="px-8 py-2 bg-[var(--danger)] text-white  gap-2 flex items-cente rounded-lg"
          >
            <Trash2 size={17} />  Delete
          </button>

        </div>

      </div>
    </div>
  );
}

/* ---------------------- EDIT MODAL ---------------------- */
function EditBankModal({
  bank,
  close,
  save,
}: {
  bank: BankType;
  close: () => void;
  save: (bank: BankType) => void;
}) {
  const [form, setForm] = useState<BankType>(bank);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-[850px] bg-[var(--card-bg)] text-[var(--foreground)] rounded-2xl p-8 border border-[var(--card-border)] relative">

        <button onClick={close} className="absolute right-5 top-5 text-[var(--text-muted)] hover:text-white">
          <X size={22} />
        </button>

        <h2 className="text-2xl font-bold">Edit Bank Account</h2>
        <p className="text-sm text-[var(--text-muted)] mb-6">Update bank and UPI details below.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {Object.keys(form).map((field) =>
            field !== "id" && field !== "status" ? (
              <div key={field}>
                <label className="text-sm mb-1 block capitalize">
                  {field.replace(/([A-Z])/g, " $1")}
                </label>
                <input
                  type="text"
                  name={field}
                  value={(form as any)[field]}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)]"
                />
              </div>
            ) : null
          )}
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button onClick={close} className="px-5 py-2 bg-[var(--hover-bg)] text-black rounded-lg">
            Close
          </button>

          <button
            onClick={() => save(form)}
            className="px-5 py-2 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white rounded-lg"
          >
            Save Changes
          </button>
        </div>

      </div>
  
    </div>
  );
}

/* ---------------------- ADD MODAL ---------------------- */
function AddBankModal({
  newBank,
  handleChange,
  close,
  add,
}: {
  newBank: {
    bankName: string;
    accountHolder: string;
    accountNumber: string;
    ifsc: string;
    branch: string;
    phonepe: string;
    googlePay: string;
    paytm: string;
    upiId: string;
  };
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  close: () => void;
  add: () => void;
}) {
  const fields: { key: keyof typeof newBank; label: string }[] = [
    { key: "bankName", label: "Bank Name" },
    { key: "accountHolder", label: "Account Holder Name" },
    { key: "accountNumber", label: "Account Number" },
    { key: "ifsc", label: "IFSC Code" },
    { key: "branch", label: "Branch" },
    { key: "upiId", label: "UPI ID" },
    { key: "phonepe", label: "PhonePe Number" },
    { key: "googlePay", label: "Google Pay Number" },
    { key: "paytm", label: "Paytm Number" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // simple validation
    for (const f of fields) {
      if (!newBank[f.key]) {
        alert(`❌ Please fill ${f.label}`);
        return;
      }
    }

    add();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-[850px] bg-[var(--card-bg)] text-[var(--foreground)] rounded-2xl p-8 border border-[var(--card-border)] relative">

        {/* CLOSE */}
        <button
          onClick={close}
          className="absolute right-5 top-5 text-[var(--text-muted)] hover:text-white"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold">Add New Bank Account</h2>
        <p className="text-sm text-[var(--text-muted)] mb-6">
          Fill bank details to add new account.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {fields.map(({ key, label }) => (
              <div key={key}>
                <label className="text-sm mb-1 block">
                  {label}
                </label>
                <input
                  type="text"
                  name={key}
                  value={newBank[key]}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg
                    bg-[var(--input-bg)]
                    border border-[var(--input-border)]
                    focus:outline-none
                    focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={close}
              className="px-5 py-2 bg-[var(--hover-bg)] text-black rounded-lg"
            >
              Close
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white rounded-lg"
            >
              Add Bank Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
