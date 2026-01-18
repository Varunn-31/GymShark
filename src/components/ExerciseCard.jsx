import React from "react";
import { Link } from "react-router-dom";
import { getExerciseImage } from "../utils/imageUtils";

const ExerciseCard = ({ exercise, onAddToCart, isInCart }) => {
  // Get better workout image based on exercise
  const imageUrl = exercise.gifUrl || getExerciseImage(exercise);
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(exercise);
    }
  };
  
  return (
    <div className="relative w-full max-w-sm bg-white/45 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/60 hover:border-amber-400/50 backdrop-blur-xl group">
      <Link 
        to={`/exercise/${exercise.id}`} 
        className="block"
        style={{ textDecoration: 'none' }}
      >
        {/* Image Container */}
        <div className="relative h-80 overflow-hidden bg-gray-100">
          <img 
            src={imageUrl} 
            alt={exercise.name} 
            loading="lazy" 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-orange-600 shadow-md capitalize">
              {exercise.bodyPart || exercise.muscle || 'exercise'}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 shadow-md capitalize">
              {exercise.target || exercise.muscle || exercise.equipment || 'target'}
            </span>
          </div>

          {/* Exercise Name */}
          <h3 className="text-xl font-bold text-gray-900 capitalize mb-2 group-hover:text-amber-700 transition-all duration-300">
            {exercise.name}
          </h3>
        </div>
      </Link>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        className={`absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-110 ${
          isInCart
            ? 'bg-green-500 hover:bg-green-600 text-white'
            : 'bg-white/70 hover:bg-amber-400 text-gray-900 hover:text-black border border-white/60'
        }`}
        title={isInCart ? 'Already in cart' : 'Add to workout cart'}
      >
        {isInCart ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default ExerciseCard;
