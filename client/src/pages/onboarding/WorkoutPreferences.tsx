import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
} from "@mui/material";
import { FormNavigation } from "../../components/onboarding/FormNavigation";
import { FormSelect } from "../../components/onboarding/FormSelect";
import { MultiSelectField } from "../../components/onboarding/MultiSelectField";
import { OnboardingLayout } from "../../components/onboarding/OnboardingLayout";
import { SectionCard } from "../../components/onboarding/SectionCard";
import { useOnboarding } from "../../context/OnboardingContext";
import {
  EQUIPMENT_OPTIONS,
  FITNESS_LEVEL_OPTIONS,
  PREFERRED_WORKOUT_TIME_OPTIONS,
  WEEKDAY_OPTIONS,
  WORKOUT_DAYS_PER_WEEK_OPTIONS,
  WORKOUT_DURATION_OPTIONS,
  WORKOUT_EXPERIENCE_OPTIONS,
  WORKOUT_INTENSITY_OPTIONS,
  WORKOUT_LOCATION_OPTIONS,
  WORKOUT_PREFERENCE_OPTIONS,
} from "../../types/onboarding";
import type {
  FitnessLevel,
  PreferredWorkoutTime,
  Weekday,
  WorkoutDaysPerWeek,
  WorkoutDuration,
  WorkoutExperience,
  WorkoutExperienceOption,
  WorkoutIntensity,
  WorkoutLocation,
  WorkoutSchedule,
} from "../../types/onboarding";

interface WorkoutErrors {
  fitnessLevel?: string;
  workoutExperience?: string;
  workoutLocation?: string;
  workoutPreferences?: string;
  workoutDaysPerWeek?: string;
  workoutDuration?: string;
  preferredWorkoutTime?: string;
  restDays?: string;
  preferredIntensity?: string;
}

const getWorkoutDayCount = (value: WorkoutDaysPerWeek | ""): number | null => {
  if (!value) {
    return null;
  }

  return Number.parseInt(value, 10);
};

