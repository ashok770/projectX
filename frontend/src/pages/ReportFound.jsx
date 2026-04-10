import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ReportFound = () => {
  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    location: "",
    description: "",
    secretQuestion: "",
    secretAnswer: "",
    dropOffLocation: "",
  });
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleUpload = async () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "campus_retrieve_preset"); // The preset you just created
    data.append("cloud_name", "dtuocgtis"); // Found in Cloudinary Dashboard

    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dtuocgtis/image/upload",
      data,
    );
    return res.data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const imageUrl = image ? await handleUpload() : "";

      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/items/report",
        { ...formData, type: "found", image: imageUrl },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      alert("Item Reported!");
      navigate("/");
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white mt-10 rounded-2xl shadow-sm border border-slate-100">
      <h2 className="text-2xl font-bold mb-6 text-dark">Report a Found Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Item Name (e.g. boAt Airdopes)"
          className="w-full p-3 border rounded-lg"
          onChange={(e) =>
            setFormData({ ...formData, itemName: e.target.value })
          }
          required
        />

        <select
          className="w-full p-3 border rounded-lg"
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          required
        >
          <option value="">Select Category</option>
          <option value="Electronics">Electronics</option>
          <option value="Documents">Documents/IDs</option>
          <option value="Accessories">Accessories (Keys/Wallets)</option>
        </select>

        <input
          type="text"
          placeholder="Found Location (e.g. Library)"
          className="w-full p-3 border rounded-lg"
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          required
        />

        <textarea
          placeholder="Brief Description"
          className="w-full p-3 border rounded-lg"
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />

        <div>
          <label className="block text-sm font-semibold mb-1 text-slate-600">
            Upload Image
          </label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
          />
        </div>

        <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 space-y-3">
          <div>
            <label className="block text-sm font-bold text-orange-800 mb-1">
              Secret Question
            </label>
            <input
              type="text"
              placeholder="e.g. What is the wallpaper?"
              className="w-full p-2 border border-orange-200 rounded"
              onChange={(e) =>
                setFormData({ ...formData, secretQuestion: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-orange-800 mb-1">
              Correct Answer
            </label>
            <input
              type="text"
              placeholder="The answer only the owner knows..."
              className="w-full p-2 border border-orange-200 rounded"
              onChange={(e) =>
                setFormData({ ...formData, secretAnswer: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-700">
            Physical Drop-off Point
          </label>
          <select
            required
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand outline-none transition"
            value={formData.dropOffLocation}
            onChange={(e) => setFormData({ ...formData, dropOffLocation: e.target.value })}
          >
            <option value="">-- Where will you leave the item? --</option>
            <option value="Security Gate">Main Security Gate</option>
            <option value="CSE Dept Office">CSE Department Office (SF02)</option>
            <option value="Library Front Desk">Library Front Desk</option>
            <option value="Hostel Office">Hostel Warden Office</option>
          </select>
          <p className="text-[10px] text-slate-400 italic">
            *This is where the owner will go to collect the item.
          </p>
        </div>

        <button
          disabled={uploading}
          className="w-full bg-brand text-white font-bold py-3 rounded-lg hover:bg-orange-600 disabled:bg-slate-300"
        >
          {uploading ? "Uploading..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
};

export default ReportFound;
