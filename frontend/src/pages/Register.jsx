import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, Mail, Lock, User, ArrowRight, CheckCircle } from "lucide-react";
import axios from "axios";

const inputClass = "w-full pl-10 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition text-sm";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post("https://projectx-ojl3.onrender.com/api/auth/register", formData);
      const res = await axios.post("https://projectx-ojl3.onrender.com/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });
      login(res.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const perks = [
    "Report found items & earn trust points",
    "AI-powered matching for lost items",
    "Secure 6-digit claim verification",
    "Real-time campus lost & found feed",
  ];

  return (
    <div className="min-h-[90vh] flex animate-fade-in">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 items-center justify-center p-12">
        <div className="max-w-sm text-white">
          <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-orange-500/30">
            <UserPlus size={28} />
          </div>
          <h2 className="text-4xl font-black mb-4 leading-tight">
            Join <span className="text-orange-400">1000+</span> students helping each other.
          </h2>
          <p className="text-slate-400 leading-relaxed mb-8">
            Be part of Sri Eshwar's most trusted lost & found community.
          </p>
          <div className="space-y-3">
            {perks.map((p) => (
              <div key={p} className="flex items-start gap-3 text-slate-300 text-sm">
                <CheckCircle size={16} className="text-orange-400 mt-0.5 shrink-0" />
                {p}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm mb-8 transition">
              ← Back to home
            </Link>
            <h1 className="text-3xl font-black text-slate-900">Create account</h1>
            <p className="text-slate-500 mt-2">Join the CampusRetrieve community</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl mb-6 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { icon: <User size={17} />, label: "Full Name", type: "text", key: "name", placeholder: "Ashok Kumar" },
              { icon: <Mail size={17} />, label: "College Email", type: "email", key: "email", placeholder: "name@college.edu" },
              { icon: <Lock size={17} />, label: "Password", type: "password", key: "password", placeholder: "Min. 8 characters" },
            ].map(({ icon, label, type, key, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>
                  <input
                    type={type}
                    placeholder={placeholder}
                    className={inputClass}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    required
                  />
                </div>
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 text-white font-bold py-3.5 rounded-xl transition-all shadow-sm shadow-orange-200 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Create Account <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-8">
            Already have an account?{" "}
            <Link to="/login" className="text-orange-500 font-bold hover:text-orange-600 transition">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
