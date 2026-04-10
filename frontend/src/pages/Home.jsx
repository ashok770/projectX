import { useEffect, useState } from "react";
import axios from "axios";
import ItemCard from "../components/ItemCard";
import { Search, SlidersHorizontal, Sparkles } from "lucide-react";

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

      <div className="bg-orange-50/50 border border-orange-100 rounded-3xl p-8 mb-12">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="text-brand animate-pulse" size={20} />
          <h2 className="text-xl font-bold text-dark">Smart Matches for You</h2>
        </div>
        {matches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((item) => (
              <ItemCard key={item._id} item={item} isMatch={true} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="bg-white p-6 rounded-full shadow-inner mb-4 relative">
              <Search className="text-slate-300 animate-bounce" size={40} />
              <div className="absolute -top-1 -right-1 bg-brand w-4 h-4 rounded-full border-2 border-white"></div>
            </div>
            <h3 className="text-lg font-bold text-slate-700">No matches... yet!</h3>
            <p className="text-sm text-slate-500 max-w-xs mx-auto mt-2 leading-relaxed">
              Our AI is scanning every new report at <b>Sri Eshwar College</b>.
              Grab a coffee, we'll notify you the moment a match is found!
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <ItemCard key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Home;
