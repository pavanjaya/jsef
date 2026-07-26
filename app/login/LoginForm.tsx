"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Reveal from "../components/Reveal";
import { createClient } from "../../lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    setSubmitting(false);

    if (signInError) {
      setError("Incorrect email or password. Please try again.");
      return;
    }

    router.push(searchParams.get("next") || "/account");
    router.refresh();
  };

  return (
    <Reveal as="form" className="mem-form" onSubmit={onSubmit} style={{ margin: "0 auto" }}>
      <h3 style={{ marginBottom: "1.5rem", fontSize: 20 }}>Member Login</h3>
      <div className="fg">
        <label>Email *</label>
        <input type="email" name="email" placeholder="you@example.com" required />
      </div>
      <div className="fg">
        <label>Password *</label>
        <input type="password" name="password" placeholder="Your password" required />
      </div>

      {error && <p style={{ fontSize: 13, color: "#B91C1C", marginBottom: "1rem" }}>{error}</p>}

      <button
        type="submit"
        className="btn btn-ink"
        disabled={submitting}
        style={{ width: "100%", justifyContent: "center", padding: 13, fontSize: 14, opacity: submitting ? 0.6 : 1 }}
      >
        {submitting ? "Logging in…" : "Log In →"}
      </button>

      <p style={{ fontSize: 13, color: "var(--ink-3)", textAlign: "center", marginTop: "1.5rem" }}>
        Not a member yet? <a href="/membership" style={{ color: "var(--brand)" }}>Apply for membership →</a>
      </p>
    </Reveal>
  );
}
