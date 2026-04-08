import { useState } from "react";
import axios from "axios";

const VerifyModal = ({ item, onClose }) => {
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);

  const handleVerify = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/items/verify-claim",
        { itemId: item._id, answer },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setResult(res.data);
    } catch (err) {
      alert("Wrong answer, bro. Be honest!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-8 rounded-2xl max-w-md w-full shadow-2xl">
        <h2 className="text-xl font-bold text-dark mb-4">Verify Ownership</h2>
        <p className="text-slate-600 mb-6">
          The finder asked: <br />
          <span className="font-bold text-orange-600">
            "{item.secretQuestion}"
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
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-green-700 font-bold">✅ {result.message}</p>
            <p className="text-slate-700 mt-2">{result.contact}</p>
            <button
              onClick={onClose}
              className="w-full mt-4 bg-dark text-white py-2 rounded-lg"
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
