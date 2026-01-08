import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { loginRequest } from "../features/auth/authSlice";
import { Eye, EyeOff } from "lucide-react"; // Import the icons

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
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

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

    // clear field error while typing
    setFormErrors({
      ...formErrors,
      [e.target.name]: ""
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    dispatch(loginRequest(formData));
  };

  /* ✅ Prevent logged-in users */
  if (isAuthenticated) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-5"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Welcome Back 👋
        </h2>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            className={`input ${formErrors.email ? "border-red-500" : ""}`}
            value={formData.email}
            onChange={handleChange}
          />
          {formErrors.email && (
            <p className="text-red-500 text-xs">{formErrors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"} // Toggle between text and password
              name="password"
              placeholder="••••••••"
              className={`input ${formErrors.password ? "border-red-500" : ""}`}
              value={formData.password}
              onChange={handleChange}
            />
            <span
              onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
              className="absolute right-3 top-1/3 transform -translate-y-1/2 cursor-pointer"
            >
              {showPassword ? <EyeOff /> : <Eye />} {/* Show Eye or EyeOff icon */}
            </span>
          </div>
          {formErrors.password && (
            <p className="text-red-500 text-xs">{formErrors.password}</p>
          )}
        </div>

        {/* API Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`btn-primary w-full mt-2 ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <span className="text-indigo-600 font-medium cursor-pointer">
            Sign up
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
