"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const LOGIN_PATH = "/ziyah-admin/login";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const session = localStorage.getItem("admin_session");

    if (session === "true") {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      if (pathname !== LOGIN_PATH) {
        router.push(LOGIN_PATH);
      }
    }
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
