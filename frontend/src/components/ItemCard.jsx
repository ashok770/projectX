import { MapPin, Calendar, ShieldCheck } from "lucide-react";

const ItemCard = ({ item }) => {
  const isFound = item.type === "found";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition">
      <div className="relative h-48 w-full bg-slate-200">
        {item.image ? (
          <img
            src={item.image}
            alt={item.itemName}
            className={`w-full h-full object-cover ${isFound ? "blur-md hover:blur-none transition-all duration-500" : ""}`}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400">
            No Image
          </div>
        )}
        <span
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white ${isFound ? "bg-orange-500" : "bg-blue-500"}`}
        >
          {item.type.toUpperCase()}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg text-dark truncate">
          {item.itemName}
        </h3>
        <div className="flex items-center gap-1 text-slate-500 text-sm mt-1">
          <MapPin size={14} />
          <span>{item.location}</span>
        </div>
        <div className="flex items-center gap-1 text-slate-500 text-sm mt-1">
          <Calendar size={14} />
          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
        </div>

        <button className="w-full mt-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50 transition">
          View Details
        </button>
      </div>
    </div>
  );
};

export default ItemCard;
