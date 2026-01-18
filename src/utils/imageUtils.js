// Utility function to get better workout images based on exercise name and muscle
export const getExerciseImage = (exercise) => {
  const exerciseName = exercise.name?.toLowerCase() || '';
  const muscle = exercise.muscle?.toLowerCase() || exercise.bodyPart?.toLowerCase() || '';
  
  // Map exercises to better Unsplash images
  const imageMap = {
    // Cardio exercises
    'cardio': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    'running': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop',
    'cycling': 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&h=400&fit=crop',
    'jumping': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=400&fit=crop',
    
    // Upper body
    'biceps': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop',
    'triceps': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop',
    'shoulders': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop',
    'delts': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop',
    'chest': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    'pectorals': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    'back': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop',
    'lats': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop',
    
    // Lower body
    'legs': 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400&h=400&fit=crop',
    'quadriceps': 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400&h=400&fit=crop',
    'hamstrings': 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400&h=400&fit=crop',
    'calves': 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400&h=400&fit=crop',
    'glutes': 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400&h=400&fit=crop',
    
    // Core
    'abdominals': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    'abs': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    'core': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    
    // Specific exercises
    'pull': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop',
    'push': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    'curl': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop',
    'press': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    'squat': 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400&h=400&fit=crop',
    'deadlift': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop',
  };

  // Check for specific exercise names
  for (const [key, url] of Object.entries(imageMap)) {
    if (exerciseName.includes(key) || muscle.includes(key)) {
      return url;
    }
  }

  // Default based on muscle group
  if (muscle.includes('bicep') || muscle.includes('tricep') || muscle.includes('arm')) {
    return 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop';
  }
  if (muscle.includes('chest') || muscle.includes('pectoral')) {
    return 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop';
  }
  if (muscle.includes('leg') || muscle.includes('quad') || muscle.includes('hamstring') || muscle.includes('calf')) {
    return 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400&h=400&fit=crop';
  }
  if (muscle.includes('shoulder') || muscle.includes('delt')) {
    return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop';
  }
  if (muscle.includes('back') || muscle.includes('lat')) {
    return 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop';
  }

  // Default fitness image
  return 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center';
};
