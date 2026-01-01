"use client";

import { useMemo, useState, useCallback } from "react";
import {
  Plus,
  Trash2,
  BadgeCheck,
  XCircle,
  Loader2
} from "lucide-react";
import { useGetAdminNotifications } from "@/hooks/notification/useGetAdminNotifications";
import { useBroadcastNotification } from "@/hooks/notification/useBroadcastNotification";
import Pagination from "../../components/ui/pagination";
import { Notification, NotificationType } from "@/services/notification/notification.services";
import GlobalLoader from "../../components/ui/GlobalLoader";

interface TransformedNotification {
  id: string;
  _id: string;
  title: string;
  message: string;
  type: string;
  isActive: boolean;
  expireAt: string;
  createdAt: string;
  sentBy: string;
}

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const { data, isLoading, refetch } = useGetAdminNotifications({ page, limit });
  const broadcastMutation = useBroadcastNotification();

  const notifications: TransformedNotification[] = useMemo(() => {
    if (!data?.list || data.list.length === 0) return [];

    return data.list.map((item: Notification, index: number) => ({
      id: `${item._id}-${index}`,
      _id: item._id,
      title: item.title,
      message: item.message,
      type: item.data.type,
      isActive: item.isActive,
      expireAt: new Date(item.expireAt).toLocaleDateString(),
      createdAt: new Date(item.createdAt).toLocaleString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      sentBy: "Admin",
    }));
  }, [data?.list]);

  const filteredNotifications: TransformedNotification[] = useMemo(() => {
    if (!search.trim()) return notifications;

    return notifications.filter((n: TransformedNotification) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.message.toLowerCase().includes(search.toLowerCase()) ||
      n.type.toLowerCase().includes(search.toLowerCase())
    );
  }, [notifications, search]);



  if (isLoading) {
    return (
      <div className="container-pad flex items-center justify-center min-h-[400px]">
        <GlobalLoader />
      </div>
    );
  }

  return (
    <div className="container-pad space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Notifications</h1>
          <p className="text-[var(--text-muted)] mt-1">Manage broadcast notifications</p>
        </div>
        <button
          onClick={() => setOpenModal(true)}
          className="btn btn-primary px-6 py-2.5 inline-flex items-center gap-2 shadow-lg hover:shadow-xl whitespace-nowrap"
        >
          <Plus size={18} />
          New Notification
        </button>
      </div>

      {/* Search */}
      <div className="card-elevated max-w-md">
        <div className="relative">
          <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            placeholder="Search notifications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input w-full pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--glow)] rounded-lg"
          />
        </div>
      </div>

      {/* Responsive Table Card */}
      <div className="card-elevated overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-[var(--text-muted)]/40 scrollbar-track-transparent">
          <table className="table table-fixed min-w-[1100px] w-full">
            <thead>
              <tr>
                <th className="w-[200px]">Title</th>
                <th className="w-[300px]">Message</th>
                <th className="w-[100px]">Type</th>
                <th className="w-[120px]">Status</th>
                <th className="w-[140px]">Expires</th>
                <th className="w-[200px]">Created</th>
              </tr>
            </thead>
            <tbody>
              {filteredNotifications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <div className="space-y-2">
                      <div className="w-16 h-16 bg-[var(--hover-bg)] rounded-xl flex items-center justify-center mx-auto">
                        <svg className="w-7 h-7 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <div className="text-[var(--text-muted)]">
                        <p className="font-semibold text-[var(--foreground)]">No notifications found</p>
                        <p className="text-sm">Try adjusting your search or create a new one</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredNotifications.map((notification: TransformedNotification) => (
                  <tr key={notification.id} className="hover:bg-[var(--hover-bg)]">
                    <td className="font-medium text-[var(--foreground)] truncate">
                      {notification.title}
                    </td>
                    <td className="max-w-[300px]">
                      <span className="text-[var(--text-muted)] block truncate whitespace-nowrap">
                        {notification.message}
                      </span>
                    </td>
                    <td>
                      <span className="pill text-xs font-medium">
                        {notification.type}
                      </span>
                    </td>
                    <td className="whitespace-nowrap">
  <span
    className={`pill text-xs font-medium inline-flex items-center gap-1 ${
      notification.isActive ? "pill-success" : "pill-muted"
    }`}
  >
    {notification.isActive ? "Active" : "Expired"}
  </span>
</td>


                    <td className="text-[var(--text-muted)] text-sm">
                      {notification.expireAt}
                    </td>
                    <td className="text-[var(--text-muted)] whitespace-nowrap text-sm">
                      {notification.createdAt}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Scroll Hint */}
        <div className="lg:hidden px-4 py-2 bg-[var(--hover-bg)] text-[var(--text-muted)] text-xs text-center">
          👈 Swipe left to see more columns
        </div>
      </div>

      {data?.pagination && (
        <div className="card pt-0 pb-4 px-0">
          <Pagination
            page={data.pagination.page}
            totalPages={data.pagination.totalPages}
            limit={data.pagination.limit}
            onPageChange={setPage}
            onLimitChange={setLimit}
          />
        </div>
      )}

      {openModal && <SendNotificationModal onClose={() => setOpenModal(false)} />}
    </div>
  );
}

// Fully Custom Form Modal (same as before)
function SendNotificationModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "GENERAL" as NotificationType,
  });
  const [isSending, setIsSending] = useState(false);

  const broadcastMutation = useBroadcastNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.message.trim()) return;

    setIsSending(true);
    const payload = {
      title: formData.title.trim(),
      message: formData.message.trim(),
      expireAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      data: { type: formData.type },
    };

    try {
      await broadcastMutation.mutateAsync(payload);
      onClose();
      setFormData({ title: "", message: "", type: "GENERAL" });
    } catch (error) {
      console.error("Send failed:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="card-elevated w-full max-w-md max-h-[90vh] overflow-hidden">
        <div className="p-6 pb-4 border-b border-[var(--card-border)]">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[var(--foreground)]">Send Notification</h2>
            <button
              onClick={onClose}
              className="btn btn-ghost p-1.5 hover:bg-[var(--hover-bg)] rounded-lg"
              disabled={isSending}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[var(--foreground)] mb-2">
              Title *
            </label>
            <input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter notification title"
              className="input w-full py-2.5 px-3 text-sm focus:ring-2 focus:ring-[var(--glow)]"
              disabled={isSending}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[var(--foreground)] mb-2">
              Message *
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Enter notification message"
              rows={4}
              className="input w-full py-2.5 px-3 text-sm resize-vertical focus:ring-2 focus:ring-[var(--glow)]"
              disabled={isSending}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[var(--foreground)] mb-2">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as NotificationType })}
              className="input w-full py-2.5 px-3 text-sm focus:ring-2 focus:ring-[var(--glow)]"
              disabled={isSending}
            >
              <option value="GENERAL">General</option>
              <option value="INFORMATION">Information</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="HOLIDAY">Holiday</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost flex-1 py-2.5 font-semibold"
              disabled={isSending}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSending || !formData.title.trim() || !formData.message.trim()}
              className="btn btn-primary flex-1 py-2.5 font-semibold relative flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Notification"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
