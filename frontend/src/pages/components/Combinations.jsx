import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar_Login";
import PrimaryButton from "./PrimaryButton";

import { addRecentOutput } from "../recentOutputs";


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


function GenerateModal({
  open,
  onClose,
  onGenerate,
  itemsCount,
  osfUrl,
  itemsPreview,
  downloadCsv,
  defaultK = 2,
  defaultWeightStep = 1,
  generating,
   osfStatus,
   osfMsg,

  // NEW:
  results,          // array of combinations from backend
  generatedAt,      // optional string timestamp
  onResetResults,   // clears results so modal returns to input mode
}) {
  const [k, setK] = useState(defaultK);
  const [weightStep, setWeightStep] = useState(defaultWeightStep);
  const [err, setErr] = useState("");



  // Reset inputs when opened (only when NOT showing results)
  useEffect(() => {
    if (open && (!results || results.length === 0)) {
      setK(defaultK);
      setWeightStep(defaultWeightStep);
      setErr("");
    }
  }, [open, defaultK, defaultWeightStep, results]);

  const validate = (nextK) => {
    if (!Number.isFinite(nextK) || !Number.isInteger(nextK)) return "Please enter a whole number.";
    if (nextK < 1) return "K must be at least 1.";
    if (nextK > itemsCount) return `K cannot be greater than your item count (${itemsCount}).`;
    return "";
  };

  const onChangeK = (val) => {
    const next = Number(val);
    setK(next);
    setErr(validate(next));
  };

  const onClickGenerate = () => {
    const e = validate(k);
    setErr(e);
    if (e) return;
    onGenerate({ size: k, weight_step: weightStep });
  };

  if (!open) return null;

  const showResults = Array.isArray(results) && results.length > 0;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(6px)",
        display: "grid",
        placeItems: "center",
        padding: 14,
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          // if results view, closing should also reset (optional)
          onClose();
        }
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.98 }}
        transition={{ duration: 0.22, ease: [0.215, 0.61, 0.355, 1] }}
        style={{
          width: "min(920px, 100%)",
          borderRadius: 22,
          background: "rgba(12,14,20,0.82)",
          border: "1px solid rgba(255,255,255,0.10)",
          boxShadow: "0 22px 80px rgba(0,0,0,0.55)",
          overflow: "hidden",
          maxHeight: "min(86vh, 880px)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* HEADER */}
        <div style={{ padding: "18px 18px 0 18px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div>
              <div style={{ fontWeight: 950, fontSize: 18 }}>
                {showResults ? "Generated combinations" : "Generate combinations"}
              </div>
              <div style={{ color: "rgba(255,255,255,0.60)", fontSize: 13, marginTop: 6, lineHeight: 1.5 }}>
                {showResults ? (
                  <>
                    Generated <strong>{results.length}</strong> combinations
                    {generatedAt ? <> • <span style={{ opacity: 0.9 }}>{generatedAt}</span></> : null}
                  </>
                ) : (
                  <>
                    You added <strong>{itemsCount}</strong> items. Choose how many elements should be in each subset (K).
                  </>
                )}
              </div>
            </div>

            <button
  type="button"
  aria-label="Close"
  onClick={() => {
    onResetResults?.();
    onClose();
  }}
  style={{
    width: 38,
    height: 38,
    borderRadius: 12,
    display: "grid",
    placeItems: "center",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    color: "rgba(255,255,255,0.92)",
    cursor: "pointer",
    fontWeight: 900,
    lineHeight: 1,
    userSelect: "none",
  }}
  onMouseDown={(e) => e.stopPropagation()}
  title="Close"
>
  <span style={{ fontSize: 18, transform: "translateY(-1px)" }}>×</span>
</button>

          </div>

          {!showResults && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
              <div
                className="pill"
                style={{
                  padding: "6px 10px",
                  borderRadius: 999,
                  background: "rgba(106,217,255,0.12)",
                  border: "1px solid rgba(106,217,255,0.30)",
                  color: "rgba(255,255,255,0.90)",
                  fontSize: 12,
                  fontWeight: 900,
                }}
              >
                Items: {itemsCount}
              </div>
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
                }}
              >
                Valid K: 1–{itemsCount}
              </div>
            </div>
          )}
        </div>

        {/* BODY */}
        <div style={{ padding: 18, display: "grid", gap: 14, overflow: "auto" }}>
          {/* Preview / context */}
          <div
            style={{
              padding: 14,
              borderRadius: 16,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div style={{ fontWeight: 900, fontSize: 13, marginBottom: 8 }}>
              {showResults ? "Input items" : "Preview"}
            </div>
            <div style={{ color: "rgba(255,255,255,0.70)", fontSize: 13, lineHeight: 1.6 }}>
              {itemsPreview}
            </div>
          </div>

          {!showResults ? (
            // INPUT VIEW
            <div style={{ display: "grid", gap: 10 }}>
              <div style={{ display: "grid", gap: 6 }}>
                <div style={{ fontWeight: 900, fontSize: 13 }}>How many elements per subset? (K)</div>
                <input
                  type="number"
                  min={1}
                  max={itemsCount}
                  value={Number.isFinite(k) ? k : ""}
                  onChange={(e) => onChangeK(e.target.value)}
                  className="pill"
                  style={{
                    padding: "12px",
                    borderRadius: 14,
                    background: "rgba(255,255,255,0.05)",
                    border: err ? "1px solid rgba(255,70,90,0.35)" : "1px solid rgba(255,255,255,0.12)",
                    color: "white",
                  }}
                  placeholder={`Enter a number (1–${itemsCount})`}
                />
                {err ? (
                  <div style={{ color: "rgba(255,120,130,0.95)", fontSize: 12, fontWeight: 800 }}>
                    {err}
                  </div>
                ) : (
                  <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}>
                    Example: If K=3 and you have 5 items, you’ll get all 3-item combinations.
                  </div>
                )}
              </div>

              


              <div style={{ display: "grid", gap: 6 }}>
                <div style={{ fontWeight: 900, fontSize: 13 }}>Weight step (optional)</div>
                <input
                  type="number"
                  min={1}
                  value={Number.isFinite(weightStep) ? weightStep : ""}
                  onChange={(e) => setWeightStep(Number(e.target.value))}
                  className="pill"
                  style={{
                    padding: "12px",
                    borderRadius: 14,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "white",
                  }}
                  placeholder="1"
                />
              </div>
            </div>
          ) : (
            // RESULTS VIEW
            <div
              style={{
                padding: 12,
                borderRadius: 16,
                background: "rgba(0,0,0,0.25)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div style={{ fontWeight: 900, fontSize: 13, marginBottom: 10 }}>
                Results
              </div>

              <div style={{ display: "grid", gap: 8 }}>
                {results.slice(0, 200).map((r, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 10,
                      padding: "10px 12px",
                      borderRadius: 12,
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.9)", fontWeight: 800 }}>
                      #{r.compound_number ?? idx + 1}
                    </div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", flex: 1, textAlign: "right" }}>
                      {(r.materials || []).join(" • ")}
                    </div>
                  </div>
                ))}

                {results.length > 200 && (
                  <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, padding: "6px 4px" }}>
                    Showing first 200 results. (You can add pagination/download next.)
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER ACTIONS */}
        <div
          style={{
            padding: 18,
            borderTop: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            gap: 10,
            justifyContent: "flex-end",
            flexWrap: "wrap",
          }}
        >
          {/* OSF status banner (shows in both input + results) */}
{osfStatus !== "idle" && (
  <button
    type="button"
    className="pill"
    onClick={(e) => {
      e.stopPropagation();
      if (osfUrl) window.open(osfUrl, "_blank", "noopener,noreferrer");
    }}
    style={{
      padding: "10px 12px",
      borderRadius: 12,
      background:
        osfStatus === "success"
          ? "rgba(60,255,140,0.10)"
          : osfStatus === "error"
          ? "rgba(255,70,90,0.10)"
          : "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.10)",
      color: "rgba(255,255,255,0.92)",
      fontSize: 12,
      fontWeight: 900,
      cursor: osfUrl ? "pointer" : "not-allowed",
      whiteSpace: "nowrap",
    }}
    disabled={!osfUrl}
    title={osfUrl ? "Open in OSF" : "No OSF link available"}
  >
    {osfMsg}
  </button>
)}


          {!showResults ? (
            <>
              <button
                type="button"
                className="pill"
                onClick={onClose}
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
                type="button"
                className="pill"
                onClick={onClickGenerate}
                disabled={generating || !!err || itemsCount === 0}
                style={{
                  padding: "12px 14px",
                  borderRadius: 12,
                  background: "rgba(106,217,255,0.16)",
                  border: "1px solid rgba(106,217,255,0.35)",
                  color: "white",
                  cursor: generating ? "not-allowed" : "pointer",
                  fontWeight: 950,
                  minWidth: 190,
                  opacity: generating ? 0.75 : 1,
                }}
              >
                {generating ? "Generating…" : "Generate combinations"}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="pill"
                onClick={() => onResetResults?.()}
                style={{
                  padding: "12px 14px",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: 900,
                  minWidth: 150,
                }}
              >
                Go Back
              </button>

              <button
  type="button"
  className="pill"
  onClick={downloadCsv}
  style={{
    padding: "12px 14px",
    borderRadius: 12,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    color: "white",
    cursor: "pointer",
    fontWeight: 950,
    minWidth: 160,
  }}
>
  Download CSV
</button>


              <button
                type="button"
                className="pill"
                onClick={() => {
                  onResetResults?.();
                  onClose();
                }}
                style={{
                  padding: "12px 14px",
                  borderRadius: 12,
                  background: "rgba(106,217,255,0.16)",
                  border: "1px solid rgba(106,217,255,0.35)",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: 950,
                  minWidth: 110,
                }}
              >
                Done
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}


export default function Submit() {

 


  const [comboResults, setComboResults] = useState([]);
  const [osfUrl, setOsfUrl] = useState("https://osf.io/rcusy/files/osfstorage");
  const [lastK, setLastK] = useState(0);
  const [generatedAt, setGeneratedAt] = useState("");  
  const [modalOpen, setModalOpen] = useState(false);
  const [generating, setGenerating] = useState(false);  
  const [current, setCurrent] = useState("");
  const [items, setItems] = useState([]);
  const [osfStatus, setOsfStatus] = useState("idle"); // idle | uploading | success | error
  const [osfMsg, setOsfMsg] = useState("");


  const cleanedItems = useMemo(() => items.map((x) => x.trim()).filter(Boolean), [items]);

  const downloadCsv = async () => {
  try {
    const { blob, filename } = await createCsvBlob();

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = filename;

    document.body.appendChild(a);
    a.click();

    a.remove();
    URL.revokeObjectURL(url);

  } catch (e) {
    console.error(e);
    alert("Failed to download CSV (check console).");
  }
};


const createCsvBlob = async ({ combos, size, generatedAt } = {}) => {
  const useCombos = combos ?? comboResults;
  const useSize = size ?? lastK;
  const useTs = generatedAt ?? generatedAt;

  if (!Array.isArray(useCombos) || useCombos.length === 0) {
    throw new Error("No combinations to export.");
  }

  const combinationsAsStrings = useCombos.map((r, idx) => {
    if (typeof r === "string") return r;
    const n = r?.compound_number ?? (idx + 1);
    const mats = (r?.materials || []).join(" | ");
    return `${n}: ${mats}`;
  });

  const payload = {
    items: cleanedItems,
    size: useSize,
    combinations: combinationsAsStrings,
    combos: `generated_at=${useTs || ""}`,
  };

  const res = await fetch("https://generatingcombinations-production.up.railway.app/create-csv", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(await res.text());

  const cd = res.headers.get("Content-Disposition") || "";
  const match = cd.match(/filename="([^"]+)"/);
  const filename = match?.[1] ?? "combinations.csv";

  const blob = await res.blob();
  return { blob, filename };
};



const generateCombos = async ({ size, weight_step }) => {
  setGenerating(true);
  setLastK(size);
  setOsfStatus("uploading");
  setOsfMsg("Generating and Uploading...");

  try {
    const res = await fetch("https://generatingcombinations-production.up.railway.app/generate-combinations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cleanedItems, size, weight_step }),
    });

    if (!res.ok) throw new Error(await res.text());

    const data = await res.json();
    const combos = data.combinations || [];
    const ts = data.generated_at || "";
    const newOsfUrl = data.osf_file_page_url || data.osf_url;

    // Update all states at once
    setComboResults(combos);
    setGeneratedAt(ts);
    if (newOsfUrl) setOsfUrl(newOsfUrl);
    
    setOsfStatus("success");
    setOsfMsg("Saved to OSF");

    // Log to recent outputs
    addRecentOutput({
      osf_url: newOsfUrl,
      created_at: ts || new Date().toISOString(),
      k_value: size,
      item_count: cleanedItems.length,
      input_preview: cleanedItems.slice(0, 5).join(", ") + (cleanedItems.length > 5 ? "..." : ""),
    });

  } catch (e) {
    console.error(e);
    setOsfStatus("error");
    setOsfMsg("Upload failed");
    alert("Failed to generate combinations.");
  } finally {
    setGenerating(false);
  }
};

// You can safely remove the old uploadToOsf function entirely 
// as its logic is now inside generateCombos.



  const addItem = () => {
    const v = current.trim();
    if (!v) return;

    // prevent exact duplicates (case-insensitive)
    const exists = cleanedItems.some((x) => x.toLowerCase() === v.toLowerCase());
    if (exists) {
      setCurrent("");
      return;
    }

    setItems((prev) => [...prev, v]);
    setCurrent("");
  };

  const removeItem = (idx) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const clearAll = () => {
    setItems([]);
    setCurrent("");
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem();
    }
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
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
              <div className="pill">Input • One per line</div>
              <div className="pill">Timestamp-ready</div>
              <div className="pill">Open innovation</div>
            </div>

            <motion.h1 className="h1" variants={fadeUp} custom={1}>
              Add your materials concepts
              <span style={{ display: "block", color: "#6ad9ff" }}>
                one at a time
              </span>
            </motion.h1>

            <motion.p className="sub" variants={fadeUp} custom={2} style={{ maxWidth: 820, marginBottom: 24 }}>
              Enter items like polymers, additives, chemicals, or concepts. Press <strong>Enter</strong> after each one.
              We’ll store your list and use it to generate combinatorial innovations with time-date stamps for prior art.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="heroGrid" style={{ alignItems: "start" }}>
              {/* LEFT: instructions / context */}
              <div style={{ display: "grid", gap: 16 }}>
                <div className="featureCard" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div style={{ fontWeight: 900, marginBottom: 10, fontSize: 16 }}>Examples</div>
                  <div style={{ color: "rgba(255,255,255,0.70)", lineHeight: 1.7, fontSize: 14 }}>
                    <p>• PLA</p>
                    <p>• Graphene</p>
                    <p>• Silica</p>
                    <p>• PETG</p>
                    <div style={{ marginTop: 12, fontSize: 13, opacity: 0.8, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 12 }}>
                      Tip: keep each entry short and specific.
                    </div>
                  </div>
                </div>

                <div className="featureCard" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div style={{ fontWeight: 900, marginBottom: 10, fontSize: 16 }}>Why we collect this</div>
                  <div style={{ color: "rgba(255,255,255,0.70)", lineHeight: 1.7, fontSize: 14 }}>
                    You’re helping create a public, timestamped record of “obvious” combinations so future innovation stays open.
                  </div>
                </div>
              </div>

              {/* RIGHT: input + list */}
              <div
                className="card authBox"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontWeight: 900, fontSize: 18 }}>Your list</div>
                  <div style={{ marginTop: 4, color: "rgba(255,255,255,0.55)", fontSize: 13 }}>
                    Press Enter to add. We’ll store everything you add below.
                  </div>
                </div>

                <div style={{ display: "grid", gap: 10 }}>
                  <div style={{ display: "flex", gap: 10 }}>
                    <input
                      value={current}
                      onChange={(e) => setCurrent(e.target.value)}
                      onKeyDown={onKeyDown}
                      placeholder="Type one item… then press Enter"
                      className="pill"
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: 12,
                        background: "rgba(255,255,255,0.05)",
                        color: "white",
                      }}
                    />

                    <button
                      type="button"
                      className="pill"
                      onClick={addItem}
                      style={{
                        padding: "12px 14px",
                        borderRadius: 12,
                        background: "rgba(106,217,255,0.12)",
                        border: "1px solid rgba(106,217,255,0.35)",
                        color: "white",
                        cursor: "pointer",
                        fontWeight: 800,
                      }}
                    >
                      Add
                    </button>
                  </div>

                  <div
                    style={{
                      marginTop: 6,
                      padding: 12,
                      borderRadius: 14,
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "rgba(0,0,0,0.25)",
                      minHeight: 170,
                      maxHeight: 260,
                      overflow: "auto",
                    }}
                  >
                    {cleanedItems.length === 0 ? (
                      <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, lineHeight: 1.6 }}>
                        Nothing added yet. Add your first item above.
                      </div>
                    ) : (
                      <div style={{ display: "grid", gap: 8 }}>
                        {cleanedItems.map((x, idx) => (
                          <div
                            key={`${x}-${idx}`}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: 10,
                              padding: "10px 12px",
                              borderRadius: 12,
                              background: "rgba(255,255,255,0.04)",
                              border: "1px solid rgba(255,255,255,0.07)",
                            }}
                          >
                            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.9)" }}>
                              {idx + 1}. {x}
                            </div>

                            <button
                              type="button"
                              onClick={() => removeItem(idx)}
                              className="pill"
                              style={{
                                padding: "6px 10px",
                                borderRadius: 10,
                                background: "rgba(255,70,90,0.10)",
                                border: "1px solid rgba(255,70,90,0.25)",
                                color: "rgba(255,255,255,0.9)",
                                cursor: "pointer",
                                fontSize: 12,
                                fontWeight: 800,
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
                    <button
                      type="button"
                      className="pill"
                      onClick={clearAll}
                      style={{
                        padding: "12px",
                        borderRadius: 12,
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.10)",
                        color: "white",
                        cursor: "pointer",
                        fontWeight: 800,
                        flex: 1,
                      }}
                    >
                      Clear
                    </button>

                    <PrimaryButton
                      style={{ flex: 1 }}
                     onClick={() => {
                     if (cleanedItems.length === 0) return;
                     setComboResults([]);
                     setGeneratedAt("");
                     setModalOpen(true);
}}

                    >
                      Continue
                    </PrimaryButton>
                  </div>

                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", lineHeight: 1.5, marginTop: 4 }}>
                    Next step can generate all pairwise combinations and publish with a timestamp (e.g., OSF).
                  </div>
                </div>
              </div>

<GenerateModal
  open={modalOpen}
  onClose={() => setModalOpen(false)}
  osfStatus={osfStatus}
  osfMsg={osfMsg}
  osfUrl={osfUrl}   // or osfUrl state
  onGenerate={generateCombos}
  itemsCount={cleanedItems.length}
  itemsPreview={cleanedItems.slice(0, 10).join(", ") + (cleanedItems.length > 10 ? " …" : "")}
  defaultK={Math.min(3, Math.max(1, cleanedItems.length))}
  defaultWeightStep={1}
  generating={generating}
  downloadCsv={downloadCsv}
  results={comboResults}
  generatedAt={generatedAt}
  onResetResults={() => {
    setComboResults([]);
    setGeneratedAt("");
  }}
/>

{/* Change 'showResults' to 'comboResults.length > 0' */}
{osfStatus === "success" && !!osfUrl && comboResults.length > 0 && (
  <button
    type="button"
    className="pill"
    onClick={(e) => {
      e.stopPropagation();
      window.open(osfUrl, "_blank", "noopener,noreferrer");
    }}
    style={{ marginTop: '10px' }} // Added a little styling help
  >
    View on OSF
  </button>
)}



            </motion.div>
          </motion.div>

          <footer className="footer" style={{ textAlign: "center", marginTop: 40 }}>
            Built for combinatorial innovation • 2026 • v1.0.4
          </footer>
        </main>
      </div>
    </div>

    
  );
}
