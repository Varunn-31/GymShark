import React from "react";
import { NutritionCalculator } from "../components";

const NutritionCalculatorPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent">
          Nutrition Calculator
        </h1>
        <div className="max-w-2xl mx-auto">
          <NutritionCalculator />
        </div>
      </div>
    </div>
  );
};

export default NutritionCalculatorPage;
