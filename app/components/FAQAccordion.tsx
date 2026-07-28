"use client";

import { useState } from "react";

type FAQItem = { q: string; a: string };

export default function FAQAccordion({ items }: { items: readonly FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="faq-list">
      {items.map((item, i) => (
        <div className="faq-item" key={item.q}>
          <button type="button" className="faq-q" onClick={() => setOpen(open === i ? null : i)}>
            {item.q}
            <span className="faq-icon">{open === i ? "−" : "+"}</span>
          </button>
          {open === i && <p className="faq-a">{item.a}</p>}
        </div>
      ))}
    </div>
  );
}
