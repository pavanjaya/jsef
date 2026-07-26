import type { Metadata } from "next";
import Reveal from "../components/Reveal";

export const metadata: Metadata = {
  title: "Committee — JSEC",
};

type Member = {
  firstName: string;
  lastName: string;
  role: string;
  desc: string;
  phone: string;
  email: string;
  photo?: string;
  initials?: string;
};

const EXECUTIVES: Member[] = [
  {
    firstName: "Mahesh",
    lastName: "Tarachand Jangid",
    role: "President · B.Arch · Architect",
    desc: "Founding member and community leader driving JSEC's vision since 2018. 11+ years in community leadership.",
    phone: "+91 97666 40399",
    email: "president@jangidbsec.org",
    photo: "/images/president-mahesh-jangid.png",
  },
  {
    firstName: "Vikas",
    lastName: "Nemichand Jangid",
    role: "Secretary · B.Com · Business",
    desc: "Oversees committee operations, member coordination, and official communications. 12+ years in administration.",
    phone: "+91 91308 75666",
    email: "secretary@jangidbsec.org",
    initials: "VJ",
  },
  {
    firstName: "Manoj",
    lastName: "Satyanarayan Jangid",
    role: "Treasurer · MBA · Service",
    desc: "Manages funds, accounts, and financial planning for all JSEC activities. 8+ years in financial management.",
    phone: "+91 99752 01974",
    email: "treasurer@jangidbsec.org",
    initials: "MJ",
  },
];

const MEMBERS: Member[] = [
  {
    firstName: "Pavan",
    lastName: "Tarachand Jangid",
    role: "Member · M.Des · Service",
    desc: "Design and service management. Supports creative and operational community programs.",
    phone: "+91 91702 09810",
    email: "pavan@jangidbsec.org",
    photo: "/images/member-pavan-jangid.png",
  },
  {
    firstName: "Harish",
    lastName: "Ramkishor Jangid",
    role: "Member · Graduate · Business",
    desc: "Business development and community service. Drives outreach and engagement initiatives.",
    phone: "+91 99601 04109",
    email: "harish@jangidbsec.org",
    initials: "HJ",
  },
  {
    firstName: "Deepak",
    lastName: "Omprakash Jangid",
    role: "Member · B.Com · Business",
    desc: "Commerce and business management. Supports member welfare and financial activities.",
    phone: "+91 63907 59575",
    email: "deepak.o@jangidbsec.org",
    initials: "DJ",
  },
  {
    firstName: "Pawan",
    lastName: "Shantilal Jangid",
    role: "Member · MBA · Business",
    desc: "Strategic planning and business development. Strengthens community partnerships.",
    phone: "+91 70209 81080",
    email: "pawan@jangidbsec.org",
    initials: "PJ",
  },
  {
    firstName: "Deepak",
    lastName: "Gopal Sharma",
    role: "Member · MBA · Business",
    desc: "Management and organisational development. Coordinates key events and programs.",
    phone: "+91 95377 78714",
    email: "deepak.g@jangidbsec.org",
    initials: "DS",
  },
  {
    firstName: "Mohit",
    lastName: "Santkumar Jangid",
    role: "Member · BBL · Business",
    desc: "Legal and business operations. Ensures compliance and supports governance processes.",
    phone: "+91 90678 72730",
    email: "mohit@jangidbsec.org",
    initials: "MJ",
  },
  {
    firstName: "Anil",
    lastName: "Mahesh Jangid",
    role: "Member · B.Com · Business",
    desc: "Financial planning and business strategy. Supports long-term community sustainability.",
    phone: "+91 94237 00004",
    email: "anil@jangidbsec.org",
    initials: "AJ",
  },
  {
    firstName: "Suresh",
    lastName: "Ramchandra Jangid",
    role: "Member · B.M.E · Business",
    desc: "Engineering and business management. Oversees infrastructure and technical initiatives.",
    phone: "+91 91537 86855",
    email: "suresh@jangidbsec.org",
    initials: "SJ",
  },
];

