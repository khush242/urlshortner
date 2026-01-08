import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerRequest } from "../features/auth/authSlice";
import { Eye, EyeOff } from "lucide-react"; 

const Signup = () => {
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth);

  // State for form data and password visibility
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  /* ===== VALIDATION ===== */
  const validate = () => {
    const errors = {};

    if (!formData.fullName) {
      errors.fullName = "Full name is required";
    }

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
      [e.target.name]: e.target.value,
    });

    // clear field error while typing
    setFormErrors({
      ...formErrors,
      [e.target.name]: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    dispatch(registerRequest(formData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-5"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Create Account 🎉
        </h2>

        {/* Full Name */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            name="fullName"
            placeholder="Your full name"
            className={`input ${formErrors.fullName ? "border-red-500" : ""}`}
            value={formData.fullName}
            onChange={handleChange}
          />
          {formErrors.fullName && (
            <p className="text-red-500 text-xs">{formErrors.fullName}</p>
          )}
        </div>

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
              type={passwordVisible ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              className={`input ${formErrors.password ? "border-red-500" : ""}`}
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute right-3 top-1/3 transform -translate-y-1/2 text-gray-500"
            >
              {passwordVisible ? (
                <EyeOff size={20} /> // Lucide EyeOff icon
              ) : (
                <Eye size={20} /> // Lucide Eye icon
              )}
            </button>
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
          className={`btn-primary w-full mt-2 ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <span className="text-indigo-600 font-medium cursor-pointer">
            Log in
          </span>
        </p>
      </form>            
    </div>
  );
};

export default Signup;
