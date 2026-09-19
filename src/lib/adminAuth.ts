import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "ziyah_admin_session";

export async function isAdminSession() {
  const jar = await cookies();
  return jar.get(ADMIN_SESSION_COOKIE)?.value === "1";
}

export async function requireAdmin() {
  const ok = await isAdminSession();
  if (!ok) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
