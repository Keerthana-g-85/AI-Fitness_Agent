import { useEffect, useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import FitnessCenterOutlinedIcon from "@mui/icons-material/FitnessCenterOutlined";
import StraightenOutlinedIcon from "@mui/icons-material/StraightenOutlined";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";
import DirectionsRunOutlinedIcon from "@mui/icons-material/DirectionsRunOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import { AppHeader } from "../components/AppHeader";
import { ProfileSummary } from "../components/profile/ProfileSummary";
import type { SummaryField } from "../components/profile/ProfileSummary";
import {
  getMyProfile,
  getProfileErrorMessage,
  profileQueryKeys,
} from "../api/profileApi";
import type { MyProfile } from "../types/profile";
import dayjs from "dayjs";

const NOT_PROVIDED = "Not provided";

const formatText = (value: string | number | null | undefined): string => {
  if (value === null || value === undefined || value === "") {
    return NOT_PROVIDED;
  }

  return String(value);
};

const formatNumber = (
  value: number | null | undefined,
  unit = "",
): string => {
  if (value === null || value === undefined) {
    return NOT_PROVIDED;
  }

  const text = Number.isInteger(value) ? String(value) : value.toFixed(1);

  return unit ? `${text} ${unit}` : text;
};

const formatBoolean = (value: boolean): string => (value ? "Yes" : "No");

const formatList = (values: string[] | null | undefined): string =>
  values && values.length > 0 ? values.join(", ") : "None recorded";

const formatDate = (value: string | null | undefined): string =>
  value ? dayjs(value).format("DD MMM YYYY") : NOT_PROVIDED;

const formatTime = (value: string | null | undefined): string =>
  value ? dayjs(`2000-01-01T${value}`).format("hh:mm A") : NOT_PROVIDED;

const formatMinutes = (minutes: number | null | undefined): string => {
  if (minutes == null) {
    return NOT_PROVIDED;
  }

  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;

  if (hours === 0) {
    return `${remaining} min`;
  }

  return remaining === 0 ? `${hours} hr` : `${hours} hr ${remaining} min`;
};

const getInitials = (name: string): string =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

const Subheading = ({ children }: { children: string }) => (
  <Typography sx={{ fontWeight: 700, mt: 1, mb: 1.5 }} variant="subtitle2">
    {children}
  </Typography>
);

const RecordCard = ({
  title,
  status,
  fields,
}: {
  title: string;
  status?: string;
  fields: SummaryField[];
}) => (
  <Card elevation={0} variant="outlined" sx={{ borderRadius: 2.5 }}>
    <CardContent sx={{ p: 2 }}>
      <Stack
        direction="row"
        spacing={1}
        sx={{ alignItems: "center", justifyContent: "space-between", mb: 1.5 }}
      >
        <Typography sx={{ fontWeight: 700 }} variant="subtitle2">
          {title}
        </Typography>
        {status && <Chip label={status} size="small" variant="outlined" />}
      </Stack>
      <ProfileSummary fields={fields} />
    </CardContent>
  </Card>
);

const EmptyRecord = ({ children }: { children: string }) => (
  <Typography color="text.secondary" variant="body2">
    {children}
  </Typography>
);

const Section = ({
  id,
  title,
  description,
  icon,
  editTo,
  editLabel,
  children,
  defaultExpanded = false,
}: {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  editTo?: string;
  editLabel?: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}) => (
  <Accordion
    defaultExpanded={defaultExpanded}
    disableGutters
    elevation={0}
    id={id}
    sx={{
      border: "1px solid",
      borderColor: "rgba(15, 118, 110, 0.14)",
      borderRadius: "14px !important",
      "&:before": { display: "none" },
      overflow: "hidden",
    }}
  >
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "rgba(15, 118, 110, 0.08)",
            color: "primary.main",
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 700 }}>{title}</Typography>
          <Typography color="text.secondary" variant="body2">
            {description}
          </Typography>
        </Box>
      </Stack>
    </AccordionSummary>
    <AccordionDetails sx={{ pt: 0 }}>
      {children}
      {editTo && (
        <>
          <Divider sx={{ my: 2 }} />
          <Button
            component={RouterLink}
            endIcon={<EditOutlinedIcon />}
            size="small"
            to={editTo}
            variant="outlined"
          >
            {editLabel ?? "Edit section"}
          </Button>
        </>
      )}
    </AccordionDetails>
  </Accordion>
);

