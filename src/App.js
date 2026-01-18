import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import { Home, ExerciseDetail, WorkoutCartPage, AICoachPage, NutritionCalculatorPage, SignInPage, SignUpPage } from "./pages";
import { NavBar } from "./components";
import { CartProvider } from "./context/CartContext";
import { useAuth } from "./context/AuthContext";
import "./App.css";

const App = () => {
  const { user, loading, guest } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user && !guest && !["/signin", "/signup"].includes(location.pathname)) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <CartProvider>
      <div className="w-full max-w-7xl mx-auto min-h-screen bg-transparent">
        {!['/signin', '/signup'].includes(location.pathname) && <NavBar />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/exercise/:id" element={<ExerciseDetail />} />
          <Route path="/workout-cart" element={<WorkoutCartPage />} />
          <Route path="/ai-coach" element={<AICoachPage />} />
          <Route path="/nutrition" element={<NutritionCalculatorPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
      </div>
    </CartProvider>
  );
};

export default App;
