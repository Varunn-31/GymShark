import React from "react";
const Exercises = ({ exercises }) => {
  return (
    <div id="exercises" className="mt-12 px-5 py-8">
      <h2 className="text-4xl font-bold mb-12 text-center text-gray-900">
        Showing Results
      </h2>
      {exercises.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-700">
            No exercises found. Search for exercises using the search bar above.
          </p>
        </div>
      ) : (
        <div className="bg-white/45 rounded-2xl shadow-sm border border-white/60 overflow-hidden backdrop-blur-xl">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 px-6 py-4 bg-white/60 text-xs uppercase tracking-wide text-gray-600 font-semibold">
            <span>Exercise</span>
            <span>Difficulty</span>
            <span>Type</span>
            <span>Equipment / Muscle</span>
          </div>
          <div className="divide-y divide-white/50">
            {exercises.map((exercise, index) => (
              <div
                key={exercise.id || index}
                className="grid grid-cols-1 sm:grid-cols-4 gap-4 px-6 py-4 text-sm text-gray-800"
              >
                <span className="font-semibold text-gray-900">{exercise.name}</span>
                <span className="capitalize">{exercise.difficulty || "unknown"}</span>
                <span className="capitalize">{exercise.type || "unknown"}</span>
                <span className="capitalize">
                  {exercise.equipment || "body weight"} · {exercise.bodyPart || exercise.muscle || "unknown"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Exercises;
