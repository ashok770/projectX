import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const VerifyModal = ({ item, onClose }) => {
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);
  const { getProfile } = useContext(AuthContext);

  const handleVerify = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/items/verify-claim",
        { itemId: item._id, answer },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    setResult(res.data);
      getProfile();
    } catch (err) {
      alert("Wrong answer, bro. Be honest!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-8 rounded-2xl max-w-md w-full shadow-2xl">
        <h2 className="text-xl font-bold text-dark mb-4">Verify Ownership</h2>
        <p className="text-slate-600 mb-6 bg-slate-50 p-3 rounded-lg border border-slate-100">
          <span className="text-xs uppercase font-bold text-slate-400 block mb-1">Question from the Finder:</span>
          <span className="font-bold text-orange-600 text-lg italic">
            "{item.secretQuestion || "No question provided by finder."}"
          </span>
        </p>

        {!result ? (
          <>
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
                className="flex-1 bg-brand text-white py-2 rounded-lg font-bold"
              >
                Verify
              </button>
            </div>
          </>
        ) : (
          <div className="bg-green-50 p-6 rounded-xl border border-green-200 text-center">
            <p className="text-green-700 font-bold text-lg">✅ {result.message}</p>
            <p className="text-slate-600 text-sm mt-2">
              Please visit <span className="font-bold text-dark">{result.dropOffLocation}</span> and show this code to the staff:
            </p>
            <div className="my-4 bg-white border-2 border-dashed border-green-400 rounded-xl py-4">
              <p className="text-5xl font-mono font-black tracking-[0.3em] text-green-600">
                {result.claimCode}
              </p>
            </div>
            <p className="text-xs text-slate-400">Show this code only to the staff. Do not share it.</p>
            <button
              onClick={onClose}
              className="w-full mt-4 bg-dark text-white py-2 rounded-lg font-bold"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyModal;
