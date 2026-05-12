// src/pages/HowToUse.jsx
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

function StepCard({ n, title, desc }) {
  return (
    <div
      className="featureCard"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 18,
        padding: 16,
        display: "flex",
        gap: 14,
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 14,
          display: "grid",
          placeItems: "center",
          fontWeight: 950,
          background: "rgba(106,217,255,0.12)",
          border: "1px solid rgba(106,217,255,0.30)",
        }}
      >
        {n}
      </div>

      <div>
        <div style={{ fontWeight: 950, fontSize: 15 }}>{title}</div>
        <div style={{ marginTop: 6, color: "rgba(255,255,255,0.65)", fontSize: 13, lineHeight: 1.7 }}>
          {desc}
        </div>
      </div>
    </div>
  );
}

export default function HowToUse() {
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

            {/* Pills */}
            <motion.div
              variants={fadeUp}
              custom={0}
              style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}
            >
              <Pill>Simple workflow</Pill>
              <Pill>Research ready</Pill>
              <Pill style={{ background: "rgba(106,217,255,0.12)", border: "1px solid rgba(106,217,255,0.30)" }}>
                Timestamp publishing
              </Pill>
            </motion.div>

            {/* Header */}
            <motion.h1 className="h1" variants={fadeUp} custom={1}>
              How to use
              <span style={{ display: "block", color: "#6ad9ff" }}>
                step-by-step workflow
              </span>
            </motion.h1>

            <motion.p
              className="sub"
              variants={fadeUp}
              custom={2}
              style={{ maxWidth: 850, marginBottom: 24 }}
            >
              Follow these steps to generate combinatorial outputs and create timestamped
              prior-art documentation.
            </motion.p>

            {/* Steps Grid */}
            <motion.div
              variants={fadeUp}
              custom={3}
              style={{
                display: "grid",
                gap: 14,
              }}
            >
              <StepCard
                n="1"
                title="Sign in"
                desc="Log in using Google authentication so outputs can be linked to your account history."
              />

              <StepCard
                n="2"
                title="Add materials or concepts"
                desc="Enter one item per line — polymers, additives, compounds, or ideas."
              />

              <StepCard
                n="3"
                title="Choose combination size (K)"
                desc="Pick how many items should be in each generated subset (e.g., pairs, triples)."
              />

              <StepCard
                n="4"
                title="Generate combinations"
                desc="The backend computes all valid combinations and timestamps the result."
              />

              <StepCard
                n="5"
                title="Export or publish"
                desc="Download CSV or upload to OSF to create a permanent timestamped research record."
              />
            </motion.div>

            {/* Tips Section */}
            <motion.div
              variants={fadeUp}
              custom={4}
              style={{ marginTop: 18 }}
              className="featureCard"
            >
              <div style={{ fontWeight: 950, marginBottom: 8 }}>
                💡 Tips for best results
              </div>

              <div style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.7, fontSize: 13 }}>
                • Keep entries short and specific<br />
                • Avoid duplicates<br />
                • Start with K=2 or K=3 for exploration<br />
                • Use OSF upload for research credibility
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeUp}
              custom={5}
              style={{
                marginTop: 22,
                display: "flex",
                gap: 12,
                justifyContent: "flex-end",
                flexWrap: "wrap",
              }}
            >
              <Link
                to="/about"
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
                Learn more
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
