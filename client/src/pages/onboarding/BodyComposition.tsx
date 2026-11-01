import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Stack } from "@mui/material";
import dayjs from "dayjs";
import { DateField } from "../../components/onboarding/DateField";
import { FormNavigation } from "../../components/onboarding/FormNavigation";
import { FormSelect } from "../../components/onboarding/FormSelect";
import { NumberField } from "../../components/onboarding/NumberField";
import { OnboardingLayout } from "../../components/onboarding/OnboardingLayout";
import { SectionCard } from "../../components/onboarding/SectionCard";
import { useOnboarding } from "../../context/OnboardingContext";
import {
  BODY_COMPOSITION_FIELDS,
  BODY_COMPOSITION_SOURCE_OPTIONS,
} from "../../types/onboarding";
import type {
  BodyCompositionData,
  NumericBodyCompositionField,
} from "../../types/onboarding";
import { isPercentage, isPositiveNumber } from "../../utils/validation";

type CompositionErrors = Partial<
  Record<NumericBodyCompositionField, string>
>;

const BodyCompositionPage = () => {
  const navigate = useNavigate();
  const { data, updateBodyComposition } = useOnboarding();
  const [errors, setErrors] = useState<CompositionErrors>({});

  const clearError = (field: NumericBodyCompositionField) => {
    setErrors((currentErrors) => {
      if (!currentErrors[field]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const updateField = (field: NumericBodyCompositionField, value: string) => {
    updateBodyComposition({ [field]: value });
    clearError(field);
  };

  const renderFields = (
    group: (typeof BODY_COMPOSITION_FIELDS)[number]["group"],
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
      {BODY_COMPOSITION_FIELDS.filter((field) => field.group === group).map(
        (field) => (
          <NumberField
            error={errors[field.key]}
            key={field.key}
            label={field.label}
            max={field.validation === "percentage" ? 100 : undefined}
            min={field.validation === "percentage" ? 0 : 0.1}
            onChange={(value) => updateField(field.key, value)}
            placeholder="Optional"
            unit={field.unit || undefined}
            value={data.bodyComposition[field.key]}
          />
        ),
      )}
    </Box>
  );

  const validate = (): CompositionErrors => {
    const nextErrors: CompositionErrors = {};

    BODY_COMPOSITION_FIELDS.forEach((field) => {
      const value = data.bodyComposition[field.key];

      if (!value.trim()) {
        return;
      }

      if (field.validation === "percentage" && !isPercentage(value)) {
        nextErrors[field.key] = `${field.label} must be between 0 and 100`;
        return;
      }

      if (field.validation === "positive" && !isPositiveNumber(value)) {
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

    navigate("/medical-history");
  };

  return (
    <OnboardingLayout
      description="Enter the readings from your scale or body composition device. All fields are optional."
      stepIndex={2}
      title="Body composition"
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
            description="Record the latest readings from your device."
            title="Fat and Muscle"
          >
            {renderFields("fatMuscle")}
          </SectionCard>

          <SectionCard title="Body Water">
            {renderFields("bodyWater")}
          </SectionCard>

          <SectionCard title="Metabolic Information">
            {renderFields("metabolic")}
          </SectionCard>

          <SectionCard title="Measurement Details">
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2.25,
              }}
            >
              <FormSelect
                label="Source"
                onChange={(value) =>
                  updateBodyComposition({
                    source: value as BodyCompositionData["source"],
                  })
                }
                options={BODY_COMPOSITION_SOURCE_OPTIONS}
                value={data.bodyComposition.source}
              />
              <DateField
                label="Measured At"
                maxDate={dayjs()}
                onChange={(value) =>
                  updateBodyComposition({ measuredAt: value })
                }
                value={data.bodyComposition.measuredAt}
              />
            </Box>
          </SectionCard>

          <FormNavigation
            backLabel="Back: Fitness Goal"
            nextLabel="Next: Medical History"
            onBack={() => navigate("/fitness-goal")}
            onNext={handleNext}
          />
        </Stack>
      </Box>
    </OnboardingLayout>
  );
};

export default BodyCompositionPage;
