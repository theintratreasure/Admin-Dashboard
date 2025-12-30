"use client";

import {
  useMemo,
  useState,
  useEffect,
  useRef,
  Dispatch,
  SetStateAction,
} from "react";
import {
  Plus,
  SlidersHorizontal,
  Trash2,
  Check,
  ChevronDown,
  X,
} from "lucide-react";
import { useBroadcastNotification } from "@/hooks/useNotification";

/* ================= TYPES ================= */

type SortState = {
  column: string;
  order: "asc" | "desc" | "";
};

type ColumnKey =
  | "title"
  | "message"
  | "total"
  | "success"
  | "failed"
  | "createdAt"
  | "sentBy";

interface Notification {
  id: number;
  title: string;
  message: string;
  total: number;
  success: number;
  failed: number;
  createdAt: string;
  sentBy: string;
}

interface SortableTHProps {
  label: string;
  column: ColumnKey;
  sort: SortState;
  setSort: Dispatch<SetStateAction<SortState>>;
  openSort: ColumnKey | null;
  setOpenSort: Dispatch<SetStateAction<ColumnKey | null>>;
  hideColumn: (key: ColumnKey) => void;
  closeView: () => void;
}

/* ================= DUMMY DATA ================= */

const DUMMY: Notification[] = [
  {
    id: 1,
    title: "Maintenance Alert",
    message: "Trading will pause at 12:00 PM IST.",
    total: 4,
    success: 2,
    failed: 2,
    createdAt: "12/12/2025, 14:40:21",
    sentBy: "SuperAdmin Sam",
  },
  {
    id: 2,
    title: "Test - 2",
    message: "This is a test notification",
    total: 4,
    success: 2,
    failed: 2,
    createdAt: "12/12/2025, 14:39:52",
    sentBy: "SuperAdmin Sam",
  },
];

/* ================= SORTABLE HEADER ================= */

function SortableTH({
  label,
  column,
  sort,
  setSort,
  openSort,
  setOpenSort,
  hideColumn,
  closeView,
}: SortableTHProps) {
  return (
    <th className="px-4 py-3 relative">
      <button
        onClick={() => {
          setOpenSort(openSort === column ? null : column);
          closeView();
        }}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg
        bg-[var(--card-bg)] 
        hover:bg-[var(--hover-bg)]"
      >
        {label}
        <ChevronDown size={14} />
      </button>

      {openSort === column && (
        <div className="absolute left-0 mt-2 w-32 z-50
          bg-[var(--card-bg)]
         http://localhost:3000
          rounded-xl shadow-lg"
        >
          <button
            onClick={() => {
              setSort({ column, order: "asc" });
              setOpenSort(null);
            }}
            className="w-full px-3 py-2 text-left hover:bg-[var(--hover-bg)]"
          >
            ↑ Asc
          </button>

          <button
            onClick={() => {
              setSort({ column, order: "desc" });
              setOpenSort(null);
            }}
            className="w-full px-3 py-2 text-left hover:bg-[var(--hover-bg)]"
          >
            ↓ Desc
          </button>

          <div className="h-px bg-[var(--card-border)]" />

          <button
            onClick={() => {
              hideColumn(column);
              setOpenSort(null);
            }}
            className="w-full px-3 py-2 text-left text-red-400 hover:bg-[var(--hover-bg)]"
          >
            Hide
          </button>
        </div>
      )}
    </th>
  );
}

/* ================= PAGE ================= */

