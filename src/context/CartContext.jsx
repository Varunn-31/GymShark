import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // Load cart from localStorage on mount
    const savedCart = localStorage.getItem('workoutCart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('workoutCart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (exercise) => {
    // Check if exercise is already in cart
    const existingItem = cart.find(item => item.id === exercise.id);
    
    if (existingItem) {
      return; // Already in cart
    }

    // Add new exercise to cart with default sets and reps
    const newItem = {
      id: exercise.id,
      name: exercise.name,
      sets: 3,
      reps: 10,
      exercise: exercise
    };

    setCart([...cart, newItem]);
  };

  const updateCartItem = (exerciseId, updates) => {
    setCart(cart.map(item => 
      item.id === exerciseId 
        ? { ...item, ...updates }
        : item
    ));
  };

  const removeFromCart = (exerciseId) => {
    setCart(cart.filter(item => item.id !== exerciseId));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('workoutCart');
  };

  const isInCart = (exerciseId) => {
    return cart.some(item => item.id === exerciseId);
  };

  const value = {
    cart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    isInCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
