// Nutrition API utility functions
const NUTRITION_API_KEY = process.env.REACT_APP_NUTRITION_API_KEY || '6PC08XLGQTLVYix9HSVG6AJ191kL1WhltfgzzHE6';
const NUTRITION_API_URL = 'https://api.api-ninjas.com/v1/nutrition';

// Fetch nutrition data from text description
export const getNutritionData = async (query) => {
  try {
    const response = await fetch(`${NUTRITION_API_URL}?query=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'X-Api-Key': NUTRITION_API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`Nutrition API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching nutrition data:', error);
    throw error;
  }
};

// Calculate total nutrition from multiple items
export const calculateTotalNutrition = (items) => {
  if (!items || items.length === 0) return null;

  const totals = items.reduce((acc, item) => {
    acc.calories += item.calories || 0;
    acc.serving_size_g += item.serving_size_g || 0;
    acc.fat_total_g += item.fat_total_g || 0;
    acc.fat_saturated_g += item.fat_saturated_g || 0;
    acc.protein_g += item.protein_g || 0;
    acc.sodium_mg += item.sodium_mg || 0;
    acc.potassium_mg += item.potassium_mg || 0;
    acc.cholesterol_mg += item.cholesterol_mg || 0;
    acc.carbohydrates_total_g += item.carbohydrates_total_g || 0;
    acc.fiber_g += item.fiber_g || 0;
    acc.sugar_g += item.sugar_g || 0;
    return acc;
  }, {
    calories: 0,
    serving_size_g: 0,
    fat_total_g: 0,
    fat_saturated_g: 0,
    protein_g: 0,
    sodium_mg: 0,
    potassium_mg: 0,
    cholesterol_mg: 0,
    carbohydrates_total_g: 0,
    fiber_g: 0,
    sugar_g: 0
  });

  return totals;
};
