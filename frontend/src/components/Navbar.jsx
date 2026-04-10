import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Search, PlusCircle, LayoutDashboard, LogOut, ShieldCheck } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-100 sticky top-0 z-50">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <div className="bg-brand p-2 rounded-lg text-white font-bold">C</div>
        <h1 className="text-xl font-bold text-dark tracking-tight hidden md:block">
          Campus<span className="text-brand">Retrieve</span>
        </h1>
      </Link>

      {/* Actions */}
      <div className="flex items-center gap-4 md:gap-8">
        {user ? (
          <>
            <Link
              to="/report-found"
              className="flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-brand transition"
            >
              <PlusCircle size={18} />
              <span className="hidden sm:inline">Report Found</span>
            </Link>

            <Link
              to="/report-lost"
              className="flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-blue-500 transition"
            >
              <Search size={18} />
              <span className="hidden sm:inline">Report Lost</span>
            </Link>
            <Link
              to="/dashboard"
              className="flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-brand transition"
            >
              <LayoutDashboard size={18} />
              <span className="hidden sm:inline">My Dashboard</span>
            </Link>
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            {user && user.role === "admin" && (
              <Link
                to="/admin"
                className="flex items-center gap-1 text-sm font-bold text-purple-600 hover:text-purple-700 transition px-3 py-1 bg-purple-50 rounded-lg border border-purple-100"
              >
                <ShieldCheck size={18} />
                <span>Staff Panel</span>
              </Link>
            )}
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] uppercase font-bold text-slate-400 leading-none">
                  Trust Score
                </p>
                <p className="text-sm font-bold text-green-600">
                  {user.trustScore}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-500 transition"
              >
                <LogOut size={20} />
              </button>
            </div>
          </>
        ) : (
          <Link
            to="/login"
            className="bg-brand text-white px-6 py-2 rounded-full font-bold text-sm hover:shadow-lg transition"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
