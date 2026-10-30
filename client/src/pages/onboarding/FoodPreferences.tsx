import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { DynamicTextList } from "../../components/onboarding/DynamicTextList";
import { FormNavigation } from "../../components/onboarding/FormNavigation";
import { FormSelect } from "../../components/onboarding/FormSelect";
import { MultiSelectField } from "../../components/onboarding/MultiSelectField";
import { NumberField } from "../../components/onboarding/NumberField";
import { OnboardingLayout } from "../../components/onboarding/OnboardingLayout";
import { SectionCard } from "../../components/onboarding/SectionCard";
import { TimeField } from "../../components/onboarding/TimeField";
import { useOnboarding } from "../../context/OnboardingContext";
import {
  COOKING_PREFERENCE_OPTIONS,
  DIET_TYPE_OPTIONS,
  FASTING_WINDOW_OPTIONS,
  FOOD_ALLERGEN_OPTIONS,
  FOOD_INTOLERANCE_OPTIONS,
  INGREDIENT_OPTIONS,
  MEALS_PER_DAY_OPTIONS,
  PREFERRED_CUISINE_OPTIONS,
} from "../../types/onboarding";
import type {
  CookingPreference,
  DietType,
  EatingHabits,
  FastingWindow,
  FoodAvailability,
  FoodPreferences,
  MealsPerDay,
} from "../../types/onboarding";
import {
  isNonNegativeNumber,
  isPositiveNumber,
} from "../../utils/validation";

type FoodPreferenceErrors = Partial<Record<keyof FoodPreferences, string>>;
type EatingHabitErrors = Partial<Record<keyof EatingHabits, string>>;

