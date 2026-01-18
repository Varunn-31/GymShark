import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { auth } from "../firebase";
import Logo from "../assets/images/Logo.png";

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, guest, setGuest } = useAuth();
  const { cart } = useCart();
  const cartCount = cart.length;
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      if (user) {
        await signOut(auth);
      }
    } finally {
      setGuest(false);
      navigate("/signin");
    }
  };

  return (
    <nav className="sticky top-0 z-50">
      <div className="mx-auto max-w-6xl w-[calc(100%-24px)] mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-3 bg-white/45 backdrop-blur-xl border border-white/40 shadow-[0_12px_35px_rgba(0,0,0,0.22)] rounded-2xl">
      <div className="flex items-center justify-between w-full sm:w-auto">
        <Link to="/" className="flex items-center shrink-0 gap-2">
        <img
          src={Logo}
          alt="Logo"
          className="w-12 h-12 drop-shadow"
        />
        <span className="hidden sm:inline text-base font-semibold text-gray-900 tracking-tight">GymShark</span>
        </Link>
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden inline-flex items-center justify-center w-10 h-10 rounded-full border border-black/10 text-gray-800 hover:text-amber-600 hover:border-amber-400/50 transition bg-white/30"
          aria-label="Toggle navigation"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      <div className="hidden sm:flex flex-wrap items-center justify-center sm:justify-end gap-4 sm:gap-6 text-sm sm:text-base font-semibold text-gray-800 w-full sm:w-auto">
        <Link
          to="/"
          className={`transition-all duration-300 hover:text-amber-700 ${
            location.pathname === "/" ? 'text-amber-700 border-b-2 border-amber-500 pb-1' : ''
          }`}
          style={{ textDecoration: "none" }}
        >
          Home
        </Link>
        <Link
          to="/workout-cart"
          className={`transition-all duration-300 hover:text-amber-700 relative ${
            location.pathname === "/workout-cart" ? 'text-amber-700 border-b-2 border-amber-500 pb-1' : ''
          }`}
          style={{ textDecoration: "none" }}
        >
          Workout Cart
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-4 bg-amber-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 inline-flex items-center justify-center leading-none">
              {cartCount}
            </span>
          )}
        </Link>
        <Link
          to="/ai-coach"
          className={`transition-all duration-300 hover:text-amber-700 ${
            location.pathname === "/ai-coach" ? 'text-amber-700 border-b-2 border-amber-500 pb-1' : ''
          }`}
          style={{ textDecoration: "none" }}
        >
          AI Coach
        </Link>
        <Link
          to="/nutrition"
          className={`transition-all duration-300 hover:text-amber-700 ${
            location.pathname === "/nutrition" ? 'text-amber-700 border-b-2 border-amber-500 pb-1' : ''
          }`}
          style={{ textDecoration: "none" }}
        >
          Nutrition
        </Link>
        {!user && !guest && (
          <>
            <Link
              to="/signin"
              className={`transition-all duration-300 hover:text-amber-700 ${
                location.pathname === "/signin" ? 'text-amber-700 border-b-2 border-amber-500 pb-1' : ''
              }`}
              style={{ textDecoration: "none" }}
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className={`transition-all duration-300 hover:text-amber-700 ${
                location.pathname === "/signup" ? 'text-amber-700 border-b-2 border-amber-500 pb-1' : ''
              }`}
              style={{ textDecoration: "none" }}
            >
              Sign Up
            </Link>
          </>
        )}
        {(user || guest) && (
          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-full border border-black/10 bg-white/30 px-3 py-1 text-xs sm:text-sm font-semibold text-gray-900 transition-all duration-300 hover:border-amber-400/50 hover:text-amber-700"
          >
            Sign Out
          </button>
        )}
      </div>
      {menuOpen && (
        <div className="sm:hidden flex flex-col gap-3 rounded-2xl border border-white/40 bg-white/55 backdrop-blur-xl shadow-[0_12px_35px_rgba(0,0,0,0.22)] p-4">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="text-gray-900 font-semibold"
          >
            Home
          </Link>
          <Link
            to="/workout-cart"
            onClick={() => setMenuOpen(false)}
            className="text-gray-900 font-semibold"
          >
            Workout Cart
          </Link>
          <Link
            to="/ai-coach"
            onClick={() => setMenuOpen(false)}
            className="text-gray-900 font-semibold"
          >
            AI Coach
          </Link>
          <Link
            to="/nutrition"
            onClick={() => setMenuOpen(false)}
            className="text-gray-900 font-semibold"
          >
            Nutrition
          </Link>
          {!user && !guest && (
            <>
              <Link
                to="/signin"
                onClick={() => setMenuOpen(false)}
                className="text-gray-900 font-semibold"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="text-gray-900 font-semibold"
              >
                Sign Up
              </Link>
            </>
          )}
          {(user || guest) && (
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                handleSignOut();
              }}
              className="text-left text-gray-900 font-semibold"
            >
              Sign Out
            </button>
          )}
        </div>
      )}
      </div>
    </nav>
  );
};

export default NavBar;
