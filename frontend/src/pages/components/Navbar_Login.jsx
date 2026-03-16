// src/pages/components/Navbar_Login.jsx
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthUser } from "../../firebase/useAuthUser";
import { getAuth, signOut } from "firebase/auth";
import { useEffect, useRef, useState } from "react";

export default function Navbar_Login() {

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const { user } = useAuthUser();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onDown = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, []);

const doSignOut = async () => {
  try {
    setSigningOut(true);

    // Clear any local storage you might use
    localStorage.clear();
    sessionStorage.clear();

    // Sign out Firebase
    await signOut(getAuth());

    // Close everything + go home
    setOpen(false);
    setConfirmOpen(false);
    navigate("/", { replace: true });
  } catch (e) {
    console.error(e);
    alert("Sign out failed (check console).");
  } finally {
    setSigningOut(false);
  }
};


  const initials = (user?.displayName || user?.email || "U").slice(0, 1).toUpperCase();
  const photo = user?.photoURL;

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(10px)",
        background: "rgba(8,10,16,0.55)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="container" style={{ padding: "14px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* LEFT BRAND */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 12,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.10)",
              display: "grid",
              placeItems: "center",
              fontWeight: 950,
            }}
          >
            OI
          </div>
          <div style={{ lineHeight: 1.1 }}>
            <div style={{ fontWeight: 900, fontSize: 14, color: "rgba(255,255,255,0.9)" }}>Open Innovation</div>
            <div style={{ fontWeight: 950, fontSize: 16 }}>Prior-Art Generator</div>
          </div>
        </div>

        {/* RIGHT LINKS */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <NavItem to="/combinations">Combinations</NavItem>
          <NavItem to="/about">About</NavItem>
          <NavItem to="/how">How to use</NavItem>
          <NavItem to="/privacy">Privacy Policy</NavItem>

          {/* PROFILE DROPDOWN */}
          <div ref={menuRef} style={{ position: "relative" }}>
            <button
              onClick={() => setOpen((v) => !v)}
              className="pill"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 10px",
                borderRadius: 14,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.10)",
                color: "white",
                cursor: "pointer",
                fontWeight: 900,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 10,
                  overflow: "hidden",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  display: "grid",
                  placeItems: "center",
                  fontWeight: 950,
                }}
              >
                {photo ? (
                  <img src={photo} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  initials
                )}
              </div>
              <span style={{ opacity: 0.9 }}>Profile</span>
              <span style={{ opacity: 0.6 }}>▾</span>
            </button>

