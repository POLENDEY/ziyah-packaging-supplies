"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./admin.module.css";

interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: string;
  date: string;
}

export default function AdminDashboard() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInquiries() {
      try {
        setApiError(null);
        const response = await fetch("/api/inquiry");
        const data = await response.json();
        if (response.ok && Array.isArray(data)) {
          setInquiries(data);
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
    }
    fetchInquiries();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_session");
    window.location.href = "/admin/login";
  };

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const response = await fetch("/api/inquiry", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (response.ok) {
        setInquiries(
          inquiries.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
        );
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const deleteInquiry = async (id: number) => {
    if (!confirm("Delete this inquiry permanently?")) return;
    try {
      const response = await fetch("/api/inquiry", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        setInquiries(inquiries.filter((i) => i.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete inquiry:", error);
    }
  };

  const statusClass = (s: string) => {
    if (s === "new") return styles.statusNew;
    if (s === "replied") return styles.statusReplied;
    return styles.statusClosed;
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--primary-xlight)",
          color: "var(--primary-dark)",
          fontWeight: 600,
        }}
      >
        Loading dashboard...
      </div>
    );
  }

  const total = inquiries.length;
  const newCount = inquiries.filter((i) => i.status === "new").length;
  const todayCount = inquiries.filter(
    (i) =>
      i.date && new Date(i.date).toDateString() === new Date().toDateString()
  ).length;
  const repliedCount = inquiries.filter((i) => i.status === "replied").length;

  return (
    <div className={styles.adminLayout}>
      <nav className={styles.adminNav}>
        <div className={styles.adminNavBrand}>
          <Image
            src="/logo.png"
            alt="Ziyah"
            width={30}
            height={30}
            style={{ borderRadius: "50%", objectFit: "cover" }}
          />
          ZIYAH PACKAGING
          <span>CMS</span>
        </div>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          Sign Out
        </button>
      </nav>

      <div className={styles.dashboard}>
        <div className={styles.header}>
          <div className={styles.title}>
            <h1>Inquiries Dashboard</h1>
            <p>Manage customer inquiries and messages</p>
          </div>
        </div>

        {apiError && (
          <div className={styles.errorBanner}>
            <strong>Error:</strong> {apiError} — Please check your Supabase table
            setup.
          </div>
        )}

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <h3>Total Inquiries</h3>
            <p>{total}</p>
          </div>
          <div className={styles.statCard}>
            <h3>New / Pending</h3>
            <p>{newCount}</p>
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

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.length === 0 ? (
                <tr className={styles.emptyRow}>
                  <td colSpan={8}>No inquiries yet.</td>
                </tr>
              ) : (
                inquiries.map((inquiry) => (
                  <tr key={inquiry.id}>
                    <td style={{ whiteSpace: "nowrap" }}>
                      {new Date(inquiry.date).toLocaleDateString()}
                    </td>
                    <td style={{ fontWeight: 600, whiteSpace: "nowrap" }}>
                      {inquiry.name}
                    </td>
                    <td>{inquiry.email}</td>
                    <td>{inquiry.phone || "—"}</td>
                    <td>{inquiry.subject || "—"}</td>
                    <td
                      style={{
                        maxWidth: 260,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {inquiry.message}
                    </td>
                    <td>
                      <span
                        className={`${styles.status} ${statusClass(inquiry.status)}`}
                      >
                        {inquiry.status}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionBtns}>
                        {inquiry.status === "new" ? (
                          <button
                            className={`${styles.actionBtn} ${styles.actionBtnReply}`}
                            onClick={() => updateStatus(inquiry.id, "replied")}
                          >
                            Mark Replied
                          </button>
                        ) : (
                          <button
                            className={`${styles.actionBtn} ${styles.actionBtnReply}`}
                            onClick={() => updateStatus(inquiry.id, "new")}
                          >
                            Re-open
                          </button>
                        )}
                        <button
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
      </div>
    </div>
  );
}
