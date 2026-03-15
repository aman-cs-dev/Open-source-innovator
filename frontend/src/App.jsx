import { Routes, Route, Navigate } from "react-router-dom";
import About from "./pages/About";
import HowToUse from "./pages/HowToUse";
import Output from "./pages/Output";
import Profile from "./pages/Profile";
import Landing from "./pages/Landing";
import Combinations from "./pages/components/Combinations.jsx";

// ADD THIS IMPORT BELOW
import PreviousOutputsPage from "./pages/previous_outputs"; 

import { useAuthUser } from "./firebase/useAuthUser";

function RequireAuth({ children }) {
  const { user, loading } = useAuthUser();
  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
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
      <Route path="/history" element={<PreviousOutputsPage />} />
      
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}