import { useEffect, useState } from "react";
import axios from "axios";
import ItemCard from "../components/ItemCard";

const Home = () => {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchItems = async () => {
      const res = await axios.get("http://localhost:5000/api/items/all");
      setItems(res.data);
    };
    fetchItems();
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <ItemCard key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Home;
