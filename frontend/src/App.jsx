import { Routes, Route, Navigate } from "react-router-dom";
import About from "./pages/About";
import HowToUse from "./pages/HowToUse";
import PrivacyPolicy from "./pages/Output"
import Profile from "./pages/Profile";
import Landing from "./pages/Landing";
import Combinations from "./pages/components/Combinations.jsx";
import Landing_About from "./pages/components/Landing_About.jsx";
import Landing_HowToUse from "./pages/components/Landing_HowToUse.jsx";
import Landing_Privacy_Policy from "./pages/components/Landing_Privacy_Policy.jsx"

// ADD THIS IMPORT BELOW
import PreviousOutputsPage from "./pages/previous_outputs"; 

import { useAuthUser } from "./firebase/useAuthUser";

function RequireAuth({ children }) {
  const { user, loading } = useAuthUser();
  const manual_user = localStorage.getItem("user");

  if (loading) return null;
  if (!user && !manual_user) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
  <Route path="/landing_about" element={<Landing_About />} />
  <Route path="/landing_how" element={<Landing_HowToUse />} />
  <Route path="/landing_privacy" element={<Landing_Privacy_Policy />} />
      <Route path="/" element={<Landing />} />
      <Route
        path="/combinations"
        element={
          <RequireAuth>
            <Combinations />
          </RequireAuth>
        }
      />
      <Route path="/about" element={<About />} />
      <Route path="/how" element={<HowToUse />} />
      
      {/* CHANGE 'path' TO "/history" TO MATCH YOUR NAVIGATION */}
<Route path="/privacy" element={<PrivacyPolicy />} />
<Route path="/history" element={<PreviousOutputsPage />} />
<Route path="/output" element={<PreviousOutputsPage />} />
      
      <Route path="/profile" element={<Profile />} />
    </Routes>

    
  );
}