import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Alert,
  Autocomplete,
  Box,
  Stack,
  TextField,
} from "@mui/material";
import dayjs from "dayjs";
import { DateField } from "../../components/onboarding/DateField";
import { FormNavigation } from "../../components/onboarding/FormNavigation";
import { FormSelect } from "../../components/onboarding/FormSelect";
import { NumberField } from "../../components/onboarding/NumberField";
import { OnboardingLayout } from "../../components/onboarding/OnboardingLayout";
import { useOnboarding } from "../../context/OnboardingContext";
import {
  ACTIVITY_LEVEL_OPTIONS,
  GENDER_OPTIONS,
} from "../../types/onboarding";
import type { ProfileData } from "../../types/onboarding";
import { calculateAge } from "../../utils/calculateAge";
import { COUNTRY_OPTIONS } from "../../utils/countries";
import { isNotFutureDate, isPositiveNumber } from "../../utils/validation";

type ProfileErrors = Partial<Record<keyof ProfileData, string>>;

interface RegisterLocationState {
  registrationSuccess?: boolean;
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data, updateProfile } = useOnboarding();
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [showWelcome, setShowWelcome] = useState(() =>
    Boolean(
      (location.state as RegisterLocationState | null)?.registrationSuccess,
    ),
  );

  const age = calculateAge(data.profile.dateOfBirth);

  const clearError = (field: keyof ProfileData) => {
    setErrors((currentErrors) => {
      if (!currentErrors[field]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const validate = (): ProfileErrors => {
    const nextErrors: ProfileErrors = {};

    if (!data.profile.dateOfBirth) {
      nextErrors.dateOfBirth = "Date of birth is required";
    } else if (!isNotFutureDate(data.profile.dateOfBirth)) {
      nextErrors.dateOfBirth = "Date of birth cannot be in the future";
    }

    if (!data.profile.height.trim()) {
      nextErrors.height = "Height is required";
    } else if (!isPositiveNumber(data.profile.height)) {
      nextErrors.height = "Height must be a positive number";
    }

    if (!data.profile.gender) {
      nextErrors.gender = "Gender is required";
    }

    if (!data.profile.country) {
      nextErrors.country = "Country is required";
    }

    if (!data.profile.activityLevel) {
      nextErrors.activityLevel = "Activity level is required";
    }

    return nextErrors;
  };

  const handleNext = () => {
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    navigate("/fitness-goal");
  };

  return (
    <OnboardingLayout
      description="Tell us a little about yourself so we can tailor your fitness journey."
      stepIndex={0}
      title="Your profile"
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
          {showWelcome && (
            <Alert onClose={() => setShowWelcome(false)} severity="success">
              Registration successful. Let&apos;s complete your fitness profile.
            </Alert>
          )}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2.25,
            }}
          >
            <DateField
              disableFuture
              error={errors.dateOfBirth}
              label="Date of Birth"
              maxDate={dayjs()}
              onChange={(value) => {
                updateProfile({ dateOfBirth: value });
                clearError("dateOfBirth");
              }}
              required
              value={data.profile.dateOfBirth}
            />

            <TextField
              fullWidth
              helperText="Calculated automatically from your date of birth"
              label="Age"
              placeholder="Select date of birth"
              slotProps={{ input: { readOnly: true } }}
              value={age ?? ""}
            />

            <NumberField
              error={errors.height}
              label="Height"
              min={1}
              onChange={(value) => {
                updateProfile({ height: value });
                clearError("height");
              }}
              placeholder="e.g. 172"
              required
              unit="cm"
              value={data.profile.height}
            />

            <FormSelect
              error={errors.gender}
              label="Gender"
              onChange={(value) => {
                updateProfile({
                  gender: value as ProfileData["gender"],
                });
                clearError("gender");
              }}
              options={GENDER_OPTIONS}
              required
              value={data.profile.gender}
            />

            <TextField
              fullWidth
              label="Occupation"
              onChange={(event) =>
                updateProfile({ occupation: event.target.value })
              }
              placeholder="Optional"
              value={data.profile.occupation}
            />

            <Autocomplete
              autoHighlight
              onChange={(_, value) => {
                updateProfile({ country: value ?? "" });
                clearError("country");
              }}
              options={[...COUNTRY_OPTIONS]}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={Boolean(errors.country)}
                  helperText={errors.country}
                  label="Country"
                  required
                />
              )}
              value={data.profile.country || null}
            />
          </Box>

          <FormSelect
            error={errors.activityLevel}
            helperText="Choose the option that best matches your usual week."
            label="Activity Level"
            onChange={(value) => {
              updateProfile({
                activityLevel: value as ProfileData["activityLevel"],
              });
              clearError("activityLevel");
            }}
            options={ACTIVITY_LEVEL_OPTIONS}
            required
            value={data.profile.activityLevel}
          />

          <FormNavigation
            backLabel="Back to Register"
            nextLabel="Next: Fitness Goal"
            onBack={() => navigate("/register")}
            onNext={handleNext}
          />
        </Stack>
      </Box>
    </OnboardingLayout>
  );
};

export default ProfilePage;
