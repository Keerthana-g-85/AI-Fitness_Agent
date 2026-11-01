import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import EditIcon from "@mui/icons-material/Edit";
import {
  Alert,
  Box,
  Button,
  Chip,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { FormNavigation } from "../../components/onboarding/FormNavigation";
import { OnboardingLayout } from "../../components/onboarding/OnboardingLayout";
import { SectionCard } from "../../components/onboarding/SectionCard";
import {
  completeOnboarding,
  getOnboardingErrorMessage,
} from "../../api/onboardingApi";
import type { OnboardingResponse } from "../../api/onboardingApi";
import { useAuth } from "../../context/AuthContext";
import { useOnboarding } from "../../context/OnboardingContext";
import { BODY_COMPOSITION_FIELDS } from "../../types/onboarding";
import { calculateAge } from "../../utils/calculateAge";
import { calculateDuration } from "../../utils/calculateDuration";
import { formatDate } from "../../utils/formatDate";
import { formatTime } from "../../utils/formatTime";
import { isOvernightShift } from "../../utils/validation";

interface SummaryRowProps {
  label: string;
  value?: string;
}

const SummaryRow = ({ label, value }: SummaryRowProps) => {
  if (!value || !value.trim()) {
    return null;
  }

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={{ xs: 0.25, sm: 2 }}
      sx={{ py: 0.6 }}
    >
      <Typography
        color="text.secondary"
        sx={{ flexShrink: 0, width: { sm: 190 } }}
        variant="body2"
      >
        {label}
      </Typography>
      <Typography sx={{ fontWeight: 600 }} variant="body2">
        {value}
      </Typography>
    </Stack>
  );
};

interface SummaryListProps {
  label: string;
  items: string[];
}

const SummaryList = ({ label, items }: SummaryListProps) => {
  const visibleItems = items.filter((item) => item.trim());

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={{ xs: 0.75, sm: 2 }}
      sx={{ py: 0.6 }}
    >
      <Typography
        color="text.secondary"
        sx={{ flexShrink: 0, width: { sm: 190 } }}
        variant="body2"
      >
        {label}
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
        {visibleItems.map((item) => (
          <Chip key={item} label={item} size="small" />
        ))}
      </Box>
    </Stack>
  );
};

const EmptySummary = ({ message }: { message: string }) => (
  <Typography color="text.secondary" variant="body2">
    {message}
  </Typography>
);

const withUnit = (value: string, unit: string): string =>
  value.trim() ? `${value}${unit ? ` ${unit}` : ""}` : "";

const withCurrency = (value: string): string =>
  value.trim() ? `₹${value}` : "";

const addOtherDetail = (values: string[], otherDetail: string): string[] => {
  const detail = otherDetail.trim();
  const result = values.map((value) => (value === "Other" && detail ? detail : value));

  return [...new Set(result)];
};

