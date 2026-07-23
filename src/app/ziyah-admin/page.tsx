"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import styles from "./admin.module.css";
import InquiryLightbox, { type InquiryDetail } from "./InquiryLightbox";
import FeedbackManager from "./FeedbackManager";

type Tab = "inquiries" | "feedback" | "profile";

const PAGE_SIZE = 10;

function escapeCsv(value: string | number | boolean | null | undefined) {
  const text = String(value ?? "");
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function exportInquiriesCsv(rows: InquiryDetail[]) {
  const headers = [
    "id",
    "date",
    "name",
    "email",
    "phone",
    "subject",
    "message",
    "status",
    "is_read",
  ];
  const lines = [
    headers.join(","),
    ...rows.map((row) =>
      [
        row.id,
        row.date,
        row.name,
        row.email,
        row.phone || "",
        row.subject || "",
        row.message,
        row.status,
        row.is_read ? "true" : "false",
      ]
        .map(escapeCsv)
        .join(",")
    ),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `ziyah-inquiries-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function AdminDashboard() {
  const [inquiries, setInquiries] = useState<InquiryDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [selected, setSelected] = useState<InquiryDetail | null>(null);
  const [tab, setTab] = useState<Tab>("inquiries");
  const [username, setUsername] = useState("");
  const [page, setPage] = useState(1);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileMsg, setProfileMsg] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  );
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    setUsername(localStorage.getItem("admin_username") || "Admin");
  }, []);

  const fetchInquiries = useCallback(async () => {
    try {
      setApiError(null);
      const response = await fetch("/api/inquiry");
      const data = await response.json();
      if (response.ok && Array.isArray(data)) {
        setInquiries(
          data.map((item: InquiryDetail & { is_read?: boolean | null }) => ({
            ...item,
            is_read: !!item.is_read,
          }))
        );
      } else {
        setApiError(data.error || data.details || "Unknown error occurred");
        setInquiries([]);
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to connect";
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const handleLogout = () => {
    localStorage.removeItem("admin_session");
    localStorage.removeItem("admin_username");
    window.location.href = "/ziyah-admin/login";
  };

  const patchInquiry = async (id: number, updates: { status?: string; is_read?: boolean }) => {
    const response = await fetch("/api/inquiry", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updates }),
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data as InquiryDetail;
  };

  const updateStatus = async (id: number, newStatus: string) => {
    const data = await patchInquiry(id, { status: newStatus });
    if (!data) return;
    setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i)));
    setSelected((prev) => (prev?.id === id ? { ...prev, status: newStatus } : prev));
  };

  const toggleRead = async (id: number, isRead: boolean) => {
    const data = await patchInquiry(id, { is_read: isRead });
    if (!data) return;
    setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, is_read: isRead } : i)));
    setSelected((prev) => (prev?.id === id ? { ...prev, is_read: isRead } : prev));
  };

  const deleteInquiry = async (id: number) => {
    if (!confirm("Delete this inquiry permanently?")) return;
    const response = await fetch("/api/inquiry", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (response.ok) {
      setInquiries((prev) => prev.filter((i) => i.id !== id));
      setSelected(null);
    }
  };

  const openInquiry = async (inquiry: InquiryDetail) => {
    setSelected(inquiry);
    if (!inquiry.is_read) {
      await toggleRead(inquiry.id, true);
    }
  };

  const onReplied = (inquiry: InquiryDetail) => {
    setInquiries((prev) =>
      prev.map((i) =>
        i.id === inquiry.id
          ? { ...i, status: inquiry.status || "replied", is_read: true }
          : i
      )
    );
    setSelected((prev) =>
      prev?.id === inquiry.id
        ? { ...prev, status: inquiry.status || "replied", is_read: true }
        : prev
    );
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);

    if (newPassword && newPassword !== confirmPassword) {
      setProfileMsg({ type: "err", text: "New passwords do not match." });
      return;
    }

    setProfileLoading(true);
    try {
      const response = await fetch("/api/admin/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentUsername: username,
          currentPassword,
          newUsername: newUsername.trim() || undefined,
          newPassword: newPassword || undefined,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Update failed");

      localStorage.setItem("admin_username", data.username);
      setUsername(data.username);
      setCurrentPassword("");
      setNewUsername("");
      setNewPassword("");
      setConfirmPassword("");
      setProfileMsg({ type: "ok", text: "Profile updated successfully." });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Update failed";
      setProfileMsg({ type: "err", text: msg });
    } finally {
      setProfileLoading(false);
    }
  };

  const total = inquiries.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  const pageRows = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return inquiries.slice(start, start + PAGE_SIZE);
  }, [inquiries, currentPage]);

  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        <Image src="/logo.png" alt="" width={56} height={56} className={styles.loadingLogo} />
        Loading Ziyah Admin...
      </div>
    );
  }

  const unreadCount = inquiries.filter((i) => !i.is_read).length;
  const todayCount = inquiries.filter(
    (i) => i.date && new Date(i.date).toDateString() === new Date().toDateString()
  ).length;
  const repliedCount = inquiries.filter((i) => i.status === "replied").length;

  return (
    <div className={styles.adminLayout}>
      <nav className={`admin-nav ${styles.adminNav}`}>
        <div className={styles.adminNavBrand}>
          <Image
            src="/logo.png"
            alt="Ziyah"
            width={34}
            height={34}
            className={styles.navLogo}
          />
          <div>
            <strong>ZIYAH PACKAGING</strong>
            <span>Admin CMS</span>
          </div>
        </div>
        <div className={styles.navActions}>
          <span className={styles.userChip}>Signed in as {username}</span>
          <button type="button" onClick={handleLogout} className={styles.logoutBtn}>
            Log out
          </button>
        </div>
      </nav>

      <div className={styles.dashboard}>
        <div className={styles.header}>
          <div className={styles.title}>
            <p className={styles.eyebrow}>Ziyah Packaging Supplies</p>
            <h1>
              {tab === "inquiries"
                ? "Inquiries Dashboard"
                : tab === "feedback"
                  ? "Customer Feedback"
                  : "Admin Profile"}
            </h1>
            <p>
              {tab === "inquiries"
                ? "Review customer messages, reply by email, and export records."
                : tab === "feedback"
                  ? "Manage the 4 feedback cards shown on the home page."
                  : "Update your CMS username and password."}
            </p>
          </div>
          <div className={styles.tabs}>
            <button
              type="button"
              className={`${styles.tab} ${tab === "inquiries" ? styles.tabActive : ""}`}
              onClick={() => setTab("inquiries")}
            >
              Inquiries
              {unreadCount > 0 && <em>{unreadCount}</em>}
            </button>
            <button
              type="button"
              className={`${styles.tab} ${tab === "feedback" ? styles.tabActive : ""}`}
              onClick={() => setTab("feedback")}
            >
              Feedback
            </button>
            <button
              type="button"
              className={`${styles.tab} ${tab === "profile" ? styles.tabActive : ""}`}
              onClick={() => setTab("profile")}
            >
              Profile
            </button>
          </div>
        </div>

        {tab === "inquiries" && (
          <>
            {apiError && (
              <div className={styles.errorBanner}>
                <strong>Error:</strong> {apiError}
              </div>
            )}

            <div className={styles.stats}>
              <div className={styles.statCard}>
                <h3>Total</h3>
                <p>{total}</p>
              </div>
              <div className={`${styles.statCard} ${styles.statAccent}`}>
                <h3>Unread</h3>
                <p>{unreadCount}</p>
              </div>
              <div className={styles.statCard}>
                <h3>Today</h3>
                <p>{todayCount}</p>
              </div>
              <div className={styles.statCard}>
                <h3>Replied</h3>
                <p>{repliedCount}</p>
              </div>
            </div>

            <div className={styles.tableToolbar}>
              <p className={styles.pageMeta}>
                Showing {total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}–
                {Math.min(currentPage * PAGE_SIZE, total)} of {total}
              </p>
              <button
                type="button"
                className={styles.exportBtn}
                onClick={() => exportInquiriesCsv(inquiries)}
                disabled={total === 0}
              >
                Export CSV
              </button>
            </div>

            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Read</th>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Subject</th>
                    <th>Preview</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.length === 0 ? (
                    <tr className={styles.emptyRow}>
                      <td colSpan={8}>No inquiries yet.</td>
                    </tr>
                  ) : (
                    pageRows.map((inquiry) => (
                      <tr
                        key={inquiry.id}
                        className={`${styles.row} ${!inquiry.is_read ? styles.rowUnread : ""}`}
                        onClick={() => openInquiry(inquiry)}
                      >
                        <td>
                          <span
                            className={`${styles.readDot} ${
                              inquiry.is_read ? styles.dotRead : styles.dotUnread
                            }`}
                            title={inquiry.is_read ? "Read" : "Unread"}
                          />
                        </td>
                        <td style={{ whiteSpace: "nowrap" }}>
                          {new Date(inquiry.date).toLocaleDateString()}
                        </td>
                        <td style={{ fontWeight: 700 }}>{inquiry.name}</td>
                        <td>{inquiry.email}</td>
                        <td>{inquiry.subject || "—"}</td>
                        <td className={styles.preview}>{inquiry.message}</td>
                        <td>
                          <span
                            className={`${styles.status} ${
                              inquiry.status === "new"
                                ? styles.statusNew
                                : inquiry.status === "replied"
                                  ? styles.statusReplied
                                  : styles.statusClosed
                            }`}
                          >
                            {inquiry.status}
                          </span>
                        </td>
                        <td onClick={(e) => e.stopPropagation()}>
                          <div className={styles.actionBtns}>
                            <button
                              type="button"
                              className={`${styles.actionBtn} ${styles.actionBtnReply}`}
                              onClick={() => toggleRead(inquiry.id, !inquiry.is_read)}
                            >
                              {inquiry.is_read ? "Unread" : "Read"}
                            </button>
                            <button
                              type="button"
                              className={`${styles.actionBtn} ${styles.actionBtnDelete}`}
                              onClick={() => deleteInquiry(inquiry.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className={styles.pagination}>
              <button
                type="button"
                className={styles.pageBtn}
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {pageCount}
              </span>
              <button
                type="button"
                className={styles.pageBtn}
                disabled={currentPage >= pageCount}
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              >
                Next
              </button>
            </div>
          </>
        )}

        {tab === "feedback" && <FeedbackManager />}

        {tab === "profile" && (
          <div className={styles.profileCard}>
            <div className={styles.profileHeader}>
              <Image src="/logo.png" alt="" width={56} height={56} className={styles.navLogo} />
              <div>
                <h2>Admin Account</h2>
                <p>
                  Current username: <strong>{username}</strong>
                </p>
              </div>
            </div>

            {profileMsg && (
              <div
                className={profileMsg.type === "ok" ? styles.profileOk : styles.profileErr}
              >
                {profileMsg.text}
              </div>
            )}

            <form className={styles.profileForm} onSubmit={saveProfile}>
              <div className={styles.formGroup}>
                <label htmlFor="currentPassword">Current password *</label>
                <input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="newUsername">New username</label>
                <input
                  id="newUsername"
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Leave blank to keep current"
                  autoComplete="username"
                />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="newPassword">New password</label>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    autoComplete="new-password"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="confirmPassword">Confirm new password</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>
              </div>
              <button type="submit" className={styles.saveBtn} disabled={profileLoading}>
                {profileLoading ? "Saving..." : "Save Profile Changes"}
              </button>
            </form>
          </div>
        )}
      </div>

      <InquiryLightbox
        inquiry={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
        onToggleRead={toggleRead}
        onUpdateStatus={updateStatus}
        onDelete={deleteInquiry}
        onReplied={onReplied}
      />
    </div>
  );
}
