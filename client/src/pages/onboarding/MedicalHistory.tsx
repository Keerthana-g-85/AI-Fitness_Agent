import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Button,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
} from "@mui/material";
import dayjs from "dayjs";
import { DateField } from "../../components/onboarding/DateField";
import { EmptyState } from "../../components/onboarding/EmptyState";
import { EntryCard } from "../../components/onboarding/EntryCard";
import { FormNavigation } from "../../components/onboarding/FormNavigation";
import { OnboardingLayout } from "../../components/onboarding/OnboardingLayout";
import { useOnboarding } from "../../context/OnboardingContext";
import type { MedicalCondition } from "../../types/onboarding";
import { isNotFutureDate } from "../../utils/validation";

interface ConditionFieldErrors {
  conditionName?: string;
  diagnosisDate?: string;
}

type ConditionErrors = Record<string, ConditionFieldErrors>;

const MedicalHistoryPage = () => {
  const navigate = useNavigate();
  const {
    data,
    addMedicalCondition,
    updateMedicalCondition,
    removeMedicalCondition,
  } = useOnboarding();
  const [errors, setErrors] = useState<ConditionErrors>({});

  const handleChange = (
    id: string,
    updates: Partial<MedicalCondition>,
  ) => {
    updateMedicalCondition(id, updates);
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
    removeMedicalCondition(id);
    setErrors((currentErrors) => {
      if (!currentErrors[id]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[id];
      return nextErrors;
    });
  };

  const validate = (): ConditionErrors => {
    const nextErrors: ConditionErrors = {};

    data.medicalHistory.forEach((condition) => {
      const fieldErrors: ConditionFieldErrors = {};

      if (!condition.conditionName.trim()) {
        fieldErrors.conditionName = "Condition name is required";
      }

      if (
        condition.diagnosisDate &&
        !isNotFutureDate(condition.diagnosisDate)
      ) {
        fieldErrors.diagnosisDate =
          "Diagnosis date cannot be in the future";
      }

      if (Object.keys(fieldErrors).length > 0) {
        nextErrors[condition.id] = fieldErrors;
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

    navigate("/medications");
  };

  return (
    <OnboardingLayout
      description="Share any current or previous medical conditions. This section is optional."
      stepIndex={4}
      title="Medical history"
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
          {data.medicalHistory.length === 0 ? (
            <EmptyState
              actionLabel="Add Condition"
              description="You can continue without adding anything if this does not apply to you."
              onAction={addMedicalCondition}
              title="No medical conditions added"
            />
          ) : (
            <Stack spacing={2}>
              {data.medicalHistory.map((condition, index) => {
                const conditionErrors = errors[condition.id];

                return (
                  <EntryCard
                    key={condition.id}
                    onRemove={() => handleRemove(condition.id)}
                    title={`Condition ${index + 1}`}
                  >
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                        gap: 2.25,
                      }}
                    >
                      <TextField
                        error={Boolean(conditionErrors?.conditionName)}
                        fullWidth
                        helperText={conditionErrors?.conditionName}
                        label="Condition Name"
                        onChange={(event) =>
                          handleChange(condition.id, {
                            conditionName: event.target.value,
                          })
                        }
                        placeholder="e.g. Asthma"
                        required
                        value={condition.conditionName}
                      />

                      <DateField
                        error={conditionErrors?.diagnosisDate}
                        label="Diagnosis Date"
                        maxDate={dayjs()}
                        onChange={(value) =>
                          handleChange(condition.id, {
                            diagnosisDate: value,
                          })
                        }
                        value={condition.diagnosisDate}
                      />

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gridColumn: { sm: "1 / -1" },
                        }}
                      >
                        <FormControlLabel
                          control={
                            <Switch
                              checked={condition.active}
                              onChange={(event) =>
                                handleChange(condition.id, {
                                  active: event.target.checked,
                                })
                              }
                            />
                          }
                          label="Currently active"
                        />
                      </Box>

                      <TextField
                        fullWidth
                        label="Description"
                        minRows={2}
                        multiline
                        onChange={(event) =>
                          handleChange(condition.id, {
                            description: event.target.value,
                          })
                        }
                        placeholder="Optional description"
                        sx={{ gridColumn: { sm: "1 / -1" } }}
                        value={condition.description}
                      />

                      <TextField
                        fullWidth
                        label="Doctor Advice"
                        minRows={2}
                        multiline
                        onChange={(event) =>
                          handleChange(condition.id, {
                            doctorAdvice: event.target.value,
                          })
                        }
                        placeholder="Optional"
                        value={condition.doctorAdvice}
                      />

                      <TextField
                        fullWidth
                        label="Treatment Details"
                        minRows={2}
                        multiline
                        onChange={(event) =>
                          handleChange(condition.id, {
                            treatmentDetails: event.target.value,
                          })
                        }
                        placeholder="Optional"
                        value={condition.treatmentDetails}
                      />

                      <TextField
                        fullWidth
                        label="Notes"
                        minRows={2}
                        multiline
                        onChange={(event) =>
                          handleChange(condition.id, {
                            notes: event.target.value,
                          })
                        }
                        placeholder="Optional"
                        sx={{ gridColumn: { sm: "1 / -1" } }}
                        value={condition.notes}
                      />
                    </Box>
                  </EntryCard>
                );
              })}

              <Button
                onClick={addMedicalCondition}
                startIcon={<AddIcon />}
                sx={{ alignSelf: "flex-start" }}
                variant="outlined"
              >
                Add Condition
              </Button>
            </Stack>
          )}

          <FormNavigation
            backLabel="Back: Body Composition"
            nextLabel="Next: Medications"
            onBack={() => navigate("/body-composition")}
            onNext={handleNext}
          />
        </Stack>
      </Box>
    </OnboardingLayout>
  );
};

export default MedicalHistoryPage;
