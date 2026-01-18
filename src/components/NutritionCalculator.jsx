import React, { useState } from "react";
import { imageToTextForNutrition, getNutritionFactsFromDescription } from "../utils/groqApi";

const NutritionCalculator = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [textInput, setTextInput] = useState("");
  const [useTextInput, setUseTextInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nutritionData, setNutritionData] = useState(null);
  const [error, setError] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        // Convert to base64 for API
        const base64Reader = new FileReader();
        base64Reader.onloadend = () => {
          const base64 = base64Reader.result.split(',')[1];
          setImage(base64);
        };
        base64Reader.readAsDataURL(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatNumber = (value) => {
    const numberValue = typeof value === "number" ? value : Number(value);
    return Number.isFinite(numberValue) ? Math.round(numberValue) : 0;
  };

  const handleCalculateWithImage = async (imageBase64) => {
    if (!imageBase64) return;

    setLoading(true);
    setError(null);
    setNutritionData(null);

    try {
      const foodDescription = await imageToTextForNutrition(imageBase64);
      console.log("Food description from image:", foodDescription);

      if (!foodDescription) {
        setError("Could not analyze the image. Please try describing the food manually.");
        setUseTextInput(true);
        setLoading(false);
        return;
      }

      setTextInput(foodDescription);
      setUseTextInput(true);

      const nutritionResponse = await getNutritionFactsFromDescription(foodDescription);

      if (nutritionResponse?.items?.length) {
        setNutritionData({
          items: nutritionResponse.items,
          totals: nutritionResponse.totals,
          description: foodDescription
        });
      } else {
        setError("Could not calculate nutrition. Please try a clearer image or describe the food manually.");
        setUseTextInput(true);
      }
    } catch (err) {
      console.error("Error calculating nutrition:", err);
      setError(err.message || "Failed to analyze image. Please try describing the food manually.");
      setUseTextInput(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCalculate = async () => {
    if (!image && !textInput.trim()) {
      setError("Please upload an image or enter food description");
      return;
    }

    setLoading(true);
    setError(null);
    setNutritionData(null);

    try {
      let foodDescription = "";
      
      if (useTextInput && textInput.trim()) {
        foodDescription = textInput.trim();
      } else if (image) {
        try {
          foodDescription = await imageToTextForNutrition(image);
          console.log("Food description from image:", foodDescription);
          if (foodDescription) {
            setTextInput(foodDescription);
            setUseTextInput(true);
          }
        } catch (imgError) {
          setError("Image analysis failed. Please describe the food items manually.");
          setUseTextInput(true);
          setLoading(false);
          return;
        }
      }

      if (!foodDescription) {
        setError("Please provide a food description");
        setLoading(false);
        return;
      }

      const nutritionResponse = await getNutritionFactsFromDescription(foodDescription);

      if (nutritionResponse?.items?.length) {
        setNutritionData({
          items: nutritionResponse.items,
          totals: nutritionResponse.totals,
          description: foodDescription
        });
      } else {
        setError("Could not calculate nutrition. Please try a clearer description or different food.");
      }
    } catch (err) {
      console.error("Error calculating nutrition:", err);
      setError(err.message || "Failed to calculate nutrition. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetCalculator = () => {
    setImage(null);
    setImagePreview(null);
    setTextInput("");
    setNutritionData(null);
    setError(null);
  };

  return (
    <div className="p-6 rounded-2xl bg-white/45 border border-white/60 backdrop-blur-xl text-gray-900 mb-6 shadow-2xl">
      <h3 className="text-3xl font-bold mb-2 text-gray-900">Nutrition Calculator</h3>
      <p className="text-gray-700 mb-6 text-sm">
        Upload a photo of your meal and get instant nutrition information
      </p>

      <div className="mb-4">
        <button
          onClick={() => setUseTextInput(!useTextInput)}
          className="mb-4 text-gray-900 border border-white/60 bg-white/40 rounded-lg px-4 py-2 hover:bg-white/60 transition-all duration-300"
        >
          {useTextInput ? 'Switch to Image Upload' : 'Switch to Text Input'}
        </button>
      </div>

      {useTextInput ? (
        <div>
          <textarea
            placeholder="Describe your meal (e.g., '1 grilled chicken breast, 1 cup rice, steamed broccoli')"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            rows={4}
            className="w-full mb-4 bg-white/55 border border-white/60 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400/60 resize-none"
          />
          <button
            onClick={handleCalculate}
            disabled={loading || !textInput.trim()}
            className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold py-4 rounded-xl hover:from-amber-300 hover:to-orange-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                <span>Calculating...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span>Calculate Nutrition</span>
              </>
            )}
          </button>
        </div>
      ) : !imagePreview ? (
        <div className="grid gap-4 md:grid-cols-2">
          <label
            htmlFor="nutrition-image-upload"
            className="block border-2 border-dashed border-white/70 bg-white/35 rounded-xl p-8 text-center cursor-pointer transition-all duration-300 hover:bg-white/55"
          >
            <input
              accept="image/*"
              className="hidden"
              id="nutrition-image-upload"
              type="file"
              onChange={handleImageUpload}
            />
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-gray-800 cursor-pointer">Click to upload food image</p>
          </label>
          <label
            htmlFor="nutrition-image-camera"
            className="block border-2 border-dashed border-white/70 bg-white/35 rounded-xl p-8 text-center cursor-pointer transition-all duration-300 hover:bg-white/55"
          >
            <input
              accept="image/*"
              capture="environment"
              className="hidden"
              id="nutrition-image-camera"
              type="file"
              onChange={handleImageUpload}
            />
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8h4l2-3h6l2 3h4v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 17a4 4 0 100-8 4 4 0 000 8z" />
            </svg>
            <p className="text-gray-800 cursor-pointer">Click to take a picture</p>
          </label>
        </div>
      ) : (
        <div>
          <div className="relative mb-4">
            <img
              src={imagePreview}
              alt="Food preview"
              className="w-full max-h-[300px] object-cover rounded-xl"
            />
            <button
              onClick={resetCalculator}
              className="absolute top-2 right-2 bg-black/50 text-white px-4 py-2 rounded-lg hover:bg-black/70 transition-all duration-300"
            >
              Change Image
            </button>
          </div>
          {loading ? (
            <div className="w-full bg-white/55 text-gray-900 font-bold py-4 rounded-xl flex items-center justify-center gap-2 border border-white/60">
              <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
              <span>Analyzing image and calculating nutrition...</span>
            </div>
          ) : (
            <button
              onClick={() => handleCalculateWithImage(image)}
              disabled={loading || !image}
              className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold py-4 rounded-xl hover:from-amber-300 hover:to-orange-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span>Calculate Nutrition</span>
            </button>
          )}
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-500/15 rounded-xl border border-red-500/30">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {nutritionData && (
        <div className="mt-6 bg-white/40 rounded-xl p-4 border border-white/60">
          <h4 className="text-xl font-bold mb-4 text-gray-900">Nutrition Information</h4>
          
          {nutritionData.description && (
            <div className="mb-4 p-3 bg-white/55 rounded-lg italic text-gray-700 text-sm border border-white/60">
              Detected: {nutritionData.description}
            </div>
          )}

          {nutritionData.items && nutritionData.items.length > 0 && (
            <div className="mb-6">
              <h5 className="text-lg font-bold mb-3 text-gray-900">Calories per Item:</h5>
              <div className="space-y-3">
                {nutritionData.items.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white/55 rounded-xl border border-white/60"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h6 className="text-gray-900 font-bold text-base">
                        {item.name || `Item ${index + 1}`}
                      </h6>
                      <span className="bg-white/70 text-amber-700 font-bold text-sm px-3 py-1 rounded-full border border-white/60">
                        {formatNumber(item.calories)} kcal
                      </span>
                    </div>
                    <div className="flex gap-4 flex-wrap mt-2 text-sm text-gray-700">
                      <span>Protein: {formatNumber(item.protein_g)}g</span>
                      <span>Carbs: {formatNumber(item.carbohydrates_total_g)}g</span>
                      <span>Fat: {formatNumber(item.fat_total_g)}g</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {nutritionData.totals && (
            <div className="mt-6 pt-6 border-t-2 border-black/10 bg-white/40 rounded-xl p-4 border border-white/60">
              <h5 className="text-lg font-bold mb-4 text-gray-900">Total Summary:</h5>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-900 font-bold text-lg">Total Calories</span>
                  <span className="bg-white/70 text-amber-700 font-bold text-base px-4 py-2 rounded-full border border-white/60">
                    {formatNumber(nutritionData.totals.calories)} kcal
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Total Protein</span>
                  <span className="text-gray-900 font-bold">{formatNumber(nutritionData.totals.protein_g)}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Total Carbs</span>
                  <span className="text-gray-900 font-bold">{formatNumber(nutritionData.totals.carbohydrates_total_g)}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Total Fat</span>
                  <span className="text-gray-900 font-bold">{formatNumber(nutritionData.totals.fat_total_g)}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Total Fiber</span>
                  <span className="text-gray-900 font-bold">{formatNumber(nutritionData.totals.fiber_g)}g</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NutritionCalculator;
