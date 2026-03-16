// src/pages/Profile.jsx
import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link, useSearchParams } from "react-router-dom";

import Navbar from "./components/Navbar_Login";
import PrimaryButton from "./components/PrimaryButton";

// If your auth hook gives user + loading, use it:
import { useAuthUser } from "../firebase/useAuthUser";

// Firebase delete account (pick whichever you use in your project)
import { getAuth, signOut } from "firebase/auth";
import { addRecentOutput } from "./recentOutputs";

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

function ActionCard({ title, desc, pill, onClick, to, accent = "blue" }) {
  const accentStyle =
    accent === "red"
      ? {
          background: "rgba(255,70,90,0.10)",
          border: "1px solid rgba(255,70,90,0.25)",
        }
      : accent === "green"
      ? {
          background: "rgba(60,255,140,0.10)",
          border: "1px solid rgba(60,255,140,0.25)",
        }
      : {
          background: "rgba(106,217,255,0.12)",
          border: "1px solid rgba(106,217,255,0.30)",
        };

  const content = (
    <div
      className="featureCard"
      style={{
        cursor: onClick || to ? "pointer" : "default",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 18,
        padding: 16,
        display: "grid",
        gap: 10,
      }}
      onClick={onClick}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
        <div style={{ fontWeight: 950, fontSize: 16 }}>{title}</div>
        <div
          className="pill"
          style={{
            padding: "6px 10px",
            borderRadius: 999,
            color: "rgba(255,255,255,0.9)",
            fontSize: 12,
            fontWeight: 950,
            ...accentStyle,
          }}
        >
          {pill}
        </div>
      </div>
      <div style={{ color: "rgba(255,255,255,0.70)", lineHeight: 1.65, fontSize: 13 }}>
        {desc}
      </div>

      <div style={{ marginTop: 4 }}>
        <div
          className="pill"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 12px",
            borderRadius: 14,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.10)",
            fontWeight: 900,
            color: "rgba(255,255,255,0.9)",
          }}
        >
          Open →
        </div>
      </div>
    </div>
  );

  // If `to` provided, wrap in Link
  if (to) return <Link to={to} style={{ textDecoration: "none", color: "inherit" }}>{content}</Link>;
  return content;
}

export default function Profile() {

  const handleSignOutClick = () => setShowSignOutConfirm(true);

  const [searchParams] = useSearchParams();
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  
  const navigate = useNavigate();
  const { user, loading } = useAuthUser();

  const [signingOut, setSigningOut] = useState(false);

  const initialMode = searchParams.get("view") === "details" ? "details" : "menu";
  const [mode, setMode] = useState(initialMode); // menu | details

  useEffect(() => {
  if (searchParams.get("view") === "details") setMode("details");
  else setMode("menu");
}, [searchParams]);



  const safeName = useMemo(() => {
    if (!user) return "";
    return user.displayName || user.email || "User";
  }, [user]);

  const safeEmail = user?.email || "";
  const photo = user?.photoURL || "";

const confirmSignOut = async () => {
    setShowSignOutConfirm(false);
    try {
      setSigningOut(true);
      const auth = getAuth();
      await signOut(auth);
      navigate("/", { replace: true });
    } catch (e) {
      console.error(e);
    }
  };

  // Your RequireAuth already blocks unauth users,
  // but keeping this avoids flashing weird UI if loading:
  if (loading) return null;

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
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
              <Pill>Account</Pill>
              <Pill style={{ background: "rgba(106,217,255,0.12)", border: "1px solid rgba(106,217,255,0.30)" }}>
                Signed in
              </Pill>
              {safeEmail ? <Pill>{safeEmail}</Pill> : null}
            </div>

            <motion.h1 className="h1" variants={fadeUp} custom={1}>
              Profile
              <span style={{ display: "block", color: "#6ad9ff" }}>
                manage your account
              </span>
            </motion.h1>

            <motion.p className="sub" variants={fadeUp} custom={2} style={{ maxWidth: 820, marginBottom: 24 }}>
              View your details, check previous outputs, or delete account.
            </motion.p>

            {/* Header mini card */}
            <motion.div
              variants={fadeUp}
              custom={3}
              className="featureCard"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 18,
                padding: 16,
                display: "flex",
                gap: 14,
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <div
  style={{
    width: 56,
    height: 56,
    borderRadius: 18,
    position: "relative",
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.14)",
    background:
      "radial-gradient(120% 120% at 20% 10%, rgba(106,217,255,0.28) 0%, rgba(140,90,255,0.18) 45%, rgba(255,255,255,0.04) 100%)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
    display: "grid",
    placeItems: "center",
  }}
>
  {photo ? (
    <img
      src={photo}
      alt="avatar"
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  ) : (
    <>
      {/* soft inner highlight */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(80% 80% at 30% 25%, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 60%)",
        }}
      />

      {/* Initial badge */}
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 12,
          background: "rgba(0,0,0,0.25)",
          border: "1px solid rgba(255,255,255,0.12)",
          display: "grid",
          placeItems: "center",
          color: "rgba(255,255,255,0.92)",
          fontWeight: 950,
          fontSize: 16,
          letterSpacing: 0.5,
          textTransform: "uppercase",
        }}
      >
        {(safeName || "U").slice(0, 1)}
      </div>
    </>
  )}
