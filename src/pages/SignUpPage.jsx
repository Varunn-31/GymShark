import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useAuth } from "../context/AuthContext";

const SignUpPage = () => {
  const navigate = useNavigate();
  const { user, guest, setGuest } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user || guest) {
      navigate("/");
    }
  }, [user, guest, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setGuest(false);
      navigate("/");
    } catch (err) {
      setError(err.message || "Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      await signInWithPopup(auth, googleProvider);
      setGuest(false);
      navigate("/");
    } catch (err) {
      setError(err.message || "Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestAccess = () => {
    setGuest(true);
    navigate("/");
  };

  return (
    <div className="auth-page min-h-[calc(100vh-140px)] flex items-center justify-center px-4 py-12">
      <div className="auth-card w-full max-w-md bg-white/45 shadow-2xl rounded-2xl border border-white/60 p-8 backdrop-blur-xl">
        <div className="mb-6 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-700 font-semibold">GymShark</p>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">Create your account</h1>
          <p className="text-gray-700 mt-2">Start tracking workouts, nutrition, and progress.</p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full mb-4 flex items-center justify-center gap-3 rounded-xl border border-white/60 bg-white/55 py-3 text-gray-900 font-semibold hover:bg-white/70 transition disabled:opacity-60"
        >
          <svg viewBox="0 0 48 48" className="w-5 h-5" aria-hidden="true">
            <path
              fill="#FFC107"
              d="M43.611 20.083H42V20H24v8h11.303C33.845 32.631 29.258 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.963 3.037l5.657-5.657C34.047 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.651-.389-3.917z"
            />
            <path
              fill="#FF3D00"
              d="M6.306 14.691l6.571 4.819C14.552 16.108 18.961 12 24 12c3.059 0 5.842 1.154 7.963 3.037l5.657-5.657C34.047 6.053 29.268 4 24 4c-7.682 0-14.344 4.337-17.694 10.691z"
            />
            <path
              fill="#4CAF50"
              d="M24 44c5.164 0 9.86-1.977 13.409-5.198l-6.191-5.238C29.211 35.091 26.715 36 24 36c-5.237 0-9.82-3.355-11.287-7.985l-6.53 5.026C9.497 39.556 16.227 44 24 44z"
            />
            <path
              fill="#1976D2"
              d="M43.611 20.083H42V20H24v8h11.303c-0.873 2.481-2.641 4.583-4.965 5.563l6.191 5.238C38.205 36.355 44 32 44 24c0-1.341-.138-2.651-.389-3.917z"
            />
          </svg>
          Sign up with Google
        </button>

        <button
          type="button"
          onClick={handleGuestAccess}
          className="w-full mb-5 rounded-xl border border-amber-400/40 bg-amber-300/15 text-amber-900 font-semibold py-3 hover:bg-amber-300/20 transition"
        >
          Continue as Guest
        </button>

        <div className="flex items-center gap-3 mb-4">
          <span className="flex-1 h-px bg-black/10"></span>
          <span className="text-xs uppercase text-gray-500">or</span>
          <span className="flex-1 h-px bg-black/10"></span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-white/60 bg-white/55 px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400/60"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-white/60 bg-white/55 px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400/60"
              placeholder="Minimum 6 characters"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-amber-400 text-black font-semibold py-3 hover:bg-amber-300 transition disabled:opacity-60"
          >
            {loading ? "Please wait..." : "Create account"}
          </button>
        </form>

        <p className="text-sm text-gray-700 text-center mt-6">
          Already have an account?
          <Link to="/signin" className="ml-2 text-amber-700 font-semibold hover:text-amber-600">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
