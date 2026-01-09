import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Link } from "react-router-dom";
import { loginRequest } from "../features/auth/authSlice";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";

const Login = () => {
  const dispatch = useDispatch();

  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  /* ===== VALIDATION ===== */
  const validate = () => {
    const errors = {};

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    if (formErrors[e.target.name]) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: ""
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    dispatch(loginRequest(formData));
  };

  /* ✅ Prevent logged-in users */
  if (isAuthenticated) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-amber-50 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo/Header Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-emerald-600 to-cyan-500 p-3 rounded-xl shadow-lg">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-500 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600 text-sm">Sign in to manage your short links</p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 space-y-6"
        >
          {/* Email Field */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-800">
              Email Address
            </label>
            <div
              className={`relative flex items-center transition-all duration-200 rounded-lg border-2 ${
                focusedField === "email"
                  ? "border-emerald-500 bg-emerald-50"
                  : formErrors.email
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200 bg-gray-50 hover:border-gray-300"
              }`}
            >
              <Mail className={`absolute left-3 w-5 h-5 transition-colors ${
                focusedField === "email"
                  ? "text-emerald-600"
                  : formErrors.email
                  ? "text-red-500"
                  : "text-gray-400"
              }`} />
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                className="w-full bg-transparent pl-10 pr-4 py-3 text-gray-900 placeholder-gray-500 outline-none text-sm"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
              />
            </div>
            {formErrors.email && (
              <div className="flex items-center gap-1 text-red-600 text-xs font-medium">
                <AlertCircle className="w-4 h-4" />
                {formErrors.email}
              </div>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-gray-800">
                Password
              </label>
              <button
                type="button"
                className="text-xs text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
              >
                Forgot?
              </button>
            </div>
            <div
              className={`relative flex items-center transition-all duration-200 rounded-lg border-2 ${
                focusedField === "password"
                  ? "border-emerald-500 bg-emerald-50"
                  : formErrors.password
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200 bg-gray-50 hover:border-gray-300"
              }`}
            >
              <Lock className={`absolute left-3 w-5 h-5 transition-colors ${
                focusedField === "password"
                  ? "text-emerald-600"
                  : formErrors.password
                  ? "text-red-500"
                  : "text-gray-400"
              }`} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                className="w-full bg-transparent pl-10 pr-12 py-3 text-gray-900 placeholder-gray-500 outline-none text-sm"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {formErrors.password && (
              <div className="flex items-center gap-1 text-red-600 text-xs font-medium">
                <AlertCircle className="w-4 h-4" />
                {formErrors.password}
              </div>
            )}
          </div>

          {/* API Error Alert */}
          {error && (
            <div className="flex gap-3 bg-red-50 border border-red-200 rounded-lg p-3 animate-shake">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 text-sm font-medium">Login Failed</p>
                <p className="text-red-600 text-xs mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
              loading
                ? "bg-gray-400 cursor-not-allowed opacity-75"
                : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-95"
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-gray-500 text-xs">New here?</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{" "}
              <Link to="/signup" className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors">
                Create one
              </Link>
            </p>
          </div>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-6">
          Protected by enterprise-grade security
        </p>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Login;
