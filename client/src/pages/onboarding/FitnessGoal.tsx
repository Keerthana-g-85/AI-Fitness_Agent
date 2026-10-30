import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Stack } from "@mui/material";
import dayjs from "dayjs";
import { DateField } from "../../components/onboarding/DateField";
import { FormNavigation } from "../../components/onboarding/FormNavigation";
import { FormSelect } from "../../components/onboarding/FormSelect";
import { NumberField } from "../../components/onboarding/NumberField";
import { OnboardingLayout } from "../../components/onboarding/OnboardingLayout";
import { useOnboarding } from "../../context/OnboardingContext";
import { FITNESS_GOAL_OPTIONS } from "../../types/onboarding";
import type { FitnessGoalData } from "../../types/onboarding";
import {
  isFutureDate,
  isPercentage,
  isPositiveNumber,
} from "../../utils/validation";

type FitnessGoalErrors = Partial<Record<keyof FitnessGoalData, string>>;

const FitnessGoalPage = () => {
  const navigate = useNavigate();
  const { data, updateFitnessGoal } = useOnboarding();
  const [errors, setErrors] = useState<FitnessGoalErrors>({});

  const clearError = (field: keyof FitnessGoalData) => {
    setErrors((currentErrors) => {
      if (!currentErrors[field]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const validate = (): FitnessGoalErrors => {
    const values = data.fitnessGoal;
    const nextErrors: FitnessGoalErrors = {};

    if (!values.primaryGoal) {
      nextErrors.primaryGoal = "Primary goal is required";
    }

    if (
      values.secondaryGoal &&
      values.secondaryGoal === values.primaryGoal
    ) {
      nextErrors.secondaryGoal =
        "Secondary goal must be different from the primary goal";
    }

    if (!values.currentWeight.trim()) {
      nextErrors.currentWeight = "Current weight is required";
    } else if (!isPositiveNumber(values.currentWeight)) {
      nextErrors.currentWeight = "Current weight must be greater than 0";
    }

    if (
      values.targetWeight.trim() &&
      !isPositiveNumber(values.targetWeight)
    ) {
      nextErrors.targetWeight = "Target weight must be greater than 0";
    }

    if (
      values.targetBodyFatPercentage.trim() &&
      !isPercentage(values.targetBodyFatPercentage)
    ) {
      nextErrors.targetBodyFatPercentage =
        "Body fat percentage must be between 0 and 100";
    }

    if (
      values.targetMuscleMass.trim() &&
      !isPositiveNumber(values.targetMuscleMass)
    ) {
      nextErrors.targetMuscleMass =
        "Target muscle mass must be greater than 0";
    }

    if (values.targetDate && !isFutureDate(values.targetDate)) {
      nextErrors.targetDate = "Target date must be in the future";
    }

    return nextErrors;
  };

  const handleNext = () => {
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    navigate("/body-measurements");
  };

  return (
    <OnboardingLayout
      description="Define what you want to achieve and the targets that matter to you."
      stepIndex={1}
      title="Fitness goal"
    >
      <Box
        component="form"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          handleNext();
        }}
      >
        <Stack spacing={3}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2.25,
            }}
          >
            <FormSelect
              error={errors.primaryGoal}
              label="Primary Goal"
              onChange={(value) => {
                updateFitnessGoal({
                  primaryGoal: value as FitnessGoalData["primaryGoal"],
                  secondaryGoal:
                    data.fitnessGoal.secondaryGoal === value
                      ? ""
                      : data.fitnessGoal.secondaryGoal,
                });
                clearError("primaryGoal");
                clearError("secondaryGoal");
              }}
              options={FITNESS_GOAL_OPTIONS}
              required
              value={data.fitnessGoal.primaryGoal}
            />

            <FormSelect
              error={errors.secondaryGoal}
              helperText="Optional. Choose a goal different from your primary goal."
              label="Secondary Goal"
              onChange={(value) => {
                updateFitnessGoal({
                  secondaryGoal: value as FitnessGoalData["secondaryGoal"],
                });
                clearError("secondaryGoal");
              }}
              options={FITNESS_GOAL_OPTIONS.filter(
                (goal) => goal !== data.fitnessGoal.primaryGoal,
              )}
              value={data.fitnessGoal.secondaryGoal}
            />

            <NumberField
              error={errors.currentWeight}
              label="Current Weight"
              min={0.1}
              onChange={(value) => {
                updateFitnessGoal({ currentWeight: value });
                clearError("currentWeight");
              }}
              placeholder="e.g. 72.5"
              required
              unit="kg"
              value={data.fitnessGoal.currentWeight}
            />

            <NumberField
              error={errors.targetWeight}
              helperText="Optional"
              label="Target Weight"
              min={0.1}
              onChange={(value) => {
                updateFitnessGoal({ targetWeight: value });
                clearError("targetWeight");
              }}
              placeholder="e.g. 68"
              unit="kg"
              value={data.fitnessGoal.targetWeight}
            />

            <NumberField
              error={errors.targetBodyFatPercentage}
              helperText="Optional. Enter a value from 0 to 100."
              label="Target Body Fat"
              max={100}
              min={0}
              onChange={(value) => {
                updateFitnessGoal({ targetBodyFatPercentage: value });
                clearError("targetBodyFatPercentage");
              }}
              placeholder="e.g. 20"
              unit="%"
              value={data.fitnessGoal.targetBodyFatPercentage}
            />

            <NumberField
              error={errors.targetMuscleMass}
              helperText="Optional"
              label="Target Muscle Mass"
              min={0.1}
              onChange={(value) => {
                updateFitnessGoal({ targetMuscleMass: value });
                clearError("targetMuscleMass");
              }}
              placeholder="e.g. 35"
              unit="kg"
              value={data.fitnessGoal.targetMuscleMass}
            />

            <Box sx={{ gridColumn: { sm: "1 / -1" } }}>
              <DateField
                error={errors.targetDate}
                helperText="Optional. Choose a date in the future."
                label="Target Date"
                minDate={dayjs().add(1, "day")}
                onChange={(value) => {
                  updateFitnessGoal({ targetDate: value });
                  clearError("targetDate");
                }}
                value={data.fitnessGoal.targetDate}
              />
            </Box>
          </Box>

          <FormNavigation
            backLabel="Back: Profile"
            nextLabel="Next: Body Measurements"
            onBack={() => navigate("/profile")}
            onNext={handleNext}
          />
        </Stack>
      </Box>
    </OnboardingLayout>
  );
};

export default FitnessGoalPage;
