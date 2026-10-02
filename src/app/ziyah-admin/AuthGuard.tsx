"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const LOGIN_PATH = "/ziyah-admin/login";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      if (pathname === LOGIN_PATH) {
        if (!cancelled) setIsAuthenticated(false);
        return;
      }
      try {
        const response = await fetch("/api/admin/session");
        if (cancelled) return;
        if (response.ok) {
          setIsAuthenticated(true);
          return;
        }
      } catch {
        /* treat as signed out */
      }
      if (cancelled) return;
      localStorage.removeItem("admin_session");
      localStorage.removeItem("admin_username");
      setIsAuthenticated(false);
      router.push(LOGIN_PATH);
    }

    checkSession();
    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  if (isAuthenticated === null && pathname !== LOGIN_PATH) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-geist-sans)",
          color: "var(--primary-dark)",
          background: "var(--primary-xlight)",
          fontWeight: 600,
        }}
      >
        Authenticating...
      </div>
    );
  }

  return <>{children}</>;
}
