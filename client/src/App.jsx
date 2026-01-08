import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { meRequest } from "./features/auth/authSlice";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "react-hot-toast";


export default function App() {
  const dispatch = useDispatch()

   useEffect(() => {
     dispatch(meRequest());
   }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "10px",
            background: "#111",
            color: "#fff"
          }
        }}
        />
      <main className="flex-1">
        <Routes>
          {/* Public routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
