import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Stack, TextField } from "@mui/material";
import dayjs from "dayjs";
import { DateField } from "../../components/onboarding/DateField";
import { FormNavigation } from "../../components/onboarding/FormNavigation";
import { NumberField } from "../../components/onboarding/NumberField";
import { OnboardingLayout } from "../../components/onboarding/OnboardingLayout";
import { SectionCard } from "../../components/onboarding/SectionCard";
import { useOnboarding } from "../../context/OnboardingContext";
import { BODY_MEASUREMENT_FIELDS } from "../../types/onboarding";
import type { NumericBodyMeasurementField } from "../../types/onboarding";
import { isPositiveNumber } from "../../utils/validation";

type MeasurementErrors = Partial<
  Record<NumericBodyMeasurementField, string>
>;

const BodyMeasurementsPage = () => {
  const navigate = useNavigate();
  const { data, updateBodyMeasurements } = useOnboarding();
  const [errors, setErrors] = useState<MeasurementErrors>({});

  const clearError = (field: NumericBodyMeasurementField) => {
    setErrors((currentErrors) => {
      if (!currentErrors[field]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const updateMeasurement = (
    field: NumericBodyMeasurementField,
    value: string,
  ) => {
    updateBodyMeasurements({ [field]: value });
    clearError(field);
  };

  const renderFields = (
    group: (typeof BODY_MEASUREMENT_FIELDS)[number]["group"],
  ) => (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "1fr 1fr",
          lg: "1fr 1fr 1fr",
        },
        gap: 2.25,
      }}
    >
      {BODY_MEASUREMENT_FIELDS.filter((field) => field.group === group).map(
        (field) => (
          <NumberField
            error={errors[field.key]}
            key={field.key}
            label={field.label}
            min={0.1}
            onChange={(value) => updateMeasurement(field.key, value)}
            placeholder="Optional"
            unit={field.unit}
            value={data.bodyMeasurements[field.key]}
          />
        ),
      )}
    </Box>
  );

  const validate = (): MeasurementErrors => {
    const nextErrors: MeasurementErrors = {};

    BODY_MEASUREMENT_FIELDS.forEach((field) => {
      const value = data.bodyMeasurements[field.key];

      if (value.trim() && !isPositiveNumber(value)) {
        nextErrors[field.key] = `${field.label} must be a positive number`;
      }
    });

    return nextErrors;
  };

  const handleNext = () => {
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    navigate("/body-composition");
  };

  return (
    <OnboardingLayout
      description="Add any body measurements you have available. Every field on this page is optional."
      stepIndex={2}
      title="Body measurements"
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
          <SectionCard title="General">
            {renderFields("general")}
          </SectionCard>

          <SectionCard
            description="Measure around the widest part for each area."
            title="Upper Body"
          >
            {renderFields("upper")}
          </SectionCard>

          <SectionCard title="Waist and Hip">
            {renderFields("waist")}
          </SectionCard>

          <SectionCard title="Lower Body">
            {renderFields("lower")}
          </SectionCard>

          <SectionCard
            description="Record when the measurements were taken and any helpful notes."
            title="Measurement Details"
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2.25,
              }}
            >
              <DateField
                label="Measured At"
                maxDate={dayjs()}
                onChange={(value) =>
                  updateBodyMeasurements({ measuredAt: value })
                }
                value={data.bodyMeasurements.measuredAt}
              />
              <TextField
                fullWidth
                label="Notes"
                minRows={3}
                multiline
                onChange={(event) =>
                  updateBodyMeasurements({ notes: event.target.value })
                }
                placeholder="Optional notes about your measurements"
                sx={{ gridColumn: { xs: "auto", sm: "1 / -1" } }}
                value={data.bodyMeasurements.notes}
              />
            </Box>
          </SectionCard>

          <FormNavigation
            backLabel="Back: Fitness Goal"
            nextLabel="Next: Body Composition"
            onBack={() => navigate("/fitness-goal")}
            onNext={handleNext}
          />
        </Stack>
      </Box>
    </OnboardingLayout>
  );
};

export default BodyMeasurementsPage;
