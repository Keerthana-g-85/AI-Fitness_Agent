import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { FormNavigation } from "../../components/onboarding/FormNavigation";
import { FormSelect } from "../../components/onboarding/FormSelect";
import { OnboardingLayout } from "../../components/onboarding/OnboardingLayout";
import { SectionCard } from "../../components/onboarding/SectionCard";
import { useOnboarding } from "../../context/OnboardingContext";
import {
  COACHING_STYLE_OPTIONS,
  NOTIFICATION_FREQUENCY_OPTIONS,
  PREFERRED_LANGUAGE_OPTIONS,
} from "../../types/onboarding";
import type {
  CoachingStyle,
  NotificationFrequency,
  Personalization,
  PreferredLanguage,
} from "../../types/onboarding";

type PersonalizationErrors = Partial<Record<keyof Personalization, string>>;

const PersonalizationPage = () => {
  const navigate = useNavigate();
  const { data, updatePersonalization } = useOnboarding();
  const [errors, setErrors] = useState<PersonalizationErrors>({});

  const clearError = (field: keyof Personalization) => {
    setErrors((currentErrors) => {
      if (!currentErrors[field]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const updateField = (
    updates: Partial<Personalization>,
    field: keyof Personalization,
  ) => {
    updatePersonalization(updates);
    clearError(field);
  };

  const handleEnableReminders = (checked: boolean) => {
    updatePersonalization({
      enableReminders: checked,
      waterReminders: checked ? data.personalization.waterReminders : false,
      mealReminders: checked ? data.personalization.mealReminders : false,
      workoutReminders: checked
        ? data.personalization.workoutReminders
        : false,
    });
  };

  const validate = (): PersonalizationErrors => {
    const nextErrors: PersonalizationErrors = {};
    const personalization = data.personalization;

    if (!personalization.preferredLanguage) {
      nextErrors.preferredLanguage = "Preferred language is required";
    }

    if (!personalization.coachingStyle) {
      nextErrors.coachingStyle = "Coaching style is required";
    }

    if (!personalization.notificationFrequency) {
      nextErrors.notificationFrequency =
        "Notification frequency is required";
    }

    if (!personalization.dataSharingConsent) {
      nextErrors.dataSharingConsent =
        "You must provide consent before continuing";
    }

    return nextErrors;
  };

  const handleNext = () => {
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    navigate("/review");
  };

  return (
    <OnboardingLayout
      description="Choose how your AI fitness coach should communicate with you."
      stepIndex={10}
      title="Other preferences and personalization"
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
            description="Reminder settings are optional and can be changed independently."
            title="Reminders"
          >
            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={data.personalization.enableReminders}
                    onChange={(event) =>
                      handleEnableReminders(event.target.checked)
                    }
                  />
                }
                label="Enable reminders"
              />

              {data.personalization.enableReminders && (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
                    gap: 1.5,
                  }}
                >
                  <FormControlLabel
                    control={
                      <Switch
                        checked={data.personalization.waterReminders}
                        onChange={(event) =>
                          updateField(
                            { waterReminders: event.target.checked },
                            "waterReminders",
                          )
                        }
                      />
                    }
                    label="Water reminders"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={data.personalization.mealReminders}
                        onChange={(event) =>
                          updateField(
                            { mealReminders: event.target.checked },
                            "mealReminders",
                          )
                        }
                      />
                    }
                    label="Meal reminders"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={data.personalization.workoutReminders}
                        onChange={(event) =>
                          updateField(
                            { workoutReminders: event.target.checked },
                            "workoutReminders",
                          )
                        }
                      />
                    }
                    label="Workout reminders"
                  />
                </Box>
              )}
            </Stack>
          </SectionCard>

          <SectionCard
            description="Set the language and coaching approach you prefer."
            title="Coaching Preferences"
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2.25,
              }}
            >
              <FormSelect
                error={errors.preferredLanguage}
                label="Preferred Language"
                onChange={(value) =>
                  updateField(
                    { preferredLanguage: value as PreferredLanguage },
                    "preferredLanguage",
                  )
                }
                options={PREFERRED_LANGUAGE_OPTIONS}
                required
                value={data.personalization.preferredLanguage}
              />

              <FormSelect
                error={errors.coachingStyle}
                label="Coaching Style"
                onChange={(value) =>
                  updateField(
                    { coachingStyle: value as CoachingStyle },
                    "coachingStyle",
                  )
                }
                options={COACHING_STYLE_OPTIONS}
                required
                value={data.personalization.coachingStyle}
              />

              <Box sx={{ gridColumn: { sm: "1 / -1" } }}>
                <FormSelect
                  error={errors.notificationFrequency}
                  label="Notification Frequency"
                  onChange={(value) =>
                    updateField(
                      {
                        notificationFrequency:
                          value as NotificationFrequency,
                      },
                      "notificationFrequency",
                    )
                  }
                  options={NOTIFICATION_FREQUENCY_OPTIONS}
                  required
                  value={data.personalization.notificationFrequency}
                />
              </Box>
            </Box>
          </SectionCard>

          <SectionCard
            description="Review how your information will be used before finishing onboarding."
            title="Data Sharing Consent"
          >
            <Stack spacing={2}>
              <Alert severity="info">
                Your fitness, dietary, lifestyle and health information will be
                used to personalize recommendations and saved to your account.
                It is not shared with external parties.
              </Alert>
              <Typography color="text.secondary" variant="body2">
                Privacy policy placeholder: onboarding data is saved to your
                account and is not shared with external parties.
              </Typography>

              <FormControl
                component="fieldset"
                error={Boolean(errors.dataSharingConsent)}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={data.personalization.dataSharingConsent}
                      onChange={(event) =>
                        updateField(
                          { dataSharingConsent: event.target.checked },
                          "dataSharingConsent",
                        )
                      }
                    />
                  }
                  label={
                    <Typography variant="body2">
                      I consent to the use of my personal fitness, dietary,
                      lifestyle and health information to personalize my
                      recommendations.
                    </Typography>
                  }
                />
                {errors.dataSharingConsent && (
                  <FormHelperText>{errors.dataSharingConsent}</FormHelperText>
                )}
              </FormControl>
            </Stack>
          </SectionCard>

          <FormNavigation
            backLabel="Back: Work Life"
            nextLabel="Next: Final Review"
            onBack={() => navigate("/work-life")}
            onNext={handleNext}
          />
        </Stack>
      </Box>
    </OnboardingLayout>
  );
};

export default PersonalizationPage;
