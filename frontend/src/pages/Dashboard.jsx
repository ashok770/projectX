import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Package, CheckCircle, Clock } from "lucide-react";

const Dashboard = () => {
  const [myItems, setMyItems] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchMyItems = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/items/my-items", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyItems(res.data);
    };
    fetchMyItems();
  }, []);

  const handleDelete = async (itemId) => {
    if (window.confirm("Are you sure you want to remove this report?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/items/${itemId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMyItems(myItems.filter((item) => item._id !== itemId));
        alert("Item deleted successfully!");
      } catch (err) {
        alert("Failed to delete item.");
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Profile Header */}
      <div className="bg-dark text-white p-8 rounded-3xl mb-10 flex justify-between items-center shadow-xl">
        <div>
          <h2 className="text-3xl font-bold">Hello, {user?.name}! 👋</h2>
          <p className="text-slate-300 mt-1">
            Manage your reports and track your impact.
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm uppercase tracking-widest text-slate-400">
            Trust Score
          </p>
          <p className="text-5xl font-black text-brand">{user?.trustScore}</p>
        </div>
      </div>

      <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-dark">
        <Package className="text-brand" /> Your Reported Items
      </h3>

      <div className="space-y-4">
        {myItems.map((item) => (
          <div
            key={item._id}
            className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.type === "found" ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"}`}
              >
                {item.type === "found" ? "F" : "L"}
              </div>
              <div>
                <h4 className="font-bold text-dark">{item.itemName}</h4>
                <p className="text-sm text-slate-500">
                  {item.location} •{" "}
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${item.status === "active" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}
              >
                {item.status === "active" ? (
                  <Clock size={12} />
                ) : (
                  <CheckCircle size={12} />
                )}
                {item.status.toUpperCase()}
              </span>
              <button
                onClick={() => handleDelete(item._id)}
                className="text-red-500 text-sm font-semibold hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
