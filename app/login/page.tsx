import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Login — JSEC",
};

export default function LoginPage() {
  return (
    <div className="page" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "70vh", padding: "3rem 1.5rem" }}>
      <div className="modal-box" style={{ maxWidth: 440, width: "100%", position: "relative" }}>
        <Link href="/" className="modal-close" aria-label="Close">
          &#x2715;
        </Link>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
