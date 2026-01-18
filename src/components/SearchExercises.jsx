import React, { useState, useEffect, useRef } from "react";
import { fetchExercises } from "../utils/fetchData";
import { useCart } from "../context/CartContext";

const SearchExercises = ({ setExercises }) => {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  const { addToCart } = useCart();

  // Debounced search for autocomplete
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim().length >= 2) {
        fetchSuggestions(search.trim());
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchSuggestions = async (query) => {
    setLoading(true);
    try {
      const exercisesData = await fetchExercises({ name: query, offset: 0 });
      setSuggestions(exercisesData.slice(0, 5));
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (search.trim()) {
      try {
        setLoading(true);
        const exercisesData = await fetchExercises({ name: search.trim(), offset: 0 });
        setExercises(exercisesData);
        setShowSuggestions(false);
        setSearch("");
      } catch (error) {
        console.error("Error searching exercises:", error);
        setExercises([]);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSuggestionClick = (exercise) => {
    setSearch(exercise.name);
    setExercises([exercise]);
    setShowSuggestions(false);
    // Optionally add to cart automatically
    addToCart(exercise);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center mt-6 px-5 py-4">
      {/* Search Bar with Icon and Autocomplete */}
      <div className="relative mb-8 w-full max-w-4xl" ref={searchRef}>
        <div className="relative flex items-center">
          <div className="absolute left-4 z-10">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              if (e.target.value.length >= 2) {
                setShowSuggestions(true);
              }
            }}
            onKeyPress={handleKeyPress}
            onFocus={() => {
              if (suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            placeholder="Search exercises (e.g., bench press, squats, curls)..."
            className="w-full h-14 pl-14 pr-32 rounded-full border border-white/60 focus:border-amber-400/60 focus:outline-none text-lg font-medium shadow-[0_12px_35px_rgba(0,0,0,0.18)] transition-all duration-300 hover:shadow-[0_18px_50px_rgba(0,0,0,0.22)] focus:shadow-[0_20px_60px_rgba(0,0,0,0.25)] bg-white/45 backdrop-blur-xl text-gray-900 placeholder-gray-500"
          />
          <button
            onClick={handleSearch}
            disabled={loading || !search.trim()}
            className="absolute right-2 h-10 px-6 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold text-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:from-amber-300 hover:to-orange-400 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Search"
            )}
          </button>
        </div>

        {/* Autocomplete Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-2 bg-white/55 rounded-xl shadow-2xl border border-white/60 max-h-80 overflow-y-auto backdrop-blur-xl">
            {suggestions.map((exercise, index) => (
              <div
                key={exercise.id || index}
                onClick={() => handleSuggestionClick(exercise)}
                className="p-4 hover:bg-white/60 cursor-pointer transition-colors duration-200 border-b border-white/40 last:border-b-0"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 capitalize">{exercise.name}</h4>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs px-2 py-1 rounded-full bg-white/50 text-gray-800 capitalize border border-white/50">
                        {exercise.bodyPart || exercise.muscle || 'exercise'}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-white/50 text-gray-800 capitalize border border-white/50">
                        {exercise.equipment || 'body weight'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(exercise);
                    }}
                    className="ml-4 w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white flex items-center justify-center hover:scale-110 transition-transform"
                    title="Add to cart"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showSuggestions && search.length >= 2 && suggestions.length === 0 && !loading && (
          <div className="absolute z-50 w-full mt-2 bg-white/55 rounded-xl shadow-2xl border border-white/60 p-4 backdrop-blur-xl">
            <p className="text-gray-700 text-center">No exercises found. Try a different search term.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchExercises;