export default function NotificationsPage() {
  const [data, setData] = useState<Notification[]>(DUMMY);
  const [search, setSearch] = useState("");
  const viewRef = useRef<HTMLDivElement | null>(null);

  const [openModal, setOpenModal] = useState(false);

  const [sort, setSort] = useState<SortState>({
    column: "",
    order: "",
  });

  const [openSort, setOpenSort] = useState<ColumnKey | null>(null);
  const [showView, setShowView] = useState(false);

  const [visibleCols, setVisibleCols] = useState<Record<ColumnKey, boolean>>({
    title: true,
    message: true,
    total: true,
    success: true,
    failed: true,
    createdAt: true,
    sentBy: true,
  });

  /* OUTSIDE CLICK */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        viewRef.current &&
        !viewRef.current.contains(e.target as Node)
      ) {
        setShowView(false);
        setOpenSort(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleCol = (key: ColumnKey) =>
    setVisibleCols((p) => ({ ...p, [key]: !p[key] }));

  const filtered = useMemo(() => {
    let rows = [...data];

    if (search) {
      rows = rows.filter(
        (n) =>
          n.title.toLowerCase().includes(search.toLowerCase()) ||
          n.message.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sort.column) {
      rows.sort((a: any, b: any) =>
        sort.order === "asc"
          ? a[sort.column] > b[sort.column]
            ? 1
            : -1
          : a[sort.column] < b[sort.column]
          ? 1
          : -1
      );
    }

    return rows;
  }, [data, search, sort]);

  const removeRow = (id: number) => {
    if (!confirm("Remove this notification?")) return;
    setData((p) => p.filter((r) => r.id !== id));
  };

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Notifications</h1>
        <button
          onClick={() => setOpenModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg
          bg-[var(--primary)] text-white"
        >
          <Plus size={16} /> Send Notification
        </button>
      </div>

      {/* FILTER + VIEW */}
      <div className="flex justify-between items-center gap-4">
        <input
          placeholder="Filter..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-72 px-4 py-2 rounded-lg
          bg-[var(--input-bg)] border border-[var(--input-border)]"
        />

        <div className="relative" ref={viewRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowView((p) => !p);
              setOpenSort(null);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg
            bg-[var(--card-bg)] border border-[var(--card-border)]"
          >
            <SlidersHorizontal size={16} /> View
          </button>

          {showView && (
            <div
              className="absolute right-0 mt-2 w-56 z-50
              bg-[var(--card-bg)]
              border border-[var(--card-border)]
              rounded-xl shadow-lg p-3"
              onClick={(e) => e.stopPropagation()}
            >
              {(
                Object.entries(visibleCols) as [ColumnKey, boolean][]
              ).map(([key]) => (
                <button
                  key={key}
                  onClick={() => toggleCol(key)}
                  className="flex items-center gap-2 w-full px-2 py-2 rounded-md
                  hover:bg-[var(--hover-bg)]"
                >
                  <span className="w-4">
                    {visibleCols[key] && <Check size={14} />}
                  </span>
                  {key}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl overflow-x-auto">
        <table className="w-full min-w-[1100px] text-sm">
          <thead>
            <tr className="border-b ">
              {(
                Object.keys(visibleCols) as ColumnKey[]
              ).map(
                (col) =>
                  visibleCols[col] && (
                    <SortableTH
                      key={col}
                      label={col}
                      column={col}
                      sort={sort}
                      setSort={setSort}
                      openSort={openSort}
                      setOpenSort={setOpenSort}
                      hideColumn={toggleCol}
                      closeView={() => setShowView(false)}
                    />
                  )
              )}
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((row) => (
              <tr
                key={row.id}
                className="border-b border-[var(--card-border)]
                hover:bg-[var(--hover-bg)]"
              >
                {(
                  Object.keys(visibleCols) as ColumnKey[]
                ).map(
                  (col) =>
                    visibleCols[col] && (
                      <td key={col} className="px-4 py-3">
                        {(row as any)[col]}
                      </td>
                    )
                )}
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => removeRow(row.id)}
                    className="px-3 py-1 rounded-xl bg-[var(--danger)] text-white"
                  >
                    <Trash2 size={14} className="inline mr-1" />
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {openModal && <SendNotificationModal onClose={() => setOpenModal(false)} />}
    </div>
  );
}

/* ================= MODAL ================= */

function SendNotificationModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<
    "MAINTENANCE" | "HOLIDAY" | "GENERAL" | "INFORMATION"
  >("GENERAL");

  const broadcast = useBroadcastNotification();

  const handleSend = () => {
    if (!title || !message) {
      alert("Title and message required");
      return;
    }

    // ⏰ expire after 1 day
    const expireAt = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    ).toISOString();

    broadcast.mutate(
      {
        title,
        message,
        expireAt,
        data: {
          type,
        },
      },
      {
        onSuccess: () => {
          alert("Notification sent successfully");
          onClose();
        },
        onError: (err: any) => {
          alert(err?.response?.data?.message || "Failed to send");
        },
      }
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center
      bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl
        bg-[var(--card-bg)]
        border border-[var(--card-border)]
        shadow-2xl p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Send Notification</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* TITLE */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full mb-3 px-4 py-2 rounded-lg
          bg-[var(--input-bg)] border"
        />

        {/* MESSAGE */}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          placeholder="Message"
          className="w-full mb-3 px-4 py-2 rounded-lg
          bg-[var(--input-bg)] border"
        />

        {/* TYPE SELECTOR */}
        <select
          value={type}
          onChange={(e) => setType(e.target.value as any)}
          className="w-full px-4 py-2 rounded-lg
          bg-[var(--input-bg)] border"
        >
          <option value="GENERAL">General</option>
          <option value="INFORMATION">Information</option>
          <option value="MAINTENANCE">Maintenance</option>
          <option value="HOLIDAY">Holiday</option>
        </select>

        <p className="text-xs text-[var(--text-muted)] mt-2">
          Notification will expire automatically after 24 hours
        </p>

        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border"
          >
            Cancel
          </button>

          <button
            disabled={broadcast.isPending}
            onClick={handleSend}
            className="px-5 py-2 rounded-lg
            bg-[var(--primary)] text-white"
          >
            {broadcast.isPending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}


