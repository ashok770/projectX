import { useState } from "react";
import { MapPin, Calendar, Building2, Sparkles } from "lucide-react";
import VerifyModal from "./VerifyModal";

const ItemCard = ({ item, isMatch }) => {
  const isFound = item.type === "found";
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className={`bg-white rounded-2xl border overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group cursor-pointer ${
        isMatch ? "border-purple-200 shadow-md shadow-purple-100" : "border-slate-100 shadow-sm"
      }`}>

        {/* Image */}
        <div className="relative h-44 w-full bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
          {item.image ? (
            <img
              src={item.image}
              alt={item.itemName}
              className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
                isFound ? "blur-sm group-hover:blur-none" : ""
              }`}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-300 gap-2">
              <div className="w-12 h-12 bg-slate-200 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">{isFound ? "📦" : "🔍"}</span>
              </div>
              <p className="text-xs font-medium">No photo</p>
            </div>
          )}

          {/* Type Badge */}
          <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black text-white shadow-sm ${
            isFound
              ? "bg-gradient-to-r from-orange-500 to-orange-600"
              : "bg-gradient-to-r from-blue-500 to-blue-600"
          }`}>
            {item.type.toUpperCase()}
          </div>

          {/* AI Match Badge */}
          {isMatch && (
            <div className="absolute top-3 right-3 bg-purple-600 text-white px-2 py-1 rounded-full text-[10px] font-black flex items-center gap-1 shadow-sm">
              <Sparkles size={9} /> AI
            </div>
          )}

          {/* Blur hint */}
          {isFound && item.image && (
            <div className="absolute inset-0 flex items-end justify-center pb-3 opacity-100 group-hover:opacity-0 transition-opacity">
              <span className="bg-black/50 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-sm">
                Hover to reveal
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-black text-slate-900 truncate text-base group-hover:text-orange-600 transition-colors">
            {item.itemName}
          </h3>

          <div className="space-y-1.5 mt-2">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
              <MapPin size={12} className="text-slate-400 shrink-0" />
              <span className="truncate">{item.location}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
              <Calendar size={12} className="text-slate-400 shrink-0" />
              <span>{new Date(item.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
            </div>
            {isFound && item.dropOffLocation && (
              <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-medium">
                <Building2 size={12} className="shrink-0" />
                <span className="truncate">{item.dropOffLocation}</span>
              </div>
            )}
          </div>

          {/* AI Confidence */}
          {item.aiConfidence && (
            <div className="mt-3 p-2.5 bg-purple-50 rounded-xl border border-purple-100">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] uppercase font-black text-purple-600 flex items-center gap-1">
                  <Sparkles size={9} /> Gemini Match
                </p>
                <span className="text-[10px] font-black text-purple-700">{item.aiConfidence}%</span>
              </div>
              <div className="w-full bg-purple-100 rounded-full h-1.5">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-1.5 rounded-full transition-all" style={{ width: `${item.aiConfidence}%` }} />
              </div>
              {item.aiReason && <p className="text-[10px] text-purple-600 italic mt-1.5">"{item.aiReason}"</p>}
            </div>
          )}

          <button
            onClick={() => setShowModal(true)}
            className={`w-full mt-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
              isFound
                ? "bg-orange-500 hover:bg-orange-600 text-white shadow-sm shadow-orange-200"
                : "bg-blue-500 hover:bg-blue-600 text-white shadow-sm shadow-blue-200"
            }`}
          >
            {isFound ? "Claim This Item" : "View Details"}
          </button>
        </div>
      </div>

      {showModal && <VerifyModal item={item} onClose={() => setShowModal(false)} />}
    </>
  );
};

export default ItemCard;
