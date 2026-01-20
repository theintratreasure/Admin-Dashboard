"use client";

import { useState, useMemo } from "react";
import { Plus, Trash2, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import {
  useDefaultWatchlist,
  useAddDefaultWatchlist,
  useRemoveDefaultWatchlist,
} from "@/queries/defaultWatchlist.queries";

import Pagination from "../../components/ui/pagination";
import ConfirmModal from "../../components/ui/ConfirmModal";
import GlobalLoader from "../../components/ui/GlobalLoader";

export default function MarketWatch() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
const [code, setCode] = useState("");
const [formError, setFormError] = useState<string | null>(null);
  const listQuery = useDefaultWatchlist();
  const addMutation = useAddDefaultWatchlist();
  const removeMutation = useRemoveDefaultWatchlist();

  const rows = listQuery.data?.data ?? [];

  const filtered = useMemo(() => {
    if (!search) return rows;
    return rows.filter((r) =>
      `${r.code} ${r.name}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [rows, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));

  const paginated = filtered.slice(
    (page - 1) * limit,
    page * limit
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container-pad space-y-6 max-w-6xl mx-0 md:mx-auto"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Default Watchlist</h1>
          <p className="text-[var(--text-muted)] mt-1">
            Manage symbols shown for all users
          </p>
        </div>

       <button
  onClick={() => {
    setAddOpen(true);
    setCode("");
    setFormError(null);
  }}
  className="btn btn-primary flex items-center gap-2"
>

          <Plus size={18} />
          Add Symbol
        </button>
      </div>

      {/* SEARCH */}
      <div className="card-elevated p-4 flex items-center gap-3">
        <Search size={16} className="text-[var(--text-muted)]" />
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search symbol..."
          className="input w-full"
        />
      </div>

      {/* TABLE */}
      <div className="card-elevated overflow-hidden">
        <div className="relative overflow-x-auto">
          <table className="table min-w-[800px]">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              <AnimatePresence>
                {listQuery.isLoading ? (
                  <tr>
                    <td colSpan={3} className="py-12 text-center">
                      <GlobalLoader />
                    </td>
                  </tr>
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-12 text-center text-muted">
                      No symbols found
                    </td>
                  </tr>
                ) : (
                  paginated.map((row, idx) => (
                    <motion.tr
                      key={row.code}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                    >
                      <td className="font-mono">{row.code}</td>
                      <td>{row.name}</td>
                      <td className="text-center">
                        <button
                          onClick={() => {
                            setSelectedCode(row.code);
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

      <AnimatePresence>
  {addOpen && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => setAddOpen(false)}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="card-elevated w-full max-w-md"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-5 border-b">
          <h3 className="text-lg font-bold">Add Symbol</h3>
          <button onClick={() => setAddOpen(false)}>✕</button>
        </div>

        {/* BODY */}
        <div className="p-5 space-y-4">
          <div>
            <label className="text-sm text-[var(--text-muted)]">
              Symbol Code
            </label>
            <input
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                setFormError(null);
              }}
              placeholder="BTCUSDT"
              className="input w-full mt-1"
            />
          </div>

          {formError && (
            <div className="text-sm text-red-500 bg-red-500/10 px-3 py-2 rounded">
              {formError}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-5 border-t flex justify-end gap-3">
          <button
            onClick={() => setAddOpen(false)}
            className="btn btn-ghost"
          >
            Cancel
          </button>

          <button
            disabled={!code || addMutation.isPending}
            onClick={async () => {
              try {
                await addMutation.mutateAsync(code);
                setAddOpen(false);
                setCode("");
              } catch (err: any) {
                setFormError(
                  err?.response?.data?.message ||
                    "Failed to add symbol"
                );
              }
            }}
            className="btn btn-primary"
          >
            {addMutation.isPending ? "Adding..." : "Add"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>


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

      {/* CONFIRM DELETE */}
      {confirmOpen && selectedCode && (
        <ConfirmModal
          title="Remove Symbol"
          description={`Remove ${selectedCode} from default watchlist?`}
          loading={removeMutation.isPending}
          onCancel={() => {
            setConfirmOpen(false);
            setSelectedCode(null);
          }}
          onConfirm={async () => {
            await removeMutation.mutateAsync(selectedCode);
            setConfirmOpen(false);
            setSelectedCode(null);
          }}
        />
      )}
    </motion.div>
  );
}
