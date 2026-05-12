// src/pages/PrivacyPolicy.jsx
import { motion } from "framer-motion";
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

function Section({ title, children }) {
  return (
    <div
      className="featureCard"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 18,
        padding: 16,
      }}
    >
      <div style={{ fontWeight: 950, fontSize: 15, marginBottom: 8 }}>{title}</div>
      <div style={{ color: "rgba(255,255,255,0.70)", fontSize: 13, lineHeight: 1.75 }}>
        {children}
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "190px 1fr",
        gap: 12,
        padding: "10px 0",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, fontWeight: 900 }}>
        {label}
      </div>
      <div style={{ color: "rgba(255,255,255,0.80)", fontSize: 13, lineHeight: 1.7 }}>
        {value}
      </div>
    </div>
  );
}

export default function PrivacyPolicy() {
  const effectiveDate = "February 8, 2026";

  const linkStyle = {
    color: "#6ad9ff",
    textDecoration: "underline",
    textUnderlineOffset: 3,
    fontWeight: 900,
  };

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
              <Pill>Privacy first</Pill>
              <Pill>Research-grade logging</Pill>
              <Pill style={{ background: "rgba(106,217,255,0.12)", border: "1px solid rgba(106,217,255,0.30)" }}>
                OSF publishing
              </Pill>
            </motion.div>

            {/* Header */}
            <motion.h1 className="h1" variants={fadeUp} custom={1}>
              Privacy Policy
              <span style={{ display: "block", color: "#6ad9ff" }}>
                how we handle your data
              </span>
            </motion.h1>

            <motion.p
              className="sub"
              variants={fadeUp}
              custom={2}
              style={{ maxWidth: 920, marginBottom: 18 }}
            >
              This application helps users generate combinatorial outputs and optionally publish
              timestamped artifacts to the web (e.g., to support prior-art documentation). We aim
              to collect the minimum data required to operate the service.
            </motion.p>

            {/* Meta */}
            <motion.div variants={fadeUp} custom={3} style={{ marginBottom: 16 }}>
              <div
                className="featureCard"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 18,
                  padding: 16,
                }}
              >
                <Row label="Effective date" value={effectiveDate} />
                <Row
                  label="Scope"
                  value="Applies to this web app and any related pages, APIs, and published outputs."
                />
                <Row
                  label="Third-party storage (optional)"
                  value={
                    <>
                      If you choose to publish results, outputs may be uploaded to OSF (Open Science Framework).
                      OSF content is governed by OSF’s own policies and permissions you set during upload.
                    </>
                  }
                />
                <div style={{ paddingTop: 12 }}>
                  <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, fontWeight: 900 }}>
                    OSF:
                  </span>{" "}
                  <a
                    href="https://osf.io/"
                    target="_blank"
                    rel="noreferrer"
                    style={linkStyle}
                  >
                    https://osf.io/
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Sections */}
            <motion.div
              variants={fadeUp}
              custom={4}
              style={{ display: "grid", gap: 14 }}
            >
              <Section title="1) Information we collect">
                <div style={{ marginBottom: 10, fontWeight: 900, color: "rgba(255,255,255,0.85)" }}>
                  What you provide
                </div>
                • Lists of materials/concepts you enter (e.g., items you want to combine).<br />
                • Configuration choices like combination size (K), naming, and export preferences.<br />
                • If enabled, account identifiers needed for sign-in (e.g., Google profile basics such as email and name).<br /><br />

                <div style={{ marginBottom: 10, fontWeight: 900, color: "rgba(255,255,255,0.85)" }}>
                  What we collect automatically
                </div>
                • Basic logs to operate and secure the service (e.g., request timestamps, errors, and performance metrics).<br />
                • Security signals to protect against abuse (e.g., rate limiting and suspicious activity detection).<br />
                We do not attempt to identify you beyond what is required for authentication and account history.
              </Section>

              <Section title="2) How we use information">
                • Generate combinatorial outputs from the lists you submit.<br />
                • Maintain your output history (if you are signed in).<br />
                • Provide export features (CSV download) and optional publishing workflows (e.g., OSF upload).<br />
                • Keep the platform reliable and secure (debugging, monitoring, preventing abuse).<br />
                We do not sell your personal information.
              </Section>

              <Section title="3) Publishing and prior-art timestamps">
                This tool may create timestamped outputs intended to serve as public prior art when you choose to publish them.
                Publishing is optional. If you publish outputs publicly, the content may become searchable and accessible
                according to the settings you choose on the hosting platform (e.g., OSF).
                <div style={{ marginTop: 10 }}>
                  Tip: If you are working with sensitive data, avoid publishing raw lists publicly. Consider publishing
                  anonymized or abstracted outputs instead.
                </div>
              </Section>

              <Section title="4) Data retention">
                • Draft inputs and generated results may be stored to provide history and reproducibility.<br />
                • Logs are retained for operational and security purposes and may be rotated periodically.<br />
                • If you publish to OSF, retention is controlled by OSF and the project’s settings.
              </Section>

              <Section title="5) Sharing and third parties">
                We only share data in the following cases:<br />
                • With service providers necessary to run the app (hosting, database, authentication), under appropriate safeguards.<br />
                • With OSF if you explicitly choose to upload/publish outputs there.<br />
                • If required by law or to protect the security and integrity of the service.
              </Section>

              <Section title="6) Security">
                We use reasonable technical and organizational measures to protect stored data, including access controls
                and secure transport (HTTPS) where supported. However, no method of transmission or storage is 100% secure.
              </Section>

              <Section title="7) Your choices">
                • You can choose whether to sign in.<br />
                • You can choose whether to publish outputs publicly (e.g., OSF upload).<br />
                • You can avoid entering personal or confidential information in list inputs.<br />
                If you need deletion or export of account-linked history, contact the project owner/administrator.
              </Section>

              <Section title="8) Updates to this policy">
                We may update this policy to reflect changes in the service, compliance needs, or infrastructure.
                If changes are material, we will update the effective date and, where appropriate, provide additional notice.
              </Section>

  
            </motion.div>

            <footer className="footer" style={{ textAlign: "center", marginTop: 40 }}>
              Privacy • Combinatorial innovation • {effectiveDate} • v1.0.4
            </footer>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
