import { Routes, Route } from "react-router-dom";
import TopNav from "./components/TopNav";
import Landing from "./pages/Landing";
import Onboarding from "./pages/Onboarding";
import Assistant from "./pages/Assistant";
import Results from "./pages/Results";
import SchemeDetail from "./pages/SchemeDetail";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Footer from "./components/Footer";
import AdminPortal from "./pages/AdminPortal";

export default function App() {
  return (
    <div className="min-h-screen bg-bg font-sans flex flex-col justify-between">
      <div className="flex-1">
        <TopNav />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/schemes" element={<Results />} />
          <Route path="/schemes/:id" element={<SchemeDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminPortal />} />
          <Route path="*" element={<Landing />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
