"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./login.module.css";
import { supabase } from "@/lib/supabase";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes("placeholder")) {
      setError("Supabase is not configured. Please set environment variables.");
      setLoading(false);
      return;
    }

    try {
      const { data, error: queryError } = await supabase
        .from("profile")
        .select("*")
        .eq("username", username)
        .eq("password", password)
        .maybeSingle();

      if (queryError) {
        setError(`Database Error: ${queryError.message}`);
      } else if (!data) {
        setError("Invalid username or password");
      } else {
        localStorage.setItem("admin_session", "true");
        localStorage.setItem("admin_username", data.username);
        window.location.href = "/ziyah-admin";
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Check console for details";
      setError(`System Error: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <div className={styles.loginLogo}>
          <Image src="/logo.png" alt="Ziyah Packaging" width={72} height={72} />
        </div>
        <p className={styles.eyebrow}>Ziyah Packaging Supplies</p>
        <h1>Admin Portal</h1>
        <p>Sign in to manage inquiries and your CMS profile</p>

        {error && <div className={styles.errorMsg}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Your username"
              autoComplete="username"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className={styles.loginBtn} disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <a href="/" className={styles.backLink}>
          ← Back to Website
        </a>
      </div>
    </div>
  );
}
