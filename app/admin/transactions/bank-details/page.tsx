"use client";

import { useEffect, useState } from "react";
import { Pencil, Power, Trash2, Plus, X, Trash2Icon } from "lucide-react";
import { useGetPaymentMethods } from "@/hooks/payment-method/useGetPaymentMethods";
import { uploadToCloudinary } from "@/services/cloudinary.service";
import { useAddPaymentMethod } from "@/hooks/payment-method/useAddPaymentMethod";
import { useTogglePaymentStatus } from "@/hooks/payment-method/useTogglePaymentStatus";
import { useDeletePaymentMethod } from "@/hooks/payment-method/useDeletePaymentMethod";
import { useUpdatePaymentMethod } from "@/hooks/payment-method/useUpdatePaymentMethod";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

/* ================= TYPES ================= */
interface BankType {
  id: string;
  paymentType: "bank" | "upi" | "crypto";
  status: "Active" | "Inactive";

  bankName?: string;
  accountHolder?: string;
  accountNumber?: string;
  ifsc?: string;
  branch?: string;

  upiId?: string;
  cryptoNetwork?: string;
  cryptoAddress?: string;

  image?: string;
}

interface BankCardProps {
  data: BankType;
  onDelete: () => void;
  onActivate: () => void;
  onEdit: () => void;
}

/* ================= MAIN PAGE ================= */
export default function BankAccounts() {
  const [accounts, setAccounts] = useState<BankType[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editBank, setEditBank] = useState<BankType | null>(null);
  const queryClient = useQueryClient();

  const [newBank, setNewBank] = useState({
    bankName: "",
    accountHolder: "",
    accountNumber: "",
    ifsc: "",
    branch: "",
    upiId: "",
    cryptoNetwork: "",
    cryptoAddress: "",
    image: null as File | null,
  });

  const { data } = useGetPaymentMethods();
  const deleteMutation = useDeletePaymentMethod();
  const toggleMutation = useTogglePaymentStatus();

  useEffect(() => {
    if (data?.data) {
      setAccounts(
        data.data.map((item: any) => ({
          id: item._id,
          paymentType: item.type.toLowerCase(),
          status: item.is_active ? "Active" : "Inactive",
          bankName: item.bank_name,
          accountHolder: item.account_name,
          accountNumber: item.account_number,
          ifsc: item.ifsc,
          branch: item.branch,
          upiId: item.upi_id,
          cryptoNetwork: item.crypto_network,
          cryptoAddress: item.crypto_address,
          image: item.image_url,
        }))
      );
    }
  }, [data]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setNewBank({ ...newBank, [e.target.name]: e.target.value });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Payment method deleted");
        queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
      },
      onError: () => {
      toast.error("Failed to delete payment method");
      },
    });
  };


  const toggleActive = (id: string) => {
    const bank = accounts.find((a) => a.id === id);
    if (!bank) return;

    toggleMutation.mutate(
      { id, is_active: bank.status !== "Active" },
      {
        onSuccess: () => {
          toast.success(
          bank.status === "Active"
            ? "Account deactivated"
            : "Account activated"
        );
          queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
        },
          onError: () => {
        toast.error("Status update failed");
      },
      }
    );
  };



  return (
    <div className="p-8 text-[var(--foreground)] space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Bank Accounts</h1>
          <p className="text-sm text-[var(--text-muted)]">
            Manage company bank details.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary-dark)] rounded-lg flex items-center gap-2"
        >
          <Plus size={18} /> Add Bank Details
        </button>
      </div>

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
        />
      )}

      {editBank && (
        <EditBankModal
          bank={editBank}
          close={() => setEditBank(null)}
        />

      )}
    </div>
  );
}

