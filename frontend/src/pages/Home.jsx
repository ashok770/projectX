import { useEffect, useState, useContext } from "react";
import axios from "axios";
import ItemCard from "../components/ItemCard";
import SkeletonCard from "../components/SkeletonCard";
import { Search, SlidersHorizontal, Sparkles, PackageSearch, ArrowRight, Shield, Zap, Users } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Home = () => {
  const [items, setItems]           = useState([]);
  const [filter, setFilter]         = useState("all");
  const [matches, setMatches]       = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading]       = useState(true);
  const [visible, setVisible]       = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    const fetchItems = async () => {
      try {
        const res = await axios.get("https://projectx-ojl3.onrender.com/api/items/all");
        setItems(res.data);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const res = await axios.get("https://projectx-ojl3.onrender.com/api/items/matches", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setMatches(res.data);
        }
      } catch {}
    };
    fetchMatches();
  }, []);

  const filteredItems = items.filter((item) => {
    const matchesFilter = filter === "all" || item.type === filter;
    const matchesSearch =
      item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const resolved = items.filter(i => i.status === "resolved").length;

  return (
    <div className={`transition-opacity duration-700 ${visible ? "opacity-100" : "opacity-0"}`}>

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-animated-gradient min-h-[88vh] flex items-center">

        {/* Floating blobs */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-orange-500/20 rounded-full animate-blob blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-500/10 rounded-full animate-blob blur-3xl pointer-events-none delay-300" style={{animationDelay:"2s"}} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/10 rounded-full animate-blob blur-3xl pointer-events-none" style={{animationDelay:"4s"}} />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{backgroundImage:"linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)",backgroundSize:"40px 40px"}} />

        <div className="relative max-w-7xl mx-auto px-6 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left */}
            <div>
              <div className="animate-fade-up inline-flex items-center gap-2 glass-dark text-orange-400 text-xs font-bold px-4 py-2 rounded-full mb-6 border border-orange-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
                </span>
                AI-Powered Campus Lost & Found
              </div>

              <h1 className="animate-fade-up delay-100 text-5xl md:text-6xl font-black text-white leading-[1.1] mb-6">
                Lost something<br />
                on <span className="gradient-text">campus?</span><br />
                <span className="text-slate-300 text-4xl font-bold">We'll find it.</span>
              </h1>

              <p className="animate-fade-up delay-200 text-slate-400 text-lg mb-10 leading-relaxed max-w-lg">
                CampusRetrieve uses <span className="text-orange-400 font-semibold">Gemini AI</span> to instantly match lost items with found reports at Sri Eshwar College.
              </p>

              <div className="animate-fade-up delay-300 flex flex-wrap gap-4 mb-12">
                {user ? (
                  <>
                    <Link to="/report-lost" className="btn-press group flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-7 py-3.5 rounded-2xl transition-all shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105">
                      Report Lost Item <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link to="/report-found" className="btn-press flex items-center gap-2 glass text-white font-bold px-7 py-3.5 rounded-2xl transition-all hover:bg-white/20">
                      Report Found Item
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/register" className="btn-press group flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-7 py-3.5 rounded-2xl transition-all shadow-lg shadow-orange-500/30 hover:scale-105">
                      Get Started Free <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link to="/login" className="btn-press flex items-center gap-2 glass text-white font-bold px-7 py-3.5 rounded-2xl transition-all hover:bg-white/20">
                      Sign In
                    </Link>
                  </>
                )}
              </div>

              {/* Feature pills */}
              <div className="animate-fade-up delay-400 flex flex-wrap gap-3">
                {[
                  { icon: <Zap size={13} />, label: "Instant AI Matching" },
                  { icon: <Shield size={13} />, label: "Secure Verification" },
                  { icon: <Users size={13} />, label: "Campus Community" },
                ].map((f) => (
                  <div key={f.label} className="flex items-center gap-1.5 glass-dark text-slate-300 text-xs font-medium px-3 py-1.5 rounded-full border border-white/5">
                    <span className="text-orange-400">{f.icon}</span>
                    {f.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Floating Stats Card */}
            <div className="hidden lg:flex flex-col gap-4 animate-slide-right delay-200">
              {/* Main card */}
              <div className="glass rounded-3xl p-6 border border-white/20 animate-float">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-600 text-sm font-bold">Live Campus Stats</span>
                  <span className="flex items-center gap-1 text-emerald-500 text-xs font-bold">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Live
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Reported", value: items.length, color: "text-orange-500" },
                    { label: "Recovered", value: resolved, color: "text-emerald-500" },
                    { label: "AI Matches", value: "∞", color: "text-purple-500" },
                  ].map((s) => (
                    <div key={s.label} className="text-center">
                      <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
                      <p className="text-slate-500 text-xs mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mini cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass rounded-2xl p-4 border border-white/20 animate-float delay-200" style={{animationDelay:"1s"}}>
                  <div className="w-8 h-8 bg-orange-500/20 rounded-xl flex items-center justify-center mb-2">
                    <Sparkles size={16} className="text-orange-500" />
                  </div>
                  <p className="text-slate-800 font-black text-sm">Gemini AI</p>
                  <p className="text-slate-500 text-xs">Smart matching</p>
                </div>
                <div className="glass rounded-2xl p-4 border border-white/20 animate-float delay-300" style={{animationDelay:"2s"}}>
                  <div className="w-8 h-8 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-2">
                    <Shield size={16} className="text-emerald-500" />
                  </div>
                  <p className="text-slate-800 font-black text-sm">Verified</p>
                  <p className="text-slate-500 text-xs">Secure claims</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="#f8fafc"/>
          </svg>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Smart Matches */}
        {user && (
          <div className="animate-fade-up mb-12">
            <div className="relative overflow-hidden bg-gradient-to-br from-orange-500/5 via-amber-500/5 to-orange-500/5 border border-orange-200/50 rounded-3xl p-8">
              {/* Decorative */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl pointer-events-none" />

              <div className="relative flex items-center gap-3 mb-6">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200">
                    <Sparkles size={18} className="text-white" />
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-orange-500 animate-ping opacity-20" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">AI Smart Matches</h2>
                  <p className="text-xs text-slate-500">Gemini is scanning reports for you in real-time</p>
                </div>
              </div>

              {matches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {matches.map((item, i) => (
                    <div key={item._id} className="animate-fade-up" style={{animationDelay:`${i*100}ms`}}>
                      <ItemCard item={item} isMatch={true} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="relative w-16 h-16 mx-auto mb-4">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                      <Search className="text-slate-300" size={28} />
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full border-2 border-orange-50 flex items-center justify-center">
                      <span className="text-white text-[8px] font-black">AI</span>
                    </div>
                  </div>
                  <h3 className="text-base font-black text-slate-700">Scanning for matches...</h3>
                  <p className="text-sm text-slate-400 max-w-xs mx-auto mt-1">Report a lost item and our AI will find it instantly!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Search + Filter */}
        <div className="animate-fade-up flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 border-glow rounded-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by item name or location..."
              className="w-full pl-11 pr-12 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-slate-700 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
              <SlidersHorizontal size={16} />
            </div>
          </div>

          <div className="flex bg-white border border-slate-200 p-1 rounded-2xl shadow-sm gap-1">
            {[
              { key: "all",   label: "All",   active: "bg-slate-900 text-white" },
              { key: "lost",  label: "Lost",  active: "bg-blue-500 text-white" },
              { key: "found", label: "Found", active: "bg-orange-500 text-white" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setFilter(t.key)}
                className={`btn-press px-5 py-2.5 rounded-xl text-sm font-bold capitalize transition-all duration-200 ${
                  filter === t.key ? `${t.active} shadow-sm` : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Feed Header */}
        <div className="animate-fade-up flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Campus Feed</h2>
            <p className="text-slate-500 text-sm mt-0.5">
              {loading ? "Loading reports..." : `${filteredItems.length} item${filteredItems.length !== 1 ? "s" : ""} ${searchQuery ? "found" : "on campus"}`}
            </p>
          </div>
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="text-xs text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition font-medium">
              Clear ✕
            </button>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="animate-scale-in flex flex-col items-center justify-center py-24 text-center">
            <div className="relative mb-6">
              <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-sm border border-slate-100 animate-float">
                <PackageSearch className="text-slate-300" size={40} />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center text-lg">🔍</div>
            </div>
            <h3 className="text-xl font-black text-slate-700">Nothing found</h3>
            <p className="text-slate-400 text-sm mt-2 max-w-xs">
              {searchQuery ? `No items match "${searchQuery}"` : "No items reported yet. Be the first!"}
            </p>
            {user && (
              <Link to="/report-found" className="btn-press mt-6 bg-orange-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-orange-600 transition shadow-sm shadow-orange-200">
                Report an Item
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredItems.map((item, i) => (
              <div
                key={item._id}
                className="animate-fade-up"
                style={{ animationDelay: `${Math.min(i * 60, 400)}ms`, opacity: 0, animationFillMode: "forwards" }}
              >
                <ItemCard item={item} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
