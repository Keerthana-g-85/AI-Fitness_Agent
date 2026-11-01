import { gql } from "graphql-request";

export const GET_MY_PROFILE = gql`
  query GetMyProfile {
    getMyProfile {
      user {
        id
        name
        email
        onboardingCompleted
        onboardingCompletedAt
      }
      profile {
        dateOfBirth
        heightCm
        gender
        occupation
        country
        activityLevel
      }
      fitnessGoal {
        id
        primaryGoal
        secondaryGoal
        currentWeightKg
        targetWeightKg
        targetBodyFatPercentage
        targetMuscleMassKg
        targetDate
      }
      latestBodyMeasurement {
        id
        weightKg
        neckCm
        shoulderCm
        chestCm
        bustCm
        waistCm
        abdomenCm
        hipCm
        leftArmCm
        rightArmCm
        leftThighCm
        rightThighCm
        leftCalfCm
        rightCalfCm
        heightCm
        source
        measuredAt
        notes
        createdAt
      }
      latestBodyComposition {
        id
        bodyFatPercentage
        fatMassKg
        muscleMassKg
        skeletalMuscleMassKg
        leanBodyMassKg
        bodyWaterPercentage
        totalBodyWaterLiters
        visceralFat
        boneMassKg
        proteinPercentage
        bmrKcal
        bmi
        metabolicAge
        source
        measuredAt
      }
      medicalHistories {
        id
        conditionName
        description
        isActive
        doctorAdvice
        treatmentDetails
        diagnosisDate
        notes
      }
      medications {
        id
        medicineName
        dosage
        frequency
        startDate
        endDate
        reasonForTaking
        doctorPrescribed
        notes
      }
      allergies {
        id
        allergyName
        allergyType
        severity
        reaction
        notes
      }
      foodPreferences {
        dietType
        preferredCuisine
        foodAllergies
        otherFoodAllergy
        foodIntolerances
        otherFoodIntolerance
        dislikedFoods
        favouriteFoods
        dailyFoodBudget
        cookingPreference
        cookingTime
      }
      eatingHabits {
        mealsPerDay
        breakfastTime
        lunchTime
        dinnerTime
        eatsSnacks
        frequentlyEatsOutside
        prefersHomemadeFood
        followsIntermittentFasting
        fastingWindow
      }
      foodAvailability {
        availableIngredients
        otherIngredients
      }
      workoutPreferences {
        fitnessLevel
        workoutExperience
        workoutLocation
        gymMembership
        availableEquipment
        otherEquipment
        preferredWorkouts
        preferredSports
      }
      workoutSchedule {
        workoutDaysPerWeek
        workoutDuration
        preferredWorkoutTime
        restDays
        preferredIntensity
      }
      exerciseRestrictions {
        currentInjuries
        experiencesJointPain
        restrictedExercises
        dislikedExercises
        doctorExerciseRestrictions
      }
      workLife {
        workType
        workStartTime
        workEndTime
        workingDays
        dailySittingHours
        dailyStandingHours
        dailyCommuteTime
        sleepTime
        wakeUpTime
        stressLevel
        freeTime
      }
      personalization {
        reminderPreference
        waterReminder
        mealReminder
        workoutReminder
        preferredLanguage
        coachingStyle
        notificationFrequency
        dailyWaterTargetMl
        sleepGoalMinutes
      }
    }
  }
`;