</div>


  <div
  style={{
    flex: 1,
    minWidth: 220,
    cursor: "pointer",
    padding: "6px 8px",
    borderRadius: 10,
    transition: "all 0.18s ease",
  }}
  onClick={() => setMode("details")}
  onMouseEnter={(e) => {
    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = "transparent";
  }}
>
  <div style={{ fontWeight: 950, fontSize: 16 }}>
    {safeName}
  </div>

  <div
    style={{
      marginTop: 4,
      color: "#6ad9ff",
      fontSize: 13,
      textDecoration: "underline",
      textUnderlineOffset: 3,
      fontWeight: 800,
    }}
  >
    {safeEmail || "No email available"}
  </div>
</div>


              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
                <button
                  className="pill"
                  onClick={() => setMode("details")}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    color: "white",
                    cursor: "pointer",
                    fontWeight: 900,
                  }}
                >
                  View details
                </button>

                <PrimaryButton onClick={() => navigate("/output")}>
                  Previous outputs
                </PrimaryButton>
              </div>
            </motion.div>


            {/* MENU / DETAILS */}
            {mode === "menu" ? (
              <motion.div variants={fadeUp} custom={4} style={{ display: "grid", gap: 14 }}>
                <div className="heroGrid" style={{ alignItems: "start" }}>
                  <ActionCard
                    title="Your Details"
                    pill="Info"
                    accent="blue"
                    desc="See your name, email, UID, and account metadata."
                    onClick={() => setMode("details")}
                  />

                  <ActionCard
                    title="Previous Outputs"
                    pill="History"
                    accent="green"
                    desc="View your published outputs (timestamped links)."
                    to="/output"
                  />

                  <ActionCard
                    title="delete account"
                    pill={signingOut ? "Signing out…" : "Logout"}
                    accent="red"
                    desc="delete account from this browser and return to the landing page."
                    onClick={handleSignOutClick}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div variants={fadeUp} custom={4} style={{ display: "grid", gap: 12 }}>
                <div
                  style={{
                    padding: 16,
                    borderRadius: 18,
                    background: "rgba(0,0,0,0.25)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div style={{ fontWeight: 950, fontSize: 16, marginBottom: 10 }}>Account details</div>

                  <div style={{ display: "grid", gap: 10 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        padding: "10px 12px",
                        borderRadius: 14,
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.07)",
                      }}
                    >
                      <div style={{ fontWeight: 900, color: "rgba(255,255,255,0.85)" }}>UID</div>
                      <div style={{ color: "rgba(255,255,255,0.65)", textAlign: "right" }}>
                        {user?.uid || "—"}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        padding: "10px 12px",
                        borderRadius: 14,
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.07)",
                      }}
                    >
                      <div style={{ fontWeight: 900, color: "rgba(255,255,255,0.85)" }}>Email verified</div>
                      <div style={{ color: "rgba(255,255,255,0.65)", textAlign: "right" }}>
                        {user?.emailVerified ? "Yes" : "No"}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        padding: "10px 12px",
                        borderRadius: 14,
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.07)",
                      }}
                    >
                      <div style={{ fontWeight: 900, color: "rgba(255,255,255,0.85)" }}>Provider</div>
                      <div style={{ color: "rgba(255,255,255,0.65)", textAlign: "right" }}>
                        {(user?.providerData?.[0]?.providerId || "—").replace(".com", "")}
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
                  <button
                    className="pill"
                    onClick={() => setMode("menu")}
                    style={{
                      padding: "12px 14px",
                      borderRadius: 12,
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.10)",
                      color: "white",
                      cursor: "pointer",
                      fontWeight: 900,
                      minWidth: 110,
                    }}
                  >
                    Back
                  </button>

                  <button
                    className="pill"
                    onClick={handleSignOutClick}
                    disabled={signingOut}
                    style={{
                      padding: "12px 14px",
                      borderRadius: 12,
                      background: "rgba(255,70,90,0.10)",
                      border: "1px solid rgba(255,70,90,0.25)",
                      color: "white",
                      cursor: signingOut ? "not-allowed" : "pointer",
                      fontWeight: 950,
                      minWidth: 130,
                      opacity: signingOut ? 0.75 : 1,
                    }}
                  >
                    {signingOut ? "Signing out…" : "delete account"}
                  </button>
                </div>
              </motion.div>
            )}

            <footer className="footer" style={{ textAlign: "center", marginTop: 40 }}>
              Built for combinatorial innovation • 2026 • v1.0.4
            </footer>
          </motion.div>
        </main>

                    {showSignOutConfirm && (
  <div style={{
    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', 
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
  }}>
    <div style={{
      backgroundColor: '#000', color: '#fff', padding: '30px', 
      borderRadius: '16px', border: '1px solid #333', textAlign: 'center', maxWidth: '350px'
    }}>
      <p style={{ marginBottom: '20px', fontWeight: 'bold' }}>Are you sure you want to delete account?</p>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          onClick={() => setShowSignOutConfirm(false)}
          style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #444', background: 'transparent', color: '#fff', cursor: 'pointer' }}
        >
          Cancel
        </button>
        <button 
          onClick={confirmSignOut}
          style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: '#ff465a', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
        >
          delete account
        </button>
      </div>
    </div>
  </div>
)}
      </div>
    </div>

    
  );
}
