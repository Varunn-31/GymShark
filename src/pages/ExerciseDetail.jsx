import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";
import { fetchExercises } from "../utils/fetchData";
import { Detail, ExerciseVideos, SimilarExercises } from "../components";

const ExerciseDetail = () => {
  const [exerciseDetail, setExerciseDetail] = useState({});
  const [exerciseVideos, setExerciseVideos] = useState({});
  const [targetMuscleExercises, setTargetMuscleExercises] = useState([]);
  const [equipmentExercises, setEquipmentExercises] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    const fetchExercisesData = async () => {
      try {
        // Extract exercise name from ID (format: exercise-{index}-{name})
        const exerciseName = id.replace(/^exercise-\d+-/, '').replace(/-/g, ' ');
        
        // Fetch exercise by name
        const exercisesData = await fetchExercises({ name: exerciseName });
        
        if (exercisesData && exercisesData.length > 0) {
          // Find the exact match or use the first one
          const exercise = exercisesData.find(ex => 
            ex.id === id || ex.name.toLowerCase() === exerciseName.toLowerCase()
          ) || exercisesData[0];
          
          setExerciseDetail(exercise);

          // Fetch similar exercises by muscle/target
          const muscle = exercise.muscle || exercise.bodyPart;
          if (muscle && muscle !== 'unknown') {
            let similarByMuscle = [];
            for (let offset = 0; offset < 10; offset += 5) {
              const data = await fetchExercises({ muscle, offset });
              if (data.length === 0) break;
              // Filter out the current exercise
              const filtered = data.filter(ex => ex.id !== id && ex.name !== exercise.name);
              similarByMuscle = [...similarByMuscle, ...filtered];
              if (data.length < 5) break;
            }
            setTargetMuscleExercises(similarByMuscle.slice(0, 6));
          }

          // Fetch similar exercises by equipment
          if (exercise.equipment) {
            let similarByEquipment = [];
            for (let offset = 0; offset < 10; offset += 5) {
              const data = await fetchExercises({ equipment: exercise.equipment, offset });
              if (data.length === 0) break;
              // Filter out the current exercise
              const filtered = data.filter(ex => ex.id !== id && ex.name !== exercise.name);
              similarByEquipment = [...similarByEquipment, ...filtered];
              if (data.length < 5) break;
            }
            setEquipmentExercises(similarByEquipment.slice(0, 6));
          }

          // Set empty videos array (YouTube API would need separate setup)
          setExerciseVideos([]);
        }
      } catch (error) {
        console.error("Error fetching exercise detail:", error);
      }
    };
    fetchExercisesData();
  }, [id]);

  return (
    <Box>
      <Detail exerciseDetail={exerciseDetail} />
      <ExerciseVideos
        exerciseVideos={exerciseVideos}
        name={exerciseDetail.name}
      />
      <SimilarExercises
        targetMuscleExercises={targetMuscleExercises}
        equipmentExercises={equipmentExercises}
      />
    </Box>
  );
};

export default ExerciseDetail;
