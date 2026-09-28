import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ExploreCareers from "./pages/ExploreCareers";
import CareerDetail from "./pages/CareerDetail";
import CareerCompare from "./pages/CareerCompare";
import Applications from "./pages/platform/Applications";
import ATS from "./pages/platform/ATS";
import Jobs from "./pages/platform/Jobs";
import Profile from "./pages/platform/Profile";
import Resumes from "./pages/platform/Resumes";
import Simulator from "./pages/platform/Simulator";
import Nova from "./pages/Nova";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Landing page */}
        <Route path="/" element={<Dashboard />} />

        {/* Auth pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/careers" element={<ExploreCareers />} />
        <Route path="/careers/:careerId" element={<CareerDetail />} />
        <Route path="/compare" element={<CareerCompare />} />
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
};

export default App;
