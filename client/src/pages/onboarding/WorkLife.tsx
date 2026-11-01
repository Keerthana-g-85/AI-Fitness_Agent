import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Stack } from "@mui/material";
import { FormNavigation } from "../../components/onboarding/FormNavigation";
import { FormSelect } from "../../components/onboarding/FormSelect";
import { MultiSelectField } from "../../components/onboarding/MultiSelectField";
import { NumberField } from "../../components/onboarding/NumberField";
import { OnboardingLayout } from "../../components/onboarding/OnboardingLayout";
import { SectionCard } from "../../components/onboarding/SectionCard";
import { TimeField } from "../../components/onboarding/TimeField";
import { useOnboarding } from "../../context/OnboardingContext";
import {
  FREE_TIME_OPTIONS,
  STRESS_LEVEL_OPTIONS,
  WEEKDAY_OPTIONS,
  WORK_TYPE_OPTIONS,
} from "../../types/onboarding";
import type {
  FreeTimeAvailability,
  StressLevel,
  Weekday,
  WorkLife,
  WorkType,
} from "../../types/onboarding";
import {
  isNonNegativeNumber,
  isOvernightShift,
} from "../../utils/validation";

type WorkLifeErrors = Partial<Record<keyof WorkLife, string>>;

const WorkLifePage = () => {
  const navigate = useNavigate();
  const { data, updateWorkLife } = useOnboarding();
  const [errors, setErrors] = useState<WorkLifeErrors>({});

  const clearError = (field: keyof WorkLife) => {
    setErrors((currentErrors) => {
      if (!currentErrors[field]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const updateField = (updates: Partial<WorkLife>, field: keyof WorkLife) => {
    updateWorkLife(updates);
    clearError(field);
  };

  const validate = (): WorkLifeErrors => {
    const nextErrors: WorkLifeErrors = {};
    const workLife = data.workLife;

    if (!workLife.workType) {
      nextErrors.workType = "Work type is required";
    }

    if (!workLife.sleepTime) {
      nextErrors.sleepTime = "Sleep time is required";
    }

    if (!workLife.wakeUpTime) {
      nextErrors.wakeUpTime = "Wake up time is required";
    }

    if (!workLife.freeTimeForExercise) {
      nextErrors.freeTimeForExercise =
        "Free time available for exercise is required";
    }

    if (
      workLife.dailySittingHours.trim() &&
      !isNonNegativeNumber(workLife.dailySittingHours)
    ) {
      nextErrors.dailySittingHours =
        "Daily sitting hours cannot be negative";
    }

    if (
      workLife.dailyStandingHours.trim() &&
      !isNonNegativeNumber(workLife.dailyStandingHours)
    ) {
      nextErrors.dailyStandingHours =
        "Daily standing hours cannot be negative";
    }

    if (
      workLife.dailyCommuteMinutes.trim() &&
      !isNonNegativeNumber(workLife.dailyCommuteMinutes)
    ) {
      nextErrors.dailyCommuteMinutes =
        "Daily commute time cannot be negative";
    }

    return nextErrors;
  };

  const handleNext = () => {
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    navigate("/personalization");
  };

  const overnightShift = isOvernightShift(
    data.workLife.workStartTime,
    data.workLife.workEndTime,
  );

  return (
    <OnboardingLayout
      description="Show us how your day fits together so meal and workout plans can work around your routine."
      stepIndex={8}
      title="Work life and daily routine"
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
            description="Work schedules can vary. Add the days and hours that apply to you, including overnight shifts."
            title="Work Routine"
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2.25,
              }}
            >
              <Box sx={{ gridColumn: { sm: "1 / -1" } }}>
                <FormSelect
                  error={errors.workType}
                  label="Work Type"
                  onChange={(value) =>
                    updateField({ workType: value as WorkType }, "workType")
                  }
                  options={WORK_TYPE_OPTIONS}
                  required
                  value={data.workLife.workType}
                />
              </Box>

              <TimeField
                label="Work Start Time"
                onChange={(value) =>
                  updateField({ workStartTime: value }, "workStartTime")
                }
                value={data.workLife.workStartTime}
              />

              <TimeField
                helperText={
                  overnightShift
                    ? "This end time is earlier than the start time, so it will be treated as an overnight shift."
                    : "Overnight shifts are supported."
                }
                label="Work End Time"
                onChange={(value) =>
                  updateField({ workEndTime: value }, "workEndTime")
                }
                value={data.workLife.workEndTime}
              />

              {overnightShift && (
                <Alert severity="info" sx={{ gridColumn: { sm: "1 / -1" } }}>
                  Overnight work schedule detected. Your end time will be
                  treated as the following day.
                </Alert>
              )}

              <Box sx={{ gridColumn: { sm: "1 / -1" } }}>
                <MultiSelectField
                  helperText="Optional. Select the days you usually work."
                  label="Working Days"
                  onChange={(value) =>
                    updateField(
                      { workingDays: value as Weekday[] },
                      "workingDays",
                    )
                  }
                  options={WEEKDAY_OPTIONS}
                  placeholder="Select working days"
                  value={data.workLife.workingDays}
                />
              </Box>

              <NumberField
                error={errors.dailySittingHours}
                helperText="Optional"
                label="Daily Sitting Hours"
                min={0}
                onChange={(value) =>
                  updateField({ dailySittingHours: value }, "dailySittingHours")
                }
                placeholder="e.g. 7"
                unit="hours"
                value={data.workLife.dailySittingHours}
              />

              <NumberField
                error={errors.dailyStandingHours}
                helperText="Optional"
                label="Daily Standing Hours"
                min={0}
                onChange={(value) =>
                  updateField(
                    { dailyStandingHours: value },
                    "dailyStandingHours",
                  )
                }
                placeholder="e.g. 2"
                unit="hours"
                value={data.workLife.dailyStandingHours}
              />

              <NumberField
                error={errors.dailyCommuteMinutes}
                helperText="Optional"
                label="Daily Commute Time"
                min={0}
                onChange={(value) =>
                  updateField(
                    { dailyCommuteMinutes: value },
                    "dailyCommuteMinutes",
                  )
                }
                placeholder="e.g. 60"
                unit="minutes"
                value={data.workLife.dailyCommuteMinutes}
              />
            </Box>
          </SectionCard>

          <SectionCard
            description="Your sleep and free time help us choose realistic times for meals and exercise."
            title="Sleep and Free Time"
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2.25,
              }}
            >
              <TimeField
                error={errors.sleepTime}
                label="Sleep Time"
                onChange={(value) =>
                  updateField({ sleepTime: value }, "sleepTime")
                }
                required
                value={data.workLife.sleepTime}
              />

              <TimeField
                error={errors.wakeUpTime}
                label="Wake Up Time"
                onChange={(value) =>
                  updateField({ wakeUpTime: value }, "wakeUpTime")
                }
                required
                value={data.workLife.wakeUpTime}
              />

              <FormSelect
                label="Stress Level"
                onChange={(value) =>
                  updateField(
                    { stressLevel: value as StressLevel },
                    "stressLevel",
                  )
                }
                options={STRESS_LEVEL_OPTIONS}
                value={data.workLife.stressLevel}
              />

              <FormSelect
                error={errors.freeTimeForExercise}
                helperText="Choose the time you can usually set aside for exercise."
                label="Free Time Available for Exercise"
                onChange={(value) =>
                  updateField(
                    {
                      freeTimeForExercise:
                        value as FreeTimeAvailability,
                    },
                    "freeTimeForExercise",
                  )
                }
                options={FREE_TIME_OPTIONS}
                required
                value={data.workLife.freeTimeForExercise}
              />
            </Box>
          </SectionCard>

          <FormNavigation
            backLabel="Back: Workout Preferences"
            nextLabel="Next: Personalization"
            onBack={() => navigate("/workout-preferences")}
            onNext={handleNext}
          />
        </Stack>
      </Box>
    </OnboardingLayout>
  );
};

export default WorkLifePage;
