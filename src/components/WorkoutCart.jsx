import React from "react";

const WorkoutCart = ({ cart, updateCartItem, removeFromCart, clearCart }) => {

  const totalExercises = cart.length;
  const totalSets = cart.reduce((sum, item) => sum + item.sets, 0);
  const totalReps = cart.reduce((sum, item) => sum + (item.sets * item.reps), 0);

  const handleSetChange = (exerciseId, newSets) => {
    if (newSets >= 0) {
      updateCartItem(exerciseId, { sets: newSets });
    }
  };

  const handleRepChange = (exerciseId, newReps) => {
    if (newReps >= 0) {
      updateCartItem(exerciseId, { reps: newReps });
    }
  };

  return (
    <div className="bg-white/45 rounded-2xl shadow-2xl p-6 transition-all duration-300 border border-white/60 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {totalExercises > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalExercises}
              </span>
            )}
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            Workout Cart
          </h3>
        </div>
      </div>

      {cart.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-gray-800 text-lg">Your workout cart is empty</p>
              <p className="text-gray-600 text-sm mt-2">Add exercises to start your workout!</p>
            </div>
          ) : (
            <>
              <div className="mb-4 p-3 bg-white/55 rounded-lg border border-white/60">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-700">Total Exercises:</span>
                  <span className="font-bold text-amber-700">{totalExercises}</span>
                </div>
                <div className="flex justify-between items-center text-sm mt-1">
                  <span className="text-gray-700">Total Sets:</span>
                  <span className="font-bold text-amber-700">{totalSets}</span>
                </div>
                <div className="flex justify-between items-center text-sm mt-1">
                  <span className="text-gray-700">Total Reps:</span>
                  <span className="font-bold text-amber-700">{totalReps}</span>
                </div>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="border border-white/60 rounded-xl p-4 hover:border-amber-400/50 transition-all duration-300 bg-white/45 backdrop-blur"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-bold text-gray-900 capitalize flex-1 pr-2">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-700 transition-colors p-1"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Sets Counter */}
                      <div className="flex-1">
                        <label className="text-xs text-gray-600 mb-1 block">Sets</label>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSetChange(item.id, item.sets - 1)}
                            className="w-8 h-8 rounded-lg bg-white/60 hover:bg-white/80 flex items-center justify-center font-bold text-gray-700 transition-colors border border-white/60"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            value={item.sets}
                            onChange={(e) => handleSetChange(item.id, parseInt(e.target.value) || 0)}
                            className="w-12 h-8 text-center border border-white/60 bg-white/50 rounded-lg font-bold text-gray-900 focus:outline-none focus:border-amber-400/60"
                            min="0"
                          />
                          <button
                            onClick={() => handleSetChange(item.id, item.sets + 1)}
                            className="w-8 h-8 rounded-lg bg-amber-400 hover:bg-amber-300 text-black flex items-center justify-center font-bold transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Reps Counter */}
                      <div className="flex-1">
                        <label className="text-xs text-gray-600 mb-1 block">Reps</label>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleRepChange(item.id, item.reps - 1)}
                            className="w-8 h-8 rounded-lg bg-white/60 hover:bg-white/80 flex items-center justify-center font-bold text-gray-700 transition-colors border border-white/60"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            value={item.reps}
                            onChange={(e) => handleRepChange(item.id, parseInt(e.target.value) || 0)}
                            className="w-12 h-8 text-center border border-white/60 bg-white/50 rounded-lg font-bold text-gray-900 focus:outline-none focus:border-amber-400/60"
                            min="0"
                          />
                          <button
                            onClick={() => handleRepChange(item.id, item.reps + 1)}
                            className="w-8 h-8 rounded-lg bg-orange-500 hover:bg-orange-400 text-black flex items-center justify-center font-bold transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
                >
                  Clear Cart
                </button>
              )}
            </>
          )}
    </div>
  );
};

export default WorkoutCart;