const FoodPreferencesPage = () => {
  const navigate = useNavigate();
  const {
    data,
    updateFoodPreferences,
    updateEatingHabits,
    updateFoodAvailability,
  } = useOnboarding();
  const [preferenceErrors, setPreferenceErrors] =
    useState<FoodPreferenceErrors>({});
  const [habitErrors, setHabitErrors] = useState<EatingHabitErrors>({});

  const clearPreferenceError = (field: keyof FoodPreferences) => {
    setPreferenceErrors((currentErrors) => {
      if (!currentErrors[field]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const clearHabitError = (field: keyof EatingHabits) => {
    setHabitErrors((currentErrors) => {
      if (!currentErrors[field]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const updatePreference = (
    updates: Partial<FoodPreferences>,
    field: keyof FoodPreferences,
  ) => {
    updateFoodPreferences(updates);
    clearPreferenceError(field);
  };

  const updateHabit = (
    updates: Partial<EatingHabits>,
    field: keyof EatingHabits,
  ) => {
    updateEatingHabits(updates);
    clearHabitError(field);
  };

  const validate = () => {
    const nextPreferenceErrors: FoodPreferenceErrors = {};
    const nextHabitErrors: EatingHabitErrors = {};
    const preferences = data.foodPreferences;
    const habits = data.eatingHabits;

    if (!preferences.dietType) {
      nextPreferenceErrors.dietType = "Diet type is required";
    }

    if (!preferences.cookingPreference) {
      nextPreferenceErrors.cookingPreference =
        "Cooking preference is required";
    }

    if (
      preferences.dailyFoodBudget.trim() &&
      !isNonNegativeNumber(preferences.dailyFoodBudget)
    ) {
      nextPreferenceErrors.dailyFoodBudget =
        "Daily food budget must be zero or greater";
    }

    if (
      preferences.cookingTimeAvailable.trim() &&
      !isPositiveNumber(preferences.cookingTimeAvailable)
    ) {
      nextPreferenceErrors.cookingTimeAvailable =
        "Cooking time must be greater than 0";
    }

    if (!habits.mealsPerDay) {
      nextHabitErrors.mealsPerDay = "Meals per day is required";
    }

    if (habits.followsIntermittentFasting && !habits.fastingWindow) {
      nextHabitErrors.fastingWindow =
        "Fasting window is required when intermittent fasting is enabled";
    }

    return { nextPreferenceErrors, nextHabitErrors };
  };

  const handleNext = () => {
    const { nextPreferenceErrors, nextHabitErrors } = validate();
    setPreferenceErrors(nextPreferenceErrors);
    setHabitErrors(nextHabitErrors);

    if (
      Object.keys(nextPreferenceErrors).length > 0 ||
      Object.keys(nextHabitErrors).length > 0
    ) {
      return;
    }

    navigate("/workout-preferences");
  };

  const updateAvailability = (updates: Partial<FoodAvailability>) => {
    updateFoodAvailability(updates);
  };

  return (
    <OnboardingLayout
      description="Help your AI coach understand the meals, ingredients and eating routine that work for you."
      stepIndex={7}
      title="Food preferences"
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
            description="Tell us what you like to eat and how you prefer to prepare your meals."
            title="Dietary Preferences"
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2.25,
              }}
            >
              <FormSelect
                error={preferenceErrors.dietType}
                label="Diet Type"
                onChange={(value) =>
                  updatePreference(
                    { dietType: value as DietType },
                    "dietType",
                  )
                }
                options={DIET_TYPE_OPTIONS}
                required
                value={data.foodPreferences.dietType}
              />

              <FormSelect
                error={preferenceErrors.cookingPreference}
                label="Cooking Preference"
                onChange={(value) =>
                  updatePreference(
                    {
                      cookingPreference: value as CookingPreference,
                    },
                    "cookingPreference",
                  )
                }
                options={COOKING_PREFERENCE_OPTIONS}
                required
                value={data.foodPreferences.cookingPreference}
              />

              <MultiSelectField
                helperText="Select as many cuisines as you enjoy."
                label="Preferred Cuisine"
                onChange={(value) =>
                  updatePreference(
                    { preferredCuisines: value as FoodPreferences["preferredCuisines"] },
                    "preferredCuisines",
                  )
                }
                options={PREFERRED_CUISINE_OPTIONS}
                placeholder="Select cuisines"
                value={data.foodPreferences.preferredCuisines}
              />

              <NumberField
                error={preferenceErrors.dailyFoodBudget}
                helperText="Optional"
                label="Daily Food Budget"
                min={0}
                onChange={(value) =>
                  updatePreference(
                    { dailyFoodBudget: value },
                    "dailyFoodBudget",
                  )
                }
                placeholder="e.g. 500"
                unit="₹"
                value={data.foodPreferences.dailyFoodBudget}
              />

              <MultiSelectField
                error={preferenceErrors.foodAllergies}
                label="Food Allergies"
                onChange={(value) =>
                  updatePreference(
                    { foodAllergies: value as FoodPreferences["foodAllergies"] },
                    "foodAllergies",
                  )
                }
                options={FOOD_ALLERGEN_OPTIONS}
                placeholder="Select food allergies"
                value={data.foodPreferences.foodAllergies}
              />

              {data.foodPreferences.foodAllergies.includes("Other") && (
                <TextField
                  fullWidth
                  label="Other Food Allergy"
                  onChange={(event) =>
                    updatePreference(
                      { otherFoodAllergy: event.target.value },
                      "otherFoodAllergy",
                    )
                  }
                  placeholder="Specify the allergy"
                  value={data.foodPreferences.otherFoodAllergy}
                />
              )}

              <MultiSelectField
                label="Food Intolerances"
                onChange={(value) =>
                  updatePreference(
                    {
                      foodIntolerances:
                        value as FoodPreferences["foodIntolerances"],
                    },
                    "foodIntolerances",
                  )
                }
                options={FOOD_INTOLERANCE_OPTIONS}
                placeholder="Select food intolerances"
                value={data.foodPreferences.foodIntolerances}
              />

              {data.foodPreferences.foodIntolerances.includes("Other") && (
                <TextField
                  fullWidth
                  label="Other Food Intolerance"
                  onChange={(event) =>
                    updatePreference(
                      { otherFoodIntolerance: event.target.value },
                      "otherFoodIntolerance",
                    )
                  }
                  placeholder="Specify the intolerance"
                  value={data.foodPreferences.otherFoodIntolerance}
                />
              )}

              <NumberField
                error={preferenceErrors.cookingTimeAvailable}
                helperText="Optional"
                label="Cooking Time Available"
                min={1}
                onChange={(value) =>
                  updatePreference(
                    { cookingTimeAvailable: value },
                    "cookingTimeAvailable",
                  )
                }
                placeholder="e.g. 30"
                unit="minutes"
                value={data.foodPreferences.cookingTimeAvailable}
              />
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 2.5,
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 600, mb: 1 }} variant="body2">
                  Disliked Foods
                </Typography>
                <DynamicTextList
                  addLabel="Add Disliked Food"
                  label="Disliked Food"
                  onChange={(value) =>
                    updatePreference(
                      { dislikedFoods: value },
                      "dislikedFoods",
                    )
                  }
                  placeholder="e.g. Bitter gourd"
                  values={data.foodPreferences.dislikedFoods}
                />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 600, mb: 1 }} variant="body2">
                  Favourite Foods
                </Typography>
                <DynamicTextList
                  addLabel="Add Favourite Food"
                  label="Favourite Food"
                  onChange={(value) =>
                    updatePreference(
                      { favouriteFoods: value },
                      "favouriteFoods",
                    )
                  }
                  placeholder="e.g. Paneer tikka"
                  values={data.foodPreferences.favouriteFoods}
                />
              </Box>
            </Box>
          </SectionCard>

          <SectionCard
            description="Your meal timings help us build a routine that fits your day."
            title="Eating Habits"
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2.25,
              }}
            >
              <FormSelect
                error={habitErrors.mealsPerDay}
                label="Meals Per Day"
                onChange={(value) =>
                  updateHabit(
                    { mealsPerDay: value as MealsPerDay },
                    "mealsPerDay",
                  )
                }
                options={MEALS_PER_DAY_OPTIONS}
                required
                value={data.eatingHabits.mealsPerDay}
              />

              <TimeField
                label="Breakfast Time"
                onChange={(value) =>
                  updateHabit({ breakfastTime: value }, "breakfastTime")
                }
                value={data.eatingHabits.breakfastTime}
              />

              <TimeField
                label="Lunch Time"
                onChange={(value) =>
                  updateHabit({ lunchTime: value }, "lunchTime")
                }
                value={data.eatingHabits.lunchTime}
              />

              <TimeField
                label="Dinner Time"
                onChange={(value) =>
                  updateHabit({ dinnerTime: value }, "dinnerTime")
                }
                value={data.eatingHabits.dinnerTime}
              />
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 1.5,
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={data.eatingHabits.eatsSnacks}
                    onChange={(event) =>
                      updateHabit(
                        { eatsSnacks: event.target.checked },
                        "eatsSnacks",
                      )
                    }
                  />
                }
                label="Do you eat snacks?"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={data.eatingHabits.frequentlyEatsOutside}
                    onChange={(event) =>
                      updateHabit(
                        { frequentlyEatsOutside: event.target.checked },
                        "frequentlyEatsOutside",
                      )
                    }
                  />
                }
                label="Frequently eat outside?"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={data.eatingHabits.prefersHomemadeFood}
                    onChange={(event) =>
                      updateHabit(
                        { prefersHomemadeFood: event.target.checked },
                        "prefersHomemadeFood",
                      )
                    }
                  />
                }
                label="Prefer homemade food?"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={data.eatingHabits.followsIntermittentFasting}
                    onChange={(event) =>
                      updateHabit(
                        {
                          followsIntermittentFasting: event.target.checked,
                          fastingWindow: event.target.checked
                            ? data.eatingHabits.fastingWindow
                            : "",
                        },
                        "followsIntermittentFasting",
                      )
                    }
                  />
                }
                label="Follow intermittent fasting?"
              />

              {data.eatingHabits.followsIntermittentFasting && (
                <FormSelect
                  error={habitErrors.fastingWindow}
                  label="Fasting Window"
                  onChange={(value) =>
                    updateHabit(
                      { fastingWindow: value as FastingWindow },
                      "fastingWindow",
                    )
                  }
                  options={FASTING_WINDOW_OPTIONS}
                  required
                  value={data.eatingHabits.fastingWindow}
                />
              )}
            </Box>
          </SectionCard>

          <SectionCard
            description="Select the ingredients you usually have at home or can easily access."
            title="Food Availability"
          >
            <Stack spacing={2}>
              <MultiSelectField
                helperText="Select all ingredients that are usually available to you."
                label="Available Ingredients"
                onChange={(value) =>
                  updateAvailability({
                    ingredients:
                      value as FoodAvailability["ingredients"],
                  })
                }
                options={INGREDIENT_OPTIONS}
                placeholder="Select ingredients"
                value={data.foodAvailability.ingredients}
              />

              {data.foodAvailability.ingredients.includes("Other") && (
                <TextField
                  fullWidth
                  helperText="Add any additional ingredients that are available to you."
                  label="Other Ingredients"
                  onChange={(event) =>
                    updateAvailability({
                      otherIngredients: event.target.value,
                    })
                  }
                  placeholder="e.g. Ragi, quinoa"
                  value={data.foodAvailability.otherIngredients}
                />
              )}
            </Stack>
          </SectionCard>

          <FormNavigation
            backLabel="Back: Allergies"
            nextLabel="Next: Workout Preferences"
            onBack={() => navigate("/allergies")}
            onNext={handleNext}
          />
        </Stack>
      </Box>
    </OnboardingLayout>
  );
};

export default FoodPreferencesPage;
