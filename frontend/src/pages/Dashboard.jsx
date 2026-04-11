import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import {
  Package, CheckCircle, Clock, Coffee,
  Award, Edit3, Trash2, X, MapPin,
  TrendingUp, Star, PlusCircle
} from "lucide-react";
import { Link } from "react-router-dom";

const statusConfig = {
  active:           { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200", icon: <Clock size={11} />,       label: "Active" },
  resolved:         { bg: "bg-slate-100",   text: "text-slate-500",   border: "border-slate-200",   icon: <CheckCircle size={11} />, label: "Resolved" },
  "pending-pickup": { bg: "bg-amber-100",   text: "text-amber-700",   border: "border-amber-200",   icon: <Star size={11} />,        label: "Pending Pickup" },
  matched:          { bg: "bg-purple-100",  text: "text-purple-700",  border: "border-purple-200",  icon: <TrendingUp size={11} />,  label: "Matched" },
};

const Dashboard = () => {
  const [myItems, setMyItems]       = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading]       = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://projectx-ojl3.onrender.com/api/items/my-items", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMyItems(res.data);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`https://projectx-ojl3.onrender.com/api/items/${editingItem._id}`, editingItem, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyItems(myItems.map(i => i._id === editingItem._id ? editingItem : i));
      setEditingItem(null);
    } catch {}
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm("Remove this report?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://projectx-ojl3.onrender.com/api/items/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyItems(myItems.filter(i => i._id !== itemId));
    } catch {}
  };

  const stats = [
    { label: "Total Reports", value: myItems.length,                                    icon: <Package size={18} />,     from: "from-orange-400", to: "to-orange-600",  glow: "shadow-orange-200" },
    { label: "Active",        value: myItems.filter(i => i.status === "active").length, icon: <Clock size={18} />,       from: "from-emerald-400", to: "to-emerald-600", glow: "shadow-emerald-200" },
    { label: "Resolved",      value: myItems.filter(i => i.status === "resolved").length, icon: <CheckCircle size={18} />, from: "from-blue-400",   to: "to-blue-600",    glow: "shadow-blue-200" },
    { label: "Trust Score",   value: user?.trustScore ?? 0,                              icon: <Award size={18} />,       from: "from-purple-400", to: "to-purple-600",  glow: "shadow-purple-200" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Header Banner ─────────────────────────────── */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full translate-y-1/2 -translate-x-1/3 blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-6 py-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">

            {/* User info */}
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-orange-500/30">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-slate-900" />
              </div>
              <div>
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">My Dashboard</p>
                <h1 className="text-2xl font-black text-white mt-0.5">{user?.name}</h1>
                <p className="text-slate-400 text-xs mt-0.5">Sri Eshwar College of Engineering</p>
              </div>
            </div>

            {/* Trust Score */}
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 self-start sm:self-auto">
              <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <Award className="text-orange-400" size={20} />
              </div>
              <div>
                <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Trust Score</p>
                <p className="text-3xl font-black text-orange-400 leading-none mt-0.5">{user?.trustScore ?? 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ──────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.from} ${s.to} flex items-center justify-center text-white shadow-md ${s.glow} mb-4`}>
                {s.icon}
              </div>
              <p className="text-2xl font-black text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500 font-medium mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Reports Section */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">

          {/* Section Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-50">
            <h2 className="font-black text-slate-900 flex items-center gap-2 text-lg">
              <Package className="text-orange-500" size={20} />
              Your Reports
              {!loading && (
                <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2 py-0.5 rounded-full ml-1">
                  {myItems.length}
                </span>
              )}
            </h2>
            <div className="flex gap-2">
              <Link to="/report-found" className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-3 py-2 rounded-xl transition shadow-sm shadow-orange-200">
                <PlusCircle size={13} /> Found
              </Link>
              <Link to="/report-lost" className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold px-3 py-2 rounded-xl transition shadow-sm shadow-blue-200">
                <PlusCircle size={13} /> Lost
              </Link>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="divide-y divide-slate-50">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-4">
                  <div className="w-11 h-11 bg-slate-100 rounded-xl skeleton shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 skeleton rounded-full w-1/3" />
                    <div className="h-3 skeleton rounded-full w-1/2" />
                  </div>
                  <div className="h-6 w-16 skeleton rounded-full" />
                </div>
              ))}
            </div>
          ) : myItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
                <Coffee className="text-slate-300" size={28} />
              </div>
              <h3 className="text-lg font-black text-slate-800">No reports yet</h3>
              <p className="text-slate-400 text-sm mt-2 mb-6 max-w-xs">
                Help your campus community by reporting lost or found items!
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link to="/report-found" className="bg-orange-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-orange-600 transition text-sm shadow-sm shadow-orange-200">
                  Report Found Item
                </Link>
                <Link to="/report-lost" className="bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-600 transition text-sm shadow-sm shadow-blue-200">
                  Report Lost Item
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {myItems.map((item) => {
                const s = statusConfig[item.status] || statusConfig.active;
                return (
                  <div key={item._id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/70 transition-colors group">

                    {/* Type icon */}
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                      item.type === "found"
                        ? "bg-orange-100 text-orange-600"
                        : "bg-blue-100 text-blue-600"
                    }`}>
                      {item.type === "found" ? "F" : "L"}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 truncate text-sm group-hover:text-orange-600 transition-colors">
                        {item.itemName}
                      </p>
                      <div className="flex items-center gap-1 text-slate-400 text-xs mt-0.5">
                        <MapPin size={10} />
                        <span className="truncate">{item.location}</span>
                        <span className="mx-1">·</span>
                        <span>{new Date(item.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                      </div>
                    </div>

                    {/* Status badge */}
                    <span className={`hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border shrink-0 ${s.bg} ${s.text} ${s.border}`}>
                      {s.icon} {s.label}
                    </span>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition"
                        title="Edit"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Edit Modal ────────────────────────────────── */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h2 className="text-lg font-black text-slate-900">Edit Report</h2>
              <button
                onClick={() => setEditingItem(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              {[
                { label: "Item Name", key: "itemName" },
                { label: "Location",  key: "location" },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
                  <input
                    type="text"
                    value={editingItem[key]}
                    onChange={(e) => setEditingItem({ ...editingItem, [key]: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition text-sm"
                    required
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
                <textarea
                  value={editingItem.description || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition text-sm h-24 resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="flex-1 py-3 text-slate-600 font-bold border border-slate-200 rounded-xl hover:bg-slate-50 transition text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition text-sm shadow-sm shadow-orange-200"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
