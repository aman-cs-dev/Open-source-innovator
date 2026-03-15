import { useEffect, useState } from "react";
import Navbar from "./components/Navbar_Login";
import { getRecentOutputs, clearRecentOutputs } from "./recentOutputs";

export default function OutputPage() {
  const [outputs, setOutputs] = useState([]);

  useEffect(() => {
    // Load data on mount
    setOutputs(getRecentOutputs());

    // Listen for updates while the page is open
    const handleUpdate = () => setOutputs(getRecentOutputs());
    window.addEventListener("recent_outputs_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("recent_outputs_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return (
    <div className="bg">
      <div className="layer">
        <Navbar />
        <main className="container hero">
          <div className="card" style={{ padding: "clamp(20px, 5vw, 40px)", minHeight: "300px" }}>
            <div style={{ fontWeight: 950, fontSize: 24, marginBottom: 8 }}>
              Previous outputs
            </div>
            <div style={{ color: "rgba(255,255,255,0.5)", marginBottom: 24, fontSize: 14 }}>
              Last 10 published outputs stored on this device.
            </div>

            {outputs.length === 0 ? (
              /* EMPTY STATE */
              <div style={{ 
                padding: "40px", 
                textAlign: "center", 
                border: "1px dashed rgba(255,255,255,0.1)", 
                borderRadius: 20 
              }}>
                <div style={{ color: "rgba(255,255,255,0.4)", fontWeight: 700 }}>
                  No recent outputs.
                </div>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", marginTop: 4 }}>
                  Start a new session to see history here.
                </p>
              </div>
            ) : (
              /* LIST STATE */
              <div style={{ display: "grid", gap: 10 }}>
                {outputs.map((o) => {
                  const d = new Date(o.created_at);
                  const label = d.toLocaleString(undefined, {
                    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                  });

                  return (
                    <div key={o.id} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "14px 18px", borderRadius: 14,
                      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)"
                    }}>
                      <div>
                        <div style={{ fontWeight: 850, color: "white" }}>{label}</div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{o.input_preview}</div>
                      </div>
                      <button
                        className="pill"
                        onClick={() => window.open(o.osf_url, "_blank")}
                        style={{ padding: "8px 14px", cursor: "pointer", fontWeight: 900 }}
                      >
                        View →
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {outputs.length > 0 && (
              <div style={{ marginTop: 20, textAlign: "right" }}>
                <button 
                  onClick={() => confirm("Clear all history?") && clearRecentOutputs()}
                  style={{ background: "none", border: "none", color: "rgba(255,100,100,0.5)", cursor: "pointer", fontSize: 12, fontWeight: 800 }}
                >
                  Clear History
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}