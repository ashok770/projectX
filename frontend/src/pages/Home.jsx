import { useEffect, useState } from "react";
import axios from "axios";
import ItemCard from "../components/ItemCard";

const Home = () => {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      const res = await axios.get("http://localhost:5000/api/items/all");
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
            "http://localhost:5000/api/items/matches",
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          setMatches(res.data);
        }
      } catch (err) {
        console.log("Match fetch failed");
      }
    };
    fetchMatches();
  }, []);

  // Inside your return(), before the main "Campus Feed" heading:
  {
    matches.length > 0 && (
      <div className="mb-10 bg-gradient-to-r from-orange-500 to-brand p-1 rounded-2xl shadow-lg">
        <div className="bg-white p-6 rounded-[calc(1rem-1px)]">
          <div className="flex items-center gap-2 mb-4">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
            </span>
            <h2 className="text-xl font-bold text-dark">
              Possible Matches Found!
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matches.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        </div>
      </div>
    );
  }
  useEffect(() => {
    const fetchMatches = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const res = await axios.get(
          "http://localhost:5000/api/items/smart-matches",
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setMatches(res.data);
      }
    };
    fetchMatches();
  }, []);

  const filteredItems =
    filter === "all" ? items : items.filter((i) => i.type === filter);

  return (
    <div className="max-w-7xl mx-auto px-8 py-10">
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
