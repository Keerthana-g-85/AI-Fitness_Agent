import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Paper,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import { DateField } from "../onboarding/DateField";
import { FormSelect } from "../onboarding/FormSelect";
import { MultiSelectField } from "../onboarding/MultiSelectField";
import { NumberField } from "../onboarding/NumberField";
import { TimeField } from "../onboarding/TimeField";
import { DynamicTextList } from "../onboarding/DynamicTextList";
import {
  getProfileErrorMessage,
  profileQueryKeys,
  updateMyProfile,
} from "../../api/profileApi";
import { useAuth } from "../../context/AuthContext";
import {
  ACTIVITY_LEVEL_OPTIONS,
  ALLERGY_SEVERITY_OPTIONS,
  ALLERGY_TYPE_OPTIONS,
  BODY_COMPOSITION_SOURCE_OPTIONS,
  COACHING_STYLE_OPTIONS,
  COOKING_PREFERENCE_OPTIONS,
  DIET_TYPE_OPTIONS,
  EQUIPMENT_OPTIONS,
  FASTING_WINDOW_OPTIONS,
  FITNESS_GOAL_OPTIONS,
  FITNESS_LEVEL_OPTIONS,
  FOOD_ALLERGEN_OPTIONS,
  FOOD_INTOLERANCE_OPTIONS,
  FREE_TIME_OPTIONS,
  GENDER_OPTIONS,
  INGREDIENT_OPTIONS,
  MEALS_PER_DAY_OPTIONS,
  MEDICATION_FREQUENCY_OPTIONS,
  NOTIFICATION_FREQUENCY_OPTIONS,
  PREFERRED_CUISINE_OPTIONS,
  PREFERRED_LANGUAGE_OPTIONS,
  PREFERRED_WORKOUT_TIME_OPTIONS,
  SPORTS_OPTIONS,
  STRESS_LEVEL_OPTIONS,
  WEEKDAY_OPTIONS,
  WORKOUT_DURATION_OPTIONS,
  WORKOUT_EXPERIENCE_OPTIONS,
  WORKOUT_INTENSITY_OPTIONS,
  WORKOUT_LOCATION_OPTIONS,
  WORKOUT_PREFERENCE_OPTIONS,
  WORK_TYPE_OPTIONS,
} from "../../types/onboarding";
import type {
  EditableSection,
  MyProfile,
} from "../../types/profile";
import {
  buildProfileUpdateInput,
  createProfileEditForm,
  emptyAllergy,
  emptyMedicalHistory,
  emptyMedication,
  validateProfileSection,
} from "./editProfileForm";
import type {
  AllergyForm,
  BodyCompositionForm,
  BodyMeasurementForm,
  BasicForm,
  FitnessGoalForm,
  FoodForm,
  FormErrors,
  MedicalHistoryForm,
  MedicationForm,
  ProfileEditForm,
  WorkLifeForm,
  WorkoutForm,
} from "./editProfileForm";

interface EditProfileDialogProps {
  open: boolean;
  section: EditableSection | null;
  profile: MyProfile;
  onClose: () => void;
  onSaved: (message: string) => void;
  variant?: "dialog" | "page";
}

const SECTION_META: Record<
  EditableSection,
  { title: string; description: string }
> = {
  basic: {
    title: "Basic Information",
    description: "Update your identity and lifestyle basics.",
  },
  fitnessGoal: {
    title: "Fitness Goals",
    description: "Adjust your goal, targets and timeline.",
  },
  bodyMeasurement: {
    title: "Body Measurements",
    description: "Update your latest measurement record.",
  },
  bodyComposition: {
    title: "Body Composition",
    description: "Update your latest body composition record.",
  },
  medicalHistories: {
    title: "Medical History",
    description: "Add, revise or remove medical conditions.",
  },
  medications: {
    title: "Medications",
    description: "Keep your current medication list accurate.",
  },
  allergies: {
    title: "Allergies",
    description: "Review the allergies recorded in your profile.",
  },
  food: {
    title: "Food Preferences & Availability",
    description: "Update your diet, eating habits and available food.",
  },
  workout: {
    title: "Workout Preferences",
    description: "Adjust your training preferences, schedule and limits.",
  },
  workLifeAndPersonalization: {
    title: "Work-Life & Personalization",
    description: "Update your routine, coaching and reminder settings.",
  },
  preferences: {
    title: "Preferences & Goals",
    description: "Set reminders, coaching preferences and daily targets.",
  },
};

const fieldGridSx = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
  gap: 2,
} as const;

const Subheading = ({ children }: { children: string }) => (
  <Typography sx={{ fontWeight: 700, mt: 1 }} variant="subtitle2">
    {children}
  </Typography>
);

