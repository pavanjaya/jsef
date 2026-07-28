"use client";

import { useMemo, useState } from "react";
import Reveal from "../components/Reveal";
import { SearchIcon, PinIcon, PhoneIcon, ArchitectureIcon, FinanceIcon, EducationIcon } from "./icons";

type Business = {
  id: string;
  category: "architecture" | "finance" | "education" | "healthcare" | "retail";
  categoryLabel: string;
  icon: React.ReactNode;
  emoji: string;
  emojiBg: string;
  name: string;
  owner: string;
  desc: string;
  address: string;
  phone: string;
  tags: string[];
  searchText: string;
};

const BUSINESSES: Business[] = [
  {
    id: "mj-architects",
    category: "architecture",
    categoryLabel: "Architecture",
    icon: <ArchitectureIcon />,
    emoji: "🏛️",
    emojiBg: "linear-gradient(135deg,#e8d5b7,#c9a87c)",
    name: "MJ Architects",
    owner: "Mahesh Jangid",
    desc: "Contemporary architecture and design studio known for thoughtful, functional, and aesthetically refined spaces.",
    address: "G-2, Neelima Apartment, College Rd, Vise Mala, Nashik, Maharashtra 422005",
    phone: "+91 97666 40399",
    tags: ["Architecture", "Interior Design", "+2 more"],
    searchText: "mj architects mahesh jangid architecture interior design",
  },
  {
    id: "jangid-finance-solutions",
    category: "finance",
    categoryLabel: "Finance",
    icon: <FinanceIcon />,
    emoji: "💼",
    emojiBg: "linear-gradient(135deg,#dbeafe,#93c5fd)",
    name: "Jangid Finance Solutions",
    owner: "Rajesh Jangid",
    desc: "Trusted financial services provider offering home loans, business loans, insurance planning and wealth management for families.",
    address: "Opp. Rajiv Gandhi Bhavan, Sharanpur Rd, Nashik, Maharashtra 422002",
    phone: "+91 98234 56789",
    tags: ["Home Loans", "Insurance", "+3 more"],
    searchText: "jangid finance solutions rajesh jangid loans investment",
  },
  {
    id: "jangid-academy",
    category: "education",
    categoryLabel: "Education",
    icon: <EducationIcon />,
    emoji: "🎓",
    emojiBg: "linear-gradient(135deg,#d1fae5,#6ee7b7)",
    name: "Jangid Academy",
    owner: "Suresh Jangid",
    desc: "Premier coaching institute offering competitive exam preparation, skill development courses and career counselling for students.",
    address: "Suyojit Complex, Gangapur Rd, Nashik, Maharashtra 422013",
    phone: "+91 97654 32100",
    tags: ["JEE / NEET", "Skill Dev", "+2 more"],
    searchText: "jangid academy suresh jangid coaching classes education",
  },
];

const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "architecture", label: "Architecture" },
  { key: "finance", label: "Finance" },
  { key: "education", label: "Education" },
  { key: "healthcare", label: "Healthcare" },
  { key: "retail", label: "Retail" },
] as const;

const DELAYS = [0, 1, 2] as const;

export default function DirectoryClient() {
  const [filter, setFilter] = useState<string>("all");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return BUSINESSES.filter((b) => {
      const catOk = filter === "all" || b.category === filter;
      const nameOk = !q || b.searchText.includes(q);
      return catOk && nameOk;
    });
  }, [filter, query]);

  return (
    <>
      <Reveal as="div" className="dir-toolbar">
        <label className="dir-search">
          <SearchIcon />
          <input type="text" placeholder="Search businesses, owners…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
        <span className="dir-count">
          Showing {visible.length} business{visible.length !== 1 ? "es" : ""}
        </span>
      </Reveal>

      <Reveal as="div" className="dir-filters" delay={1}>
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            className={`dir-filter-btn${filter === c.key ? " active" : ""}`}
            onClick={() => setFilter(c.key)}
          >
            {c.label}
          </button>
        ))}
      </Reveal>

      <div className="biz-grid">
        {visible.map((b, i) => (
          <Reveal as="div" className="biz-card" delay={DELAYS[i % 3] || undefined} key={b.id}>
            <div className="biz-card-img-wrap">
              <div style={{ width: "100%", height: "100%", background: b.emojiBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>
                {b.emoji}
              </div>
              <div className="biz-badges">
                <span className="biz-badge">Verified</span>
              </div>
            </div>
            <div className="biz-card-body">
              <span className="biz-category">
                {b.icon}
                {b.categoryLabel}
              </span>
              <div>
                <div className="biz-name">{b.name}</div>
                <div className="biz-owner">{b.owner}</div>
              </div>
              <div className="biz-desc">{b.desc}</div>
              <div className="biz-meta">
                <div className="biz-meta-row">
                  <PinIcon />
                  {b.address.split(",").slice(-2).join(",").trim()}
                </div>
                <div className="biz-meta-row">
                  <PhoneIcon />
                  <a href={`tel:${b.phone.replace(/\s/g, "")}`}>{b.phone}</a>
                </div>
              </div>
              <div className="biz-tags">
                {b.tags.slice(0, 2).map((t) => (
                  <span className="biz-tag" key={t}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="biz-card-footer">
              <button className="biz-btn-primary">View Profile</button>
            </div>
          </Reveal>
        ))}
      </div>
    </>
  );
}