const OnboardingReviewPage = () => {
  const navigate = useNavigate();
  const { data, regenerateSubmissionId } = useOnboarding();
  const { refreshUser } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const profileAge = calculateAge(data.profile.dateOfBirth);

  const profileRows = [
    {
      label: "Date of Birth",
      value: formatDate(data.profile.dateOfBirth),
    },
    {
      label: "Age",
      value: profileAge !== null ? `${profileAge} years` : "",
    },
    {
      label: "Height",
      value: withUnit(data.profile.height, "cm"),
    },
    { label: "Gender", value: data.profile.gender },
    { label: "Occupation", value: data.profile.occupation },
    { label: "Country", value: data.profile.country },
    { label: "Activity Level", value: data.profile.activityLevel },
  ];

  const fitnessRows = [
    { label: "Primary Goal", value: data.fitnessGoal.primaryGoal },
    { label: "Secondary Goal", value: data.fitnessGoal.secondaryGoal },
    {
      label: "Current Weight",
      value: withUnit(data.fitnessGoal.currentWeight, "kg"),
    },
    {
      label: "Target Weight",
      value: withUnit(data.fitnessGoal.targetWeight, "kg"),
    },
    {
      label: "Target Body Fat",
      value: withUnit(data.fitnessGoal.targetBodyFatPercentage, "%"),
    },
    {
      label: "Target Muscle Mass",
      value: withUnit(data.fitnessGoal.targetMuscleMass, "kg"),
    },
    {
      label: "Target Date",
      value: formatDate(data.fitnessGoal.targetDate),
    },
  ];

  const compositionRows = [
    ...BODY_COMPOSITION_FIELDS.filter((field) =>
      data.bodyComposition[field.key].trim(),
    ).map((field) => ({
      label: field.label,
      value: withUnit(data.bodyComposition[field.key], field.unit),
    })),
    { label: "Source", value: data.bodyComposition.source },
    {
      label: "Measured At",
      value: formatDate(data.bodyComposition.measuredAt),
    },
  ];

  const foodAllergyItems = addOtherDetail(
    data.foodPreferences.foodAllergies,
    data.foodPreferences.otherFoodAllergy,
  );
  const foodIntoleranceItems = addOtherDetail(
    data.foodPreferences.foodIntolerances,
    data.foodPreferences.otherFoodIntolerance,
  );
  const availableIngredientItems = addOtherDetail(
    data.foodAvailability.ingredients,
    data.foodAvailability.otherIngredients,
  );
  const availableEquipmentItems = addOtherDetail(
    data.workoutExperience.availableEquipment,
    data.workoutExperience.otherEquipment,
  );
  const reminderItems = [
    data.personalization.waterReminders ? "Water" : "",
    data.personalization.mealReminders ? "Meals" : "",
    data.personalization.workoutReminders ? "Workouts" : "",
  ].filter((item) => item);

  const overnightWorkShift = isOvernightShift(
    data.workLife.workStartTime,
    data.workLife.workEndTime,
  );

  const { mutate: submitOnboarding, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: async (response: OnboardingResponse) => {
      if (!response.success) {
        setSubmitError(response.message);
        return;
      }

      setSubmitError(null);
      setSnackbarOpen(true);
      setSubmitted(true);
      regenerateSubmissionId();
      await refreshUser();
    },
    onError: (error: unknown) => {
      setSubmitError(getOnboardingErrorMessage(error));
    },
  });

  const handleConfirm = () => {
    if (!data.personalization.dataSharingConsent) {
      setConsentError(true);
      return;
    }

    if (isPending) {
      return;
    }

    setConsentError(false);
    setSubmitError(null);
    submitOnboarding(data);
  };

  if (submitted) {
    return (
      <>
        <OnboardingLayout
          description="You have completed every step of the onboarding flow."
          stepIndex={10}
          title="Onboarding complete"
        >
          <Stack
            spacing={2.5}
            sx={{ alignItems: "center", py: { xs: 3, sm: 5 } }}
          >
            <CheckCircleOutlineOutlinedIcon
              color="success"
              sx={{ fontSize: { xs: 64, sm: 80 } }}
            />
            <Typography sx={{ fontWeight: 700, textAlign: "center" }} variant="h5">
              Your fitness profile is ready
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ maxWidth: 560, textAlign: "center" }}
              variant="body2"
            >
              Your onboarding information has been saved to your account.
              No information was sent to external parties.
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              sx={{ pt: 1, width: { xs: "100%", sm: "auto" } }}
            >
              <Button onClick={() => setSubmitted(false)} variant="outlined">
                Review answers
              </Button>
              <Button onClick={() => navigate("/dashboard")} variant="contained">
                Go to Dashboard
              </Button>
            </Stack>
          </Stack>
        </OnboardingLayout>
        <Snackbar
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          open={snackbarOpen}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity="success"
            variant="filled"
          >
            Onboarding completed and saved successfully.
          </Alert>
        </Snackbar>
      </>
    );
  }

  return (
    <>
      <OnboardingLayout
        description="Check your answers below. You can edit any section before finishing."
        stepIndex={10}
        title="Review and submit"
      >
        <Stack spacing={2.5}>
          <Alert severity="info">
            Review your answers carefully. Confirming will save your onboarding
            information to your account.
          </Alert>

          <SectionCard
            action={
              <Button
                onClick={() => navigate("/profile")}
                size="small"
                startIcon={<EditIcon />}
              >
                Edit
              </Button>
            }
            title="Profile"
          >
            {profileRows.map((row) => (
              <SummaryRow key={row.label} label={row.label} value={row.value} />
            ))}
          </SectionCard>

          <SectionCard
            action={
              <Button
                onClick={() => navigate("/fitness-goal")}
                size="small"
                startIcon={<EditIcon />}
              >
                Edit
              </Button>
            }
            title="Fitness Goals"
          >
            {fitnessRows.map((row) => (
              <SummaryRow key={row.label} label={row.label} value={row.value} />
            ))}
          </SectionCard>

          <SectionCard
            action={
              <Button
                onClick={() => navigate("/body-composition")}
                size="small"
                startIcon={<EditIcon />}
              >
                Edit
              </Button>
            }
            title="Body Composition"
          >
            {compositionRows.some((row) => row.value.trim()) ? (
              compositionRows.map((row) => (
                <SummaryRow key={row.label} label={row.label} value={row.value} />
              ))
            ) : (
              <EmptySummary message="No body composition data entered." />
            )}
          </SectionCard>

          <SectionCard
            action={
              <Button
                onClick={() => navigate("/medical-history")}
                size="small"
                startIcon={<EditIcon />}
              >
                Edit
              </Button>
            }
            title="Medical History"
          >
            {data.medicalHistory.length === 0 ? (
              <EmptySummary message="No medical conditions added." />
            ) : (
              <Stack spacing={1.5}>
                {data.medicalHistory.map((condition, index) => (
                  <Box
                    key={condition.id}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Typography sx={{ fontWeight: 700 }} variant="subtitle2">
                      Condition {index + 1}: {condition.conditionName}
                    </Typography>
                    <SummaryRow
                      label="Active"
                      value={condition.active ? "Yes" : "No"}
                    />
                    <SummaryRow
                      label="Diagnosis Date"
                      value={formatDate(condition.diagnosisDate)}
                    />
                    <SummaryRow
                      label="Description"
                      value={condition.description}
                    />
                    <SummaryRow
                      label="Doctor Advice"
                      value={condition.doctorAdvice}
                    />
                    <SummaryRow
                      label="Treatment Details"
                      value={condition.treatmentDetails}
                    />
                    <SummaryRow label="Notes" value={condition.notes} />
                  </Box>
                ))}
              </Stack>
            )}
          </SectionCard>

          <SectionCard
            action={
              <Button
                onClick={() => navigate("/medications")}
                size="small"
                startIcon={<EditIcon />}
              >
                Edit
              </Button>
            }
            title="Medications"
          >
            {data.medications.length === 0 ? (
              <EmptySummary message="No medications added." />
            ) : (
              <Stack spacing={1.5}>
                {data.medications.map((medication, index) => (
                  <Box
                    key={medication.id}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Typography sx={{ fontWeight: 700 }} variant="subtitle2">
                      Medication {index + 1}: {medication.medicineName}
                    </Typography>
                    <SummaryRow label="Dosage" value={medication.dosage} />
                    <SummaryRow
                      label="Frequency"
                      value={medication.frequency}
                    />
                    <SummaryRow
                      label="Start Date"
                      value={formatDate(medication.startDate)}
                    />
                    <SummaryRow
                      label="End Date"
                      value={formatDate(medication.endDate)}
                    />
                    <SummaryRow
                      label="Duration"
                      value={calculateDuration(
                        medication.startDate,
                        medication.endDate,
                      )}
                    />
                    <SummaryRow
                      label="Reason for Taking"
                      value={medication.reasonForTaking}
                    />
                    <SummaryRow
                      label="Doctor Prescribed"
                      value={medication.doctorPrescribed ? "Yes" : "No"}
                    />
                    <SummaryRow label="Notes" value={medication.notes} />
                  </Box>
                ))}
              </Stack>
            )}
          </SectionCard>

          <SectionCard
            action={
              <Button
                onClick={() => navigate("/allergies")}
                size="small"
                startIcon={<EditIcon />}
              >
                Edit
              </Button>
            }
            title="Allergies"
          >
            {data.allergies.length === 0 ? (
              <EmptySummary message="No allergies added." />
            ) : (
              <Stack spacing={1.5}>
                {data.allergies.map((allergy, index) => (
                  <Box
                    key={allergy.id}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Typography sx={{ fontWeight: 700 }} variant="subtitle2">
                      Allergy {index + 1}: {allergy.allergyName}
                    </Typography>
                    <SummaryRow
                      label="Allergy Type"
                      value={allergy.allergyType}
                    />
                    <SummaryRow label="Severity" value={allergy.severity} />
                    <SummaryRow label="Reaction" value={allergy.reaction} />
                    <SummaryRow label="Notes" value={allergy.notes} />
                  </Box>
                ))}
              </Stack>
            )}
          </SectionCard>

          <SectionCard
            action={
              <Button
                onClick={() => navigate("/food-preferences")}
                size="small"
                startIcon={<EditIcon />}
              >
                Edit
              </Button>
            }
            title="Food Preferences and Dietary Habits"
          >
            <SummaryRow label="Diet Type" value={data.foodPreferences.dietType} />
            <SummaryList
              label="Preferred Cuisine"
              items={data.foodPreferences.preferredCuisines}
            />
            <SummaryList label="Food Allergies" items={foodAllergyItems} />
            <SummaryList
              label="Food Intolerances"
              items={foodIntoleranceItems}
            />
            <SummaryList
              label="Disliked Foods"
              items={data.foodPreferences.dislikedFoods}
            />
            <SummaryList
              label="Favourite Foods"
              items={data.foodPreferences.favouriteFoods}
            />
            <SummaryRow
              label="Daily Food Budget"
              value={withCurrency(data.foodPreferences.dailyFoodBudget)}
            />
            <SummaryRow
              label="Cooking Preference"
              value={data.foodPreferences.cookingPreference}
            />
            <SummaryRow
              label="Cooking Time Available"
              value={withUnit(
                data.foodPreferences.cookingTimeAvailable,
                "minutes",
              )}
            />
            <SummaryRow label="Meals Per Day" value={data.eatingHabits.mealsPerDay} />
            <SummaryRow
              label="Breakfast Time"
              value={formatTime(data.eatingHabits.breakfastTime)}
            />
            <SummaryRow
              label="Lunch Time"
              value={formatTime(data.eatingHabits.lunchTime)}
            />
            <SummaryRow
              label="Dinner Time"
              value={formatTime(data.eatingHabits.dinnerTime)}
            />
            {data.eatingHabits.eatsSnacks && (
              <SummaryRow label="Eats Snacks" value="Yes" />
            )}
            {data.eatingHabits.frequentlyEatsOutside && (
              <SummaryRow label="Frequently Eats Outside" value="Yes" />
            )}
            {data.eatingHabits.prefersHomemadeFood && (
              <SummaryRow label="Prefers Homemade Food" value="Yes" />
            )}
            {data.eatingHabits.followsIntermittentFasting && (
              <SummaryRow
                label="Intermittent Fasting"
                value={data.eatingHabits.fastingWindow || "Yes"}
              />
            )}
            <SummaryList
              label="Available Ingredients"
              items={availableIngredientItems}
            />
          </SectionCard>

          <SectionCard
            action={
              <Button
                onClick={() => navigate("/workout-preferences")}
                size="small"
                startIcon={<EditIcon />}
              >
                Edit
              </Button>
            }
            title="Workout and Fitness Preferences"
          >
            <SummaryRow
              label="Fitness Level"
              value={data.workoutExperience.fitnessLevel}
            />
            <SummaryRow
              label="Workout Experience"
              value={data.workoutExperience.workoutExperience}
            />
            <SummaryRow
              label="Workout Location"
              value={data.workoutExperience.workoutLocation}
            />
            {data.workoutExperience.gymMembership && (
              <SummaryRow label="Gym Membership" value="Yes" />
            )}
            <SummaryList
              label="Available Equipment"
              items={availableEquipmentItems}
            />
            <SummaryList
              label="Workout Preferences"
              items={data.workoutSchedule.workoutPreferences}
            />
            <SummaryRow
              label="Workout Days Per Week"
              value={data.workoutSchedule.workoutDaysPerWeek}
            />
            <SummaryRow
              label="Workout Duration"
              value={data.workoutSchedule.workoutDuration}
            />
            <SummaryRow
              label="Preferred Workout Time"
              value={data.workoutSchedule.preferredWorkoutTime}
            />
            <SummaryList
              label="Rest Days"
              items={data.workoutSchedule.restDays}
            />
            <SummaryRow
              label="Preferred Intensity"
              value={data.workoutSchedule.preferredIntensity}
            />
            <SummaryRow
              label="Current Injuries"
              value={data.exerciseRestrictions.currentInjuries}
            />
            {data.exerciseRestrictions.hasJointPain && (
              <SummaryRow label="Experiences Joint Pain" value="Yes" />
            )}
            <SummaryRow
              label="Exercise Restrictions"
              value={data.exerciseRestrictions.exerciseRestrictions}
            />
            <SummaryRow
              label="Disliked Exercises"
              value={data.exerciseRestrictions.dislikedExercises}
            />
            <SummaryRow
              label="Doctor Restrictions"
              value={data.exerciseRestrictions.doctorExerciseRestrictions}
            />
          </SectionCard>

          <SectionCard
            action={
              <Button
                onClick={() => navigate("/work-life")}
                size="small"
                startIcon={<EditIcon />}
              >
                Edit
              </Button>
            }
            title="Work Life and Daily Routine"
          >
            <SummaryRow label="Work Type" value={data.workLife.workType} />
            <SummaryRow
              label="Work Start Time"
              value={formatTime(data.workLife.workStartTime)}
            />
            <SummaryRow
              label="Work End Time"
              value={formatTime(data.workLife.workEndTime)}
            />
            {overnightWorkShift && (
              <SummaryRow label="Overnight Shift" value="Yes" />
            )}
            <SummaryList label="Working Days" items={data.workLife.workingDays} />
            <SummaryRow
              label="Daily Sitting Hours"
              value={withUnit(data.workLife.dailySittingHours, "hours")}
            />
            <SummaryRow
              label="Daily Standing Hours"
              value={withUnit(data.workLife.dailyStandingHours, "hours")}
            />
            <SummaryRow
              label="Daily Commute Time"
              value={withUnit(data.workLife.dailyCommuteMinutes, "minutes")}
            />
            <SummaryRow
              label="Sleep Time"
              value={formatTime(data.workLife.sleepTime)}
            />
            <SummaryRow
              label="Wake Up Time"
              value={formatTime(data.workLife.wakeUpTime)}
            />
            <SummaryRow label="Stress Level" value={data.workLife.stressLevel} />
            <SummaryRow
              label="Free Time for Exercise"
              value={data.workLife.freeTimeForExercise}
            />
          </SectionCard>

          <SectionCard
            action={
              <Button
                onClick={() => navigate("/personalization")}
                size="small"
                startIcon={<EditIcon />}
              >
                Edit
              </Button>
            }
            title="Other Preferences and Personalization"
          >
            {data.personalization.enableReminders && (
              <>
                <SummaryRow label="Reminders" value="Enabled" />
                <SummaryList label="Reminder Types" items={reminderItems} />
              </>
            )}
            <SummaryRow
              label="Preferred Language"
              value={data.personalization.preferredLanguage}
            />
            <SummaryRow
              label="Coaching Style"
              value={data.personalization.coachingStyle}
            />
            <SummaryRow
              label="Notification Frequency"
              value={data.personalization.notificationFrequency}
            />
            <SummaryRow
              label="Data Sharing Consent"
              value={
                data.personalization.dataSharingConsent ? "Provided" : ""
              }
            />
          </SectionCard>

          {consentError && (
            <Alert
              action={
                <Button
                  color="inherit"
                  onClick={() => navigate("/personalization")}
                  size="small"
                >
                  Go to consent
                </Button>
              }
              severity="error"
            >
              Please provide explicit data-sharing consent before submitting.
            </Alert>
          )}

          {submitError && (
            <Alert severity="error">{submitError}</Alert>
          )}

          <FormNavigation
            backLabel="Back: Personalization"
            nextLabel={isPending ? "Saving onboarding..." : "Confirm & Complete"}
            nextPending={isPending}
            onBack={() => navigate("/personalization")}
            onNext={handleConfirm}
          />
        </Stack>
      </OnboardingLayout>
      <Snackbar
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        open={snackbarOpen}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          variant="filled"
        >
          Onboarding completed. Your answers were not sent to a server.
        </Alert>
      </Snackbar>
    </>
  );
};

export default OnboardingReviewPage;
