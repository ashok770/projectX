import { useEffect, useState } from "react";
import axios from "axios";
import ItemCard from "../components/ItemCard";
import { Search, SlidersHorizontal } from "lucide-react";

const Home = () => {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [matches, setMatches] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      const res = await axios.get("https://projectx-ojl3.onrender.com/api/items/all");
      setItems(res.data);
    };
    fetchItems();
  }, []);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const res = await axios.get(
            "https://projectx-ojl3.onrender.com/api/items/matches",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setMatches(res.data);
        }
      } catch (err) {
        console.log("Match fetch failed");
      }
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

  return (
    <div className="max-w-7xl mx-auto px-8 py-10">
      <div className="relative max-w-xl mx-auto mb-12">
        <div className="relative flex items-center">
          <Search className="absolute left-4 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search for items (e.g. 'iPhone', 'Library', 'Watch')..."
            className="w-full pl-12 pr-12 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all text-slate-600"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute right-4 text-slate-300">
            <SlidersHorizontal size={18} />
          </div>
        </div>
        {searchQuery && (
          <p className="text-xs text-slate-400 mt-2 ml-2">
            Showing results for "<span className="text-brand font-medium">{searchQuery}</span>"
          </p>
        )}
      </div>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-dark">Campus Feed</h2>
          <p className="text-slate-500">
            Live updates of lost and found items in college
          </p>
        </div>

        <div className="flex bg-white p-1 rounded-lg shadow-sm border border-slate-200">
          {["all", "lost", "found"].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition ${filter === t ? "bg-brand text-white" : "text-slate-600 hover:bg-slate-50"}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {matches.length > 0 && (
        <div className="mb-12 p-6 bg-orange-50 rounded-2xl border border-orange-200">
          <h2 className="text-xl font-bold text-orange-800 flex items-center gap-2">
            <span>✨ Smart Matches for You</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {matches.map((item) => (
              <ItemCard key={item._id} item={item} isMatch={true} />
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <ItemCard key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Home;
