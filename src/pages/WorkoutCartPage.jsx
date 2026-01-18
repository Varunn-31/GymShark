import React from "react";
import { WorkoutCart } from "../components";
import { useCart } from "../context/CartContext";

const WorkoutCartPage = () => {
  const { cart, updateCartItem, removeFromCart, clearCart } = useCart();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent">
          My Workout Cart
        </h1>
        <div className="max-w-2xl mx-auto">
          <WorkoutCart
            cart={cart}
            updateCartItem={updateCartItem}
            removeFromCart={removeFromCart}
            clearCart={clearCart}
          />
        </div>
      </div>
    </div>
  );
};

export default WorkoutCartPage;
