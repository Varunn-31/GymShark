// Groq API utility functions
const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY;
const GROQ_NUTRITION_API_KEY = process.env.REACT_APP_GROQ_API_KEY_2;
const GROQ_VISION_API_KEY = process.env.REACT_APP_GROQ_API_KEY || process.env.REACT_APP_GROQ_API_KEY_2;
const GROQ_API_URL = 'https://api.groq.com/openai/v1';

// Convert image to text description for nutrition calculation
export const imageToTextForNutrition = async (imageBase64) => {
  try {
    if (!GROQ_VISION_API_KEY || GROQ_VISION_API_KEY === '') {
      throw new Error('Groq vision API key is not configured. Please add REACT_APP_GROQ_API_KEY to your .env file.');
    }
    // Convert base64 to data URL
    const imageDataUrl = `data:image/jpeg;base64,${imageBase64}`;
    
    // Try with vision-capable models first
    const visionModels = [
      'llama-3.2-90b-vision-preview',
      'llama-3.1-70b-versatile',
      'llama-3.1-8b-instant'
    ];

    for (const model of visionModels) {
      try {
        const response = await fetch(`${GROQ_API_URL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GROQ_VISION_API_KEY}`
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: 'system',
                content: 'You are a nutrition assistant. Analyze the food image and describe it in detail, including all food items, quantities, and preparation methods. Format your response as a clear, concise description that can be used to calculate nutrition. Example: "1 large grilled chicken breast (200g), 1 cup of steamed broccoli, 1 medium baked potato (150g)"'
              },
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: 'Analyze this food image and provide a detailed description of all food items with quantities for nutrition calculation. Be specific about portions and cooking methods:'
                  },
                  {
                    type: 'image_url',
                    image_url: {
                      url: imageDataUrl
                    }
                  }
                ]
              }
            ],
            max_tokens: 500,
            temperature: 0.3
          })
        });

        if (response.ok) {
          const data = await response.json();
          const description = data.choices[0]?.message?.content || '';
          if (description) {
            console.log(`Successfully analyzed image using ${model}`);
            return description;
          }
        } else {
          const errorData = await response.json();
          console.warn(`Model ${model} failed:`, errorData);
          // Try next model
          continue;
        }
      } catch (modelError) {
        console.warn(`Error with model ${model}:`, modelError);
        // Try next model
        continue;
      }
    }

    // If all vision models fail, throw error to use text input
    throw new Error('Image analysis is not available. Please use text input to describe your meal.');
  } catch (error) {
    console.error('Error converting image to text:', error);
    throw error;
  }
};

export const getNutritionFactsFromDescription = async (description) => {
  if (!GROQ_NUTRITION_API_KEY || GROQ_NUTRITION_API_KEY === '') {
    throw new Error('Groq nutrition API key is not configured. Please add REACT_APP_GROQ_API_KEY_2 to your .env file.');
  }

  const nutritionModels = [
    'llama-3.1-8b-instant',
    'llama-3.1-70b-versatile',
    'mixtral-8x7b-32768'
  ];

  for (const model of nutritionModels) {
    const response = await fetch(`${GROQ_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_NUTRITION_API_KEY}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: 'You are a nutrition analysis engine. Convert a food description into nutrition facts. Return ONLY valid JSON with this shape: {"items":[{"name":"string","calories":number,"protein_g":number,"carbohydrates_total_g":number,"fat_total_g":number,"serving_size_g":number,"fiber_g":number,"sugar_g":number}],"totals":{"calories":number,"protein_g":number,"carbohydrates_total_g":number,"fat_total_g":number,"fiber_g":number,"sugar_g":number}}. Use grams for macro nutrients. Do not add any text outside the JSON.'
          },
          {
            role: 'user',
            content: `Food description: ${description}`
          }
        ],
        max_tokens: 700,
        temperature: 0.2
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 401 || response.status === 403) {
        throw new Error(`Groq nutrition API error: ${response.status} ${errorData.error?.message || ''}`.trim());
      }
      continue;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    try {
      return JSON.parse(content);
    } catch (error) {
      throw new Error('Could not parse nutrition data from Groq response.');
    }
  }

  throw new Error('All nutrition models failed. Please try again later.');
};

// AI Coach chat function
export const getAICoachResponse = async (message, exerciseContext = null) => {
  // Check if API key is available
  if (!GROQ_API_KEY || GROQ_API_KEY === '') {
    throw new Error('Groq API key is not configured. Please add REACT_APP_GROQ_API_KEY to your .env file.');
  }

  const systemPrompt = exerciseContext 
    ? `You are an expert fitness coach. The user is viewing exercises. Provide helpful, motivational, and educational fitness advice. Be concise, friendly, and professional. Current exercise context: ${exerciseContext}`
    : 'You are an expert fitness coach. Provide helpful, motivational, and educational fitness advice. Be concise, friendly, and professional.';

  // Try multiple models as fallback
  const models = ['llama-3.1-8b-instant', 'llama-3.1-70b-versatile', 'mixtral-8x7b-32768'];
  
  for (const model of models) {
    try {
      const response = await fetch(`${GROQ_API_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.choices && data.choices[0] && data.choices[0].message) {
          const content = data.choices[0].message.content;
          if (content) {
            console.log(`Successfully got response using model: ${model}`);
            return content;
          }
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.warn(`Model ${model} failed:`, errorData);
        // If it's an auth error, don't try other models
        if (response.status === 401 || response.status === 403) {
          throw new Error('Invalid API key. Please check your REACT_APP_GROQ_API_KEY in .env file.');
        }
        // Try next model
        continue;
      }
    } catch (error) {
      // If it's a network error or auth error, throw immediately
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error('Network error: Please check your internet connection and try again.');
      }
      if (error.message.includes('Invalid API key')) {
        throw error;
      }
      console.warn(`Error with model ${model}:`, error);
      // Try next model
      continue;
    }
  }

  // If all models failed
  throw new Error('All AI models failed. Please check your API key and try again.');
};
