// src/components/Navbar.jsx
const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm border-b border-slate-100">
      <div className="flex items-center gap-2">
        <div className="bg-brand p-2 rounded-lg">
          {/* We'll add an icon here later */}
          <div className="w-5 h-5 bg-white rounded-sm"></div>
        </div>
        <h1 className="text-xl font-bold text-dark tracking-tight">
          Campus<span className="text-brand">Retrieve</span>
        </h1>
      </div>

      <div className="flex gap-6">
        <a
          href="/login"
          className="text-sm font-semibold text-slate-600 hover:text-brand"
        >
          Sign In
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
