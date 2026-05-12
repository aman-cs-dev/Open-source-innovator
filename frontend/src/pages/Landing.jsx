import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "../firebase/useAuthUser"; // adjust path to where your hook is

import { motion, time } from "framer-motion";


import Navbar from "./components/Landing_Navbar.jsx";
import PrimaryButton from "./components/PrimaryButton";

import { signInWithGoogle, signInWithMicrosoft } from "../firebase/firebase.jsx";



const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.05 * i, duration: 0.6, ease: [0.215, 0.61, 0.355, 1] },
  }),
};

export default function Landing() {
  const navigate = useNavigate();

 
  const { user, loading } = useAuthUser();

  const [manual_user, setManualUser] = useState(null);
  const [is_manual, set_is_manual] = useState(false);

  useEffect(() => {
  
    const saved_user = localStorage.getItem("user");
    
    if(!loading) {
    if (user ||saved_user) {
      if(saved_user) {
      const parsedUser = JSON.parse(saved_user);
      setManualUser(parsedUser);
      set_is_manual(parsedUser.is_manual || false);
      }
      navigate("/combinations", { replace: true });
    
    }
   }
  }, [user, loading, navigate]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogle = async () => {
    try {
      
      // removes any previous user first
      localStorage.removeItem("user");
      const result = await signInWithGoogle();
      console.log("Google user:", result.user);
      navigate("/combinations"); // <-- redirect
    } catch (err) {
      console.error("Google login error:", err);
      alert(err?.message || "Google login failed");
    }
  };

  const handleMicrosoft = async () => {
    try {

      // removes any previous user first
      localStorage.removeItem("user");
      const result = await signInWithMicrosoft();
      console.log("Microsoft user:", result.user);
      navigate("/combinations"); // <-- redirect
    } catch (err) {
      console.error("Microsoft login error:", err);
      alert(err?.message || "Microsoft login failed");
    }
  };

  const handleManualLogin = async () => {

    
   try {
      
       if(!email || !password || !firstName || !lastName) {
        alert("Please fill all the required sections!");
        return;
       }

        const manual_user = {
        firstName,
        lastName,
        email,
        password,
        is_manual: true,
       };

       localStorage.setItem("user", JSON.stringify(manual_user));
       setManualUser(manual_user);
       set_is_manual(true);
       navigate("/combinations");
       
   }  catch(err) {
    console.error("Error in manual login:", err);
   }

     
  
  }

  return (
    <div className="bg">
      <div className="layer">
        <Navbar />

        <main className="container hero">
          {/* Main Hero Section */}
          <motion.div
            className="card"
            style={{ padding: 'clamp(20px, 5vw, 40px)', textAlign: 'left' }}
            initial="hidden"
            animate="show"
            variants={fadeUp}
          >
            {/* Tagline Pills */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
              <div className="pill">Timestamped • Prior art • Open licensing</div>
              <div className="pill">Fast input • Safety limits</div>
              <div className="pill">University-hosting friendly</div>
            </div>

            <motion.h1 className="h1" variants={fadeUp} custom={1}>
              Turn your lists into
              <span style={{ display: "block", color: "#6ad9ff" }}>combinatorial innovation</span>
            </motion.h1>

            <motion.p className="sub" variants={fadeUp} custom={2} style={{ maxWidth: '800px', marginBottom: 32 }}>
              Paste materials, chemicals, or concepts. We generate combinations, publish outputs with
              time-date stamps, and keep results accessible so others can build on them responsibly.
            </motion.p>

            {/* The Main Content Grid */}
            <motion.div
              variants={fadeUp}
              custom={3}
              className="heroGrid"
              style={{ alignItems: "start" }}
            >
              {/* LEFT column: stacked info cards */}
              <div style={{ display: "grid", gap: 16 }}>
                <div className="featureCard" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div style={{ fontWeight: 900, marginBottom: 12, fontSize: 16 }}>What this tool does</div>
                  <div style={{ color: "rgba(255,255,255,0.70)", lineHeight: 1.6, fontSize: 14 }}>
                    <p>• Provide lists (e.g., polymers, fillers, additives).</p>
                    <p>• System generates valid combinatorial pairs.</p>
                    <p>• Outputs are timestamped to establish <strong>prior art</strong>.</p>
                    <div style={{ marginTop: 12, fontSize: 13, opacity: 0.8, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 12 }}>
                      Goal: Open-source innovation that is easy to share, cite, and reuse.
                    </div>
                  </div>
                </div>

                <div className="featureCard" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ fontWeight: 900 }}>Quick start</div>
                    <div className="pill">Steps</div>
                  </div>
                  <div style={{ display: "grid", gap: 8, fontSize: 14, color: "rgba(255,255,255,0.8)" }}>
                    <div><strong>1.</strong> Paste your lists</div>
                    <div><strong>2.</strong> Set safety limits</div>
                    <div><strong>3.</strong> Generate & Publish</div>
                  </div>
                  <div style={{
                    marginTop: 16,
                    padding: 12,
                    borderRadius: 12,
                    background: "rgba(0,0,0,0.3)",
                    fontFamily: "monospace",
                    fontSize: 11,
                    color: "#00ffa3"
                  }}>
                    &gt; 2026-01-05 • PLA + Graphene<br/>
                    &gt; 2026-01-05 • PETG + Silica
                  </div>
                </div>
              </div>

              {/* RIGHT column: signup form */}
              <div className="card authBox" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontWeight: 900, fontSize: 18 }}>Create your account</div>
                  <div style={{ marginTop: 4, color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
                    Join the open innovation network.
                  </div>
                </div>

                <div style={{ display: "grid", gap: 12 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <input 
                      value={firstName} 
                      onChange={(e) => setFirstName(e.target.value)} 
                      placeholder="First name"
                      className="pill" 
                      style={{ width: "100%", padding: "12px", borderRadius: 12, background: "rgba(255,255,255,0.05)", color: "white" }}
                    />
                    <input 
                      value={lastName} 
                      onChange={(e) => setLastName(e.target.value)} 
                      placeholder="Last name"
                      className="pill" 
                      style={{ width: "100%", padding: "12px", borderRadius: 12, background: "rgba(255,255,255,0.05)", color: "white" }}
                    />
                  </div>
                  <input 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="Email address" 
                    type="email"
                    className="pill"
                    style={{ width: "100%", padding: "12px", borderRadius: 12, background: "rgba(255,255,255,0.05)", color: "white" }}
                  />
                  <input 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Password" 
                    type="password"
                    className="pill"
                    style={{ width: "100%", padding: "12px", borderRadius: 12, background: "rgba(255,255,255,0.05)", color: "white" }}
                  />
                  
                  <PrimaryButton style={{ marginTop: 8 }} onClick={ handleManualLogin}>
                  Create account
                  </PrimaryButton>

                  <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "10px 0", color: "rgba(255,255,255,0.3)", fontSize: 11 }}>
                    <div style={{ height: 1, flex: 1, background: "rgba(255,255,255,0.1)" }} />
                    OR
                    <div style={{ height: 1, flex: 1, background: "rgba(255,255,255,0.1)" }} />
                  </div>

                  <div style={{ display: "grid", gap: 8 }}>
                    <button className="authOption" style={{ width: '100%', cursor: 'pointer' }} onClick={handleGoogle}> 
                      <div className="authLeft">
                        <div className="iconBadge">G</div>
                        <div className="authTitle" style={{ fontSize: 14 }}>Google</div>
                      </div>
                      <div style={{ fontSize: 12, opacity: 0.6 }}>Continue</div>
                    </button>
                    <button className="authOption" style={{ width: '100%', cursor: 'pointer' }} onClick={handleMicrosoft}>
                      <div className="authLeft">
                        <div className="iconBadge">M</div>
                        <div className="authTitle" style={{ fontSize: 14 }}>Microsoft</div>
                      </div>
                      <div style={{ fontSize: 12, opacity: 0.6 }}>Continue</div>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Secondary Info Sections */}
          <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
            <motion.div className="card" style={{ padding: 20 }} variants={fadeUp} custom={4} initial="hidden" animate="show">
              <div style={{ fontWeight: 900, marginBottom: 8 }}>Why timestamping matters</div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.6 }}>
                By establishing prior art, you prevent "obvious" combinations from being locked behind restrictive patents.
              </div>
            </motion.div>

            <motion.div className="card" style={{ padding: 20 }} variants={fadeUp} custom={5} initial="hidden" animate="show">
              <div style={{ fontWeight: 900, marginBottom: 8 }}>Project Roadmap</div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, lineHeight: 1.6 }}>
                • Advanced Combinatorial Rules<br/>
                • Direct OSF Integration<br/>
                • Institutional Auth
              </div>
            </motion.div>
          </div>

          <footer className="footer" style={{ textAlign: 'center', marginTop: 40 }}>
            Built for combinatorial innovation • 2026 • v1.0.4
          </footer>
        </main>
      </div>
    </div>
  );
}