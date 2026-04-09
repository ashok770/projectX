import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm border-b border-slate-100">
      <Link to="/" className="flex items-center gap-2">
        <div className="bg-brand p-2 rounded-lg w-8 h-8 flex items-center justify-center text-white font-bold">
          C
        </div>
        <h1 className="text-xl font-bold text-dark tracking-tight">
          Campus<span className="text-brand">Retrieve</span>
        </h1>
      </Link>

      <div className="flex items-center gap-6">
        {user ? (
          <>
            <Link to="/dashboard" className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full">
              <span className="text-xs font-bold text-green-600">
                Trust: {user.trustScore}
              </span>
            </Link>
            <button
              onClick={logout}
              className="text-sm font-semibold text-red-500"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="text-sm font-semibold text-slate-600 hover:text-brand transition"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
