import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutRequest } from "../features/auth/authSlice";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // Import Lucide icons

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [isMenuOpen, setIsMenuOpen] = useState(false); // For mobile menu toggle

  const handleLogout = () => {
    dispatch(logoutRequest());
    navigate("/login");
  };

  return (
    <nav className="bg-white px-6 py-4 flex justify-between items-center border-b border-emerald-200 shadow-sm">
      {/* Brand Name */}
      <Link to="/" className="text-2xl font-semibold bg-gradient-to-r from-emerald-600 to-cyan-500 bg-clip-text text-transparent hover:opacity-80">
        Shortify
      </Link>

      {/* Hamburger Menu for Mobile */}
      <div className="md:hidden">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="text-gray-700" size={24} /> : <Menu className="text-gray-700" size={24} />}
        </button>
      </div>

      {/* Links for Large Screens */}
      <div className="hidden md:flex space-x-6 items-center">
        <Link to="/" className="text-gray-700 hover:text-emerald-600 font-medium transition">Home</Link>

        {!isAuthenticated ? (
          <>
            <Link to="/login" className="text-gray-700 hover:text-emerald-600 font-medium transition">Login</Link>
            <Link to="/signup" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded hover:from-amber-600 hover:to-orange-600 transition">Register</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" className="text-gray-700 hover:text-emerald-600 font-medium transition">Dashboard</Link>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user?.fullName}</span>
              <button
                onClick={handleLogout}
                className="bg-red-50 text-red-600 px-3 py-1 rounded hover:bg-red-100 transition font-medium"
              >
                Logout
              </button>
            </div>
          </>
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 right-0 bg-white border border-emerald-200 w-full p-4 flex flex-col space-y-4 shadow-lg">
          <Link to="/" className="text-gray-700 hover:text-emerald-600 font-medium transition">Home</Link>

          {!isAuthenticated ? (
            <>
              <Link to="/login" className="text-gray-700 hover:text-emerald-600 font-medium transition">Login</Link>
              <Link to="/signup" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded hover:from-amber-600 hover:to-orange-600 transition font-medium text-center">Register</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="text-gray-700 hover:text-emerald-600 font-medium transition">Dashboard</Link>
              <div className="flex flex-col space-y-4">
                <span className="text-sm text-gray-600">{user?.fullName}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-50 text-red-600 px-3 py-1 rounded hover:bg-red-100 transition font-medium"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
