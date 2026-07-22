import type { Metadata } from "next";
import AdminStyles from "./AdminStyles";
import AuthGuard from "./AuthGuard";

export const metadata: Metadata = {
  title: "Ziyah Admin CMS",
  description: "Manage inquiries and admin profile for Ziyah Packaging Supplies",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-container">
      <AdminStyles />
      <AuthGuard>{children}</AuthGuard>
    </div>
  );
}
