import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Camera, Package, MapPin, FileText, Loader, Search, Upload } from "lucide-react";

const inputClass = "w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm text-slate-700";

const ReportLost = () => {
  const [formData, setFormData] = useState({ itemName: "", category: "", location: "", description: "" });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "campus_retrieve_preset");
    const res = await axios.post("https://api.cloudinary.com/v1_1/dtuocgtis/image/upload", data);
    return res.data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const imageUrl = image ? await handleUpload() : "";
      const token = localStorage.getItem("token");
      await axios.post(
        "https://projectx-ojl3.onrender.com/api/items/report",
        { ...formData, type: "lost", image: imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const set = (key) => (e) => setFormData({ ...formData, [key]: e.target.value });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-slate-50 animate-fade-in">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-2xl mx-auto px-6 py-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <AlertCircle size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black">Report a Lost Item</h1>
              <p className="text-blue-100 text-sm mt-0.5">Our AI will scan all found reports for a match</p>
            </div>
          </div>

          {/* AI Badge */}
          <div className="mt-6 inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-2xl px-4 py-3">
            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
              <Search size={16} className="animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-black">Gemini AI is on standby</p>
              <p className="text-[10px] text-blue-200">Will instantly match your report with found items</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Item Details */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-50 bg-slate-50/50">
              <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                <Package className="text-blue-500" size={16} />
              </div>
              <h2 className="font-black text-slate-800">What did you lose?</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Item Name *</label>
                <input type="text" placeholder="e.g. Black Sony Headphones, Student ID" className={inputClass} onChange={set("itemName")} required />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Category *</label>
                <select className={inputClass} onChange={set("category")} required defaultValue="">
                  <option value="" disabled>Select a category</option>
                  <option value="Electronics">📱 Electronics</option>
                  <option value="Documents">📄 Documents / IDs</option>
                  <option value="Accessories">🔑 Accessories (Keys/Wallets)</option>
                  <option value="Books">📚 Books / Stationery</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  <span className="flex items-center gap-1"><MapPin size={12} /> Last Seen Location *</span>
                </label>
                <input type="text" placeholder="e.g. Block 3 Cafeteria, Library 2nd Floor" className={inputClass} onChange={set("location")} required />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  <span className="flex items-center gap-1"><FileText size={12} /> Specific Details</span>
                </label>
                <textarea placeholder="Color, brand, unique stickers, scratches, or any identifying marks..." className={`${inputClass} h-28 resize-none`} onChange={set("description")} />
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-50 bg-slate-50/50">
              <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center">
                <Camera className="text-purple-500" size={16} />
              </div>
              <div>
                <h2 className="font-black text-slate-800">Reference Photo <span className="text-slate-400 font-medium text-sm">(optional)</span></h2>
                <p className="text-xs text-slate-400">Helps AI match better</p>
              </div>
            </div>
            <div className="p-6">
              {preview ? (
                <div className="relative">
                  <img src={preview} alt="preview" className="w-full h-48 object-cover rounded-2xl" />
                  <button type="button" onClick={() => { setImage(null); setPreview(null); }}
                    className="absolute top-3 right-3 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/70 transition text-xs font-bold">✕</button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-36 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-blue-300 hover:bg-blue-50/50 transition-all group">
                  <Upload className="text-slate-300 group-hover:text-blue-400 transition mb-2" size={28} />
                  <p className="text-sm font-semibold text-slate-400 group-hover:text-blue-500 transition">Click to upload a photo</p>
                  <p className="text-xs text-slate-300 mt-1">PNG, JPG up to 10MB</p>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              )}
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-black py-4 rounded-2xl hover:from-blue-700 hover:to-blue-800 disabled:from-slate-300 disabled:to-slate-300 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-3 text-base"
          >
            {loading ? (
              <><Loader className="animate-spin" size={20} /> Searching for matches...</>
            ) : (
              <><Search size={20} /> Find My Item</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportLost;
