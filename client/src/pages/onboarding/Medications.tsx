import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
} from "@mui/material";
import dayjs from "dayjs";
import { DateField } from "../../components/onboarding/DateField";
import { EmptyState } from "../../components/onboarding/EmptyState";
import { EntryCard } from "../../components/onboarding/EntryCard";
import { FormNavigation } from "../../components/onboarding/FormNavigation";
import { FormSelect } from "../../components/onboarding/FormSelect";
import { OnboardingLayout } from "../../components/onboarding/OnboardingLayout";
import { useOnboarding } from "../../context/OnboardingContext";
import { MEDICATION_FREQUENCY_OPTIONS } from "../../types/onboarding";
import type { Medication } from "../../types/onboarding";
import { calculateDuration } from "../../utils/calculateDuration";

interface MedicationFieldErrors {
  medicineName?: string;
  endDate?: string;
}

type MedicationErrors = Record<string, MedicationFieldErrors>;

const MedicationsPage = () => {
  const navigate = useNavigate();
  const {
    data,
    addMedication,
    updateMedication,
    removeMedication,
  } = useOnboarding();
  const [errors, setErrors] = useState<MedicationErrors>({});

  const handleChange = (id: string, updates: Partial<Medication>) => {
    updateMedication(id, updates);
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
    removeMedication(id);
    setErrors((currentErrors) => {
      if (!currentErrors[id]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[id];
      return nextErrors;
    });
  };

  const validate = (): MedicationErrors => {
    const nextErrors: MedicationErrors = {};

    data.medications.forEach((medication) => {
      const fieldErrors: MedicationFieldErrors = {};

      if (!medication.medicineName.trim()) {
        fieldErrors.medicineName = "Medicine name is required";
      }

      if (
        medication.startDate &&
        medication.endDate &&
        dayjs(medication.endDate).isBefore(dayjs(medication.startDate), "day")
      ) {
        fieldErrors.endDate = "End date cannot be earlier than start date";
      }

      if (Object.keys(fieldErrors).length > 0) {
        nextErrors[medication.id] = fieldErrors;
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

    navigate("/allergies");
  };

  return (
    <OnboardingLayout
      description="List any medications you currently take. This section is optional."
      stepIndex={5}
      title="Medications"
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
          {data.medications.length === 0 ? (
            <EmptyState
              actionLabel="Add Medication"
              description="You can continue without adding a medication if this does not apply to you."
              onAction={addMedication}
              title="No medications added"
            />
          ) : (
            <Stack spacing={2}>
              {data.medications.map((medication, index) => {
                const medicationErrors = errors[medication.id];
                const duration = calculateDuration(
                  medication.startDate,
                  medication.endDate,
                );

                return (
                  <EntryCard
                    key={medication.id}
                    onRemove={() => handleRemove(medication.id)}
                    title={`Medication ${index + 1}`}
                  >
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                        gap: 2.25,
                      }}
                    >
                      <TextField
                        error={Boolean(medicationErrors?.medicineName)}
                        fullWidth
                        helperText={medicationErrors?.medicineName}
                        label="Medicine Name"
                        onChange={(event) =>
                          handleChange(medication.id, {
                            medicineName: event.target.value,
                          })
                        }
                        placeholder="Enter the name you were given"
                        required
                        value={medication.medicineName}
                      />

                      <TextField
                        fullWidth
                        label="Dosage"
                        onChange={(event) =>
                          handleChange(medication.id, {
                            dosage: event.target.value,
                          })
                        }
                        placeholder="Optional"
                        value={medication.dosage}
                      />

                      <FormSelect
                        label="Frequency"
                        onChange={(value) =>
                          handleChange(medication.id, {
                            frequency:
                              value as Medication["frequency"],
                          })
                        }
                        options={MEDICATION_FREQUENCY_OPTIONS}
                        value={medication.frequency}
                      />

                      <DateField
                        label="Start Date"
                        onChange={(value) =>
                          handleChange(medication.id, {
                            startDate: value,
                          })
                        }
                        value={medication.startDate}
                      />

                      <DateField
                        error={medicationErrors?.endDate}
                        label="End Date"
                        minDate={
                          medication.startDate
                            ? dayjs(medication.startDate)
                            : undefined
                        }
                        onChange={(value) =>
                          handleChange(medication.id, {
                            endDate: value,
                          })
                        }
                        value={medication.endDate}
                      />

                      <TextField
                        fullWidth
                        helperText="Calculated automatically from the start and end dates"
                        label="Duration"
                        placeholder="Not available"
                        slotProps={{ input: { readOnly: true } }}
                        value={duration}
                      />

                      <TextField
                        fullWidth
                        label="Reason for Taking"
                        onChange={(event) =>
                          handleChange(medication.id, {
                            reasonForTaking: event.target.value,
                          })
                        }
                        placeholder="Optional"
                        sx={{ gridColumn: { sm: "1 / -1" } }}
                        value={medication.reasonForTaking}
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
                            <Checkbox
                              checked={medication.doctorPrescribed}
                              onChange={(event) =>
                                handleChange(medication.id, {
                                  doctorPrescribed: event.target.checked,
                                })
                              }
                            />
                          }
                          label="Doctor prescribed"
                        />
                      </Box>

                      <TextField
                        fullWidth
                        label="Notes"
                        minRows={2}
                        multiline
                        onChange={(event) =>
                          handleChange(medication.id, {
                            notes: event.target.value,
                          })
                        }
                        placeholder="Optional"
                        sx={{ gridColumn: { sm: "1 / -1" } }}
                        value={medication.notes}
                      />
                    </Box>
                  </EntryCard>
                );
              })}

              <Button
                onClick={addMedication}
                startIcon={<AddIcon />}
                sx={{ alignSelf: "flex-start" }}
                variant="outlined"
              >
                Add Medication
              </Button>
            </Stack>
          )}

          <FormNavigation
            backLabel="Back: Medical History"
            nextLabel="Next: Allergies"
            onBack={() => navigate("/medical-history")}
            onNext={handleNext}
          />
        </Stack>
      </Box>
    </OnboardingLayout>
  );
};

export default MedicationsPage;
