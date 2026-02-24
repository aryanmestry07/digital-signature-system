import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); // To highlight the active link
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
      {/* Brand Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-black text-xl italic">S</span>
        </div>
        <h2 className="font-black text-xl tracking-tight text-slate-900">
          Sign<span className="text-indigo-600">Flow</span>
        </h2>
      </div>

      {token && (
        <div className="flex items-center gap-8">
          <Link
            to="/dashboard"
            className={`text-sm font-bold transition-colors ${
              isActive("/dashboard") 
              ? "text-indigo-600" 
              : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Dashboard
          </Link>

          {/* User Profile / Logout Group */}
          <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
          
            
            <button
              onClick={handleLogout}
              className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all transform active:scale-95 shadow-sm"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;