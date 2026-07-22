"use client";

import { useEffect, useRef } from "react";
import styles from "./InquiryLightbox.module.css";

export type InquiryDetail = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
  status: string;
  is_read?: boolean;
  date: string;
};

type Props = {
  inquiry: InquiryDetail | null;
  open: boolean;
  onClose: () => void;
  onToggleRead: (id: number, isRead: boolean) => void;
  onUpdateStatus: (id: number, status: string) => void;
  onDelete: (id: number) => void;
};

export default function InquiryLightbox({
  inquiry,
  open,
  onClose,
  onToggleRead,
  onUpdateStatus,
  onDelete,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.setAttribute("closedby", "any");
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && inquiry) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [open, inquiry]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClick = (event: MouseEvent) => {
      if (!("closedBy" in HTMLDialogElement.prototype) && event.target === dialog) {
        onClose();
      }
    };
    dialog.addEventListener("click", onClick);
    return () => dialog.removeEventListener("click", onClick);
  }, [onClose]);

  if (!inquiry) return <dialog ref={dialogRef} className={styles.dialog} />;

  const isRead = !!inquiry.is_read;

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="inquiry-title"
      onClose={onClose}
    >
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className={styles.header}>
          <p className={styles.eyebrow}>Customer Inquiry</p>
          <h2 id="inquiry-title">{inquiry.name}</h2>
          <div className={styles.badges}>
            <span className={`${styles.badge} ${isRead ? styles.read : styles.unread}`}>
              {isRead ? "Read" : "Unread"}
            </span>
            <span className={styles.badge}>{inquiry.status}</span>
          </div>
        </div>

        <div className={styles.meta}>
          <div>
            <strong>Email</strong>
            <a href={`mailto:${inquiry.email}`}>{inquiry.email}</a>
          </div>
          <div>
            <strong>Phone</strong>
            <p>{inquiry.phone || "—"}</p>
          </div>
          <div>
            <strong>Subject</strong>
            <p>{inquiry.subject || "—"}</p>
          </div>
          <div>
            <strong>Received</strong>
            <p>{new Date(inquiry.date).toLocaleString()}</p>
          </div>
        </div>

        <div className={styles.messageBlock}>
          <strong>Full message</strong>
          <p>{inquiry.message}</p>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.primary}
            onClick={() => onToggleRead(inquiry.id, !isRead)}
          >
            Mark as {isRead ? "Unread" : "Read"}
          </button>
          {inquiry.status === "new" ? (
            <button
              type="button"
              className={styles.secondary}
              onClick={() => onUpdateStatus(inquiry.id, "replied")}
            >
              Mark Replied
            </button>
          ) : (
            <button
              type="button"
              className={styles.secondary}
              onClick={() => onUpdateStatus(inquiry.id, "new")}
            >
              Re-open
            </button>
          )}
          <button
            type="button"
            className={styles.danger}
            onClick={() => {
              onDelete(inquiry.id);
              onClose();
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </dialog>
  );
}
