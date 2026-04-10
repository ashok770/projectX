import { useState } from "react";
import axios from "axios";
import { ShieldCheck, PackageCheck, Search } from "lucide-react";

const AdminPanel = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleHandover = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/admin/complete-handover",
        { claimCode: code },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      alert("✅ Handover Successful! The item is now marked as Resolved.");
      setCode("");
    } catch (err) {
      alert(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-dark p-8 text-white flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black flex items-center gap-2">
              <ShieldCheck className="text-brand" /> Staff Handover Terminal
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Sri Eshwar College of Engineering - Security Desk
            </p>
          </div>
          <div className="bg-brand/20 p-3 rounded-2xl">
            <PackageCheck size={32} className="text-brand" />
          </div>
        </div>

        {/* Action Area */}
        <div className="p-10 text-center">
          <p className="text-slate-600 mb-8 max-w-sm mx-auto text-sm">
            Verify the student's 6-digit claim code to release the item from the
            office.
          </p>

          <div className="relative max-w-xs mx-auto mb-8">
            <input
              type="text"
              placeholder="000000"
              maxLength="6"
              className="w-full text-center text-5xl font-mono tracking-[0.5em] py-6 border-2 border-slate-200 rounded-2xl focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all uppercase"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>

          <button
            onClick={handleHandover}
            disabled={code.length !== 6 || loading}
            className="w-full max-w-xs bg-brand text-white font-black py-4 rounded-2xl hover:bg-orange-600 disabled:bg-slate-200 transition-all shadow-lg shadow-brand/20"
          >
            {loading ? "Verifying..." : "Confirm Handover"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
