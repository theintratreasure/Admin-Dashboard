"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

import { useInstruments } from "@/hooks/instruments/useInstruments";
import { useCreateInstrument } from "@/hooks/instruments/useCreateInstrument";
import { useUpdateInstrument } from "@/hooks/instruments/useUpdateInstrument";
import { useDeleteInstrument } from "@/hooks/instruments/useDeleteInstrument";

import Pagination from "../../components/ui/pagination";
import GlobalLoader from "../../components/ui/GlobalLoader";
import PremiumInput from "../../components/ui/PremiumInput";
import Toggle from "../../components/ui/Toggle";
import ConfirmModal from "../../components/ui/ConfirmModal";

/* ================= TYPES ================= */

type InstrumentFormState = {
  _id?: string;
  code: string;
  name: string;
  segment: string;
  lotSize: number;
  minQty: number;
  maxQty: number;
  qtyPrecision: number;
  pricePrecision: number;
  tickSize?: number | null;
  contractSize: number;
  swapEnabled: boolean;
  swapLong: number;
  swapShort: number;
  isActive: boolean;
  isTradeable: boolean;
};

/* ================= PAGE ================= */

export default function ManageInstruments() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const [openForm, setOpenForm] = useState(false);
  const [form, setForm] = useState<InstrumentFormState | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data, isLoading } = useInstruments({ page, limit });
  const createMutation = useCreateInstrument();
  const updateMutation = useUpdateInstrument();
  const deleteMutation = useDeleteInstrument();

  const instruments = useMemo(() => {
    const rows = data?.data ?? [];
    if (!search) return rows;

    return rows.filter((r: any) =>
      Object.values(r)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [data, search]);

  const totalPages = data?.pagination?.totalPages || 1;

  const openCreate = () => {
    setForm({
      code: "",
      name: "",
      segment: "",
      lotSize: 1,
      minQty: 0,
      maxQty: 0,
      qtyPrecision: 2,
      pricePrecision: 2,
      tickSize: 0,
      contractSize: 1,
      swapEnabled: false,
      swapLong: 0,
      swapShort: 0,
      isActive: true,
      isTradeable: true,
    });
    setOpenForm(true);
  };

  const openEdit = (row: any) => {
    setForm(row);
    setOpenForm(true);
  };

  const handleSave = async () => {
    if (!form) return;

    if (form._id) {
      await updateMutation.mutateAsync({
        id: form._id,
        payload: form,
      });
    } else {
      await createMutation.mutateAsync(form);
    }

    setOpenForm(false);
    setForm(null);
  };

  /* ================= RENDER ================= */

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="
    container-pad
    space-y-8
    overflow-x-hidden
    max-w-6xl mx-0 md:mx-auto
  "
    >

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] bg-clip-text text-transparent">
            Instruments Management
          </h1>
          <p className="text-[var(--text-muted)] mt-1">
            Manage tradable instruments, contracts and trading rules
          </p>
        </div>

        <button
          onClick={openCreate}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Add Instrument
        </button>
      </div>

      {/* SEARCH */}
      <div className="card-elevated p-6 flex items-center gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-4 h-4" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search instruments..."
            className="input w-full pl-10 pr-4"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="card-elevated overflow-hidden">
        <div className="relative overflow-x-auto overscroll-x-contain">

          <table className="table w-max min-w-[1400px]">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Segment</th>
                <th>Lot</th>
                <th>Min Qty</th>
                <th>Max Qty</th>
                <th>Precision</th>
                <th>Contract</th>
                <th>Swap</th>
                <th>Tradeable</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              <AnimatePresence>
                {isLoading ? (
                  <tr>
                    <td colSpan={11} className="py-12 text-center">
                      <GlobalLoader />
                    </td>
                  </tr>
                ) : instruments.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-16 text-center">
                      <div className="text-[var(--text-muted)]">
                        No instruments found
                      </div>
                    </td>
                  </tr>
                ) : (
                  instruments.map((row: any, idx: number) => (
                    <motion.tr
                      key={row._id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="group"
                    >
                      <td className="font-mono">{row.code}</td>
                      <td className="font-medium">{row.name}</td>
                      <td>
                        <span className="pill pill-accent">
                          {row.segment}
                        </span>
                      </td>
                      <td>{row.lotSize}</td>
                      <td>{row.minQty}</td>
                      <td>{row.maxQty}</td>
                      <td>{row.qtyPrecision}/{row.pricePrecision}</td>
                      <td>{row.contractSize}</td>
                      <td>
                        <span className={`pill ${row.swapEnabled ? "pill-success" : ""}`}>
                          {row.swapEnabled ? "Enabled" : "Disabled"}
                        </span>
                      </td>
                      <td>
                        <span className={`pill ${row.isTradeable ? "pill-success" : "pill-danger"}`}>
                          {row.isTradeable ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="text-center flex justify-center gap-2">
                        <button
                          onClick={() => openEdit(row)}
                          className="btn p-2"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedId(row._id);
                            setConfirmOpen(true);
                          }}
                          className="btn p-2 text-red-500"
                        >
                          <Trash2 size={14} />
                        </button>

                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}
      <Pagination
        page={page}
        totalPages={totalPages}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={(l) => {
          setLimit(l);
          setPage(1);
        }}
      />

      {/* FORM MODAL */}
      <AnimatePresence>
        {openForm && form && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setOpenForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="card-elevated w-full max-w-3xl"
            >
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-xl font-bold">
                  {form._id ? "Edit Instrument" : "Add Instrument"}
                </h3>
                <button onClick={() => setOpenForm(false)}>
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <PremiumInput label="Code" value={form.code} onChange={(v) => setForm({ ...form, code: v })} />
                <PremiumInput label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
                <PremiumInput label="Segment" value={form.segment} onChange={(v) => setForm({ ...form, segment: v })} />
                <PremiumInput label="Lot Size" type="number" value={form.lotSize} onChange={(v) => setForm({ ...form, lotSize: Number(v) })} />
                <PremiumInput label="Min Qty" type="number" value={form.minQty} onChange={(v) => setForm({ ...form, minQty: Number(v) })} />
                <PremiumInput label="Max Qty" type="number" value={form.maxQty} onChange={(v) => setForm({ ...form, maxQty: Number(v) })} />

                <Toggle label="Swap Enabled" value={form.swapEnabled} onChange={(v) => setForm({ ...form, swapEnabled: v })} />
                <Toggle label="Tradeable" value={form.isTradeable} onChange={(v) => setForm({ ...form, isTradeable: v })} />
              </div>

              <div className="p-6 border-t flex gap-3 justify-end">
                <button
                  onClick={() => setOpenForm(false)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="btn btn-primary"
                >
                  {form._id ? "Update" : "Create"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {confirmOpen && selectedId && (
        <ConfirmModal
          title="Delete Instrument"
          description="Are you sure you want to delete this instrument? This action cannot be undone."
          loading={deleteMutation.isPending}
          onCancel={() => {
            setConfirmOpen(false);
            setSelectedId(null);
          }}
          onConfirm={async () => {
            await deleteMutation.mutateAsync(selectedId);
            setConfirmOpen(false);
            setSelectedId(null);
          }}
        />
      )}

    </motion.div>
  );
}
