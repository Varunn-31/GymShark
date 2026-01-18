import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeroBanner, SearchExercises, Exercises } from "../components";
import { useCart } from "../context/CartContext";
import { fetchExercises } from "../utils/fetchData";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

const Home = () => {
  const [exercises, setExercises] = useState([]);
  const { cart, addToCart, clearCart, isInCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loadingAll, setLoadingAll] = useState(false);
  const [dashboardSaveState, setDashboardSaveState] = useState("idle");

  const handleShowAllExercises = async () => {
    setLoadingAll(true);
    try {
      const muscles = [
        "abdominals",
        "abductors",
        "adductors",
        "biceps",
        "calves",
        "chest",
        "forearms",
        "glutes",
        "hamstrings",
        "lats",
        "lower_back",
        "middle_back",
        "neck",
        "quadriceps",
        "traps",
        "triceps"
      ];

      const allExercises = [];
      for (const muscle of muscles) {
        const data = await fetchExercises({ muscle });
        allExercises.push(...data);
      }

      const uniqueExercises = Array.from(
        new Map(
          allExercises.map((exercise) => [
            `${exercise.name}-${exercise.muscle}-${exercise.equipment}-${exercise.type}`.toLowerCase(),
            exercise
          ])
        ).values()
      );

      setExercises(uniqueExercises);
    } finally {
      setLoadingAll(false);
    }
  };

  const cartSummary = useMemo(() => {
    const totalExercises = cart.length;
    const totalSets = cart.reduce((sum, item) => sum + (Number(item.sets) || 0), 0);
    const totalReps = cart.reduce((sum, item) => sum + (Number(item.reps) || 0), 0);
    return { totalExercises, totalSets, totalReps };
  }, [cart]);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;
    const persist = async () => {
      try {
        if (!cancelled) setDashboardSaveState("saving");

        const ref = doc(db, "users", user.uid, "ui", "home_dashboard");
        await setDoc(
          ref,
          {
            updatedAt: serverTimestamp(),
            cartSummary: {
              totalExercises: cartSummary.totalExercises,
              totalSets: cartSummary.totalSets,
              totalReps: cartSummary.totalReps,
            },
          },
          { merge: true }
        );

        if (!cancelled) setDashboardSaveState("saved");
      } catch (e) {
        if (!cancelled) setDashboardSaveState("error");
      }
    };

    persist();
    return () => {
      cancelled = true;
    };
  }, [user, cartSummary.totalExercises, cartSummary.totalSets, cartSummary.totalReps]);

  return (
    <div>
      <HeroBanner />
      
      <div className="container mx-auto px-4 mt-8 mb-8">
        <div className="mb-6 rounded-2xl bg-white/45 border border-white/60 backdrop-blur-xl shadow-[0_18px_50px_rgba(0,0,0,0.18)] p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">Today’s Plan</h2>
              <p className="mt-1 text-sm text-gray-700">
                {cartSummary.totalExercises === 0
                  ? "Your workout cart is empty. Add a few exercises to build today’s session."
                  : "Your workout cart is ready. Review it or clear it in one tap."}
              </p>
            </div>

            {user && (
              <div className="shrink-0 text-xs font-semibold text-gray-700 bg-white/55 border border-white/60 rounded-full px-3 py-1">
                {dashboardSaveState === "saving" && "Syncing…"}
                {dashboardSaveState === "saved" && "Synced"}
                {dashboardSaveState === "error" && "Offline"}
                {dashboardSaveState === "idle" && ""}
              </div>
            )}
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl bg-white/55 border border-white/60 p-4">
              <div className="text-xs font-semibold text-gray-600">Exercises</div>
              <div className="mt-1 text-2xl font-extrabold text-gray-900">{cartSummary.totalExercises}</div>
            </div>
            <div className="rounded-xl bg-white/55 border border-white/60 p-4">
              <div className="text-xs font-semibold text-gray-600">Total Sets</div>
              <div className="mt-1 text-2xl font-extrabold text-gray-900">{cartSummary.totalSets}</div>
            </div>
            <div className="rounded-xl bg-white/55 border border-white/60 p-4">
              <div className="text-xs font-semibold text-gray-600">Total Reps</div>
              <div className="mt-1 text-2xl font-extrabold text-gray-900">{cartSummary.totalReps}</div>
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => navigate("/workout-cart")}
              className="w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-black bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 transition"
            >
              Go to Cart
            </button>
            <button
              type="button"
              onClick={() => clearCart()}
              disabled={cartSummary.totalExercises === 0}
              className="w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-gray-900 bg-white/55 border border-white/60 hover:bg-white/70 transition disabled:opacity-50"
            >
              Clear Cart
            </button>
          </div>
        </div>

        <SearchExercises setExercises={setExercises} />

        <div className="flex justify-center mt-6">
          <label className="flex items-center gap-3 text-sm font-semibold text-gray-900 bg-white/40 border border-white/50 rounded-xl px-4 py-2 shadow-[0_12px_35px_rgba(0,0,0,0.18)] backdrop-blur-xl">
            <span>Exercises</span>
            <select
              className="bg-transparent focus:outline-none text-amber-700"
              onChange={(event) => {
                if (event.target.value === "all") {
                  handleShowAllExercises();
                }
              }}
              defaultValue="default"
            >
              <option value="default" disabled>
                Select
              </option>
              <option value="all">Show All Exercises</option>
            </select>
          </label>
        </div>
        
        {exercises.length > 0 && (
          <Exercises
            exercises={exercises}
            setExercises={setExercises}
            onAddToCart={addToCart}
            isInCart={isInCart}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
