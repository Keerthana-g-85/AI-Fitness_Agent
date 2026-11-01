import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import {
  createEmptyAllergy,
  createEmptyMedicalCondition,
  createEmptyMedication,
  createInitialOnboardingData,
  createOnboardingSubmissionId,
} from "../types/onboarding";
import type {
  Allergy,
  BodyCompositionData,
  EatingHabits,
  ExerciseRestrictions,
  FitnessGoalData,
  FoodAvailability,
  FoodPreferences,
  MedicalCondition,
  Medication,
  OnboardingData,
  Personalization,
  ProfileData,
  WorkLife,
  WorkoutExperience,
  WorkoutSchedule,
} from "../types/onboarding";

const STORAGE_KEY = "fitness-agent-onboarding-v1";

interface OnboardingContextValue {
  data: OnboardingData;
  updateProfile: (updates: Partial<ProfileData>) => void;
  updateFitnessGoal: (updates: Partial<FitnessGoalData>) => void;
  updateBodyComposition: (updates: Partial<BodyCompositionData>) => void;
  addMedicalCondition: () => void;
  updateMedicalCondition: (
    id: string,
    updates: Partial<MedicalCondition>,
  ) => void;
  removeMedicalCondition: (id: string) => void;
  addMedication: () => void;
  updateMedication: (id: string, updates: Partial<Medication>) => void;
  removeMedication: (id: string) => void;
  addAllergy: () => void;
  updateAllergy: (id: string, updates: Partial<Allergy>) => void;
  removeAllergy: (id: string) => void;
  updateFoodPreferences: (updates: Partial<FoodPreferences>) => void;
  updateEatingHabits: (updates: Partial<EatingHabits>) => void;
  updateFoodAvailability: (updates: Partial<FoodAvailability>) => void;
  updateWorkoutExperience: (updates: Partial<WorkoutExperience>) => void;
  updateWorkoutSchedule: (updates: Partial<WorkoutSchedule>) => void;
  updateExerciseRestrictions: (
    updates: Partial<ExerciseRestrictions>,
  ) => void;
  updateWorkLife: (updates: Partial<WorkLife>) => void;
  updatePersonalization: (updates: Partial<Personalization>) => void;
  regenerateSubmissionId: () => void;
  resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextValue | undefined>(
  undefined,
);

const createId = (): string => crypto.randomUUID();

const loadOnboardingData = (): OnboardingData => {
  const initialData = createInitialOnboardingData();

  if (typeof window === "undefined") {
    return initialData;
  }

  try {
    const storedData = window.localStorage.getItem(STORAGE_KEY);

    if (!storedData) {
      return initialData;
    }

    const parsedData = JSON.parse(storedData) as Partial<OnboardingData>;

    return {
      submissionId:
        typeof parsedData.submissionId === "string"
          ? parsedData.submissionId
          : initialData.submissionId,
      profile: { ...initialData.profile, ...parsedData.profile },
      fitnessGoal: { ...initialData.fitnessGoal, ...parsedData.fitnessGoal },
      bodyComposition: {
        ...initialData.bodyComposition,
        ...parsedData.bodyComposition,
      },
      medicalHistory: Array.isArray(parsedData.medicalHistory)
        ? parsedData.medicalHistory
        : [],
      medications: Array.isArray(parsedData.medications)
        ? parsedData.medications
        : [],
      allergies: Array.isArray(parsedData.allergies)
        ? parsedData.allergies
        : [],
      foodPreferences: {
        ...initialData.foodPreferences,
        ...parsedData.foodPreferences,
      },
      eatingHabits: {
        ...initialData.eatingHabits,
        ...parsedData.eatingHabits,
      },
      foodAvailability: {
        ...initialData.foodAvailability,
        ...parsedData.foodAvailability,
      },
      workoutExperience: {
        ...initialData.workoutExperience,
        ...parsedData.workoutExperience,
      },
      workoutSchedule: {
        ...initialData.workoutSchedule,
        ...parsedData.workoutSchedule,
      },
      exerciseRestrictions: {
        ...initialData.exerciseRestrictions,
        ...parsedData.exerciseRestrictions,
      },
      workLife: {
        ...initialData.workLife,
        ...parsedData.workLife,
      },
      personalization: {
        ...initialData.personalization,
        ...parsedData.personalization,
      },
    };
  } catch {
    return initialData;
  }
};

interface OnboardingProviderProps {
  children: ReactNode;
}

export const OnboardingProvider = ({ children }: OnboardingProviderProps) => {
  const [data, setData] = useState<OnboardingData>(loadOnboardingData);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      return;
    }
  }, [data]);

  const updateProfile = useCallback((updates: Partial<ProfileData>) => {
    setData((currentData) => ({
      ...currentData,
      profile: { ...currentData.profile, ...updates },
    }));
  }, []);

  const updateFitnessGoal = useCallback((updates: Partial<FitnessGoalData>) => {
    setData((currentData) => ({
      ...currentData,
      fitnessGoal: { ...currentData.fitnessGoal, ...updates },
    }));
  }, []);

  const updateBodyComposition = useCallback(
    (updates: Partial<BodyCompositionData>) => {
      setData((currentData) => ({
        ...currentData,
        bodyComposition: { ...currentData.bodyComposition, ...updates },
      }));
    },
    [],
  );

  const addMedicalCondition = useCallback(() => {
    setData((currentData) => ({
      ...currentData,
      medicalHistory: [
        ...currentData.medicalHistory,
        createEmptyMedicalCondition(createId()),
      ],
    }));
  }, []);

  const updateMedicalCondition = useCallback(
    (id: string, updates: Partial<MedicalCondition>) => {
      setData((currentData) => ({
        ...currentData,
        medicalHistory: currentData.medicalHistory.map((condition) =>
          condition.id === id ? { ...condition, ...updates } : condition,
        ),
      }));
    },
    [],
  );

  const removeMedicalCondition = useCallback((id: string) => {
    setData((currentData) => ({
      ...currentData,
      medicalHistory: currentData.medicalHistory.filter(
        (condition) => condition.id !== id,
      ),
    }));
  }, []);

  const addMedication = useCallback(() => {
    setData((currentData) => ({
      ...currentData,
      medications: [
        ...currentData.medications,
        createEmptyMedication(createId()),
      ],
    }));
  }, []);

  const updateMedication = useCallback(
    (id: string, updates: Partial<Medication>) => {
      setData((currentData) => ({
        ...currentData,
        medications: currentData.medications.map((medication) =>
          medication.id === id ? { ...medication, ...updates } : medication,
        ),
      }));
    },
    [],
  );

  const removeMedication = useCallback((id: string) => {
    setData((currentData) => ({
      ...currentData,
      medications: currentData.medications.filter(
        (medication) => medication.id !== id,
      ),
    }));
  }, []);

  const addAllergy = useCallback(() => {
    setData((currentData) => ({
      ...currentData,
      allergies: [...currentData.allergies, createEmptyAllergy(createId())],
    }));
  }, []);

  const updateAllergy = useCallback(
    (id: string, updates: Partial<Allergy>) => {
      setData((currentData) => ({
        ...currentData,
        allergies: currentData.allergies.map((allergy) =>
          allergy.id === id ? { ...allergy, ...updates } : allergy,
        ),
      }));
    },
    [],
  );

  const removeAllergy = useCallback((id: string) => {
    setData((currentData) => ({
      ...currentData,
      allergies: currentData.allergies.filter((allergy) => allergy.id !== id),
    }));
  }, []);

  const updateFoodPreferences = useCallback(
    (updates: Partial<FoodPreferences>) => {
      setData((currentData) => ({
        ...currentData,
        foodPreferences: { ...currentData.foodPreferences, ...updates },
      }));
    },
    [],
  );

  const updateEatingHabits = useCallback((updates: Partial<EatingHabits>) => {
    setData((currentData) => ({
      ...currentData,
      eatingHabits: { ...currentData.eatingHabits, ...updates },
    }));
  }, []);

  const updateFoodAvailability = useCallback(
    (updates: Partial<FoodAvailability>) => {
      setData((currentData) => ({
        ...currentData,
        foodAvailability: { ...currentData.foodAvailability, ...updates },
      }));
    },
    [],
  );

  const updateWorkoutExperience = useCallback(
    (updates: Partial<WorkoutExperience>) => {
      setData((currentData) => ({
        ...currentData,
        workoutExperience: {
          ...currentData.workoutExperience,
          ...updates,
        },
      }));
    },
    [],
  );

  const updateWorkoutSchedule = useCallback(
    (updates: Partial<WorkoutSchedule>) => {
      setData((currentData) => ({
        ...currentData,
        workoutSchedule: { ...currentData.workoutSchedule, ...updates },
      }));
    },
    [],
  );

  const updateExerciseRestrictions = useCallback(
    (updates: Partial<ExerciseRestrictions>) => {
      setData((currentData) => ({
        ...currentData,
        exerciseRestrictions: {
          ...currentData.exerciseRestrictions,
          ...updates,
        },
      }));
    },
    [],
  );

  const updateWorkLife = useCallback((updates: Partial<WorkLife>) => {
    setData((currentData) => ({
      ...currentData,
      workLife: { ...currentData.workLife, ...updates },
    }));
  }, []);

  const updatePersonalization = useCallback(
    (updates: Partial<Personalization>) => {
      setData((currentData) => ({
        ...currentData,
        personalization: { ...currentData.personalization, ...updates },
      }));
    },
    [],
  );

  const resetOnboarding = useCallback(() => {
    setData(createInitialOnboardingData());
  }, []);

  const regenerateSubmissionId = useCallback(() => {
    setData((currentData) => ({
      ...currentData,
      submissionId: createOnboardingSubmissionId(),
    }));
  }, []);

  const value = useMemo<OnboardingContextValue>(
    () => ({
      data,
      updateProfile,
      updateFitnessGoal,
      updateBodyComposition,
      addMedicalCondition,
      updateMedicalCondition,
      removeMedicalCondition,
      addMedication,
      updateMedication,
      removeMedication,
      addAllergy,
      updateAllergy,
      removeAllergy,
      updateFoodPreferences,
      updateEatingHabits,
      updateFoodAvailability,
      updateWorkoutExperience,
      updateWorkoutSchedule,
      updateExerciseRestrictions,
      updateWorkLife,
      updatePersonalization,
      regenerateSubmissionId,
      resetOnboarding,
    }),
    [
      data,
      updateProfile,
      updateFitnessGoal,
      updateBodyComposition,
      addMedicalCondition,
      updateMedicalCondition,
      removeMedicalCondition,
      addMedication,
      updateMedication,
      removeMedication,
      addAllergy,
      updateAllergy,
      removeAllergy,
      updateFoodPreferences,
      updateEatingHabits,
      updateFoodAvailability,
      updateWorkoutExperience,
      updateWorkoutSchedule,
      updateExerciseRestrictions,
      updateWorkLife,
      updatePersonalization,
      regenerateSubmissionId,
      resetOnboarding,
    ],
  );

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = (): OnboardingContextValue => {
  const context = useContext(OnboardingContext);

  if (!context) {
    throw new Error("useOnboarding must be used within OnboardingProvider");
  }

  return context;
};
