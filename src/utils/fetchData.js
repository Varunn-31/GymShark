export const exerciseOptions = {
    method: 'GET',
    headers: {
      'X-Api-Key': process.env.REACT_APP_RAPID_API_KEY || '6PC08XLGQTLVYix9HSVG6AJ191kL1WhltfgzzHE6'
    }
  };

export const youtubeOptions = {
    method: 'GET',
    url: 'https://youtube-search-and-download.p.rapidapi.com/channel/about',
    params: {id: 'UCE_M8A5yxnLfW0KghEeajjw'},
    headers: {
      'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY ,
      'X-RapidAPI-Host': 'youtube-search-and-download.p.rapidapi.com'
    }
  };

// Map API Ninjas response to match app structure
const mapExerciseData = (exercise, index) => {
  const uniqueId = `exercise-${Date.now()}-${index}-${exercise.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
  return {
    id: uniqueId,
    name: exercise.name,
    bodyPart: exercise.muscle || 'unknown',
    target: exercise.muscle || 'unknown',
    muscle: exercise.muscle || 'unknown',
    equipment: exercise.equipment || 'body weight',
    type: exercise.type || 'strength',
    difficulty: exercise.difficulty || 'beginner',
    gifUrl: `https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center`,
    instructions: exercise.instructions || []
  };
};

export const fetchData = async (url, options) => {
    try {
        const response = await fetch(url, options)
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error fetching data:', error);
        // Return empty array or default data to prevent crashes
        return [];
    }
}

// Fetch exercises from API Ninjas with pagination support
export const fetchExercises = async (params = {}) => {
  try {
    const baseUrl = 'https://api.api-ninjas.com/v1/exercises';
    const queryParams = new URLSearchParams();
    
    if (params.name) queryParams.append('name', params.name);
    if (params.type) queryParams.append('type', params.type);
    if (params.muscle) queryParams.append('muscle', params.muscle);
    if (params.difficulty) queryParams.append('difficulty', params.difficulty);
    if (params.equipment) queryParams.append('equipment', params.equipment);
    if (params.offset) queryParams.append('offset', params.offset);
    
    const url = `${baseUrl}?${queryParams.toString()}`;
    const data = await fetchData(url, exerciseOptions);
    
    // Map the data to match app structure
    return data.map((exercise, index) => mapExerciseData(exercise, index));
  } catch (error) {
    console.error('Error fetching exercises:', error);
    return [];
  }
}