const WorkoutPreferencesPage = () => {
  const navigate = useNavigate();
  const {
    data,
    updateWorkoutExperience,
    updateWorkoutSchedule,
    updateExerciseRestrictions,
  } = useOnboarding();
  const [errors, setErrors] = useState<WorkoutErrors>({});

  const clearError = (field: keyof WorkoutErrors) => {
    setErrors((currentErrors) => {
      if (!currentErrors[field]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const updateExperience = (
    updates: Partial<WorkoutExperience>,
    field: keyof WorkoutErrors,
  ) => {
    updateWorkoutExperience(updates);
    clearError(field);
  };

  const updateSchedule = (
    updates: Partial<WorkoutSchedule>,
    field: keyof WorkoutErrors,
  ) => {
    updateWorkoutSchedule(updates);
    clearError(field);
  };

  const workoutDayCount = getWorkoutDayCount(
    data.workoutSchedule.workoutDaysPerWeek,
  );
  const maxRestDays =
    workoutDayCount === null ? null : Math.max(0, 7 - workoutDayCount);
  const restDayLimitReached =
    maxRestDays !== null &&
    data.workoutSchedule.restDays.length >= maxRestDays;
  const disabledRestDays = restDayLimitReached
    ? WEEKDAY_OPTIONS.filter(
        (day) => !data.workoutSchedule.restDays.includes(day),
      )
    : [];

  const handleWorkoutDaysChange = (value: string) => {
    const nextWorkoutDays = value as WorkoutDaysPerWeek;
    const nextDayCount = getWorkoutDayCount(nextWorkoutDays);
    const nextMaxRestDays =
      nextDayCount === null ? null : Math.max(0, 7 - nextDayCount);

    updateWorkoutSchedule({
      workoutDaysPerWeek: nextWorkoutDays,
      restDays:
        nextMaxRestDays === null
          ? data.workoutSchedule.restDays
          : data.workoutSchedule.restDays.slice(0, nextMaxRestDays),
    });
    clearError("workoutDaysPerWeek");
    clearError("restDays");
  };

  const validate = (): WorkoutErrors => {
    const nextErrors: WorkoutErrors = {};
    const experience = data.workoutExperience;
    const schedule = data.workoutSchedule;

    if (!experience.fitnessLevel) {
      nextErrors.fitnessLevel = "Fitness level is required";
    }

    if (!experience.workoutExperience) {
      nextErrors.workoutExperience = "Workout experience is required";
    }

    if (!experience.workoutLocation) {
      nextErrors.workoutLocation = "Workout location is required";
    }

    if (schedule.workoutPreferences.length === 0) {
      nextErrors.workoutPreferences =
        "Select at least one workout preference";
    }

    if (!schedule.workoutDaysPerWeek) {
      nextErrors.workoutDaysPerWeek = "Workout days per week is required";
    }

    if (!schedule.workoutDuration) {
      nextErrors.workoutDuration = "Workout duration is required";
    }

    if (!schedule.preferredWorkoutTime) {
      nextErrors.preferredWorkoutTime = "Preferred workout time is required";
    }

    if (!schedule.preferredIntensity) {
      nextErrors.preferredIntensity = "Preferred intensity is required";
    }

    if (
      maxRestDays !== null &&
      schedule.restDays.length > maxRestDays
    ) {
      nextErrors.restDays =
        maxRestDays === 0
          ? "No rest days are available with a 7-day workout schedule"
          : `Select no more than ${maxRestDays} rest days for this workout schedule`;
    }

    return nextErrors;
  };

  const handleNext = () => {
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    navigate("/work-life");
  };

  const showsGymMembership =
    data.workoutExperience.workoutLocation === "Gym" ||
    data.workoutExperience.workoutLocation === "Gym and Home";

  return (
    <OnboardingLayout
      description="Share your experience, preferred activities and the schedule you can realistically follow."
      stepIndex={7}
      title="Workout preferences"
    >
      <Box
        component="form"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          handleNext();
        }}
      >
        <Stack spacing={2.5}>
          <SectionCard
            description="This helps your coach choose the right starting point and equipment."
            title="Fitness Experience"
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2.25,
              }}
            >
              <FormSelect
                error={errors.fitnessLevel}
                label="Fitness Level"
                onChange={(value) =>
                  updateExperience(
                    { fitnessLevel: value as FitnessLevel },
                    "fitnessLevel",
                  )
                }
                options={FITNESS_LEVEL_OPTIONS}
                required
                value={data.workoutExperience.fitnessLevel}
              />

              <FormSelect
                error={errors.workoutExperience}
                label="Workout Experience"
                onChange={(value) =>
                  updateExperience(
                    {
                      workoutExperience:
                        value as WorkoutExperienceOption,
                    },
                    "workoutExperience",
                  )
                }
                options={WORKOUT_EXPERIENCE_OPTIONS}
                required
                value={data.workoutExperience.workoutExperience}
              />

              <FormSelect
                error={errors.workoutLocation}
                label="Workout Location"
                onChange={(value) => {
                  const workoutLocation = value as WorkoutLocation;
                  const nextShowsGym =
                    workoutLocation === "Gym" ||
                    workoutLocation === "Gym and Home";

                  updateExperience(
                    {
                      workoutLocation,
                      gymMembership: nextShowsGym
                        ? data.workoutExperience.gymMembership
                        : false,
                    },
                    "workoutLocation",
                  );
                }}
                options={WORKOUT_LOCATION_OPTIONS}
                required
                value={data.workoutExperience.workoutLocation}
              />

              {showsGymMembership && (
                <FormControlLabel
                  control={
                    <Switch
                      checked={data.workoutExperience.gymMembership}
                      onChange={(event) =>
                        updateExperience(
                          { gymMembership: event.target.checked },
                          "workoutLocation",
                        )
                      }
                    />
                  }
                  label="I have a gym membership"
                />
              )}

              <Box sx={{ gridColumn: { sm: showsGymMembership ? "auto" : "1 / -1" } }}>
                <MultiSelectField
                  helperText="Optional. Select all equipment you can use."
                  label="Available Equipment"
                  onChange={(value) =>
                    updateExperience(
                      {
                        availableEquipment:
                          value as WorkoutExperience["availableEquipment"],
                      },
                      "workoutLocation",
                    )
                  }
                  options={EQUIPMENT_OPTIONS}
                  placeholder="Select equipment"
                  value={data.workoutExperience.availableEquipment}
                />
              </Box>

              {data.workoutExperience.availableEquipment.includes("Other") && (
                <TextField
                  fullWidth
                  helperText="Optional"
                  label="Other Equipment"
                  onChange={(event) =>
                    updateExperience(
                      { otherEquipment: event.target.value },
                      "workoutLocation",
                    )
                  }
                  placeholder="e.g. Battle ropes"
                  sx={{ gridColumn: { sm: "1 / -1" } }}
                  value={data.workoutExperience.otherEquipment}
                />
              )}
            </Box>
          </SectionCard>

          <SectionCard
            description="Choose every activity you would be happy to include in your plan."
            title="Workout Preferences"
          >
            <MultiSelectField
              error={errors.workoutPreferences}
              helperText="Select at least one activity."
              label="Preferred Workout Types"
              onChange={(value) =>
                updateSchedule(
                  {
                    workoutPreferences:
                      value as WorkoutSchedule["workoutPreferences"],
                  },
                  "workoutPreferences",
                )
              }
              options={WORKOUT_PREFERENCE_OPTIONS}
              placeholder="Select workout types"
              required
              value={data.workoutSchedule.workoutPreferences}
            />
          </SectionCard>

          <SectionCard
            description="We will use this to build a weekly plan around your real availability."
            title="Workout Schedule"
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2.25,
              }}
            >
              <FormSelect
                error={errors.workoutDaysPerWeek}
                label="Workout Days Per Week"
                onChange={handleWorkoutDaysChange}
                options={WORKOUT_DAYS_PER_WEEK_OPTIONS}
                required
                value={data.workoutSchedule.workoutDaysPerWeek}
              />

              <FormSelect
                error={errors.workoutDuration}
                label="Workout Duration"
                onChange={(value) =>
                  updateSchedule(
                    { workoutDuration: value as WorkoutDuration },
                    "workoutDuration",
                  )
                }
                options={WORKOUT_DURATION_OPTIONS}
                required
                value={data.workoutSchedule.workoutDuration}
              />

              <FormSelect
                error={errors.preferredWorkoutTime}
                label="Preferred Workout Time"
                onChange={(value) =>
                  updateSchedule(
                    {
                      preferredWorkoutTime:
                        value as PreferredWorkoutTime,
                    },
                    "preferredWorkoutTime",
                  )
                }
                options={PREFERRED_WORKOUT_TIME_OPTIONS}
                required
                value={data.workoutSchedule.preferredWorkoutTime}
              />

              <FormSelect
                error={errors.preferredIntensity}
                label="Preferred Intensity"
                onChange={(value) =>
                  updateSchedule(
                    {
                      preferredIntensity: value as WorkoutIntensity,
                    },
                    "preferredIntensity",
                  )
                }
                options={WORKOUT_INTENSITY_OPTIONS}
                required
                value={data.workoutSchedule.preferredIntensity}
              />

              <Box sx={{ gridColumn: { sm: "1 / -1" } }}>
                <MultiSelectField
                  disabledOptions={disabledRestDays}
                  error={errors.restDays}
                  helperText={
                    maxRestDays === null
                      ? "Choose your weekly workout days to see how many rest days you can select."
                      : maxRestDays === 0
                        ? "A 7-day workout schedule leaves no rest days."
                        : `Select up to ${maxRestDays} rest day${maxRestDays === 1 ? "" : "s"} for this schedule.`
                  }
                  label="Rest Days"
                  onChange={(value) =>
                    updateSchedule(
                      { restDays: value as Weekday[] },
                      "restDays",
                    )
                  }
                  options={WEEKDAY_OPTIONS}
                  placeholder="Select rest days"
                  value={data.workoutSchedule.restDays}
                />
              </Box>
            </Box>
          </SectionCard>

          <SectionCard
            description="Let your coach know about any movements or activities to avoid."
            title="Exercise Restrictions"
          >
            <Stack spacing={2.25}>
              <TextField
                fullWidth
                label="Current Injuries"
                minRows={3}
                multiline
                onChange={(event) =>
                  updateExerciseRestrictions({
                    currentInjuries: event.target.value,
                  })
                }
                placeholder="Optional. Describe any current injuries."
                value={data.exerciseRestrictions.currentInjuries}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={data.exerciseRestrictions.hasJointPain}
                    onChange={(event) =>
                      updateExerciseRestrictions({
                        hasJointPain: event.target.checked,
                      })
                    }
                  />
                }
                label="Do you experience joint pain?"
              />

              <TextField
                fullWidth
                label="Exercise Restrictions"
                minRows={3}
                multiline
                onChange={(event) =>
                  updateExerciseRestrictions({
                    exerciseRestrictions: event.target.value,
                  })
                }
                placeholder="Optional. List movements or activities you need to avoid."
                value={data.exerciseRestrictions.exerciseRestrictions}
              />

              <TextField
                fullWidth
                label="Disliked Exercises"
                minRows={3}
                multiline
                onChange={(event) =>
                  updateExerciseRestrictions({
                    dislikedExercises: event.target.value,
                  })
                }
                placeholder="Optional. List exercises you do not enjoy."
                value={data.exerciseRestrictions.dislikedExercises}
              />

              <TextField
                fullWidth
                label="Doctor Exercise Restrictions"
                minRows={3}
                multiline
                onChange={(event) =>
                  updateExerciseRestrictions({
                    doctorExerciseRestrictions: event.target.value,
                  })
                }
                placeholder="Optional. Add any instructions from your doctor."
                value={data.exerciseRestrictions.doctorExerciseRestrictions}
              />
            </Stack>
          </SectionCard>

          <FormNavigation
            backLabel="Back: Food Preferences"
            nextLabel="Next: Work Life"
            onBack={() => navigate("/food-preferences")}
            onNext={handleNext}
          />
        </Stack>
      </Box>
    </OnboardingLayout>
  );
};

export default WorkoutPreferencesPage;
