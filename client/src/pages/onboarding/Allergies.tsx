import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Stack, TextField } from "@mui/material";
import { EmptyState } from "../../components/onboarding/EmptyState";
import { EntryCard } from "../../components/onboarding/EntryCard";
import { FormNavigation } from "../../components/onboarding/FormNavigation";
import { FormSelect } from "../../components/onboarding/FormSelect";
import { OnboardingLayout } from "../../components/onboarding/OnboardingLayout";
import { useOnboarding } from "../../context/OnboardingContext";
import {
  ALLERGY_SEVERITY_OPTIONS,
  ALLERGY_TYPE_OPTIONS,
} from "../../types/onboarding";
import type { Allergy } from "../../types/onboarding";

type AllergyErrors = Record<string, string>;

const AllergiesPage = () => {
  const navigate = useNavigate();
  const { data, addAllergy, updateAllergy, removeAllergy } = useOnboarding();
  const [errors, setErrors] = useState<AllergyErrors>({});

  const handleChange = (id: string, updates: Partial<Allergy>) => {
    updateAllergy(id, updates);
    setErrors((currentErrors) => {
      if (!currentErrors[id]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[id];
      return nextErrors;
    });
  };

  const handleRemove = (id: string) => {
    removeAllergy(id);
    setErrors((currentErrors) => {
      if (!currentErrors[id]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[id];
      return nextErrors;
    });
  };

  const validate = (): AllergyErrors => {
    const nextErrors: AllergyErrors = {};

    data.allergies.forEach((allergy) => {
      if (!allergy.allergyName.trim()) {
        nextErrors[allergy.id] = "Allergy name is required";
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

    navigate("/food-preferences");
  };

  return (
    <OnboardingLayout
      description="List any allergies or sensitivities you have. This section is optional."
      stepIndex={5}
      title="Allergies"
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
          {data.allergies.length === 0 ? (
            <EmptyState
              actionLabel="Add Allergy"
              description="You can continue without adding an allergy if this does not apply to you."
              onAction={addAllergy}
              title="No allergies added"
            />
          ) : (
            <Stack spacing={2}>
              {data.allergies.map((allergy, index) => (
                <EntryCard
                  key={allergy.id}
                  onRemove={() => handleRemove(allergy.id)}
                  title={`Allergy ${index + 1}`}
                >
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                      gap: 2.25,
                    }}
                  >
                    <TextField
                      error={Boolean(errors[allergy.id])}
                      fullWidth
                      helperText={errors[allergy.id]}
                      label="Allergy Name"
                      onChange={(event) =>
                        handleChange(allergy.id, {
                          allergyName: event.target.value,
                        })
                      }
                      placeholder="e.g. Peanuts"
                      required
                      value={allergy.allergyName}
                    />

                    <FormSelect
                      label="Allergy Type"
                      onChange={(value) =>
                        handleChange(allergy.id, {
                          allergyType: value as Allergy["allergyType"],
                        })
                      }
                      options={ALLERGY_TYPE_OPTIONS}
                      value={allergy.allergyType}
                    />

                    <FormSelect
                      label="Severity"
                      onChange={(value) =>
                        handleChange(allergy.id, {
                          severity: value as Allergy["severity"],
                        })
                      }
                      options={ALLERGY_SEVERITY_OPTIONS}
                      value={allergy.severity}
                    />

                    <TextField
                      fullWidth
                      label="Reaction"
                      minRows={2}
                      multiline
                      onChange={(event) =>
                        handleChange(allergy.id, {
                          reaction: event.target.value,
                        })
                      }
                      placeholder="Optional"
                      sx={{ gridColumn: { sm: "1 / -1" } }}
                      value={allergy.reaction}
                    />

                    <TextField
                      fullWidth
                      label="Notes"
                      minRows={2}
                      multiline
                      onChange={(event) =>
                        handleChange(allergy.id, {
                          notes: event.target.value,
                        })
                      }
                      placeholder="Optional"
                      sx={{ gridColumn: { sm: "1 / -1" } }}
                      value={allergy.notes}
                    />
                  </Box>
                </EntryCard>
              ))}

              <Button
                onClick={addAllergy}
                startIcon={<AddIcon />}
                sx={{ alignSelf: "flex-start" }}
                variant="outlined"
              >
                Add Allergy
              </Button>
            </Stack>
          )}

          <FormNavigation
            backLabel="Back: Medications"
            nextLabel="Next: Food Preferences"
            onBack={() => navigate("/medications")}
            onNext={handleNext}
          />
        </Stack>
      </Box>
    </OnboardingLayout>
  );
};

export default AllergiesPage;
