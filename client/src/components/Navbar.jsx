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
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
      {/* Brand Name */}
      <Link to="/" className="text-2xl font-semibold hover:text-gray-300">
        Shortify
      </Link>

      {/* Hamburger Menu for Mobile */}
      <div className="md:hidden">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="text-white" size={24} /> : <Menu className="text-white" size={24} />}
        </button>
      </div>

      {/* Links for Large Screens */}
      <div className="hidden md:flex space-x-6 items-center">
        <Link to="/" className="hover:text-gray-300">Home</Link>

        {!isAuthenticated ? (
          <>
            <Link to="/login" className="hover:text-gray-300">Login</Link>
            <Link to="/signup" className="hover:text-gray-300">Register</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">{user?.fullName}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </>
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 right-0 bg-gray-800 w-full p-4 flex flex-col space-y-4">
          <Link to="/" className="hover:text-gray-300">Home</Link>

          {!isAuthenticated ? (
            <>
              <Link to="/login" className="hover:text-gray-300">Login</Link>
              <Link to="/signup" className="hover:text-gray-300">Register</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
              <div className="flex flex-col space-y-4">
                <span className="text-sm text-gray-300">{user?.fullName}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition"
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
