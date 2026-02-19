"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Bitcoin,
  Landmark,
  Layers,
  CandlestickChart,
  SlidersHorizontal,
  Hash,
  Type,
  Boxes,
  ArrowDownToLine,
  ArrowUpToLine,
  Sigma,
  DollarSign,
  MoveHorizontal,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  ToggleRight,
  BadgeCheck,
  Power,
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
import { getSymbolList, SymbolListItem } from "@/services/instrument.service";

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
  spread: number;
  contractSize: number;
  swapEnabled: boolean;
  swapLong: number | "";
  swapShort: number | "";
  isActive: boolean;
  isTradeable: boolean;
};

/* ================= PAGE ================= */

export default function ManageInstruments() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [segment, setSegment] = useState<string | undefined>(undefined);
  const [viewOpen, setViewOpen] = useState(false);
  const viewBoxRef = useRef<HTMLDivElement | null>(null);
  const symbolBoxRef = useRef<HTMLDivElement | null>(null);
  const [symbolOpen, setSymbolOpen] = useState(false);
  const [symbolLoading, setSymbolLoading] = useState(false);
  const [symbolResults, setSymbolResults] = useState<SymbolListItem[]>([]);

  const [openForm, setOpenForm] = useState(false);
  const [form, setForm] = useState<InstrumentFormState | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data, isLoading } = useInstruments({ page, limit, segment });
  const createMutation = useCreateInstrument();
  const updateMutation = useUpdateInstrument();
  const deleteMutation = useDeleteInstrument();
  const [visibleCols, setVisibleCols] = useState({
    code: true,
    name: true,
    segment: true,
    lot: true,
    minQty: true,
    maxQty: true,
    qtyPrecision: true,
    pricePrecision: true,
    tickSize: true,
    spread: true,
    spreadMode: true,
    swapLong: true,
    swapShort: true,
    contract: true,
    swap: true,
    tradeable: true,
    active: true,
    actions: true,
  });

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const onClick = (e: Event) => {
      const target = e.target as Node;
      const path = (e as Event & { composedPath?: () => EventTarget[] }).composedPath?.();
      const isInsideView =
        !!viewBoxRef.current &&
        (viewBoxRef.current.contains(target) ||
          (path && path.includes(viewBoxRef.current)));
      if (!isInsideView) setViewOpen(false);
      const isInsideSymbol =
        !!symbolBoxRef.current &&
        (symbolBoxRef.current.contains(target) ||
          (path && path.includes(symbolBoxRef.current)));
      if (!isInsideSymbol) setSymbolOpen(false);
    };
    document.addEventListener("mousedown", onClick, true);
    document.addEventListener("touchstart", onClick, true);
    return () => {
      document.removeEventListener("mousedown", onClick, true);
      document.removeEventListener("touchstart", onClick, true);
    };
  }, []);

  useEffect(() => {
    const formCode = form?.code;
    const formSegment = form?.segment;

    if (!openForm || !formCode) return;
    const q = String(formCode || "").trim().toUpperCase();
    if (!q) {
      setSymbolResults([]);
      setSymbolLoading(false);
      return;
    }

    let active = true;
    const handler = setTimeout(async () => {
      setSymbolLoading(true);
      const segKey = (formSegment || "").toUpperCase();
      const category =
        segKey === "FOREX"
          ? "FX"
          : segKey === "CRYPTO"
          ? "CRYPTO"
          : segKey === "METAL" || segKey === "METALS"
          ? "METAL"
          : segKey === "INDICES" || segKey === "INDEX"
          ? "INDEXES"
          : undefined;

      try {
        const list = await getSymbolList({
          page: 1,
          limit: 50,
          search: q,
          category,
          isActive: true,
          sortBy: "createdAt",
          sortOrder: "desc",
        });
        if (active) setSymbolResults(list);
      } finally {
        if (active) setSymbolLoading(false);
      }
    }, 350);

    return () => {
      active = false;
      clearTimeout(handler);
    };
  }, [openForm, form?.code, form?.segment]);

  const instruments = useMemo<InstrumentFormState[]>(() => {
    const rows = (data?.data ?? []).map((row) => ({
      ...row,
      spread_mode: row.spread_mode || "FIXED",
    }));
    if (!search) return rows;

    return rows.filter((row) =>
      Object.values(row)
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
      minQty: "",
      maxQty: "",
      qtyPrecision: 2,
      pricePrecision: 2,
      tickSize: 0,
      spread: 0,
      contractSize: 1,
      swapEnabled: false,
      swapLong: "",
      swapShort: "",
      isActive: true,
      isTradeable: true,
    });
    setOpenForm(true);
  };

  const openEdit = (row: InstrumentFormState) => {
    setForm({ ...row, spread_mode: row.spread_mode || "FIXED" });
    setOpenForm(true);
  };

  const segmentMeta = (segment?: string) => {
    const key = (segment || "").toUpperCase();
    if (key === "CRYPTO") {
      return { label: "CRYPTO", color: "text-amber-600", Icon: Bitcoin };
    }
    if (key === "FOREX") {
      return { label: "FOREX", color: "text-blue-600", Icon: Landmark };
    }
    if (key === "METAL" || key === "METALS") {
      return { label: "METAL", color: "text-emerald-600", Icon: Layers };
    }
    if (key === "INDICES" || key === "INDEX" || key === "INDX") {
      return { label: "INDICES", color: "text-purple-600", Icon: CandlestickChart };
    }
    return { label: segment || "--", color: "text-[var(--text-muted)]", Icon: Layers };
  };

  const handleSave = async () => {
    if (!form) return;
    const toNumber = (
      value: number | "" | null | undefined,
      fallback = 0
    ) => (value === "" || value === null || value === undefined ? fallback : Number(value));
    const payload = {
      code: form.code,
      name: form.name,
      segment: form.segment,
      lotSize: toNumber(form.lotSize, 1),
      minQty: toNumber(form.minQty),
      maxQty: toNumber(form.maxQty),
      qtyPrecision: toNumber(form.qtyPrecision, 2),
      pricePrecision: toNumber(form.pricePrecision, 2),
      tickSize:
        form.tickSize === "" || form.tickSize === null || form.tickSize === undefined
          ? null
          : Number(form.tickSize),
      spread: toNumber(form.spread),
      contractSize: toNumber(form.contractSize, 1),
      swapEnabled: form.swapEnabled,
      swapLong: toNumber(form.swapLong),
      swapShort: toNumber(form.swapShort),
      isActive: form.isActive,
      isTradeable: form.isTradeable,
    };

    if (form._id) {
      await updateMutation.mutateAsync({
        id: form._id,
        payload,
      });
    } else {
      await createMutation.mutateAsync(payload);
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
          <h1 className="text-[15px] sm:text-2xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] bg-clip-text text-transparent">
            Instruments Management
          </h1>
          <p className="text-[var(--text-muted)] mt-1 text-[11px] sm:text-base">
            Manage tradable instruments, contracts and trading rules
          </p>
        </div>

        {!isMobile && (
          <button
            onClick={openCreate}
            className="btn text-xs sm:text-sm border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--text-main)] hover:bg-[var(--hover-bg)]"
          >
            Add Instrument
          </button>
        )}
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap items-center">
        {[
          { key: undefined, label: "All", Icon: Layers },
          { key: "CRYPTO", label: "Crypto", Icon: Bitcoin },
          { key: "FOREX", label: "Forex", Icon: Landmark },
          { key: "METAL", label: "Metal", Icon: Layers },
          { key: "INDICES", label: "Indices", Icon: CandlestickChart },
        ].map((item, idx) => (
          <button
            key={item.label}
            onClick={() => {
              setSegment(item.key);
              setPage(1);
            }}
            className={`px-3 py-1.5 border text-xs sm:text-sm inline-flex items-center gap-1.5 rounded-none ${
              idx > 0 ? "-ml-px" : ""
            } ${
              segment === item.key
                ? "border-[var(--primary)] text-[var(--primary)] bg-[var(--hover-bg)] shadow-[inset_0_0_0_1px_var(--primary)]"
                : "border-[var(--card-border)] text-[var(--text-muted)]"
            }`}
          >
            <item.Icon size={12} />
            {item.label}
          </button>
        ))}
      </div>

      {/* SEARCH */}
      <div
        className="rounded-xl border-0 shadow-none p-0 flex items-center gap-3 sm:gap-4 bg-transparent"
        style={{ boxShadow: "none", border: "none", padding: 0 }}
      >
        <div className="relative w-full">
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search instruments..."
              className="input w-full pr-2 text-sm py-1 sm:py-2 sm:text-sm"
            />
        </div>
        <div className="flex items-center gap-2 ml-auto">
          {!isMobile && (
            <div className="relative" ref={viewBoxRef}>
              <button
                onClick={() => setViewOpen((v) => !v)}
                className="p-2 text-[var(--text-main)] hover:text-[var(--primary)]"
                aria-label="Toggle columns"
              >
                <SlidersHorizontal size={16} />
              </button>
              {viewOpen && (
                <div
                  className="absolute right-0 mt-2 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-lg z-30 overflow-y-auto"
                  style={{ width: 240, maxHeight: "45vh" }}
                >
                  <div className="px-3 py-2 text-[11px] sm:text-xs text-[var(--text-muted)] border-b border-[var(--card-border)] sticky top-0 bg-[var(--card-bg)]">
                    Toggle columns
                  </div>
                  <div className="p-2 space-y-1">
                    {[
                      { key: "code", label: "Code" },
                      { key: "name", label: "Name" },
                      { key: "segment", label: "Segment" },
                      { key: "lot", label: "Lot" },
                      { key: "minQty", label: "Min Qty" },
                      { key: "maxQty", label: "Max Qty" },
                      { key: "qtyPrecision", label: "QTY Precision" },
                      { key: "pricePrecision", label: "Price Precision" },
                      { key: "tickSize", label: "Ticksize" },
                      { key: "spread", label: "Spread" },
                      { key: "spreadMode", label: "Spread Mode" },
                      { key: "swapLong", label: "Swap Long" },
                      { key: "swapShort", label: "Swap Short" },
                      { key: "contract", label: "Contract" },
                      { key: "swap", label: "Swap" },
                      { key: "tradeable", label: "Tradeable" },
                      { key: "active", label: "Enable" },
                      { key: "actions", label: "Actions" },
                    ].map((col) => (
                      <label
                        key={col.key}
                        className="flex items-center gap-2 px-2 py-1 text-xs sm:text-sm cursor-pointer border-b border-[var(--card-border)] hover:bg-[var(--hover-bg)]"
                      >
                        <input
                          type="checkbox"
                          checked={visibleCols[col.key as keyof typeof visibleCols]}
                          onChange={() =>
                            setVisibleCols((prev) => ({
                              ...prev,
                              [col.key]: !prev[col.key as keyof typeof prev],
                            }))
                          }
                          className="h-4 w-4 rounded border border-[var(--card-border)] bg-transparent accent-black"
                        />
                        <span>{col.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {isMobile && (
            <button
              onClick={openCreate}
              className="btn flex items-center justify-center border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--text-main)] hover:bg-[var(--hover-bg)]"
              aria-label="Add Instrument"
            >
              <Plus size={18} />
            </button>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div
        className="rounded-xl border-0 bg-[var(--card-bg)] shadow-none overflow-hidden p-0"
        style={{ boxShadow: "none", padding: 0 }}
      >
        <div className="relative overflow-x-auto overscroll-x-contain hidden md:block">

          <table className="table w-max min-w-[1500px]">
            <thead>
              <tr>
                {visibleCols.code && <th>Code</th>}
                {visibleCols.name && <th>Name</th>}
                {visibleCols.segment && <th>Segment</th>}
                {visibleCols.lot && <th>Lot</th>}
                {visibleCols.minQty && <th>Min Qty</th>}
                {visibleCols.maxQty && <th>Max Qty</th>}
                {visibleCols.qtyPrecision && <th>QTY Precision</th>}
                {visibleCols.pricePrecision && <th>Price Precision</th>}
                {visibleCols.tickSize && <th>Ticksize</th>}
                {visibleCols.spread && <th>Spread</th>}
                {visibleCols.spreadMode && <th>Spread Mode</th>}
                {visibleCols.swapLong && <th>Swap Long</th>}
                {visibleCols.swapShort && <th>Swap Short</th>}
                {visibleCols.contract && <th>Contract</th>}
                {visibleCols.swap && <th>Swap</th>}
                {visibleCols.tradeable && <th>Tradeable</th>}
                {visibleCols.active && <th>Enable</th>}
                {visibleCols.actions && <th className="text-center">Actions</th>}
              </tr>
            </thead>

            <tbody>
              <AnimatePresence>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={Object.values(visibleCols).filter(Boolean).length}
                      className="py-12 text-center"
                    >
                      <GlobalLoader />
                    </td>
                  </tr>
                ) : instruments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={Object.values(visibleCols).filter(Boolean).length}
                      className="py-16 text-center"
                    >
                      <div className="text-[var(--text-muted)]">
                        No instruments found
                      </div>
                    </td>
                  </tr>
                ) : (
                  instruments.map((row, idx) => (
                    <motion.tr
                      key={row._id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="group"
                    >
                      {visibleCols.code && <td className="font-mono">{row.code}</td>}
                      {visibleCols.name && <td className="font-medium">{row.name}</td>}
                      {visibleCols.segment && (
                        <td>
                          {(() => {
                            const meta = segmentMeta(row.segment);
                            return (
                              <span className={`inline-flex items-center gap-1.5 rounded-full border border-[var(--card-border)] px-2 py-0.5 text-xs font-medium ${meta.color}`}>
                                <meta.Icon size={12} />
                                {meta.label}
                              </span>
                            );
                          })()}
                        </td>
                      )}
                      {visibleCols.lot && <td>{row.lotSize}</td>}
                      {visibleCols.minQty && <td>{row.minQty}</td>}
                      {visibleCols.maxQty && <td>{row.maxQty}</td>}
                      {visibleCols.qtyPrecision && <td>{row.qtyPrecision}</td>}
                      {visibleCols.pricePrecision && <td>{row.pricePrecision}</td>}
                      {visibleCols.tickSize && <td>{row.tickSize}</td>}
                      {visibleCols.spread && <td>{row.spread}</td>}
                      {visibleCols.spreadMode && <td>{row.spread_mode || "FIXED"}</td>}
                      {visibleCols.swapLong && <td>{row.swapLong}</td>}
                      {visibleCols.swapShort && <td>{row.swapShort}</td>}
                      {visibleCols.contract && <td>{row.contractSize}</td>}
                      {visibleCols.swap && (
                        <td>
                          <span
                            className={
                              row.swapEnabled ? "text-green-700" : "text-red-700"
                            }
                          >
                            {row.swapEnabled ? "Enabled" : "Disabled"}
                          </span>
                        </td>
                      )}
                      {visibleCols.tradeable && (
                        <td>
                          <span
                            className={
                              row.isTradeable ? "text-green-700" : "text-red-700"
                            }
                          >
                            {row.isTradeable ? "True" : "False"}
                          </span>
                        </td>
                      )}
                      {visibleCols.active && (
                        <td>
                          <span
                            className={
                              row.isActive ? "text-green-700" : "text-red-700"
                            }
                          >
                            {row.isActive ? "True" : "False"}
                          </span>
                        </td>
                      )}
                      {visibleCols.actions && (
                        <td className="text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => openEdit(row)}
                              className="btn p-2"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => {
                                if (!row._id) return;
                                setSelectedId(row._id);
                                setConfirmOpen(true);
                              }}
                              className="btn p-2 text-red-500"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      )}
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* MOBILE LIST */}
        <div className="md:hidden p-0 space-y-3 text-[11px]">
          {isLoading ? (
            <div className="py-10">
              <GlobalLoader />
            </div>
          ) : instruments.length === 0 ? (
            <div className="py-10 text-center text-[var(--text-muted)]">
              No instruments found
            </div>
          ) : (
            instruments.map((row) => (
              <div
                key={row._id}
                className="w-full rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-3 shadow-none relative overflow-hidden"
              >
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl animate-pulse"
                  style={{
                    background:
                      "radial-gradient(120% 120% at 0% 0%, rgba(59,130,246,0.10), transparent 60%)",
                    animationDuration: "3s",
                  }}
                />
                <div className="relative space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-[12px]">{row.code}</div>
                      <div className="text-[10px] text-[var(--text-muted)]">
                        {row.name}
                      </div>
                    </div>
                    {(() => {
                      const meta = segmentMeta(row.segment);
                      return (
                        <span className={`inline-flex items-center gap-1.5 rounded-full border border-[var(--card-border)] px-2 py-0.5 text-[10px] font-medium ${meta.color}`}>
                          <meta.Icon size={12} />
                          {meta.label}
                        </span>
                      );
                    })()}
                  </div>

                  <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px]">
                    <div className="flex justify-between"><span className="text-[var(--text-muted)]">Lot</span><span className="font-medium">{row.lotSize}</span></div>
                    <div className="flex justify-between"><span className="text-[var(--text-muted)]">Min Qty</span><span className="font-medium">{row.minQty}</span></div>
                    <div className="flex justify-between"><span className="text-[var(--text-muted)]">Max Qty</span><span className="font-medium">{row.maxQty}</span></div>
                    <div className="flex justify-between"><span className="text-[var(--text-muted)]">Qty Prec</span><span className="font-medium">{row.qtyPrecision}</span></div>
                    <div className="flex justify-between"><span className="text-[var(--text-muted)]">Price Prec</span><span className="font-medium">{row.pricePrecision}</span></div>
                    <div className="flex justify-between"><span className="text-[var(--text-muted)]">Tick</span><span className="font-medium">{row.tickSize}</span></div>
                    <div className="flex justify-between"><span className="text-[var(--text-muted)]">Spread</span><span className="font-medium">{row.spread}</span></div>
                    <div className="flex justify-between"><span className="text-[var(--text-muted)]">Spread Mode</span><span className="font-medium">{row.spread_mode || "FIXED"}</span></div>
                    <div className="flex justify-between"><span className="text-[var(--text-muted)]">Contract</span><span className="font-medium">{row.contractSize}</span></div>
                    <div className="flex justify-between"><span className="text-[var(--text-muted)]">Swap Long</span><span className="font-medium">{row.swapLong}</span></div>
                    <div className="flex justify-between"><span className="text-[var(--text-muted)]">Swap Short</span><span className="font-medium">{row.swapShort}</span></div>
                    <div className="flex justify-between"><span className="text-[var(--text-muted)]">Swap</span><span className="font-medium">{row.swapEnabled ? "Enabled" : "Disabled"}</span></div>
                    <div className="flex justify-between"><span className="text-[var(--text-muted)]">Tradeable</span><span className="font-medium">{row.isTradeable ? "Yes" : "No"}</span></div>
                    <div className="flex justify-between"><span className="text-[var(--text-muted)]">Active</span><span className="font-medium">{row.isActive ? "Yes" : "No"}</span></div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button onClick={() => openEdit(row)} className="btn p-2">
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => {
                        if (!row._id) return;
                        setSelectedId(row._id);
                        setConfirmOpen(true);
                      }}
                      className="btn p-2 text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
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
            className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setOpenForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="card-elevated shadow-none w-full max-w-3xl max-h-[90vh] overflow-y-auto"
              style={{ boxShadow: "none" }}
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
                <div className="w-full space-y-1" ref={symbolBoxRef}>
                  <label className="text-sm font-medium text-[var(--text-muted)] flex items-center gap-2">
                    <Hash size={14} className="text-[var(--text-muted)]" />
                    Code
                  </label>
                  <div className="relative">
                    <div
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2
                      bg-[var(--input-bg)]
                      border-[var(--input-border)]
                      focus-within:border-[var(--primary)]
                      focus-within:shadow-[0_0_0_3px_var(--glow)]
                      transition`}
                    >
                      <Hash size={18} className="text-[var(--text-muted)] shrink-0" />
                      <input
                        type="text"
                        value={form.code}
                        placeholder="Search code..."
                        onFocus={() => setSymbolOpen(true)}
                        onChange={(e) =>
                          setForm({ ...form, code: e.target.value })
                        }
                        className="w-full bg-transparent outline-none text-sm text-[var(--foreground)]
                        placeholder:text-[var(--text-muted)]"
                      />
                    </div>

                    {symbolOpen && (
                      <div className="absolute left-0 right-0 top-full mt-1.5 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] max-h-60 overflow-auto z-50">
                        {symbolLoading ? (
                          <div className="px-3 py-2 text-xs text-[var(--text-muted)]">
                            Searching...
                          </div>
                        ) : symbolResults.length === 0 ? (
                          <div className="px-3 py-2 text-xs text-[var(--text-muted)]">
                            No results
                          </div>
                        ) : (
                          symbolResults.map((item) => (
                            <button
                              key={item._id}
                              onClick={() => {
                                setForm((prev) => {
                                  if (!prev) return prev;
                                  const nextSegment =
                                    prev.segment ||
                                    (item.category === "FX"
                                      ? "FOREX"
                                      : item.category === "INDEXES"
                                      ? "INDICES"
                                      : item.category || "");
                                  return {
                                    ...prev,
                                    code: item.code,
                                    name: prev.name || item.name,
                                    segment: nextSegment,
                                  };
                                });
                                setSymbolOpen(false);
                              }}
                              className="w-full text-left px-3 py-2 hover:bg-[var(--hover-bg)] flex items-center justify-between gap-2"
                            >
                              <span className="flex flex-col min-w-0">
                                <span className="text-sm font-semibold">
                                  {item.code}
                                </span>
                                <span className="text-[11px] text-[var(--text-muted)] truncate">
                                  {item.name}
                                </span>
                              </span>
                              {item.category && (
                                <span className="text-[10px] text-[var(--text-muted)]">
                                  {item.category}
                                </span>
                              )}
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <PremiumInput label="Name" icon={Type} value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
                <PremiumInput label="Segment" icon={Layers} value={form.segment} onChange={(v) => setForm({ ...form, segment: v })} />
                <PremiumInput label="Lot Size" icon={Boxes} type="number" value={form.lotSize} onChange={(v) => setForm({ ...form, lotSize: v === "" ? "" : Number(v) })} />
                <PremiumInput label="Min Qty" icon={ArrowDownToLine} type="number" value={form.minQty} onChange={(v) => setForm({ ...form, minQty: v === "" ? "" : Number(v) })} />
                <PremiumInput label="Max Qty" icon={ArrowUpToLine} type="number" value={form.maxQty} onChange={(v) => setForm({ ...form, maxQty: v === "" ? "" : Number(v) })} />
                <PremiumInput
                  label="Qty Precision"
                  type="number"
                  icon={Sigma}
                  value={form.qtyPrecision}
                  onChange={(v) => setForm({ ...form, qtyPrecision: v === "" ? "" : Number(v) })}
                />

                <PremiumInput
                  label="Price Precision"
                  type="number"
                  icon={DollarSign}
                  value={form.pricePrecision}
                  onChange={(v) => setForm({ ...form, pricePrecision: v === "" ? "" : Number(v) })}
                />

                <PremiumInput
                  label="Tick Size"
                  type="number"
                  icon={MoveHorizontal}
                  value={form.tickSize ?? ""}
                  onChange={(v) =>
                    setForm({ ...form, tickSize: v === "" ? "" : Number(v) })
                  }
                />

                <PremiumInput
                  label="Spread"
                  type="number"
                  icon={MoveHorizontal}
                  value={form.spread}
                  onChange={(v) => setForm({ ...form, spread: v === "" ? "" : Number(v) })}
                />

                <div className="w-full space-y-1">
                  <label className="text-sm font-medium text-[var(--text-muted)] flex items-center gap-2">
                    <SlidersHorizontal size={14} className="text-[var(--text-muted)]" />
                    Spread Mode
                  </label>
                  <select
                    value={form.spread_mode}
                    onChange={(e) =>
                      setForm({ ...form, spread_mode: e.target.value as "FIXED" | "ADD_ON" })
                    }
                    className="input w-full"
                  >
                    <option value="FIXED">FIXED (Static)</option>
                    <option value="ADD_ON">ADD_ON (Add to base)</option>
                  </select>
                </div>

                <PremiumInput
                  label="Contract Size"
                  type="number"
                  icon={Package}
                  value={form.contractSize}
                  onChange={(v) => setForm({ ...form, contractSize: v === "" ? "" : Number(v) })}
                />

                <PremiumInput
                  label="Swap Long"
                  type="number"
                  icon={ArrowUpRight}
                  value={form.swapLong}
                  onChange={(v) => setForm({ ...form, swapLong: v === "" ? "" : Number(v) })}
                />

                <PremiumInput
                  label="Swap Short"
                  type="number"
                  icon={ArrowDownRight}
                  value={form.swapShort}
                  onChange={(v) => setForm({ ...form, swapShort: v === "" ? "" : Number(v) })}
                />


                <Toggle label={<span className="inline-flex items-center gap-2"><ToggleRight size={14} /> Swap Enabled</span>} value={form.swapEnabled} onChange={(v) => setForm({ ...form, swapEnabled: v })} />
                <Toggle label={<span className="inline-flex items-center gap-2"><BadgeCheck size={14} /> Tradeable</span>} value={form.isTradeable} onChange={(v) => setForm({ ...form, isTradeable: v })} />
                <Toggle label={<span className="inline-flex items-center gap-2"><Power size={14} /> Active</span>} value={form.isActive} onChange={(v) => setForm({ ...form, isActive: v })} />
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
