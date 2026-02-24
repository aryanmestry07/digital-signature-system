import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.detail || "Invalid credentials");
        setIsLoading(false);
        return;
      }

      localStorage.setItem("token", data.access_token);
      navigate("/dashboard");

    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-4 font-sans">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md min-h-[620px] flex flex-col justify-between border border-gray-100">

        {/* App Logo & Name */}
        <div className="text-center mb-10">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-black text-2xl italic">S</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              Sign<span className="text-indigo-600">Flow</span>
            </h1>
          </div>
          <p className="text-gray-500 text-sm">
            Secure & seamless digital signing
          </p>
        </div>

        <div>
          <header className="mb-8 text-center">
            <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">
              Login
            </h2>
            <p className="text-gray-500 mt-2 text-sm">
              Access your digital signature dashboard
            </p>
          </header>

          <form onSubmit={handleLogin} className="space-y-6">

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@company.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-gray-50 hover:bg-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-gray-50 hover:bg-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 rounded-xl font-bold text-white transition-all transform active:scale-[0.98] shadow-md ${
                isLoading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg"
              }`}
            >
              {isLoading ? "Signing in..." : "Login"}
            </button>
          </form>
        </div>

        <footer className="mt-8">
          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-[10px] uppercase tracking-[0.2em] font-bold">
              Join Us
            </span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <p className="text-center text-gray-600 text-sm">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-indigo-600 font-bold hover:text-indigo-800 transition-colors"
            >
              Sign Up
            </Link>
          </p>
        </footer>

      </div>
    </div>
  );
}

export default Login;