/* ================= CARD ================= */
function BankCard({ data, onDelete, onActivate, onEdit }: BankCardProps) {
  return (
    <div className="border border-[var(--card-border)] bg-[var(--card-bg)] p-6 rounded-xl">
      <div className="flex justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-3">
            {data.paymentType.toUpperCase()}
            <span
              className={`text-xs px-2 py-1 rounded-md ${data.status === "Active"
                ? "bg-[var(--success)] text-white"
                : "bg-[var(--hover-bg)] text-black"
                }`}
            >
              {data.status}
            </span>
          </h2>

          <div className="mt-4 space-y-1 text-sm text-[var(--text-muted)]">
            {data.paymentType === "bank" && (
              <>
                <p><strong>Account Holder:</strong> {data.accountHolder}</p>
                <p><strong>Account Number:</strong> {data.accountNumber}</p>
                <p><strong>IFSC:</strong> {data.ifsc}</p>
                <p><strong>Branch:</strong> {data.branch}</p>
              </>
            )}

            {data.paymentType === "upi" && (
              <p><strong>UPI ID:</strong> {data.upiId}</p>
            )}

            {data.paymentType === "crypto" && (
              <>
                <p><strong>Network:</strong> {data.cryptoNetwork}</p>
                <p><strong>Wallet:</strong> {data.cryptoAddress}</p>
              </>
            )}

            {data.image && (
              <>
                <hr className="border-[var(--card-border)] my-3" />
                <img src={data.image} className="h-32 rounded-lg border" />
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button onClick={onActivate} className={`px-5 py-2 rounded-lg flex items-center gap-2 ${data.status === "Active"
            ? "bg-yellow-600 hover:bg-yellow-700 text-black"
            : "bg-[var(--hover-bg)] hover:opacity-90 text-black"
            }`}
          >
            <Power size={16} />
            {data.status === "Active" ? "Deactivate" : "Activate"}
          </button>

          <button onClick={onEdit} className="px-5 py-2 rounded-lg flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
            <Pencil size={16} /> Edit
          </button>

          <button
            onClick={onDelete}
            className="px-5 py-2 rounded-lg flex items-center gap-2 bg-[var(--danger)] hover:opacity-80 text-white"
          >
            <Trash2 size={16} /> Delete
          </button>

        </div>
      </div>
    </div>
  );
}


/* ================= EDIT MODAL ================= */

function EditBankModal({
  bank,
  close,

}: {
  bank: BankType;
  close: () => void;

}) {
  const [form, setForm] = useState<BankType>({ ...bank });
  const queryClient = useQueryClient();

  const [preview, setPreview] = useState<string | null>(
    bank.image || null
  );


  const updateMutation = useUpdatePaymentMethod();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const [newImage, setNewImage] = useState<File | null>(null);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setNewImage(file);
    setPreview(URL.createObjectURL(file));
  };

  /* ================= SAVE (UPDATED) ================= */
  const handleSave = async () => {
    let imageUrl = form.image;
    let imagePublicId;

    if (newImage) {
      const cloud = await uploadToCloudinary(newImage);
      imageUrl = cloud.secure_url;
      imagePublicId = cloud.public_id;
    }

    updateMutation.mutate(
      {
        id: form.id,
        payload: {
          bank_name: form.bankName,
          account_name: form.accountHolder,
          account_number: form.accountNumber,
          ifsc: form.ifsc,
          upi_id: form.upiId,
          crypto_network: form.cryptoNetwork,
          crypto_address: form.cryptoAddress,
          image_url: imageUrl,
          image_public_id: imagePublicId,
        },
      },
      {
        onSuccess: () => {
           toast.success("Payment details updated");
          queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
          close();
        },
        onError: () => {
      toast.error("Update failed");
    },
      }
    );

  };


  return (
    <div
      className="fixed inset-0 z-[9999]
                 bg-black/40 backdrop-blur-sm
                 flex items-center justify-center"
    >
      {/* MODAL BOX */}
      <div className="w-[850px] bg-[var(--card-bg)]
                      rounded-2xl p-8 relative">

        {/* CLOSE */}
        <button
          onClick={close}
          className="absolute right-5 top-5 text-[var(--text-muted)]"
        >
          <X size={22} />
        </button>

        <h2 className="text-xl font-semibold mb-6">
          Edit Payment Details
        </h2>

        <div className="grid grid-cols-2 gap-5">
          {form.paymentType === "bank" && (
            <>
              <input name="bankName" value={form.bankName || ""} onChange={handleChange} placeholder="Bank Name" className="w-full px-3 py-2 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)]" />
              <input name="accountHolder" value={form.accountHolder || ""} onChange={handleChange} placeholder="Account Holder" className="w-full px-3 py-2 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)]" />
              <input name="accountNumber" value={form.accountNumber || ""} onChange={handleChange} placeholder="Account Number" className="w-full px-3 py-2 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)]" />
              <input name="ifsc" value={form.ifsc || ""} onChange={handleChange} placeholder="IFSC Code" className="w-full px-3 py-2 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)]" />
              <input name="branch" value={form.branch || ""} onChange={handleChange} placeholder="Branch" className="w-full px-3 py-2 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)]" />
            </>
          )}

          {form.paymentType === "upi" && (
            <input name="upiId" value={form.upiId || ""} onChange={handleChange} placeholder="UPI ID" className="w-full px-3 py-2 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)]" />
          )}

          {form.paymentType === "crypto" && (
            <>
              <input name="cryptoNetwork" value={form.cryptoNetwork || ""} onChange={handleChange} placeholder="Crypto Network" className="w-full px-3 py-2 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)]" />
              <input name="cryptoAddress" value={form.cryptoAddress || ""} onChange={handleChange} placeholder="Wallet Address" className="w-full px-3 py-2 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)]" />
            </>
          )}

          <div className="col-span-2">
            <input type="file" onChange={handleImageChange} className="w-full px-3 py-2 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)]" />
            {preview && (
              <img src={preview} className="mt-3 h-32 rounded-lg border" />
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button onClick={close}>Cancel</button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-[var(--primary)] text-white rounded-lg"
          >
            Save
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
}: {
  newBank: {
    bankName: string;
    accountHolder: string;
    accountNumber: string;
    ifsc: string;
    branch: string;
    upiId: string;
    cryptoNetwork: string;
    cryptoAddress: string;
    image?: File | null;
  };
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  close: () => void;
}) {
  const [bankType, setBankType] =
    useState<"bank" | "upi" | "crypto">("bank");

  const [isLoading, setIsLoading] = useState(false);

  const [preview, setPreview] = useState<string | null>(null);

  const addMutation = useAddPaymentMethod();


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));

    handleChange({
      target: {
        name: "image",
        value: file,
      },
    } as any);
  };


  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (bankType === "bank") {
      if (
        !newBank.bankName ||
        !newBank.accountHolder ||
        !newBank.accountNumber ||
        !newBank.ifsc ||
        !newBank.branch
      ) {
        toast.error("Please fill all bank details");
        return;
      }
    }

    if (bankType === "upi" && !newBank.upiId) {
     toast.error("Please fill UPI ID");
      return;
    }

    if (
      bankType === "crypto" &&
      (!newBank.cryptoNetwork || !newBank.cryptoAddress)
    ) {
       toast.error("Please fill crypto details");
      return;
    }

    if (!newBank.image) {
       toast.error("Please upload image");
      return;
    }
    setIsLoading(true);
    try {

      const cloud = await uploadToCloudinary(newBank.image);
      const PAYMENT_TYPE_MAP = {
        bank: "BANK",
        upi: "UPI",
        crypto: "CRYPTO",
      } as const;


      addMutation.mutate(
        {
          type: PAYMENT_TYPE_MAP[bankType],

          title: newBank.bankName || "Payment",

          bank_name: newBank.bankName,
          account_name: newBank.accountHolder,
          account_number: newBank.accountNumber,
          ifsc: newBank.ifsc,

          upi_id: newBank.upiId,
          crypto_network: newBank.cryptoNetwork,
          crypto_address: newBank.cryptoAddress,

          image_url: cloud.secure_url,
          image_public_id: cloud.public_id,
        },
        {
          onSuccess: () => {
            toast.success("Payment method added successfully");
            setIsLoading(false);
            close();
          },
          onError: () => {
          toast.error("Failed to add payment method");
          setIsLoading(false);
          },
        }
      );
    } catch {
       toast.error("Image upload failed");
       setIsLoading(false);
    }
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

        <h2 className="text-2xl font-bold mb-1">
          Add Payment Details
        </h2>
        <p className="text-sm text-[var(--text-muted)] mb-6">
          Select payment type and upload proof image.
        </p>

        {/* PAYMENT TYPE */}
        <div className="mb-6">
          <label className="text-sm mb-1 block">Payment Type</label>
          <select
            value={bankType}
            onChange={(e) =>
              setBankType(e.target.value as "bank" | "upi" | "crypto")
            }
            className="w-full px-3 py-2 rounded-lg bg-[var(--input-bg)]
              border border-[var(--input-border)] focus:ring-2 focus:ring-[var(--primary)]"
          >
            <option value="bank">Bank</option>
            <option value="upi">UPI ID</option>
            <option value="crypto">Crypto</option>
          </select>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {bankType === "bank" && (
              <>
                <Input label="Bank Name" name="bankName" value={newBank.bankName} onChange={handleChange} placeholder="Bank Name" />
                <Input label="Account Holder" name="accountHolder" value={newBank.accountHolder} onChange={handleChange} placeholder="Account Holder" />
                <Input label="Account Number" name="accountNumber" value={newBank.accountNumber} onChange={handleChange} placeholder="Account Number" />
                <Input label="IFSC Code" name="ifsc" value={newBank.ifsc} onChange={handleChange} placeholder="IFSC Code" />
                <Input label="Branch" name="branch" value={newBank.branch} onChange={handleChange} placeholder="Branch" />
              </>
            )}

            {bankType === "upi" && (
              <Input label="UPI ID" name="upiId" value={newBank.upiId} onChange={handleChange} />
            )}

            {bankType === "crypto" && (
              <>
                <select
                  name="cryptoNetwork"
                  value={newBank.cryptoNetwork}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--input-bg)]
                    border border-[var(--input-border)]"
                >
                  <option value="">Select Network</option>
                  <option value="BTC">Bitcoin</option>
                  <option value="ETH">Ethereum</option>
                  <option value="TRON">TRON</option>
                  <option value="BSC">BSC</option>
                </select>

                <Input label="Wallet Address" name="cryptoAddress" value={newBank.cryptoAddress} onChange={handleChange} />
              </>
            )}

            <div className="md:col-span-2 bg-[var(--input-bg)]
          border border-[var(--input-border)]">
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {preview && <img src={preview} className="mt-3 h-32 bg-[var(--input-bg)]
          border border-[var(--input-border)]" />}
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button type="button" onClick={close}>Close</button>
            <button
  type="submit"
  disabled={isLoading}
  className={`px-5 py-2 rounded-lg flex items-center gap-2
    ${isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-[var(--primary)]"}
    text-white`}
>
  {isLoading && (
    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
  )}
  {isLoading ? "Processing..." : "Add Account"}
</button>
          </div>
        </form>
      </div>
    </div>
  );
}


/* ================= REUSABLE INPUT ================= */
function Input({
  label,
  ...props
}: {
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-sm mb-1 block">{label}</label>
      <input
        {...props}
        className="w-full px-3 py-2 rounded-lg
          bg-[var(--input-bg)]
          border border-[var(--input-border)]
          focus:outline-none
          focus:ring-2 focus:ring-[var(--primary)]"
      />
    </div>
  );
}


