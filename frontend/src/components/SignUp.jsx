import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function SignUp() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.fullName,   // ✅ matches backend now
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.detail || "Registration failed");
        setIsLoading(false);
        return;
      }

      alert("Account created successfully! Please login.");
      navigate("/login");

    } catch (error) {
      console.error("Signup error:", error);
      alert("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-4 font-sans">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md min-h-[650px] flex flex-col justify-between border border-gray-100">
        
        <div>
          <header className="mb-8 text-center">
            <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">
              Create Account
            </h2>
            <p className="text-gray-500 mt-3 text-sm">
              Join the digital signature platform
            </p>
          </header>

          <form onSubmit={handleSignUp} className="space-y-5">

            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Full Name
              </label>
              <input
                name="fullName"
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 hover:bg-white"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                placeholder="name@company.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 hover:bg-white"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 hover:bg-white"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 hover:bg-white"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 rounded-xl font-bold text-white transition-all transform active:scale-[0.98] shadow-md mt-4 ${
                isLoading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
              }`}
            >
              {isLoading ? "Creating account..." : "Sign Up"}
            </button>
          </form>
        </div>

        <footer className="mt-8 text-center text-gray-600 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-bold hover:text-blue-800 transition-colors"
          >
            Login
          </Link>
        </footer>
      </div>
    </div>
  );
}

export default SignUp;