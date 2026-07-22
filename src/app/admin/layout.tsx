import type { Metadata } from "next";
import AdminStyles from "./AdminStyles";
import AuthGuard from "./AuthGuard";

export const metadata: Metadata = {
  title: "Admin Dashboard | Printing Services",
  description: "Manage inquiries and site content",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-container">
      <AdminStyles />
      <AuthGuard>
        {children}
      </AuthGuard>
    </div>
  );
}
