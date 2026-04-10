import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; // Added Link
import { Mail, Lock } from "lucide-react"; // Added Icons for a better look

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://projectx-ojl3.onrender.com/api/auth/login", {
        email,
        password,
      });
      login(res.data);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-[80vh]">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-slate-100">
        <h2 className="text-3xl font-black text-dark text-center mb-2">
          Welcome Back
        </h2>
        <p className="text-slate-500 text-center mb-8">
          Login to report or claim items
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              College Email
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-3.5 text-slate-400"
                size={18}
              />
              <input
                type="email"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand bg-slate-50"
                placeholder="name@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-3.5 text-slate-400"
                size={18}
              />
              <input
                type="password"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand bg-slate-50"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-brand text-white font-bold py-3 rounded-xl hover:bg-orange-600 hover:shadow-lg transition duration-300"
          >
            Sign In
          </button>
        </form>

        {/* 🚀 This is the missing part you needed! */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-slate-600 text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-brand font-bold hover:underline"
            >
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
