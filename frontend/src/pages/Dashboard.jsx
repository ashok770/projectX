import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Package, CheckCircle, Clock, Coffee, Star, TrendingUp, Award, Edit3, Trash2, X } from "lucide-react";
import { Link } from "react-router-dom";

const statusConfig = {
  active:          { color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: <Clock size={11} />, label: "Active" },
  resolved:        { color: "bg-slate-100 text-slate-500 border-slate-200",       icon: <CheckCircle size={11} />, label: "Resolved" },
  "pending-pickup":{ color: "bg-amber-100 text-amber-700 border-amber-200",       icon: <Star size={11} />, label: "Pending Pickup" },
  matched:         { color: "bg-purple-100 text-purple-700 border-purple-200",    icon: <TrendingUp size={11} />, label: "Matched" },
};

const Dashboard = () => {
  const [myItems, setMyItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchMyItems = async () => {
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
    fetchMyItems();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`https://projectx-ojl3.onrender.com/api/items/${editingItem._id}`, editingItem, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyItems(myItems.map((item) => item._id === editingItem._id ? editingItem : item));
      setEditingItem(null);
    } catch (err) {}
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm("Remove this report?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://projectx-ojl3.onrender.com/api/items/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyItems(myItems.filter((item) => item._id !== itemId));
    } catch (err) {}
  };

  const stats = [
    { label: "Total Reports", value: myItems.length, icon: <Package size={20} />, color: "from-orange-400 to-orange-600", shadow: "shadow-orange-200" },
    { label: "Active",        value: myItems.filter(i => i.status === "active").length, icon: <Clock size={20} />, color: "from-emerald-400 to-emerald-600", shadow: "shadow-emerald-200" },
    { label: "Resolved",      value: myItems.filter(i => i.status === "resolved").length, icon: <CheckCircle size={20} />, color: "from-blue-400 to-blue-600", shadow: "shadow-blue-200" },
    { label: "Trust Score",   value: user?.trustScore || 0, icon: <Award size={20} />, color: "from-purple-400 to-purple-600", shadow: "shadow-purple-200" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50/30 animate-fade-in">

      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full translate-y-1/2 -translate-x-1/3 blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-orange-500/30">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-slate-900 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              </div>
              <div>
                <p className="text-slate-400 text-sm font-medium">Welcome back</p>
                <h1 className="text-3xl font-black text-white">{user?.name} 👋</h1>
                <p className="text-slate-400 text-sm mt-0.5">Sri Eshwar College of Engineering</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
              <div className="text-right">
                <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">Trust Score</p>
                <p className="text-4xl font-black text-orange-400">{user?.trustScore}</p>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <Award className="text-orange-400" size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-6 pb-16">

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white shadow-lg ${s.shadow} mb-3`}>
                {s.icon}
              </div>
              <p className="text-2xl font-black text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Items Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Package className="text-orange-500" size={22} />
            Your Reports
          </h2>
          <div className="flex gap-3">
            <Link to="/report-found" className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-4 py-2 rounded-xl transition shadow-sm shadow-orange-200">
              + Found Item
            </Link>
            <Link to="/report-lost" className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-xl transition shadow-sm shadow-blue-200">
              + Lost Item
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 animate-pulse border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-200 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded-full w-1/3" />
                    <div className="h-3 bg-slate-100 rounded-full w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : myItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center">
                <Coffee className="text-slate-300" size={36} />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center">
                <span className="text-lg">☕</span>
              </div>
            </div>
            <h3 className="text-xl font-black text-slate-800">Nothing here yet</h3>
            <p className="text-slate-400 text-sm mt-2 mb-8 max-w-xs mx-auto">
              Help your campus community by reporting lost or found items!
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/report-found" className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition shadow-sm shadow-orange-200">
                Report Found Item
              </Link>
              <Link to="/report-lost" className="bg-blue-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 transition shadow-sm shadow-blue-200">
                Report Lost Item
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {myItems.map((item, i) => {
              const status = statusConfig[item.status] || statusConfig.active;
              return (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg shadow-sm ${
                      item.type === "found"
                        ? "bg-gradient-to-br from-orange-400 to-orange-600 text-white"
                        : "bg-gradient-to-br from-blue-400 to-blue-600 text-white"
                    }`}>
                      {item.type === "found" ? "F" : "L"}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors">{item.itemName}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        📍 {item.location} · {new Date(item.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1 ${status.color}`}>
                      {status.icon} {status.label}
                    </span>
                    <button onClick={() => setEditingItem(item)} className="p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition">
                      <Edit3 size={15} />
                    </button>
                    <button onClick={() => handleDelete(item._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 flex items-center justify-between">
              <h2 className="text-xl font-black text-white">Edit Report</h2>
              <button onClick={() => setEditingItem(null)} className="text-white/70 hover:text-white transition">
                <X size={22} />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              {[
                { label: "Item Name", key: "itemName", type: "text" },
                { label: "Location", key: "location", type: "text" },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
                  <input
                    type={type}
                    value={editingItem[key]}
                    onChange={(e) => setEditingItem({ ...editingItem, [key]: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition text-sm"
                    required
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
                <textarea
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition text-sm h-24 resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setEditingItem(null)} className="flex-1 py-3 text-slate-500 font-bold border border-slate-200 rounded-xl hover:bg-slate-50 transition text-sm">
                  Cancel
                </button>
                <button type="submit" className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition text-sm shadow-sm shadow-orange-200">
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
