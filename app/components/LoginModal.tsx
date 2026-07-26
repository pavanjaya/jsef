"use client";

import { Suspense, useEffect } from "react";
import LoginForm from "../login/LoginForm";

export default function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      className={`modal-overlay${open ? " open" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-box" style={{ maxWidth: 440 }}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
          &#x2715;
        </button>
        {open && (
          <Suspense fallback={null}>
            <LoginForm onSuccess={onClose} />
          </Suspense>
        )}
      </div>
    </div>
  );
}
