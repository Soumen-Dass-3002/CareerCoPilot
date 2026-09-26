import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ExploreCareers from "./pages/ExploreCareers";
import CareerDetail from "./pages/CareerDetail";
import CareerCompare from "./pages/CareerCompare";
import { Applications, ATS, Colleges, Jobs, Profile, Resumes, Simulator } from "./pages/Platform";
import Nova from "./pages/Nova";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Website ka first page */}
        <Route path="/" element={<Dashboard />} />

        {/* Auth pages sirf popup/buttons se */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/careers" element={<ExploreCareers />} />
        <Route path="/careers/:careerId" element={<CareerDetail />} />
        <Route path="/compare" element={<CareerCompare />} />
        <Route path="/colleges" element={<Colleges />} />
        <Route path="/resumes" element={<Resumes />} />
        <Route path="/ats" element={<ATS />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/simulator" element={<Simulator />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/nova" element={<Nova />} />

        {/* Unknown URL → Dashboard */}
        <Route
          path="*"
          element={<Navigate to="/" />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
