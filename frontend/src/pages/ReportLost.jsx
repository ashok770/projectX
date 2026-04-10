import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Camera, Package, MapPin } from "lucide-react";

const ReportLost = () => {
  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    location: "",
    description: "",
  });
  const [image, setImage] = useState(null); 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "campus_retrieve_preset");

    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dtuocgtis/image/upload",
      data,
    );
    return res.data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = "";
      if (image) {
        imageUrl = await handleUpload();
      }

      const token = localStorage.getItem("token");
      await axios.post(
        "https://projectx-ojl3.onrender.com/api/items/report",
        { ...formData, type: "lost", image: imageUrl },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      alert("Lost report filed! Searching for matches...");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Error filing report. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white mt-10 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-6">
        <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
          <AlertCircle size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-dark">Report a Lost Item</h2>
          <p className="text-sm text-slate-500">
            Provide details so our AI can find a match.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Item Name */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
            <Package size={16} className="text-blue-500" /> Item Name
          </label>
          <input
            type="text"
            placeholder="e.g. Black Sony Headphones"
            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
            onChange={(e) =>
              setFormData({ ...formData, itemName: e.target.value })
            }
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Category
          </label>
          <select
            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            required
          >
            <option value="">Select Category</option>
            <option value="Electronics">Electronics</option>
            <option value="Documents">Documents/IDs</option>
            <option value="Accessories">Accessories</option>
            <option value="Books">Books/Stationery</option>
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
            <MapPin size={16} className="text-blue-500" /> Last Seen Location
          </label>
          <input
            type="text"
            placeholder="e.g. Block 3 Cafeteria"
            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            required
          />
        </div>

        {/* Optional Image Upload */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1">
            <Camera size={16} className="text-blue-500" /> Reference Image
            (Optional)
          </label>
          <p className="text-[11px] text-slate-500 mb-3 font-medium">
            Have an old photo of the item? It helps us match better.
          </p>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white file:font-bold hover:file:bg-blue-700 transition cursor-pointer"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Specific Details
          </label>
          <textarea
            placeholder="Color, brand, unique stickers, or marks..."
            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition h-28"
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 hover:shadow-lg transition-all disabled:bg-slate-300"
        >
          {loading ? "Uploading & Matching..." : "Find My Item"}
        </button>
      </form>
    </div>
  );
};

export default ReportLost;
