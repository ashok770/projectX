import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Camera } from "lucide-react"; // Import Camera icon

const ReportLost = () => {
  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    location: "",
    description: "",
  });
  const [image, setImage] = useState(null); // State for the image file
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 1. Copy the handleUpload function (Update with YOUR real cloud name)
  const handleUpload = async () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "campus_retrieve_preset");

    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dtuocgtis/image/upload", // ✅ Make sure this is YOUR cloud name
      data,
    );
    return res.data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 2. Modified handleSubmit to handle OPTIONAL image upload
      let imageUrl = "";
      if (image) {
        // If an image was selected, upload it first
        imageUrl = await handleUpload();
      }

      const token = localStorage.getItem("token");
      // 3. Send the report with the (potentially empty) imageUrl
      await axios.post(
        "http://localhost:5000/api/items/report",
        { ...formData, type: "lost", image: imageUrl }, // ✅ Include image
        { headers: { Authorization: `Bearer ${token}` } },
      );

      alert("Lost report filed! We will look for matches.");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Error filing report. Check your console!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white mt-10 rounded-2xl shadow-sm border border-slate-100">
      {/* Header (unchanged) */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
          <AlertCircle size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-dark">Report a Lost Item</h2>
          <p className="text-sm text-slate-500">
            Provide details so we can match it.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name, Category, Location fields (unchanged) */}
        {/* ... */}

        {/* 4. The NEW Optional Image Field */}
        <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
          <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
            <Camera size={16} className="text-blue-500" />
            Upload Photo (Optional)
          </label>
          <p className="text-xs text-slate-500 mb-3">
            An old photo of the item helps our AI match it faster.
          </p>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition cursor-pointer"
          />

          {image && (
            <p className="text-xs text-green-600 mt-2 font-medium">
              ✅ {image.name} selected.
            </p>
          )}
        </div>

        {/* Description field (unchanged) */}
        {/* ... */}

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition disabled:bg-slate-300"
        >
          {loading ? "Filing Report..." : "Search for Matches"}
        </button>
      </form>
    </div>
  );
};

export default ReportLost;