const ProfilePage = () => {
  const location = useLocation();
  const [snackbar, setSnackbar] = useState<string | null>(null);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: profileQueryKeys.me,
    queryFn: getMyProfile,
    retry: false,
  });

  useEffect(() => {
    const state = location.state as { message?: string } | null;

    if (state?.message) {
      setSnackbar(state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    if (!data || !location.hash) {
      return;
    }

    const sectionId = location.hash.slice(1);
    const timer = window.setTimeout(() => {
      document
        .getElementById(sectionId)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);

    return () => window.clearTimeout(timer);
  }, [data, location.hash]);

  if (isLoading) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <AppHeader />
        <Container maxWidth="lg" sx={{ py: 6, textAlign: "center" }}>
          <CircularProgress />
          <Typography color="text.secondary" sx={{ mt: 2 }} variant="body2">
            Loading your profile...
          </Typography>
        </Container>
      </Box>
    );
  }

  if (isError || !data) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <AppHeader />
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Alert
            action={
              <Button color="inherit" onClick={() => void refetch()} size="small">
                Retry
              </Button>
            }
            severity="error"
          >
            {getProfileErrorMessage(error)}
          </Alert>
        </Container>
      </Box>
    );
  }

  const profile: MyProfile = data;
  const basic = profile.profile;
  const goal = profile.fitnessGoal;
  const measurement = profile.latestBodyMeasurement;
  const composition = profile.latestBodyComposition;
  const food = profile.foodPreferences;
  const eating = profile.eatingHabits;
  const availability = profile.foodAvailability;
  const workout = profile.workoutPreferences;
  const schedule = profile.workoutSchedule;
  const restrictions = profile.exerciseRestrictions;
  const workLife = profile.workLife;
  const personalization = profile.personalization;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppHeader />
      <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 5 } }}>
        <Stack spacing={3}>
          <Card
            elevation={0}
            sx={{
              p: { xs: 2.5, sm: 3.5 },
              borderRadius: 4,
              color: "#ffffff",
              background:
                "linear-gradient(135deg, #115e59 0%, #0f766e 55%, #14b8a6 100%)",
              boxShadow: "0 24px 60px rgba(15, 118, 110, 0.22)",
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ alignItems: { xs: "flex-start", sm: "center" } }}
            >
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: "rgba(255,255,255,0.18)",
                  fontSize: 24,
                  fontWeight: 800,
                }}
              >
                {getInitials(profile.user.name)}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography sx={{ fontWeight: 800 }} variant="h4">
                  {profile.user.name}
                </Typography>
                <Typography sx={{ opacity: 0.86 }} variant="body1">
                  {profile.user.email}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1.25, flexWrap: "wrap", rowGap: 1 }}>
                  <Chip
                    label={profile.user.onboardingCompleted ? "Onboarding complete" : "Onboarding in progress"}
                    size="small"
                    sx={{ bgcolor: "rgba(255,255,255,0.16)", color: "#ffffff" }}
                  />
                  {goal && (
                    <Chip
                      label={goal.primaryGoal}
                      size="small"
                      sx={{ bgcolor: "rgba(255,255,255,0.16)", color: "#ffffff" }}
                    />
                  )}
                </Stack>
              </Box>
              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
                <Button
                  component={RouterLink}
                  startIcon={<EventNoteOutlinedIcon />}
                  sx={{ color: "#ffffff", borderColor: "rgba(255,255,255,0.5)" }}
                  to="/tracking"
                  variant="outlined"
                >
                  Daily tracking
                </Button>
                <Button
                  component={RouterLink}
                  startIcon={<StraightenOutlinedIcon />}
                  sx={{ bgcolor: "#ffffff", color: "primary.dark", "&:hover": { bgcolor: "#f0fdfa" } }}
                  to="/profile/measurements"
                  variant="contained"
                >
                  Measurements
                </Button>
              </Stack>
            </Stack>
          </Card>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", lg: "repeat(4, minmax(0, 1fr))" },
              gap: 1.5,
            }}
          >
            {[
              { label: "Current weight", value: formatNumber(goal?.currentWeightKg ?? measurement?.weightKg, "kg") },
              { label: "Target weight", value: formatNumber(goal?.targetWeightKg, "kg") },
              { label: "Body fat", value: formatNumber(composition?.bodyFatPercentage, "%") },
              { label: "Latest measurement", value: formatDate(measurement?.measuredAt) },
            ].map((item) => (
              <Card elevation={0} key={item.label} variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography color="text.secondary" variant="caption">
                    {item.label}
                  </Typography>
                  <Typography sx={{ fontWeight: 800 }} variant="h6">
                    {item.value}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          <Stack spacing={1.5}>
            <Section
              defaultExpanded
              description="Your personal details, body basics and daily activity."
              editLabel="Edit personal information"
              editTo="/profile/edit/personal"
              icon={<PersonOutlineOutlinedIcon />}
              id="basic-information"
              title="Basic Information"
            >
              <ProfileSummary
                fields={[
                  { label: "Full name", value: profile.user.name },
                  { label: "Email", value: profile.user.email },
                  { label: "Date of birth", value: formatDate(basic?.dateOfBirth) },
                  { label: "Height", value: formatNumber(basic?.heightCm, "cm") },
                  { label: "Gender", value: formatText(basic?.gender) },
                  { label: "Occupation", value: formatText(basic?.occupation) },
                  { label: "Country", value: formatText(basic?.country) },
                  { label: "Activity level", value: formatText(basic?.activityLevel) },
                ]}
              />
            </Section>

            <Section
              description="Your main goal, targets and timeline."
              editLabel="Edit fitness goals"
              editTo="/profile/edit/fitness-goals"
              icon={<FitnessCenterOutlinedIcon />}
              id="fitness-goals"
              title="Fitness Goals"
            >
              {goal ? (
                <ProfileSummary
                  fields={[
                    { label: "Primary goal", value: goal.primaryGoal },
                    { label: "Secondary goal", value: formatText(goal.secondaryGoal) },
                    { label: "Current weight", value: formatNumber(goal.currentWeightKg, "kg") },
                    { label: "Target weight", value: formatNumber(goal.targetWeightKg, "kg") },
                    { label: "Target body fat", value: formatNumber(goal.targetBodyFatPercentage, "%") },
                    { label: "Target muscle mass", value: formatNumber(goal.targetMuscleMassKg, "kg") },
                    { label: "Target date", value: formatDate(goal.targetDate) },
                  ]}
                />
              ) : (
                <EmptyRecord>No fitness goal recorded yet.</EmptyRecord>
              )}
            </Section>

            <Section
              defaultExpanded
              description="Latest body readings with full measurement history."
              icon={<StraightenOutlinedIcon />}
              id="body-measurements"
              title="Body Measurements & Composition"
            >
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
                  <Button
                    component={RouterLink}
                    startIcon={<AddIcon />}
                    to="/profile/measurements"
                    variant="contained"
                    size="small"
                  >
                    Add measurement
                  </Button>
                  <Button
                    component={RouterLink}
                    startIcon={<StraightenOutlinedIcon />}
                    to="/profile/measurements"
                    variant="outlined"
                    size="small"
                  >
                    View history & progress
                  </Button>
                </Stack>
                {measurement ? (
                  <>
                    <ProfileSummary
                      fields={[
                        { label: "Measured on", value: formatDate(measurement.measuredAt) },
                        { label: "Weight", value: formatNumber(measurement.weightKg, "kg") },
                        { label: "Height", value: formatNumber(measurement.heightCm, "cm") },
                        { label: "Waist", value: formatNumber(measurement.waistCm, "cm") },
                        { label: "Hip", value: formatNumber(measurement.hipCm, "cm") },
                        { label: "Chest", value: formatNumber(measurement.chestCm, "cm") },
                        { label: "Source", value: formatText(measurement.source) },
                        { label: "Notes", value: formatText(measurement.notes) },
                      ]}
                    />
                    {composition && (
                      <>
                        <Subheading>Body composition</Subheading>
                        <ProfileSummary
                          fields={[
                            { label: "Body fat", value: formatNumber(composition.bodyFatPercentage, "%") },
                            { label: "Muscle mass", value: formatNumber(composition.muscleMassKg, "kg") },
                            { label: "Lean body mass", value: formatNumber(composition.leanBodyMassKg, "kg") },
                            { label: "Body water", value: formatNumber(composition.bodyWaterPercentage, "%") },
                            { label: "Visceral fat", value: formatNumber(composition.visceralFat) },
                            { label: "BMR", value: formatNumber(composition.bmrKcal, "kcal") },
                            { label: "BMI", value: formatNumber(composition.bmi) },
                            { label: "Metabolic age", value: formatNumber(composition.metabolicAge, "years") },
                          ]}
                        />
                      </>
                    )}
                  </>
                ) : (
                  <EmptyRecord>No body measurements recorded yet.</EmptyRecord>
                )}
              </Stack>
            </Section>

            <Section
              description="Medical conditions, medications and allergies."
              icon={<LocalHospitalOutlinedIcon />}
              id="health"
              title="Health"
            >
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
                  <Button component={RouterLink} size="small" to="/profile/edit/medical-history" variant="outlined">
                    Edit medical history
                  </Button>
                  <Button component={RouterLink} size="small" to="/profile/edit/medications" variant="outlined">
                    Edit medications
                  </Button>
                  <Button component={RouterLink} size="small" to="/profile/edit/allergies" variant="outlined">
                    Edit allergies
                  </Button>
                </Stack>
                <Subheading>Medical history</Subheading>
                {profile.medicalHistories.length === 0 ? (
                  <EmptyRecord>No medical conditions recorded.</EmptyRecord>
                ) : (
                  profile.medicalHistories.map((history) => (
                    <RecordCard
                      fields={[
                        { label: "Description", value: formatText(history.description) },
                        { label: "Doctor advice", value: formatText(history.doctorAdvice) },
                        { label: "Treatment", value: formatText(history.treatmentDetails) },
                        { label: "Diagnosed", value: formatDate(history.diagnosisDate) },
                        { label: "Notes", value: formatText(history.notes) },
                      ]}
                      key={history.id}
                      status={history.isActive ? "Active" : "Resolved"}
                      title={history.conditionName}
                    />
                  ))
                )}
                <Subheading>Medications</Subheading>
                {profile.medications.length === 0 ? (
                  <EmptyRecord>No medications recorded.</EmptyRecord>
                ) : (
                  profile.medications.map((medication) => (
                    <RecordCard
                      fields={[
                        { label: "Dosage", value: formatText(medication.dosage) },
                        { label: "Frequency", value: formatText(medication.frequency) },
                        { label: "Start date", value: formatDate(medication.startDate) },
                        { label: "End date", value: formatDate(medication.endDate) },
                        { label: "Reason", value: formatText(medication.reasonForTaking) },
                        { label: "Doctor prescribed", value: formatBoolean(medication.doctorPrescribed) },
                      ]}
                      key={medication.id}
                      title={medication.medicineName}
                    />
                  ))
                )}
                <Subheading>Allergies</Subheading>
                {profile.allergies.length === 0 ? (
                  <EmptyRecord>No allergies recorded.</EmptyRecord>
                ) : (
                  profile.allergies.map((allergy) => (
                    <RecordCard
                      fields={[
                        { label: "Type", value: formatText(allergy.allergyType) },
                        { label: "Severity", value: formatText(allergy.severity) },
                        { label: "Reaction", value: formatText(allergy.reaction) },
                        { label: "Notes", value: formatText(allergy.notes) },
                      ]}
                      key={allergy.id}
                      title={allergy.allergyName}
                    />
                  ))
                )}
              </Stack>
            </Section>

            <Section
              description="Diet, eating habits and available ingredients."
              editLabel="Edit food & nutrition"
              editTo="/profile/edit/nutrition"
              icon={<RestaurantOutlinedIcon />}
              id="food"
              title="Food & Nutrition"
            >
              <Stack spacing={2}>
                <Subheading>Food preferences</Subheading>
                {food ? (
                  <ProfileSummary
                    fields={[
                      { label: "Diet type", value: food.dietType },
                      { label: "Preferred cuisines", value: formatList(food.preferredCuisine) },
                      { label: "Food allergies", value: formatList(food.foodAllergies) },
                      { label: "Other allergy", value: formatText(food.otherFoodAllergy) },
                      { label: "Intolerances", value: formatList(food.foodIntolerances) },
                      { label: "Disliked foods", value: formatList(food.dislikedFoods) },
                      { label: "Favourite foods", value: formatList(food.favouriteFoods) },
                      { label: "Daily food budget", value: formatNumber(food.dailyFoodBudget) },
                      { label: "Cooking preference", value: food.cookingPreference },
                      { label: "Cooking time", value: formatNumber(food.cookingTime, "min") },
                    ]}
                  />
                ) : (
                  <EmptyRecord>No food preferences recorded.</EmptyRecord>
                )}
                <Subheading>Eating habits</Subheading>
                {eating ? (
                  <ProfileSummary
                    fields={[
                      { label: "Meals per day", value: eating.mealsPerDay },
                      { label: "Breakfast", value: formatTime(eating.breakfastTime) },
                      { label: "Lunch", value: formatTime(eating.lunchTime) },
                      { label: "Dinner", value: formatTime(eating.dinnerTime) },
                      { label: "Eats snacks", value: formatBoolean(eating.eatsSnacks) },
                      { label: "Eats outside often", value: formatBoolean(eating.frequentlyEatsOutside) },
                      { label: "Prefers homemade", value: formatBoolean(eating.prefersHomemadeFood) },
                      { label: "Intermittent fasting", value: formatBoolean(eating.followsIntermittentFasting) },
                      { label: "Fasting window", value: formatText(eating.fastingWindow) },
                    ]}
                  />
                ) : (
                  <EmptyRecord>No eating habits recorded.</EmptyRecord>
                )}
                <Subheading>Food availability</Subheading>
                {availability ? (
                  <ProfileSummary
                    fields={[
                      { label: "Available ingredients", value: formatList(availability.availableIngredients) },
                      { label: "Other ingredients", value: formatText(availability.otherIngredients) },
                    ]}
                  />
                ) : (
                  <EmptyRecord>No food availability recorded.</EmptyRecord>
                )}
              </Stack>
            </Section>

            <Section
              description="Training preferences, schedule and exercise restrictions."
              editLabel="Edit workout preferences"
              editTo="/profile/edit/workout"
              icon={<DirectionsRunOutlinedIcon />}
              id="workout"
              title="Workout & Fitness"
            >
              <Stack spacing={2}>
                <Subheading>Workout preferences</Subheading>
                {workout ? (
                  <ProfileSummary
                    fields={[
                      { label: "Fitness level", value: workout.fitnessLevel },
                      { label: "Experience", value: workout.workoutExperience },
                      { label: "Location", value: workout.workoutLocation },
                      { label: "Gym membership", value: formatBoolean(workout.gymMembership) },
                      { label: "Equipment", value: formatList(workout.availableEquipment) },
                      { label: "Other equipment", value: formatText(workout.otherEquipment) },
                      { label: "Preferred workouts", value: formatList(workout.preferredWorkouts) },
                      { label: "Preferred sports", value: formatList(workout.preferredSports) },
                    ]}
                  />
                ) : (
                  <EmptyRecord>No workout preferences recorded.</EmptyRecord>
                )}
                <Subheading>Schedule</Subheading>
                {schedule ? (
                  <ProfileSummary
                    fields={[
                      { label: "Days per week", value: formatNumber(schedule.workoutDaysPerWeek) },
                      { label: "Duration", value: schedule.workoutDuration },
                      { label: "Preferred time", value: schedule.preferredWorkoutTime },
                      { label: "Rest days", value: formatList(schedule.restDays) },
                      { label: "Intensity", value: schedule.preferredIntensity },
                    ]}
                  />
                ) : (
                  <EmptyRecord>No workout schedule recorded.</EmptyRecord>
                )}
                <Subheading>Exercise restrictions</Subheading>
                {restrictions ? (
                  <ProfileSummary
                    fields={[
                      { label: "Current injuries", value: formatText(restrictions.currentInjuries) },
                      { label: "Joint pain", value: formatBoolean(restrictions.experiencesJointPain) },
                      { label: "Restricted exercises", value: formatText(restrictions.restrictedExercises) },
                      { label: "Disliked exercises", value: formatText(restrictions.dislikedExercises) },
                      { label: "Doctor restrictions", value: formatText(restrictions.doctorExerciseRestrictions) },
                    ]}
                  />
                ) : (
                  <EmptyRecord>No exercise restrictions recorded.</EmptyRecord>
                )}
              </Stack>
            </Section>

            <Section
              description="Your working routine and available free time."
              editLabel="Edit work-life details"
              editTo="/profile/edit/work-life"
              icon={<WorkOutlineOutlinedIcon />}
              id="work-life"
              title="Work-Life"
            >
              {workLife ? (
                <ProfileSummary
                  fields={[
                    { label: "Work type", value: workLife.workType },
                    { label: "Work start", value: formatTime(workLife.workStartTime) },
                    { label: "Work end", value: formatTime(workLife.workEndTime) },
                    { label: "Working days", value: formatList(workLife.workingDays) },
                    { label: "Sitting hours", value: formatNumber(workLife.dailySittingHours, "hrs") },
                    { label: "Standing hours", value: formatNumber(workLife.dailyStandingHours, "hrs") },
                    { label: "Commute", value: formatNumber(workLife.dailyCommuteTime, "min") },
                    { label: "Sleep time", value: formatTime(workLife.sleepTime) },
                    { label: "Wake up time", value: formatTime(workLife.wakeUpTime) },
                    { label: "Stress level", value: formatText(workLife.stressLevel) },
                    { label: "Free time", value: workLife.freeTime },
                  ]}
                />
              ) : (
                <EmptyRecord>No work-life details recorded.</EmptyRecord>
              )}
            </Section>

            <Section
              description="Reminders, coaching style and daily targets."
              editLabel="Edit preferences"
              editTo="/profile/edit/preferences"
              icon={<TuneOutlinedIcon />}
              id="preferences"
              title="Preferences & Targets"
            >
              {personalization ? (
                <ProfileSummary
                  fields={[
                    { label: "Reminders", value: formatBoolean(personalization.reminderPreference) },
                    { label: "Water reminders", value: formatBoolean(personalization.waterReminder) },
                    { label: "Meal reminders", value: formatBoolean(personalization.mealReminder) },
                    { label: "Workout reminders", value: formatBoolean(personalization.workoutReminder) },
                    { label: "Preferred language", value: personalization.preferredLanguage },
                    { label: "Coaching style", value: personalization.coachingStyle },
                    { label: "Notification frequency", value: personalization.notificationFrequency },
                    { label: "Daily water target", value: formatNumber(personalization.dailyWaterTargetMl, "ml") },
                    { label: "Sleep goal", value: formatMinutes(personalization.sleepGoalMinutes) },
                  ]}
                />
              ) : (
                <EmptyRecord>No preferences recorded.</EmptyRecord>
              )}
            </Section>
          </Stack>
        </Stack>
      </Container>

      <Snackbar
        autoHideDuration={4000}
        onClose={() => setSnackbar(null)}
        open={Boolean(snackbar)}
      >
        <Alert onClose={() => setSnackbar(null)} severity="success">
          {snackbar}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfilePage;
