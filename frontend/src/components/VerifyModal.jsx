import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Check } from "lucide-react";

const VerifyModal = ({ item, onClose }) => {
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { getProfile } = useContext(AuthContext);

  const handleVerify = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "https://projectx-ojl3.onrender.com/api/items/verify-claim",
        { itemId: item._id, answer },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(res.data);
      getProfile();
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data?.error || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-8 rounded-2xl max-w-md w-full shadow-2xl">
        <h2 className="text-xl font-bold text-dark mb-4">Verify Ownership</h2>

        {result ? (
          <div className="text-center">
            <div className="bg-green-50 p-6 rounded-3xl border-2 border-dashed border-green-200 mb-6">
              <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-black text-green-800">Identity Verified!</h3>
              <p className="text-green-600 text-sm mt-1">Please collect your item from:</p>
              <p className="font-bold text-dark mt-1 uppercase tracking-tight">
                📍 {item.dropOffLocation || result.dropOffLocation || "College Office"}
              </p>

              <div className="mt-6 pt-6 border-t border-green-200">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-2">
                  Your Unique Claim Code
                </p>
                <div className="bg-white py-4 rounded-2xl shadow-inner">
                  <span className="text-4xl font-black tracking-[0.3em] text-dark">
                    {result.claimCode}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 px-4 mb-6">
              Show this screen to the staff member at the desk. Do not share this code with anyone else.
            </p>

            <button
              onClick={onClose}
              className="w-full bg-dark text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition"
            >
              Close & Save Pass
            </button>
          </div>
        ) : (
          <>
            <p className="text-slate-600 mb-6 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-xs uppercase font-bold text-slate-400 block mb-1">Question from the Finder:</span>
              <span className="font-bold text-orange-600 text-lg italic">
                "{item.secretQuestion || "No question provided by finder."}"
              </span>
            </p>

            <input
              type="text"
              placeholder="Your answer..."
              className="w-full p-3 border rounded-lg mb-4"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2 text-slate-500 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleVerify}
                disabled={loading || !answer.trim()}
                className="flex-1 bg-brand text-white py-2 rounded-lg font-bold disabled:bg-slate-300 flex items-center justify-center gap-2 transition"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : "Verify"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyModal;
