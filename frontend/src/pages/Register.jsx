import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, Mail, Lock, User } from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { login } = useContext(AuthContext); // We'll use this to log them in automatically after signup
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://projectx-ojl3.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        alert("Registration Successful!");
        login(data.user, data.token); // Store session
        navigate("/");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
        <div className="text-center mb-8">
          <div className="bg-brand/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-brand">
            <UserPlus size={32} />
          </div>
          <h2 className="text-3xl font-black text-dark">Join the Community</h2>
          <p className="text-slate-500 mt-2">
            Create an account to help your campus.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User
              className="absolute left-3 top-3.5 text-slate-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Full Name"
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand outline-none transition"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="relative">
            <Mail
              className="absolute left-3 top-3.5 text-slate-400"
              size={20}
            />
            <input
              type="email"
              placeholder="College Email"
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand outline-none transition"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div className="relative">
            <Lock
              className="absolute left-3 top-3.5 text-slate-400"
              size={20}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand outline-none transition"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>

          <button className="w-full bg-brand text-white font-bold py-3 rounded-xl hover:shadow-lg hover:bg-orange-600 transition duration-300">
            Create Account
          </button>
        </form>

        <p className="text-center text-slate-600 mt-6 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-brand font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