const EditProfileDialog = ({
  open,
  section,
  profile,
  onClose,
  onSaved,
  variant = "dialog",
}: EditProfileDialogProps) => {
  const queryClient = useQueryClient();
  const { refreshUser } = useAuth();
  const [form, setForm] = useState<ProfileEditForm>(() =>
    createProfileEditForm(profile),
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (!open || !section) {
      return;
    }

    setForm(createProfileEditForm(profile));
    setErrors({});
    setServerError(null);
    setConfirmOpen(false);
  }, [open, section, profile]);

  const mutation = useMutation({
    mutationFn: updateMyProfile,
    onSuccess: async (response) => {
      setConfirmOpen(false);

      if (!response.success) {
        setServerError(response.message);
        return;
      }

      await queryClient.invalidateQueries({ queryKey: profileQueryKeys.me });
      await queryClient.invalidateQueries({
        queryKey: profileQueryKeys.dashboard,
      });
      await refreshUser();
      onSaved(response.message);

      if (variant === "dialog") {
        onClose();
      }
    },
    onError: (error: unknown) => {
      setConfirmOpen(false);
      setServerError(getProfileErrorMessage(error));
    },
  });

  if (!section) {
    return null;
  }

  const meta = SECTION_META[section];

  const updateBasic = (field: keyof BasicForm, value: string): void => {
    setForm((current) => ({
      ...current,
      basic: { ...current.basic, [field]: value },
    }));
  };

  const updateGoal = (field: keyof FitnessGoalForm, value: string): void => {
    setForm((current) => ({
      ...current,
      fitnessGoal: { ...current.fitnessGoal, [field]: value },
    }));
  };

  const updateMeasurement = (
    field: keyof BodyMeasurementForm,
    value: string,
  ): void => {
    setForm((current) => ({
      ...current,
      bodyMeasurement: { ...current.bodyMeasurement, [field]: value },
    }));
  };

  const updateComposition = (
    field: keyof BodyCompositionForm,
    value: string,
  ): void => {
    setForm((current) => ({
      ...current,
      bodyComposition: { ...current.bodyComposition, [field]: value },
    }));
  };

  const updateFood = <K extends keyof FoodForm>(
    field: K,
    value: FoodForm[K],
  ): void => {
    setForm((current) => ({
      ...current,
      food: { ...current.food, [field]: value },
    }));
  };

  const updateWorkout = <K extends keyof WorkoutForm>(
    field: K,
    value: WorkoutForm[K],
  ): void => {
    setForm((current) => ({
      ...current,
      workout: { ...current.workout, [field]: value },
    }));
  };

  const updateWorkLife = <K extends keyof WorkLifeForm>(
    field: K,
    value: WorkLifeForm[K],
  ): void => {
    setForm((current) => ({
      ...current,
      workLife: { ...current.workLife, [field]: value },
    }));
  };

  const updateMedical = (
    index: number,
    updates: Partial<MedicalHistoryForm>,
  ): void => {
    setForm((current) => ({
      ...current,
      medicalHistories: current.medicalHistories.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...updates } : item,
      ),
    }));
  };

  const updateMedication = (
    index: number,
    updates: Partial<MedicationForm>,
  ): void => {
    setForm((current) => ({
      ...current,
      medications: current.medications.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...updates } : item,
      ),
    }));
  };

  const updateAllergy = (
    index: number,
    updates: Partial<AllergyForm>,
  ): void => {
    setForm((current) => ({
      ...current,
      allergies: current.allergies.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...updates } : item,
      ),
    }));
  };

  const handleClose = (): void => {
    if (mutation.isPending) {
      return;
    }

    onClose();
  };

  const handleSave = (): void => {
    const nextErrors = validateProfileSection(section, form);
    setErrors(nextErrors);
    setServerError(null);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setConfirmOpen(true);
  };

  const handleConfirm = (): void => {
    mutation.mutate(buildProfileUpdateInput(section, form));
  };

  const renderBasic = () => (
    <Box sx={fieldGridSx}>
      <TextField
        error={Boolean(errors.name)}
        fullWidth
        helperText={errors.name}
        label="Full name"
        onChange={(event) => updateBasic("name", event.target.value)}
        required
        value={form.basic.name}
      />
      <TextField
        error={Boolean(errors.email)}
        fullWidth
        helperText={errors.email}
        label="Email"
        onChange={(event) => updateBasic("email", event.target.value)}
        required
        type="email"
        value={form.basic.email}
      />
      <DateField
        disableFuture
        error={errors.dateOfBirth}
        label="Date of birth"
        onChange={(value) => updateBasic("dateOfBirth", value ?? "")}
        required
        value={form.basic.dateOfBirth || null}
      />
      <NumberField
        error={errors.heightCm}
        label="Height"
        onChange={(value) => updateBasic("heightCm", value)}
        required
        step={0.1}
        unit="cm"
        value={form.basic.heightCm}
      />
      <FormSelect
        error={errors.gender}
        label="Gender"
        onChange={(value) => updateBasic("gender", value)}
        options={GENDER_OPTIONS}
        required
        value={form.basic.gender}
      />
      <TextField
        fullWidth
        label="Occupation"
        onChange={(event) => updateBasic("occupation", event.target.value)}
        value={form.basic.occupation}
      />
      <TextField
        error={Boolean(errors.country)}
        fullWidth
        helperText={errors.country}
        label="Country"
        onChange={(event) => updateBasic("country", event.target.value)}
        required
        value={form.basic.country}
      />
      <FormSelect
        error={errors.activityLevel}
        label="Activity level"
        onChange={(value) => updateBasic("activityLevel", value)}
        options={ACTIVITY_LEVEL_OPTIONS}
        required
        value={form.basic.activityLevel}
      />
    </Box>
  );

  const renderFitnessGoal = () => (
    <Box sx={fieldGridSx}>
      <FormSelect
        error={errors.primaryGoal}
        label="Primary goal"
        onChange={(value) => updateGoal("primaryGoal", value)}
        options={FITNESS_GOAL_OPTIONS}
        required
        value={form.fitnessGoal.primaryGoal}
      />
      <FormSelect
        error={errors.secondaryGoal}
        label="Secondary goal"
        onChange={(value) => updateGoal("secondaryGoal", value)}
        options={FITNESS_GOAL_OPTIONS}
        value={form.fitnessGoal.secondaryGoal}
      />
      <NumberField
        error={errors.currentWeightKg}
        label="Current weight"
        onChange={(value) => updateGoal("currentWeightKg", value)}
        required
        unit="kg"
        value={form.fitnessGoal.currentWeightKg}
      />
      <NumberField
        error={errors.targetWeightKg}
        label="Target weight"
        onChange={(value) => updateGoal("targetWeightKg", value)}
        unit="kg"
        value={form.fitnessGoal.targetWeightKg}
      />
      <NumberField
        error={errors.targetBodyFatPercentage}
        label="Target body fat"
        onChange={(value) => updateGoal("targetBodyFatPercentage", value)}
        step={0.1}
        unit="%"
        value={form.fitnessGoal.targetBodyFatPercentage}
      />
      <NumberField
        error={errors.targetMuscleMassKg}
        label="Target muscle mass"
        onChange={(value) => updateGoal("targetMuscleMassKg", value)}
        unit="kg"
        value={form.fitnessGoal.targetMuscleMassKg}
      />
      <DateField
        error={errors.targetDate}
        label="Target date"
        minDate={dayjs().add(1, "day")}
        onChange={(value) => updateGoal("targetDate", value ?? "")}
        value={form.fitnessGoal.targetDate || null}
      />
    </Box>
  );

  const renderBodyMeasurement = () => {
    const fields: Array<{
      field: keyof BodyMeasurementForm;
      label: string;
      unit?: string;
    }> = [
      { field: "weightKg", label: "Weight", unit: "kg" },
      { field: "neckCm", label: "Neck", unit: "cm" },
      { field: "shoulderCm", label: "Shoulder", unit: "cm" },
      { field: "chestCm", label: "Chest", unit: "cm" },
      { field: "bustCm", label: "Bust", unit: "cm" },
      { field: "waistCm", label: "Waist", unit: "cm" },
      { field: "abdomenCm", label: "Abdomen", unit: "cm" },
      { field: "hipCm", label: "Hip", unit: "cm" },
      { field: "leftArmCm", label: "Left arm", unit: "cm" },
      { field: "rightArmCm", label: "Right arm", unit: "cm" },
      { field: "leftThighCm", label: "Left thigh", unit: "cm" },
      { field: "rightThighCm", label: "Right thigh", unit: "cm" },
      { field: "leftCalfCm", label: "Left calf", unit: "cm" },
      { field: "rightCalfCm", label: "Right calf", unit: "cm" },
    ];

    return (
      <Stack spacing={2}>
        <Box sx={fieldGridSx}>
          {fields.map((item) => (
            <NumberField
              error={errors[item.field]}
              key={item.field}
              label={item.label}
              onChange={(value) => updateMeasurement(item.field, value)}
              unit={item.unit}
              value={form.bodyMeasurement[item.field] as string}
            />
          ))}
          <DateField
            disableFuture
            error={errors.measuredAt}
            label="Measurement date"
            onChange={(value) => updateMeasurement("measuredAt", value ?? "")}
            value={form.bodyMeasurement.measuredAt || null}
          />
        </Box>
        <TextField
          fullWidth
          label="Notes"
          minRows={2}
          multiline
          onChange={(event) => updateMeasurement("notes", event.target.value)}
          value={form.bodyMeasurement.notes}
        />
      </Stack>
    );
  };

  const renderBodyComposition = () => {
    const fields: Array<{
      field: keyof BodyCompositionForm;
      label: string;
      unit?: string;
      step?: number;
    }> = [
      { field: "bodyFatPercentage", label: "Body fat percentage", unit: "%", step: 0.1 },
      { field: "fatMassKg", label: "Fat mass", unit: "kg" },
      { field: "muscleMassKg", label: "Muscle mass", unit: "kg" },
      { field: "skeletalMuscleMassKg", label: "Skeletal muscle mass", unit: "kg" },
      { field: "leanBodyMassKg", label: "Lean body mass", unit: "kg" },
      { field: "bodyWaterPercentage", label: "Body water percentage", unit: "%", step: 0.1 },
      { field: "totalBodyWaterLiters", label: "Total body water", unit: "L" },
      { field: "visceralFat", label: "Visceral fat", step: 1 },
      { field: "boneMassKg", label: "Bone mass", unit: "kg" },
      { field: "proteinPercentage", label: "Protein percentage", unit: "%", step: 0.1 },
      { field: "bmrKcal", label: "BMR", unit: "kcal", step: 1 },
      { field: "bmi", label: "BMI", step: 0.1 },
      { field: "metabolicAge", label: "Metabolic age", unit: "years", step: 1 },
    ];

    return (
      <Box sx={fieldGridSx}>
        {fields.map((item) => (
          <NumberField
            error={errors[item.field]}
            key={item.field}
            label={item.label}
            onChange={(value) => updateComposition(item.field, value)}
            step={item.step}
            unit={item.unit}
            value={form.bodyComposition[item.field] as string}
          />
        ))}
        <FormSelect
          label="Source"
          onChange={(value) => updateComposition("source", value)}
          options={BODY_COMPOSITION_SOURCE_OPTIONS}
          value={form.bodyComposition.source}
        />
        <DateField
          disableFuture
          error={errors.measuredAt}
          label="Measurement date"
          onChange={(value) => updateComposition("measuredAt", value ?? "")}
          value={form.bodyComposition.measuredAt || null}
        />
      </Box>
    );
  };

  const renderMedicalHistories = () => (
    <Stack spacing={2}>
      {form.medicalHistories.map((item, index) => (
        <Card elevation={0} key={item.id ?? `medical-${index}`} variant="outlined">
          <CardContent sx={{ p: 2 }}>
            <Stack
              direction="row"
              sx={{ alignItems: "center", justifyContent: "space-between", mb: 1.5 }}
            >
              <Typography sx={{ fontWeight: 700 }} variant="subtitle2">
                Condition {index + 1}
              </Typography>
              <IconButton
                aria-label={`Remove condition ${index + 1}`}
                color="error"
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    medicalHistories: current.medicalHistories.filter(
                      (_, itemIndex) => itemIndex !== index,
                    ),
                  }))
                }
              >
                <DeleteForeverOutlinedIcon />
              </IconButton>
            </Stack>
            <Box sx={fieldGridSx}>
              <TextField
                error={Boolean(errors[`medical-${index}-conditionName`])}
                fullWidth
                helperText={errors[`medical-${index}-conditionName`]}
                label="Condition name"
                onChange={(event) =>
                  updateMedical(index, { conditionName: event.target.value })
                }
                required
                value={item.conditionName}
              />
              <DateField
                disableFuture
                error={errors[`medical-${index}-diagnosisDate`]}
                label="Diagnosis date"
                onChange={(value) =>
                  updateMedical(index, { diagnosisDate: value ?? "" })
                }
                value={item.diagnosisDate || null}
              />
              <TextField
                fullWidth
                label="Description"
                multiline
                onChange={(event) =>
                  updateMedical(index, { description: event.target.value })
                }
                value={item.description}
              />
              <TextField
                fullWidth
                label="Doctor advice"
                multiline
                onChange={(event) =>
                  updateMedical(index, { doctorAdvice: event.target.value })
                }
                value={item.doctorAdvice}
              />
              <TextField
                fullWidth
                label="Treatment details"
                multiline
                onChange={(event) =>
                  updateMedical(index, { treatmentDetails: event.target.value })
                }
                value={item.treatmentDetails}
              />
              <TextField
                fullWidth
                label="Notes"
                multiline
                onChange={(event) =>
                  updateMedical(index, { notes: event.target.value })
                }
                value={item.notes}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={item.isActive}
                    onChange={(event) =>
                      updateMedical(index, { isActive: event.target.checked })
                    }
                  />
                }
                label="Currently active"
              />
            </Box>
          </CardContent>
        </Card>
      ))}
      <Button
        onClick={() =>
          setForm((current) => ({
            ...current,
            medicalHistories: [...current.medicalHistories, emptyMedicalHistory()],
          }))
        }
        startIcon={<AddIcon />}
        sx={{ alignSelf: "flex-start" }}
        variant="outlined"
      >
        Add medical condition
      </Button>
    </Stack>
  );

  const renderMedications = () => (
    <Stack spacing={2}>
      {form.medications.map((item, index) => (
        <Card elevation={0} key={item.id ?? `medication-${index}`} variant="outlined">
          <CardContent sx={{ p: 2 }}>
            <Stack
              direction="row"
              sx={{ alignItems: "center", justifyContent: "space-between", mb: 1.5 }}
            >
              <Typography sx={{ fontWeight: 700 }} variant="subtitle2">
                Medication {index + 1}
              </Typography>
              <IconButton
                aria-label={`Remove medication ${index + 1}`}
                color="error"
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    medications: current.medications.filter(
                      (_, itemIndex) => itemIndex !== index,
                    ),
                  }))
                }
              >
                <DeleteForeverOutlinedIcon />
              </IconButton>
            </Stack>
            <Box sx={fieldGridSx}>
              <TextField
                error={Boolean(errors[`medication-${index}-medicineName`])}
                fullWidth
                helperText={errors[`medication-${index}-medicineName`]}
                label="Medicine name"
                onChange={(event) =>
                  updateMedication(index, { medicineName: event.target.value })
                }
                required
                value={item.medicineName}
              />
              <TextField
                fullWidth
                label="Dosage"
                onChange={(event) =>
                  updateMedication(index, { dosage: event.target.value })
                }
                value={item.dosage}
              />
              <FormSelect
                label="Frequency"
                onChange={(value) =>
                  updateMedication(index, { frequency: value })
                }
                options={MEDICATION_FREQUENCY_OPTIONS}
                value={item.frequency}
              />
              <DateField
                error={errors[`medication-${index}-startDate`]}
                label="Start date"
                onChange={(value) =>
                  updateMedication(index, { startDate: value ?? "" })
                }
                value={item.startDate || null}
              />
              <DateField
                error={errors[`medication-${index}-endDate`]}
                label="End date"
                onChange={(value) =>
                  updateMedication(index, { endDate: value ?? "" })
                }
                value={item.endDate || null}
              />
              <TextField
                fullWidth
                label="Reason for taking"
                onChange={(event) =>
                  updateMedication(index, { reasonForTaking: event.target.value })
                }
                value={item.reasonForTaking}
              />
              <TextField
                fullWidth
                label="Notes"
                multiline
                onChange={(event) =>
                  updateMedication(index, { notes: event.target.value })
                }
                value={item.notes}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={item.doctorPrescribed}
                    onChange={(event) =>
                      updateMedication(index, {
                        doctorPrescribed: event.target.checked,
                      })
                    }
                  />
                }
                label="Doctor prescribed"
              />
            </Box>
          </CardContent>
        </Card>
      ))}
      <Button
        onClick={() =>
          setForm((current) => ({
            ...current,
            medications: [...current.medications, emptyMedication()],
          }))
        }
        startIcon={<AddIcon />}
        sx={{ alignSelf: "flex-start" }}
        variant="outlined"
      >
        Add medication
      </Button>
    </Stack>
  );

  const renderAllergies = () => (
    <Stack spacing={2}>
      {form.allergies.map((item, index) => (
        <Card elevation={0} key={item.id ?? `allergy-${index}`} variant="outlined">
          <CardContent sx={{ p: 2 }}>
            <Stack
              direction="row"
              sx={{ alignItems: "center", justifyContent: "space-between", mb: 1.5 }}
            >
              <Typography sx={{ fontWeight: 700 }} variant="subtitle2">
                Allergy {index + 1}
              </Typography>
              <IconButton
                aria-label={`Remove allergy ${index + 1}`}
                color="error"
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    allergies: current.allergies.filter(
                      (_, itemIndex) => itemIndex !== index,
                    ),
                  }))
                }
              >
                <DeleteForeverOutlinedIcon />
              </IconButton>
            </Stack>
            <Box sx={fieldGridSx}>
              <TextField
                error={Boolean(errors[`allergy-${index}-allergyName`])}
                fullWidth
                helperText={errors[`allergy-${index}-allergyName`]}
                label="Allergy name"
                onChange={(event) =>
                  updateAllergy(index, { allergyName: event.target.value })
                }
                required
                value={item.allergyName}
              />
              <FormSelect
                label="Allergy type"
                onChange={(value) =>
                  updateAllergy(index, { allergyType: value })
                }
                options={ALLERGY_TYPE_OPTIONS}
                value={item.allergyType}
              />
              <FormSelect
                label="Severity"
                onChange={(value) =>
                  updateAllergy(index, { severity: value })
                }
                options={ALLERGY_SEVERITY_OPTIONS}
                value={item.severity}
              />
              <TextField
                fullWidth
                label="Reaction"
                onChange={(event) =>
                  updateAllergy(index, { reaction: event.target.value })
                }
                value={item.reaction}
              />
              <TextField
                fullWidth
                label="Notes"
                multiline
                onChange={(event) =>
                  updateAllergy(index, { notes: event.target.value })
                }
                value={item.notes}
              />
            </Box>
          </CardContent>
        </Card>
      ))}
      <Button
        onClick={() =>
          setForm((current) => ({
            ...current,
            allergies: [...current.allergies, emptyAllergy()],
          }))
        }
        startIcon={<AddIcon />}
        sx={{ alignSelf: "flex-start" }}
        variant="outlined"
      >
        Add allergy
      </Button>
    </Stack>
  );

  const renderFood = () => (
    <Stack spacing={2}>
      <Subheading>Food Preferences</Subheading>
      <Box sx={fieldGridSx}>
        <FormSelect
          error={errors.dietType}
          label="Diet type"
          onChange={(value) => updateFood("dietType", value)}
          options={DIET_TYPE_OPTIONS}
          required
          value={form.food.dietType}
        />
        <FormSelect
          error={errors.cookingPreference}
          label="Cooking preference"
          onChange={(value) => updateFood("cookingPreference", value)}
          options={COOKING_PREFERENCE_OPTIONS}
          required
          value={form.food.cookingPreference}
        />
        <MultiSelectField
          label="Preferred cuisine"
          onChange={(value) => updateFood("preferredCuisine", value)}
          options={PREFERRED_CUISINE_OPTIONS}
          value={form.food.preferredCuisine}
        />
        <MultiSelectField
          label="Food allergies"
          onChange={(value) => updateFood("foodAllergies", value)}
          options={FOOD_ALLERGEN_OPTIONS}
          value={form.food.foodAllergies}
        />
        <TextField
          fullWidth
          label="Other food allergy"
          onChange={(event) => updateFood("otherFoodAllergy", event.target.value)}
          value={form.food.otherFoodAllergy}
        />
        <MultiSelectField
          label="Food intolerances"
          onChange={(value) => updateFood("foodIntolerances", value)}
          options={FOOD_INTOLERANCE_OPTIONS}
          value={form.food.foodIntolerances}
        />
        <TextField
          fullWidth
          label="Other food intolerance"
          onChange={(event) =>
            updateFood("otherFoodIntolerance", event.target.value)
          }
          value={form.food.otherFoodIntolerance}
        />
        <NumberField
          error={errors.dailyFoodBudget}
          label="Daily food budget"
          onChange={(value) => updateFood("dailyFoodBudget", value)}
          step={1}
          value={form.food.dailyFoodBudget}
        />
        <NumberField
          error={errors.cookingTime}
          label="Cooking time"
          onChange={(value) => updateFood("cookingTime", value)}
          step={1}
          unit="min"
          value={form.food.cookingTime}
        />
      </Box>

      <Subheading>Disliked & Favourite Foods</Subheading>
      <Box sx={fieldGridSx}>
        <DynamicTextList
          addLabel="Add disliked food"
          label="Disliked food"
          onChange={(value) => updateFood("dislikedFoods", value)}
          placeholder="e.g. Mushrooms"
          values={form.food.dislikedFoods}
        />
        <DynamicTextList
          addLabel="Add favourite food"
          label="Favourite food"
          onChange={(value) => updateFood("favouriteFoods", value)}
          placeholder="e.g. Paneer"
          values={form.food.favouriteFoods}
        />
      </Box>

      <Subheading>Eating Habits</Subheading>
      <Box sx={fieldGridSx}>
        <FormSelect
          error={errors.mealsPerDay}
          label="Meals per day"
          onChange={(value) => updateFood("mealsPerDay", value)}
          options={MEALS_PER_DAY_OPTIONS}
          required
          value={form.food.mealsPerDay}
        />
        <TimeField
          error={errors.breakfastTime}
          label="Breakfast time"
          onChange={(value) => updateFood("breakfastTime", value ?? "")}
          value={form.food.breakfastTime || null}
        />
        <TimeField
          error={errors.lunchTime}
          label="Lunch time"
          onChange={(value) => updateFood("lunchTime", value ?? "")}
          value={form.food.lunchTime || null}
        />
        <TimeField
          error={errors.dinnerTime}
          label="Dinner time"
          onChange={(value) => updateFood("dinnerTime", value ?? "")}
          value={form.food.dinnerTime || null}
        />
      </Box>
      <Stack spacing={0.5}>
        <FormControlLabel
          control={
            <Switch
              checked={form.food.eatsSnacks}
              onChange={(event) => updateFood("eatsSnacks", event.target.checked)}
            />
          }
          label="Eats snacks"
        />
        <FormControlLabel
          control={
            <Switch
              checked={form.food.frequentlyEatsOutside}
              onChange={(event) =>
                updateFood("frequentlyEatsOutside", event.target.checked)
              }
            />
          }
          label="Frequently eats outside"
        />
        <FormControlLabel
          control={
            <Switch
              checked={form.food.prefersHomemadeFood}
              onChange={(event) =>
                updateFood("prefersHomemadeFood", event.target.checked)
              }
            />
          }
          label="Prefers homemade food"
        />
        <FormControlLabel
          control={
            <Switch
              checked={form.food.followsIntermittentFasting}
              onChange={(event) =>
                updateFood("followsIntermittentFasting", event.target.checked)
              }
            />
          }
          label="Follows intermittent fasting"
        />
      </Stack>
      {form.food.followsIntermittentFasting && (
        <FormSelect
          error={errors.fastingWindow}
          label="Fasting window"
          onChange={(value) => updateFood("fastingWindow", value)}
          options={FASTING_WINDOW_OPTIONS}
          required
          value={form.food.fastingWindow}
        />
      )}

      <Subheading>Food Availability</Subheading>
      <MultiSelectField
        label="Available ingredients"
        onChange={(value) => updateFood("availableIngredients", value)}
        options={INGREDIENT_OPTIONS}
        value={form.food.availableIngredients}
      />
      <TextField
        fullWidth
        label="Other ingredients"
        onChange={(event) => updateFood("otherIngredients", event.target.value)}
        value={form.food.otherIngredients}
      />
    </Stack>
  );

  const renderWorkout = () => (
    <Stack spacing={2}>
      <Subheading>Workout Preferences</Subheading>
      <Box sx={fieldGridSx}>
        <FormSelect
          error={errors.fitnessLevel}
          label="Fitness level"
          onChange={(value) => updateWorkout("fitnessLevel", value)}
          options={FITNESS_LEVEL_OPTIONS}
          required
          value={form.workout.fitnessLevel}
        />
        <FormSelect
          error={errors.workoutExperience}
          label="Workout experience"
          onChange={(value) => updateWorkout("workoutExperience", value)}
          options={WORKOUT_EXPERIENCE_OPTIONS}
          required
          value={form.workout.workoutExperience}
        />
        <FormSelect
          error={errors.workoutLocation}
          label="Workout location"
          onChange={(value) => updateWorkout("workoutLocation", value)}
          options={WORKOUT_LOCATION_OPTIONS}
          required
          value={form.workout.workoutLocation}
        />
        <FormControlLabel
          control={
            <Switch
              checked={form.workout.gymMembership}
              onChange={(event) =>
                updateWorkout("gymMembership", event.target.checked)
              }
            />
          }
          label="Gym membership"
        />
        <MultiSelectField
          label="Available equipment"
          onChange={(value) => updateWorkout("availableEquipment", value)}
          options={EQUIPMENT_OPTIONS}
          value={form.workout.availableEquipment}
        />
        <TextField
          fullWidth
          label="Other equipment"
          onChange={(event) => updateWorkout("otherEquipment", event.target.value)}
          value={form.workout.otherEquipment}
        />
        <MultiSelectField
          label="Preferred workouts"
          onChange={(value) => updateWorkout("preferredWorkouts", value)}
          options={WORKOUT_PREFERENCE_OPTIONS}
          value={form.workout.preferredWorkouts}
        />
        <MultiSelectField
          label="Preferred sports"
          onChange={(value) => updateWorkout("preferredSports", value)}
          options={SPORTS_OPTIONS}
          value={form.workout.preferredSports}
        />
      </Box>

      <Subheading>Workout Schedule</Subheading>
      <Box sx={fieldGridSx}>
        <NumberField
          error={errors.workoutDaysPerWeek}
          label="Workout days per week"
          max={7}
          min={1}
          onChange={(value) => updateWorkout("workoutDaysPerWeek", value)}
          required
          step={1}
          value={form.workout.workoutDaysPerWeek}
        />
        <FormSelect
          error={errors.workoutDuration}
          label="Workout duration"
          onChange={(value) => updateWorkout("workoutDuration", value)}
          options={WORKOUT_DURATION_OPTIONS}
          required
          value={form.workout.workoutDuration}
        />
        <FormSelect
          error={errors.preferredWorkoutTime}
          label="Preferred workout time"
          onChange={(value) => updateWorkout("preferredWorkoutTime", value)}
          options={PREFERRED_WORKOUT_TIME_OPTIONS}
          required
          value={form.workout.preferredWorkoutTime}
        />
        <FormSelect
          error={errors.preferredIntensity}
          label="Preferred intensity"
          onChange={(value) => updateWorkout("preferredIntensity", value)}
          options={WORKOUT_INTENSITY_OPTIONS}
          required
          value={form.workout.preferredIntensity}
        />
        <MultiSelectField
          error={errors.restDays}
          label="Rest days"
          onChange={(value) => updateWorkout("restDays", value)}
          options={WEEKDAY_OPTIONS}
          value={form.workout.restDays}
        />
      </Box>

      <Subheading>Exercise Restrictions</Subheading>
      <Box sx={fieldGridSx}>
        <TextField
          fullWidth
          label="Current injuries"
          multiline
          onChange={(event) =>
            updateWorkout("currentInjuries", event.target.value)
          }
          value={form.workout.currentInjuries}
        />
        <TextField
          fullWidth
          label="Restricted exercises"
          multiline
          onChange={(event) =>
            updateWorkout("restrictedExercises", event.target.value)
          }
          value={form.workout.restrictedExercises}
        />
        <TextField
          fullWidth
          label="Disliked exercises"
          multiline
          onChange={(event) =>
            updateWorkout("dislikedExercises", event.target.value)
          }
          value={form.workout.dislikedExercises}
        />
        <TextField
          fullWidth
          label="Doctor exercise restrictions"
          multiline
          onChange={(event) =>
            updateWorkout("doctorExerciseRestrictions", event.target.value)
          }
          value={form.workout.doctorExerciseRestrictions}
        />
        <FormControlLabel
          control={
            <Switch
              checked={form.workout.experiencesJointPain}
              onChange={(event) =>
                updateWorkout("experiencesJointPain", event.target.checked)
              }
            />
          }
          label="Experiences joint pain"
        />
      </Box>
    </Stack>
  );

  const renderWorkLife = () => (
    <Stack spacing={2}>
      <Subheading>Work-Life</Subheading>
      <Box sx={fieldGridSx}>
        <FormSelect
          error={errors.workType}
          label="Work type"
          onChange={(value) => updateWorkLife("workType", value)}
          options={WORK_TYPE_OPTIONS}
          required
          value={form.workLife.workType}
        />
        <TimeField
          error={errors.workStartTime}
          label="Work start time"
          onChange={(value) => updateWorkLife("workStartTime", value ?? "")}
          value={form.workLife.workStartTime || null}
        />
        <TimeField
          error={errors.workEndTime}
          label="Work end time"
          onChange={(value) => updateWorkLife("workEndTime", value ?? "")}
          value={form.workLife.workEndTime || null}
        />
        <MultiSelectField
          label="Working days"
          onChange={(value) => updateWorkLife("workingDays", value)}
          options={WEEKDAY_OPTIONS}
          value={form.workLife.workingDays}
        />
        <NumberField
          error={errors.dailySittingHours}
          label="Daily sitting hours"
          onChange={(value) => updateWorkLife("dailySittingHours", value)}
          step={0.5}
          unit="hrs"
          value={form.workLife.dailySittingHours}
        />
        <NumberField
          error={errors.dailyStandingHours}
          label="Daily standing hours"
          onChange={(value) => updateWorkLife("dailyStandingHours", value)}
          step={0.5}
          unit="hrs"
          value={form.workLife.dailyStandingHours}
        />
        <NumberField
          error={errors.dailyCommuteTime}
          label="Daily commute time"
          onChange={(value) => updateWorkLife("dailyCommuteTime", value)}
          step={1}
          unit="min"
          value={form.workLife.dailyCommuteTime}
        />
        <TimeField
          error={errors.sleepTime}
          label="Sleep time"
          onChange={(value) => updateWorkLife("sleepTime", value ?? "")}
          required
          value={form.workLife.sleepTime || null}
        />
        <TimeField
          error={errors.wakeUpTime}
          label="Wake up time"
          onChange={(value) => updateWorkLife("wakeUpTime", value ?? "")}
          required
          value={form.workLife.wakeUpTime || null}
        />
        <FormSelect
          label="Stress level"
          onChange={(value) => updateWorkLife("stressLevel", value)}
          options={STRESS_LEVEL_OPTIONS}
          value={form.workLife.stressLevel}
        />
        <FormSelect
          error={errors.freeTime}
          label="Free time for exercise"
          onChange={(value) => updateWorkLife("freeTime", value)}
          options={FREE_TIME_OPTIONS}
          required
          value={form.workLife.freeTime}
        />
      </Box>

      <Subheading>Personalization</Subheading>
      <Stack spacing={0.5}>
        <FormControlLabel
          control={
            <Switch
              checked={form.workLife.reminderPreference}
              onChange={(event) =>
                updateWorkLife("reminderPreference", event.target.checked)
              }
            />
          }
          label="Enable reminders"
        />
        <FormControlLabel
          control={
            <Switch
              checked={form.workLife.waterReminder}
              onChange={(event) =>
                updateWorkLife("waterReminder", event.target.checked)
              }
            />
          }
          label="Water reminders"
        />
        <FormControlLabel
          control={
            <Switch
              checked={form.workLife.mealReminder}
              onChange={(event) =>
                updateWorkLife("mealReminder", event.target.checked)
              }
            />
          }
          label="Meal reminders"
        />
        <FormControlLabel
          control={
            <Switch
              checked={form.workLife.workoutReminder}
              onChange={(event) =>
                updateWorkLife("workoutReminder", event.target.checked)
              }
            />
          }
          label="Workout reminders"
        />
      </Stack>
      <Box sx={fieldGridSx}>
        <FormSelect
          error={errors.preferredLanguage}
          label="Preferred language"
          onChange={(value) => updateWorkLife("preferredLanguage", value)}
          options={PREFERRED_LANGUAGE_OPTIONS}
          required
          value={form.workLife.preferredLanguage}
        />
        <FormSelect
          error={errors.coachingStyle}
          label="Coaching style"
          onChange={(value) => updateWorkLife("coachingStyle", value)}
          options={COACHING_STYLE_OPTIONS}
          required
          value={form.workLife.coachingStyle}
        />
        <FormSelect
          error={errors.notificationFrequency}
          label="Notification frequency"
          onChange={(value) => updateWorkLife("notificationFrequency", value)}
          options={NOTIFICATION_FREQUENCY_OPTIONS}
          required
          value={form.workLife.notificationFrequency}
        />
        <NumberField
          error={errors.dailyWaterTargetMl}
          helperText="Between 500 and 10000 ml"
          label="Daily water target"
          min={500}
          onChange={(value) => updateWorkLife("dailyWaterTargetMl", value)}
          step={50}
          unit="ml"
          value={form.workLife.dailyWaterTargetMl}
        />
        <NumberField
          error={errors.sleepGoalMinutes}
          helperText="Between 60 and 1440 minutes"
          label="Sleep goal"
          min={60}
          onChange={(value) => updateWorkLife("sleepGoalMinutes", value)}
          step={15}
          unit="min"
          value={form.workLife.sleepGoalMinutes}
        />
      </Box>
    </Stack>
  );

  const renderPreferences = () => (
    <Stack spacing={2}>
      <Subheading>Reminders</Subheading>
      <Stack spacing={0.5}>
        <FormControlLabel
          control={
            <Switch
              checked={form.workLife.reminderPreference}
              onChange={(event) =>
                updateWorkLife("reminderPreference", event.target.checked)
              }
            />
          }
          label="Enable reminders"
        />
        <FormControlLabel
          control={
            <Switch
              checked={form.workLife.waterReminder}
              onChange={(event) =>
                updateWorkLife("waterReminder", event.target.checked)
              }
            />
          }
          label="Water reminders"
        />
        <FormControlLabel
          control={
            <Switch
              checked={form.workLife.mealReminder}
              onChange={(event) =>
                updateWorkLife("mealReminder", event.target.checked)
              }
            />
          }
          label="Meal reminders"
        />
        <FormControlLabel
          control={
            <Switch
              checked={form.workLife.workoutReminder}
              onChange={(event) =>
                updateWorkLife("workoutReminder", event.target.checked)
              }
            />
          }
          label="Workout reminders"
        />
      </Stack>
      <Subheading>Daily targets</Subheading>
      <Box sx={fieldGridSx}>
        <NumberField
          error={errors.dailyWaterTargetMl}
          helperText="Between 500 and 10000 ml"
          label="Daily water target"
          min={500}
          onChange={(value) => updateWorkLife("dailyWaterTargetMl", value)}
          step={50}
          unit="ml"
          value={form.workLife.dailyWaterTargetMl}
        />
        <NumberField
          error={errors.sleepGoalMinutes}
          helperText="Between 60 and 1440 minutes"
          label="Sleep goal"
          min={60}
          onChange={(value) => updateWorkLife("sleepGoalMinutes", value)}
          step={15}
          unit="min"
          value={form.workLife.sleepGoalMinutes}
        />
      </Box>
      <Subheading>Coaching</Subheading>
      <Box sx={fieldGridSx}>
        <FormSelect
          error={errors.preferredLanguage}
          label="Preferred language"
          onChange={(value) => updateWorkLife("preferredLanguage", value)}
          options={PREFERRED_LANGUAGE_OPTIONS}
          required
          value={form.workLife.preferredLanguage}
        />
        <FormSelect
          error={errors.coachingStyle}
          label="Coaching style"
          onChange={(value) => updateWorkLife("coachingStyle", value)}
          options={COACHING_STYLE_OPTIONS}
          required
          value={form.workLife.coachingStyle}
        />
        <FormSelect
          error={errors.notificationFrequency}
          label="Notification frequency"
          onChange={(value) => updateWorkLife("notificationFrequency", value)}
          options={NOTIFICATION_FREQUENCY_OPTIONS}
          required
          value={form.workLife.notificationFrequency}
        />
      </Box>
    </Stack>
  );

  const renderFields = () => {
    switch (section) {
      case "basic":
        return renderBasic();
      case "fitnessGoal":
        return renderFitnessGoal();
      case "bodyMeasurement":
        return renderBodyMeasurement();
      case "bodyComposition":
        return renderBodyComposition();
      case "medicalHistories":
        return renderMedicalHistories();
      case "medications":
        return renderMedications();
      case "allergies":
        return renderAllergies();
      case "food":
        return renderFood();
      case "workout":
        return renderWorkout();
      case "workLifeAndPersonalization":
        return renderWorkLife();
      case "preferences":
        return renderPreferences();
      default:
        return null;
    }
  };

  if (variant === "page") {
    return (
      <>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 4 },
            borderRadius: 3,
            border: "1px solid",
            borderColor: "rgba(15, 118, 110, 0.14)",
          }}
        >
          <Typography sx={{ fontWeight: 800 }} variant="h5">
            Edit {meta.title}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5, mb: 3 }} variant="body2">
            {meta.description}
          </Typography>
          {serverError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {serverError}
            </Alert>
          )}
          {renderFields()}
          <Stack
            direction="row"
            spacing={1.5}
            sx={{ justifyContent: "flex-end", mt: 3, pt: 2.5, borderTop: 1, borderColor: "divider" }}
          >
            <Button disabled={mutation.isPending} onClick={handleClose}>
              Cancel
            </Button>
            <Button
              disabled={mutation.isPending}
              onClick={handleSave}
              variant="contained"
            >
              Save changes
            </Button>
          </Stack>
        </Paper>

        <Dialog
          maxWidth="xs"
          onClose={() => {
            if (!mutation.isPending) {
              setConfirmOpen(false);
            }
          }}
          open={confirmOpen}
          slotProps={{ paper: { sx: { borderRadius: 3 } } }}
        >
          <DialogTitle sx={{ fontWeight: 800 }}>Confirm changes</DialogTitle>
          <DialogContent>
            <Typography variant="body2">
              Save your updates to {meta.title.toLowerCase()}? Your profile will
              be updated immediately.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              disabled={mutation.isPending}
              onClick={() => setConfirmOpen(false)}
            >
              Go back
            </Button>
            <Button
              disabled={mutation.isPending}
              onClick={handleConfirm}
              startIcon={
                mutation.isPending ? (
                  <CircularProgress color="inherit" size={16} />
                ) : undefined
              }
              variant="contained"
            >
              {mutation.isPending ? "Saving..." : "Confirm save"}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <Dialog
        fullScreen={false}
        fullWidth
        maxWidth="md"
        onClose={handleClose}
        open={open}
        scroll="paper"
        slotProps={{
          paper: { sx: { borderRadius: { xs: 2, sm: 3 }, m: { xs: 1, sm: 3 } } },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography component="span" sx={{ fontWeight: 800 }} variant="h6">
            Edit {meta.title}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }} variant="body2">
            {meta.description}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          {serverError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {serverError}
            </Alert>
          )}
          {renderFields()}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button disabled={mutation.isPending} onClick={handleClose}>
            Cancel
          </Button>
          <Button
            disabled={mutation.isPending}
            onClick={handleSave}
            variant="contained"
          >
            Save changes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        maxWidth="xs"
        onClose={() => {
          if (!mutation.isPending) {
            setConfirmOpen(false);
          }
        }}
        open={confirmOpen}
        slotProps={{ paper: { sx: { borderRadius: 3 } } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Confirm changes</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Save your updates to {meta.title.toLowerCase()}? Your profile will
            be updated immediately.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            disabled={mutation.isPending}
            onClick={() => setConfirmOpen(false)}
          >
            Go back
          </Button>
          <Button
            disabled={mutation.isPending}
            onClick={handleConfirm}
            startIcon={
              mutation.isPending ? (
                <CircularProgress color="inherit" size={16} />
              ) : undefined
            }
            variant="contained"
          >
            {mutation.isPending ? "Saving..." : "Confirm save"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditProfileDialog;

export { EditProfileDialog as ProfileSectionEditor };
