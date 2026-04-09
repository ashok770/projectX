import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ReportFound from "./pages/ReportFound";
import Dashboard from "./pages/Dashboard";
import ReportLost from "./pages/ReportLost";
import Register from "./pages/Register";

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/report-found" element={<ReportFound />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/report-lost" element={<ReportLost />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