{open && (
  <div
    style={{
      position: "absolute",
      right: 0,
      marginTop: 10,
      width: 260,
      borderRadius: 16,
      background: "rgba(12,14,20,0.92)",
      border: "1px solid rgba(255,255,255,0.10)",
      boxShadow: "0 22px 70px rgba(0,0,0,0.55)",
      overflow: "hidden",
    }}
  >
    <div style={{ padding: 14, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
      <button
        onClick={() => {
          setOpen(false);
          navigate("/profile?view=details");
        }}
        style={{
          width: "100%",
          background: "transparent",
          border: "none",
          padding: 0,
          textAlign: "left",
          cursor: "pointer",
        }}
      >
        <div style={{ fontWeight: 950, fontSize: 13, color: "rgba(255,255,255,0.9)" }}>
          {user?.displayName || "Account"}
        </div>

        <div
          style={{
            marginTop: 4,
            fontSize: 12,
            color: "#6ad9ff",
            fontWeight: 900,
            textDecoration: "underline",
            textUnderlineOffset: 3,
          }}
        >
          {user?.email || "—"}
        </div>
      </button>
    </div>

    <MenuBtn
      label="Account details"
      onClick={() => {
        setOpen(false);
        navigate("/profile?view=details");
      }}
    />

    <MenuBtn
    label="Previous outputs"
    onClick={() => {
    setOpen(false);
    navigate("/history"); // Changed to /history
      }}
    />

    <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }} />
    <MenuBtn
  label="Delete account"
  danger
  onClick={() => {
    setOpen(false);        // close dropdown
    setConfirmOpen(true);  // open modal
  }}
/>
  </div>
)}

          </div>
        </div>
         </div>

      {/* SIGN OUT CONFIRM MODAL */}
      {confirmOpen && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 9999,
      background: "rgba(0,0,0,0.62)",
      backdropFilter: "blur(8px)",
      display: "grid",
      placeItems: "center",
      padding: 16,
    }}
    onMouseDown={(e) => {
      if (e.target === e.currentTarget) setConfirmOpen(false);
    }}
  >
    <div
      style={{
        width: "min(560px, 100%)",
        borderRadius: 22,
        background:
          "radial-gradient(120% 120% at 20% 10%, rgba(106,217,255,0.12) 0%, rgba(140,90,255,0.10) 45%, rgba(255,255,255,0.03) 100%)",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "0 22px 80px rgba(0,0,0,0.62)",
        overflow: "hidden",
        position: "relative",
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* soft inner highlight */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(80% 80% at 30% 20%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 60%)",
        }}
      />

      {/* HEADER */}
      <div
        style={{
          padding: "18px 18px 12px 18px",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
          position: "relative",
        }}
      >
        <div style={{ display: "grid", gap: 6 }}>
          <div style={{ fontWeight: 950, fontSize: 18, color: "rgba(255,255,255,0.92)" }}>
            Delete Account?
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.62)", lineHeight: 1.55 }}>
            Are you sure you want to remove your account? You can click <strong>Cancel</strong> to stay signed in.
          </div>
        </div>

        {/* X button */}
        <button
          type="button"
          aria-label="Close"
          onClick={() => setConfirmOpen(false)}
          disabled={signingOut}
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            display: "grid",
            placeItems: "center",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.10)",
            color: "rgba(255,255,255,0.92)",
            cursor: signingOut ? "not-allowed" : "pointer",
            fontWeight: 900,
            lineHeight: 1,
            opacity: signingOut ? 0.7 : 1,
          }}
          title="Close"
        >
          <span style={{ fontSize: 18, transform: "translateY(-1px)" }}>×</span>
        </button>
      </div>

      {/* BODY */}
      <div style={{ padding: "0 18px 16px 18px" }}>
        <div
          style={{
            padding: 14,
            borderRadius: 16,
            background: "rgba(0,0,0,0.22)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.72)",
            fontSize: 13,
            lineHeight: 1.6,
          }}
        >
          Your account will be permanently deleted from this browser session.
          <div style={{ marginTop: 8, color: "rgba(255,255,255,0.55)", fontSize: 12 }}>
            Signed in as <span style={{ color: "#6ad9ff", fontWeight: 900 }}>{user?.email || "—"}</span>
          </div>
        </div>
      </div>

      {/* FOOTER BUTTONS */}
      <div
        style={{
          padding: 18,
          borderTop: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          justifyContent: "flex-end",
          gap: 10,
          flexWrap: "wrap",
          position: "relative",
        }}
      >
        <button
          type="button"
          className="pill"
          onClick={() => setConfirmOpen(false)}
          disabled={signingOut}
          style={{
            padding: "12px 14px",
            borderRadius: 12,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.10)",
            color: "white",
            cursor: signingOut ? "not-allowed" : "pointer",
            fontWeight: 900,
            minWidth: 120,
            opacity: signingOut ? 0.7 : 1,
          }}
        >
          Cancel
        </button>

        <button
          type="button"
          className="pill"
          onClick={doSignOut}
          disabled={signingOut}
          style={{
            padding: "12px 14px",
            borderRadius: 12,
            background: "rgba(255,70,90,0.14)",
            border: "1px solid rgba(255,70,90,0.35)",
            color: "white",
            cursor: signingOut ? "not-allowed" : "pointer",
            fontWeight: 950,
            minWidth: 140,
            opacity: signingOut ? 0.7 : 1,
          }}
        >
          {signingOut ? "Deleting account…" : "Delete Account"}
        </button>
      </div>
    </div>
  </div>
  
)}
        </div>
      )}

  


function NavItem({ to, children }) {
  const location = useLocation();
  const active = location.pathname === to;

  const base = {
    textDecoration: "none",
    fontWeight: 800,
    fontSize: 14,
    padding: "8px 12px",
    borderRadius: 10,
    display: "inline-flex",
    alignItems: "center",
    cursor: "pointer",
    userSelect: "none",
    transition: "all 0.18s ease",
  };

  const activeStyle = active
    ? {
        color: "#6ad9ff",
        background: "rgba(106,217,255,0.12)",
        border: "1px solid rgba(106,217,255,0.35)",
        boxShadow: "0 0 0 1px rgba(106,217,255,0.08)",
      }
    : {
        color: "rgba(255,255,255,0.85)",
        background: "transparent",
        border: "1px solid transparent",
        boxShadow: "none",
      };

  return (
    <Link
      to={to}
      style={{ ...base, ...activeStyle }}
      onMouseEnter={(e) => {
        if (active) return;
        e.currentTarget.style.color = "#6ad9ff";
        e.currentTarget.style.background = "rgba(255,255,255,0.06)";
        e.currentTarget.style.border = "1px solid rgba(255,255,255,0.10)";
        e.currentTarget.style.boxShadow =
          "0 0 0 1px rgba(106,217,255,0.12), 0 10px 28px rgba(0,0,0,0.25)";
      }}
      onMouseLeave={(e) => {
        if (active) return;
        e.currentTarget.style.color = "rgba(255,255,255,0.85)";
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.border = "1px solid transparent";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "scale(1)";
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = "scale(0.96)";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {children}
    </Link>
  );
}


function MenuBtn({ label, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        textAlign: "left",
        padding: "12px 14px",
        background: "transparent",
        border: "none",
        // Only this line changes the color based on 'danger'
        color: danger ? "#ff465a" : "white", 
        cursor: "pointer",
        fontWeight: 900,
        fontSize: 13,
      }}
    >
      {label}
    </button>
  );
}
