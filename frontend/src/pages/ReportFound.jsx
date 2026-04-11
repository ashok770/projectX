import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Camera, MapPin, Tag, FileText, Shield, CheckCircle, Upload, Loader } from "lucide-react";

const inputClass = "w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition text-sm text-slate-700";

const ReportFound = () => {
  const [formData, setFormData] = useState({
    itemName: "", category: "", location: "", description: "",
    secretQuestion: "", secretAnswer: "", dropOffLocation: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
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
    data.append("cloud_name", "dtuocgtis");
    const res = await axios.post("https://api.cloudinary.com/v1_1/dtuocgtis/image/upload", data);
    return res.data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const imageUrl = image ? await handleUpload() : "";
      const token = localStorage.getItem("token");
      await axios.post(
        "https://projectx-ojl3.onrender.com/api/items/report",
        { ...formData, type: "found", image: imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/");
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const set = (key) => (e) => setFormData({ ...formData, [key]: e.target.value });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/50 via-white to-slate-50 animate-fade-in">

      {/* Page Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="max-w-2xl mx-auto px-6 py-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <CheckCircle size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black">Report a Found Item</h1>
              <p className="text-orange-100 text-sm mt-0.5">Help reunite someone with their belongings</p>
            </div>
          </div>

          {/* Steps */}
          <div className="flex items-center gap-2 mt-8">
            {["Item Details", "Security", "Drop-off"].map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full text-xs font-bold">
                  <span className="w-4 h-4 bg-white text-orange-500 rounded-full flex items-center justify-center text-[10px] font-black">{i + 1}</span>
                  {step}
                </div>
                {i < 2 && <div className="w-4 h-px bg-white/30" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Section 1: Item Details */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-50 bg-slate-50/50">
              <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center">
                <Tag className="text-orange-500" size={16} />
              </div>
              <h2 className="font-black text-slate-800">Item Details</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Item Name *</label>
                <input type="text" placeholder="e.g. boAt Airdopes, Blue Wallet" className={inputClass} onChange={set("itemName")} required />
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
                  <span className="flex items-center gap-1"><MapPin size={12} /> Found Location *</span>
                </label>
                <input type="text" placeholder="e.g. Library 2nd Floor, Block A Corridor" className={inputClass} onChange={set("location")} required />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  <span className="flex items-center gap-1"><FileText size={12} /> Description</span>
                </label>
                <textarea placeholder="Color, brand, any unique marks..." className={`${inputClass} h-24 resize-none`} onChange={set("description")} />
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-50 bg-slate-50/50">
              <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                <Camera className="text-blue-500" size={16} />
              </div>
              <h2 className="font-black text-slate-800">Photo <span className="text-slate-400 font-medium text-sm">(optional)</span></h2>
            </div>
            <div className="p-6">
              {preview ? (
                <div className="relative">
                  <img src={preview} alt="preview" className="w-full h-48 object-cover rounded-2xl" />
                  <button type="button" onClick={() => { setImage(null); setPreview(null); }}
                    className="absolute top-3 right-3 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/70 transition text-xs font-bold">✕</button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-36 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-orange-300 hover:bg-orange-50/50 transition-all group">
                  <Upload className="text-slate-300 group-hover:text-orange-400 transition mb-2" size={28} />
                  <p className="text-sm font-semibold text-slate-400 group-hover:text-orange-500 transition">Click to upload image</p>
                  <p className="text-xs text-slate-300 mt-1">PNG, JPG up to 10MB</p>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              )}
            </div>
          </div>

          {/* Section 2: Security */}
          <div className="bg-white rounded-3xl border border-orange-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-orange-50 bg-orange-50/50">
              <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center">
                <Shield className="text-orange-500" size={16} />
              </div>
              <div>
                <h2 className="font-black text-slate-800">Ownership Verification</h2>
                <p className="text-xs text-slate-400">Only the real owner will know this answer</p>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Secret Question *</label>
                <input type="text" placeholder="e.g. What is the phone wallpaper?" className={inputClass} onChange={set("secretQuestion")} required />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Correct Answer *</label>
                <input type="text" placeholder="The answer only the true owner knows..." className={inputClass} onChange={set("secretAnswer")} required />
              </div>
            </div>
          </div>

          {/* Section 3: Drop-off */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-50 bg-slate-50/50">
              <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center">
                <MapPin className="text-emerald-500" size={16} />
              </div>
              <div>
                <h2 className="font-black text-slate-800">Drop-off Location *</h2>
                <p className="text-xs text-slate-400">Where will you leave the item for pickup?</p>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "Security Gate", label: "🔒 Security Gate", sub: "Main Entrance" },
                  { value: "CSE Dept Office", label: "💻 CSE Office", sub: "SF02" },
                  { value: "Library Front Desk", label: "📚 Library Desk", sub: "Ground Floor" },
                  { value: "Hostel Office", label: "🏠 Hostel Office", sub: "Warden Room" },
                ].map((loc) => (
                  <label key={loc.value} className={`flex flex-col p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    formData.dropOffLocation === loc.value
                      ? "border-orange-500 bg-orange-50"
                      : "border-slate-100 hover:border-orange-200 hover:bg-orange-50/30"
                  }`}>
                    <input type="radio" name="dropOff" value={loc.value} className="hidden"
                      onChange={() => setFormData({ ...formData, dropOffLocation: loc.value })} required />
                    <span className="font-bold text-sm text-slate-800">{loc.label}</span>
                    <span className="text-xs text-slate-400 mt-0.5">{loc.sub}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <button
            disabled={uploading}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-black py-4 rounded-2xl hover:from-orange-600 hover:to-orange-700 disabled:from-slate-300 disabled:to-slate-300 transition-all shadow-lg shadow-orange-200 flex items-center justify-center gap-3 text-base"
          >
            {uploading ? (
              <><Loader className="animate-spin" size={20} /> Uploading & Submitting...</>
            ) : (
              <><CheckCircle size={20} /> Submit Found Report</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportFound;
