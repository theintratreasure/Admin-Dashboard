"use client";

import { useState } from "react";
import {
  useHolidays,
  useDeleteHoliday,
  useUpdateHoliday,
  useCreateHoliday,
} from "@/hooks/useHoliday";
import { Plus, Trash2, Pencil, Power } from "lucide-react";
import { Holiday } from "@/services/holiday/holiday.service";
import Pagination from "../components/ui/pagination";
import GlobalLoader from "../components/ui/GlobalLoader";

/* ================= PAGE ================= */

export default function HolidaysPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [modal, setModal] = useState<Holiday | null>(null);

  const { data, isLoading } = useHolidays(page, limit);
  const remove = useDeleteHoliday();
  const update = useUpdateHoliday();

  return (
    <div className="container-pad space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Market Holidays</h1>
          <p className="text-sm text-[var(--text-muted)]">
            Trading calendar & suspension control
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() =>
            setModal({
              _id: "",
              title: "",
              date: "",
              isActive: true,
              expireAt: "",
              createdAt: "",
              updatedAt: "",
            })
          }
        >
          <Plus size={16} /> Add Holiday
        </button>
      </div>

      {/* TABLE */}
      <div className="card-elevated overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-center text-sm"><GlobalLoader/></div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Date</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {data?.data.map((h) => (
                <tr key={h._id}>
                  <td className="font-medium">{h.title}</td>
                  <td>{new Date(h.date).toDateString()}</td>
                  <td>
                    <span className="pill">
                      {h.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="text-right space-x-2">
                    <button
                      className="btn btn-ghost"
                      onClick={() => setModal(h)}
                    >
                      <Pencil size={14} />
                    </button>

                    {/* <button
                      className="btn btn-ghost"
                      onClick={() =>
                        update.mutate({
                          id: h._id,
                          payload: { isActive: !h.isActive },
                        })
                      }
                    >
                      <Power size={14} />
                    </button> */}

                    <button
                      className="btn btn-ghost"
                      onClick={() => {
                        if (confirm("Delete this holiday?")) {
                          remove.mutate(h._id);
                        }
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* PAGINATION */}
      {data && (
        <Pagination
          page={data.pagination.page}
          totalPages={data.pagination.totalPages}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={(l) => {
            setLimit(l);
            setPage(1);
          }}
        />
      )}

      {modal && (
        <HolidayModal
          holiday={modal}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

/* ================= MODAL ================= */

function HolidayModal({
  holiday,
  onClose,
}: {
  holiday: Holiday;
  onClose: () => void;
}) {
  const isEdit = Boolean(holiday._id);

  const [title, setTitle] = useState(holiday.title);
  const [date, setDate] = useState(
    holiday.date ? holiday.date.slice(0, 10) : ""
  );
  const [isActive, setIsActive] = useState(holiday.isActive);

  const create = useCreateHoliday();
  const update = useUpdateHoliday();

  const submit = () => {
    if (!title || !date) {
      alert("Title and date are required");
      return;
    }

    if (isEdit) {
      update.mutate({
        id: holiday._id,
        payload: { title, date, isActive },
      });
    } else {
      create.mutate({ title, date });
    }

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center
      bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="card-elevated w-full max-w-md"
      >
        <h2 className="text-xl font-semibold mb-4">
          {isEdit ? "Edit Holiday" : "Add Holiday"}
        </h2>

        <div className="space-y-3">
          <input
            className="input w-full"
            placeholder="Holiday title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="date"
            className="input w-full"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          {isEdit && (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              Active
            </label>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={submit}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
