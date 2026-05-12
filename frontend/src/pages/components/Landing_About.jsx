// src/pages/About.jsx
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.06 * i,
      duration: 0.55,
      ease: [0.215, 0.61, 0.355, 1],
    },
  }),
};

function Pill({ children, style }) {
  return (
    <div
      className="pill"
      style={{
        padding: "6px 10px",
        borderRadius: 999,
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.10)",
        color: "rgba(255,255,255,0.85)",
        fontSize: 12,
        fontWeight: 900,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function FeatureCard({ title, desc, badge }) {
  return (
    <div
      className="featureCard"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 18,
        padding: 16,
        display: "grid",
        gap: 10,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
        <div style={{ fontWeight: 950, fontSize: 16 }}>{title}</div>
        <div
          className="pill"
          style={{
            padding: "6px 10px",
            borderRadius: 999,
            background: "rgba(106,217,255,0.12)",
            border: "1px solid rgba(106,217,255,0.30)",
            color: "rgba(255,255,255,0.90)",
            fontSize: 12,
            fontWeight: 950,
          }}
        >
          {badge}
        </div>
      </div>

      <div style={{ color: "rgba(255,255,255,0.70)", lineHeight: 1.7, fontSize: 13 }}>
        {desc}
      </div>
    </div>
  );
}

function Step({ n, title, desc }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        padding: "12px 14px",
        borderRadius: 16,
        background: "rgba(0,0,0,0.25)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 14,
          display: "grid",
          placeItems: "center",
          fontWeight: 950,
          background: "rgba(106,217,255,0.12)",
          border: "1px solid rgba(106,217,255,0.30)",
          color: "rgba(255,255,255,0.95)",
        }}
      >
        {n}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 950 }}>{title}</div>
        <div style={{ marginTop: 4, color: "rgba(255,255,255,0.65)", fontSize: 13, lineHeight: 1.6 }}>
          {desc}
        </div>
      </div>
    </div>
  );
}

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="bg">
      <div className="layer">
        <Navbar />

        <main className="container hero">
          <motion.div
            className="card"
            style={{ padding: "clamp(20px, 5vw, 40px)", textAlign: "left" }}
            initial="hidden"
            animate="show"
            variants={fadeUp}
          >
            {/* pills */}
            <motion.div
              variants={fadeUp}
              custom={0}
              style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 18 }}
            >
              <Pill>Open innovation</Pill>
              <Pill>Prior art</Pill>
              <Pill style={{ background: "rgba(106,217,255,0.12)", border: "1px solid rgba(106,217,255,0.30)" }}>
                Timestamp-ready
              </Pill>
            </motion.div>

            {/* header */}
            <motion.h1 className="h1" variants={fadeUp} custom={1}>
              About this tool
              <span style={{ display: "block", color: "#6ad9ff" }}>
                what it does & why it matters
              </span>
            </motion.h1>

            <motion.p
              className="sub"
              variants={fadeUp}
              custom={2}
              style={{ maxWidth: 900, marginBottom: 24 }}
            >
              This project helps create a public, timestamped record of “obvious” combinations so future innovation stays open.
              You enter materials or concepts, generate combinations, and publish outputs (e.g., OSF) with a time-date stamp
              that can support prior-art documentation.
            </motion.p>

            {/* feature grid */}
            <motion.div variants={fadeUp} custom={3} className="heroGrid" style={{ alignItems: "start" }}>
              <FeatureCard
                title="Generate combinations"
                badge="Core"
                desc="Create all K-size combinations from your list (e.g., pairs, triples). Useful for surfacing the search space of “obvious” mixes and documenting them quickly."
              />
              <FeatureCard
                title="Timestamped publishing"
                badge="OSF"
                desc="Export results to a CSV and (optionally) upload to OSF for a stable link. The goal is a clean record you can cite later."
              />
              <FeatureCard
                title="Open innovation"
                badge="Mission"
                desc="By making combinations public and timestamped, we reduce the chance that simple recombinations get locked behind restrictive IP."
              />
            </motion.div>

            {/* How it works */}
            <motion.div variants={fadeUp} custom={4} style={{ marginTop: 18 }}>
              <div
                className="featureCard"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 18,
                  padding: 16,
                }}
              >
                <div style={{ fontWeight: 950, fontSize: 16, marginBottom: 10 }}>How it works</div>
                <div style={{ display: "grid", gap: 10 }}>
                  <Step
                    n="1"
                    title="Add your items"
                    desc="Enter materials, additives, polymers, chemicals, or ideas — one per line."
                  />
                  <Step
                    n="2"
                    title="Choose K"
                    desc="Pick how many elements per subset (e.g., K=2 for pairwise combinations)."
                  />
                  <Step
                    n="3"
                    title="Generate + export"
                    desc="Generate combinations, download CSV, and publish the output for a stable timestamped record."
                  />
                </div>
              </div>
            </motion.div>

            {/* Roadmap + CTA */}
            <motion.div variants={fadeUp} custom={5} style={{ marginTop: 18, display: "grid", gap: 14 }}>
              <div
                className="featureCard"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 18,
                  padding: 16,
                }}
              >
                <div style={{ fontWeight: 950, fontSize: 16, marginBottom: 10 }}>Roadmap (next)</div>
                <div style={{ color: "rgba(255,255,255,0.70)", lineHeight: 1.7, fontSize: 13 }}>
                  • Save history per user (your previous outputs on the profile page)<br />
                  • Better “Output” page: show OSF links + timestamps + download buttons<br />
                  • Pagination for huge result sets + search/filter<br />
                  • Optional metadata (project name, notes, tags) embedded into the CSV
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
                <Link
                  to="/how"
                  className="pill"
                  style={{
                    padding: "12px 14px",
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    color: "white",
                    textDecoration: "none",
                    fontWeight: 900,
                  }}
                >
                  Learn how to use
                </Link>

                <button
                  className="pill"
                  onClick={() => navigate("/combinations")}
                  style={{
                    padding: "12px 14px",
                    borderRadius: 12,
                    background: "rgba(106,217,255,0.16)",
                    border: "1px solid rgba(106,217,255,0.35)",
                    color: "white",
                    cursor: "pointer",
                    fontWeight: 950,
                  }}
                >
                  Start generating →
                </button>
              </div>
            </motion.div>

            <footer className="footer" style={{ textAlign: "center", marginTop: 40 }}>
              Built for combinatorial innovation • 2026 • v1.0.4
            </footer>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