const DELAYS = [1, 2, 3, 4, 5] as const;

function MemberCard({ m, delay }: { m: Member; delay?: (typeof DELAYS)[number] }) {
  return (
    <Reveal className="comm-card" delay={delay}>
      <div
        className="comm-photo"
        style={
          m.photo
            ? { background: `url('${m.photo}') center top/cover no-repeat`, filter: "grayscale(1) contrast(1.1)" }
            : undefined
        }
      >
        <span className="comm-photo-initials" style={m.photo ? { display: "none" } : undefined}>
          {m.initials}
        </span>
      </div>
      <div className="comm-info">
        <div className="comm-firstname">{m.firstName}</div>
        <div className="comm-lastname">{m.lastName}</div>
        <div className="comm-role">{m.role}</div>
        <div className="comm-desc">{m.desc}</div>
        <div className="comm-contact">
          <a href={`tel:${m.phone.replace(/\s/g, "")}`}>{m.phone}</a>
          <a href={`mailto:${m.email}`}>{m.email}</a>
        </div>
      </div>
    </Reveal>
  );
}

export default function CommitteePage() {
  return (
    <div className="page page-fade">
      <div className="page-banner" style={{ background: "#fff", borderBottom: "1px solid var(--rule)" }}>
        <div className="wrap">
          <Reveal as="span" className="eyebrow">
            Governing Body
          </Reveal>
          <Reveal as="h1" className="h1" delay={1} style={{ maxWidth: 660, marginBottom: "1.2rem" }}>
            The people
            <br />
            behind the <em>work.</em>
          </Reveal>
          <Reveal as="p" className="lead" delay={2} style={{ maxWidth: 500 }}>
            11 dedicated members who give their time, energy, and leadership to build our community.
          </Reveal>
        </div>
      </div>

      <section className="sec" style={{ background: "#fff", paddingTop: "4rem", paddingBottom: "2rem" }}>
        <div className="wrap">
          <Reveal as="span" className="eyebrow">
            Executive Committee
          </Reveal>
          <Reveal as="p" delay={1} style={{ fontSize: 14, color: "var(--ink-3)", marginBottom: "2.5rem" }}>
            3 key positions responsible for overall governance and strategic decisions.
          </Reveal>
          <div className="committee-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
            {EXECUTIVES.map((m, i) => (
              <MemberCard m={m} delay={DELAYS[i]} key={m.email} />
            ))}
          </div>
        </div>
      </section>

      <section className="sec" style={{ background: "#fff", paddingTop: "2rem", paddingBottom: "6rem" }}>
        <div className="wrap">
          <Reveal as="span" className="eyebrow">
            Committee Members
          </Reveal>
          <Reveal as="p" delay={1} style={{ fontSize: 14, color: "var(--ink-3)", marginBottom: "2.5rem" }}>
            8 dedicated members supporting various aspects of community activities.
          </Reveal>
          <div className="committee-grid" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
            {MEMBERS.map((m, i) => (
              <MemberCard m={m} delay={DELAYS[i % 5]} key={m.email} />
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "var(--warm)", padding: "5rem 0" }}>
        <div className="wrap">
          <Reveal as="h2" className="h2" style={{ textAlign: "center", marginBottom: "3rem" }}>
            Committee Structure
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", maxWidth: 800, margin: "0 auto" }}>
            <Reveal style={{ background: "#fff", padding: "2.5rem", border: "1px solid var(--rule)" }}>
              <div style={{ fontSize: 32, marginBottom: ".8rem" }}>👥</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", marginBottom: ".4rem" }}>Executive Committee</div>
              <div style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                3 key positions responsible for overall governance and strategic decisions
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: ".4rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: "var(--ink-3)" }}>President:</span>
                  <span style={{ color: "var(--ink)", fontWeight: 600 }}>Mahesh Tarachand Jangid</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: "var(--ink-3)" }}>Secretary:</span>
                  <span style={{ color: "var(--ink)", fontWeight: 600 }}>Vikas Nemichand Jangid</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: "var(--ink-3)" }}>Treasurer:</span>
                  <span style={{ color: "var(--ink)", fontWeight: 600 }}>Manoj Satyanarayan Jangid</span>
                </div>
              </div>
            </Reveal>
            <Reveal delay={1} style={{ background: "#fff", padding: "2.5rem", border: "1px solid var(--rule)" }}>
              <div style={{ fontSize: 32, marginBottom: ".8rem" }}>🤝</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", marginBottom: ".4rem" }}>Committee Members</div>
              <div style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                8 dedicated members supporting various aspects of community activities
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".3rem" }}>
                {MEMBERS.map((m) => (
                  <div style={{ fontSize: 12, color: "var(--ink-2)" }} key={m.email}>
                    • {m.firstName} {m.lastName}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <div style={{ background: "var(--deep)", padding: "3rem 0" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 2.5rem" }}>
          <Reveal as="h2" className="h2" style={{ color: "#fff", textAlign: "center", marginBottom: "2.5rem" }}>
            Committee Overview
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0 }}>
            <Reveal style={{ textAlign: "center", padding: "2rem 1rem", borderRight: "1px solid rgba(255,255,255,.1)" }}>
              <div style={{ fontSize: 48, fontWeight: 900, color: "#fff", letterSpacing: "-2px", lineHeight: 1 }}>11</div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(255,255,255,.4)", marginTop: ".4rem" }}>
                Total Members
              </div>
            </Reveal>
            <Reveal delay={1} style={{ textAlign: "center", padding: "2rem 1rem", borderRight: "1px solid rgba(255,255,255,.1)" }}>
              <div style={{ fontSize: 48, fontWeight: 900, color: "var(--brand)", letterSpacing: "-2px", lineHeight: 1 }}>3</div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(255,255,255,.4)", marginTop: ".4rem" }}>
                Executive Positions
              </div>
            </Reveal>
            <Reveal delay={2} style={{ textAlign: "center", padding: "2rem 1rem", borderRight: "1px solid rgba(255,255,255,.1)" }}>
              <div style={{ fontSize: 48, fontWeight: 900, color: "#fff", letterSpacing: "-2px", lineHeight: 1 }}>8</div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(255,255,255,.4)", marginTop: ".4rem" }}>
                Business Professionals
              </div>
            </Reveal>
            <Reveal delay={3} style={{ textAlign: "center", padding: "2rem 1rem" }}>
              <div style={{ fontSize: 48, fontWeight: 900, color: "var(--brand)", letterSpacing: "-2px", lineHeight: 1 }}>6</div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(255,255,255,.4)", marginTop: ".4rem" }}>
                Advanced Degrees
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      <section style={{ background: "#fff", padding: "5rem 0" }}>
        <div className="wrap">
          <Reveal as="h2" className="h2" style={{ textAlign: "center", marginBottom: ".8rem" }}>
            Contact the Committee
          </Reveal>
          <Reveal as="p" delay={1} style={{ textAlign: "center", color: "var(--ink-3)", fontSize: 14, marginBottom: "3rem" }}>
            Reach out to our leadership team for any queries or suggestions.
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", maxWidth: 700, margin: "0 auto" }}>
            <Reveal style={{ border: "1px solid var(--rule)", padding: "2rem" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: ".8rem" }}>
                General Inquiries
              </div>
              <div style={{ fontSize: 13, color: "var(--ink-2)", marginBottom: ".4rem" }}>🤙 President: +91 97666 40399</div>
              <div style={{ fontSize: 13, color: "var(--brand)" }}>✉ president@jangidbsec.org</div>
            </Reveal>
            <Reveal delay={1} style={{ border: "1px solid var(--rule)", padding: "2rem" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: ".8rem" }}>
                Events & Activities
              </div>
              <div style={{ fontSize: 13, color: "var(--ink-2)", marginBottom: ".4rem" }}>🤙 Event Head: +91 99867 54567</div>
              <div style={{ fontSize: 13, color: "var(--brand)" }}>✉ events@jangidbsec.org</div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
