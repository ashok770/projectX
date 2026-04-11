import { useState } from "react";
import axios from "axios";
import { ShieldCheck, PackageCheck, CheckCircle, Loader, AlertCircle } from "lucide-react";

const AdminPanel = () => {
  const [code, setCode]       = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError]     = useState("");

  const handleHandover = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "https://projectx-ojl3.onrender.com/api/admin/complete-handover",
        { claimCode: code },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(res.data);
      setCode("");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-animated-gradient flex items-center justify-center px-6 py-16 animate-fade-in">

      {/* Floating blobs */}
      <div className="fixed top-20 right-10 w-64 h-64 bg-purple-500/10 rounded-full animate-blob blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 left-10 w-80 h-80 bg-orange-500/10 rounded-full animate-blob blur-3xl pointer-events-none" style={{animationDelay:"3s"}} />

      <div className="relative w-full max-w-lg animate-scale-in">

        {/* Card */}
        <div className="glass rounded-3xl overflow-hidden shadow-2xl border border-white/20">

          {/* Header */}
          <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 p-8 overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl" />
            <div className="relative flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Terminal Active</span>
                </div>
                <h1 className="text-2xl font-black text-white flex items-center gap-2">
                  <ShieldCheck className="text-orange-400" size={24} />
                  Staff Handover Terminal
                </h1>
                <p className="text-slate-400 text-sm mt-1">Sri Eshwar College of Engineering</p>
              </div>
              <div className="w-14 h-14 bg-orange-500/20 rounded-2xl flex items-center justify-center animate-float border border-orange-500/20">
                <PackageCheck size={28} className="text-orange-400" />
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-8">
            {success ? (
              <div className="text-center animate-scale-in">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/30 animate-glow">
                    <CheckCircle size={36} className="text-white" />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-20" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Handover Complete!</h2>
                <p className="text-slate-500 mb-2">Item successfully released to student</p>
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-6">
                  <p className="text-emerald-700 font-bold text-lg">📦 {success.itemName}</p>
                  <p className="text-emerald-600 text-sm mt-1">Marked as resolved · Trust score updated</p>
                </div>
                <button
                  onClick={() => setSuccess(null)}
                  className="btn-press w-full bg-slate-900 text-white font-bold py-3.5 rounded-2xl hover:bg-slate-800 transition"
                >
                  Process Another Item
                </button>
              </div>
            ) : (
              <>
                <p className="text-slate-500 text-sm text-center mb-8 leading-relaxed">
                  Ask the student to show their <span className="font-bold text-slate-700">6-digit claim code</span>. Enter it below to release the item.
                </p>

                {error && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl mb-6 animate-fade-up">
                    <AlertCircle size={16} className="shrink-0" />
                    {error}
                  </div>
                )}

                {/* Code Input */}
                <div className="relative mb-8">
                  <input
                    type="text"
                    placeholder="000000"
                    maxLength="6"
                    className={`w-full text-center text-5xl font-mono tracking-[0.5em] py-6 border-2 rounded-2xl outline-none transition-all duration-300 ${
                      code.length === 6
                        ? "border-orange-500 bg-orange-50 text-orange-600 shadow-lg shadow-orange-100"
                        : "border-slate-200 bg-slate-50 text-slate-700 focus:border-orange-400 focus:bg-white focus:shadow-lg focus:shadow-orange-100/50"
                    }`}
                    value={code}
                    onChange={(e) => { setError(""); setCode(e.target.value.replace(/\D/g, "")); }}
                  />
                  {/* Progress dots */}
                  <div className="flex justify-center gap-2 mt-3">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        i < code.length ? "bg-orange-500 scale-125" : "bg-slate-200"
                      }`} />
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleHandover}
                  disabled={code.length !== 6 || loading}
                  className="btn-press w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-black py-4 rounded-2xl hover:from-orange-600 hover:to-orange-700 disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 transition-all shadow-lg shadow-orange-200 disabled:shadow-none flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><Loader className="animate-spin" size={20} /> Verifying Code...</>
                  ) : (
                    <><ShieldCheck size={20} /> Confirm Handover</>
                  )}
                </button>

                <p className="text-center text-xs text-slate-400 mt-4">
                  Each code can only be used once and expires after pickup
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
