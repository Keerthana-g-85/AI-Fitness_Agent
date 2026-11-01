import { gql } from "graphql-request";

export const GET_DAILY_TRACKING = gql`
  query GetDailyTracking($date: String!) {
    getDailyTracking(date: $date) {
      date
      foodIntakes {
        id
        foodName
        mealType
        servingSize
        calories
        proteinG
        carbsG
        fatG
        fiberG
        consumedOn
        notes
      }
      waterIntakes {
        id
        amountMl
        consumedOn
        notes
        createdAt
      }
      workouts {
        id
        name
        workoutType
        performedOn
        durationMinutes
        caloriesBurned
        intensity
        notes
        exercises {
          id
          exerciseName
          sets
          reps
          weightKg
          durationMinutes
          distanceKm
          caloriesBurned
        }
      }
      sleepRecord {
        id
        sleepDate
        bedTime
        wakeTime
        durationMinutes
        quality
        notes
      }
      sportsActivities {
        id
        sportName
        activityDate
        durationMinutes
        intensity
        caloriesBurned
        location
        notes
      }
      totalCaloriesConsumed
      totalWaterMl
      totalWorkoutCalories
      totalSportCalories
      dailyWaterTargetMl
      sleepGoalMinutes
    }
  }
`;
