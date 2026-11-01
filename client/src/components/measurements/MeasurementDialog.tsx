import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { DateField } from "../onboarding/DateField";
import { FormSelect } from "../onboarding/FormSelect";
import { NumberField } from "../onboarding/NumberField";
import {
  addBodyMeasurement,
  getTrackingErrorMessage,
  trackingQueryKeys,
  updateBodyMeasurement,
} from "../../api/trackingApi";
import {
  BODY_COMPOSITION_FIELDS,
  BODY_COMPOSITION_SOURCE_OPTIONS,
  BODY_MEASUREMENT_FIELDS,
} from "../../types/onboarding";
import type {
  AddBodyMeasurementInput,
  BodyCompositionRecordInput,
  MeasurementRecord,
} from "../../types/tracking";

interface MeasurementDialogProps {
  open: boolean;
  initial?: MeasurementRecord | null;
  defaultHeight?: number | null;
  onClose: () => void;
  onSaved: (message: string) => void;
}

type Values = Record<string, string>;

const MEASUREMENT_API_KEYS: Record<string, string> = {
  weight: "weightKg",
  neck: "neckCm",
  shoulder: "shoulderCm",
  chest: "chestCm",
  bust: "bustCm",
  waist: "waistCm",
  abdomen: "abdomenCm",
  hip: "hipCm",
  leftArm: "leftArmCm",
  rightArm: "rightArmCm",
  leftThigh: "leftThighCm",
  rightThigh: "rightThighCm",
  leftCalf: "leftCalfCm",
  rightCalf: "rightCalfCm",
};

const COMPOSITION_API_KEYS: Record<string, keyof BodyCompositionRecordInput> = {
  bodyFatPercentage: "bodyFatPercentage",
  fatMass: "fatMassKg",
  muscleMass: "muscleMassKg",
  skeletalMuscleMass: "skeletalMuscleMassKg",
  leanBodyMass: "leanBodyMassKg",
  boneMass: "boneMassKg",
  bodyWaterPercentage: "bodyWaterPercentage",
  totalBodyWater: "totalBodyWaterLiters",
  visceralFat: "visceralFat",
  proteinPercentage: "proteinPercentage",
  bmr: "bmrKcal",
  bmi: "bmi",
  metabolicAge: "metabolicAge",
};

const toText = (value: number | null | undefined): string =>
  value == null ? "" : String(value);

const numberOrNull = (value: string): number | null =>
  value.trim() === "" ? null : Number(value);

const compositionRecord = (
  record: MeasurementRecord | null | undefined,
): Record<string, number | null | undefined> | null =>
  record?.composition
    ? {
        bodyFatPercentage: record.composition.bodyFatPercentage,
        fatMass: record.composition.fatMassKg,
        muscleMass: record.composition.muscleMassKg,
        skeletalMuscleMass: record.composition.skeletalMuscleMassKg,
        leanBodyMass: record.composition.leanBodyMassKg,
        boneMass: record.composition.boneMassKg,
        bodyWaterPercentage: record.composition.bodyWaterPercentage,
        totalBodyWater: record.composition.totalBodyWaterLiters,
        visceralFat: record.composition.visceralFat,
        proteinPercentage: record.composition.proteinPercentage,
        bmr: record.composition.bmrKcal,
        bmi: record.composition.bmi,
        metabolicAge: record.composition.metabolicAge,
      }
    : null;

const MeasurementDialog = ({
  open,
  initial,
  defaultHeight,
  onClose,
  onSaved,
}: MeasurementDialogProps) => {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState(0);
  const [measuredAt, setMeasuredAt] = useState(dayjs().format("YYYY-MM-DD"));
  const [height, setHeight] = useState("");
  const [source, setSource] = useState("Manual Measurement");
  const [notes, setNotes] = useState("");
  const [measurements, setMeasurements] = useState<Values>({});
  const [composition, setComposition] = useState<Values>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const existingComposition = compositionRecord(initial);

    setTab(0);
    setMeasuredAt(initial?.measuredAt ?? dayjs().format("YYYY-MM-DD"));
    setHeight(toText(initial?.heightCm ?? defaultHeight));
    setSource(initial?.source ?? "Manual Measurement");
    setNotes(initial?.notes ?? "");
    setMeasurements(
      Object.fromEntries(
        BODY_MEASUREMENT_FIELDS.map((field) => [
          field.key,
          toText(initial?.[MEASUREMENT_API_KEYS[field.key] as keyof MeasurementRecord] as number | null | undefined),
        ]),
      ),
    );
    setComposition(
      Object.fromEntries(
        BODY_COMPOSITION_FIELDS.map((field) => [
          field.key,
          toText(existingComposition?.[field.key] as number | null | undefined),
        ]),
      ),
    );
    setError(null);
  }, [open, initial, defaultHeight]);

  const mutation = useMutation({
    mutationFn: async () => {
      const measurementValues = Object.fromEntries(
        Object.entries(MEASUREMENT_API_KEYS).map(([formKey, apiKey]) => [
          apiKey,
          numberOrNull(measurements[formKey] ?? ""),
        ]),
      );
      const compositionValues = Object.fromEntries(
        Object.entries(COMPOSITION_API_KEYS).map(([formKey, apiKey]) => [
          apiKey,
          numberOrNull(composition[formKey] ?? ""),
        ]),
      ) as BodyCompositionRecordInput;
      const hasComposition = Object.entries(compositionValues).some(
        ([, value]) => value !== null,
      );
      const input = {
        measuredAt,
        heightCm: numberOrNull(height),
        source: source || null,
        notes: notes.trim() || null,
        ...measurementValues,
        ...(hasComposition
          ? { composition: { ...compositionValues, source } }
          : { composition: null }),
      } as AddBodyMeasurementInput;

      return initial
        ? updateBodyMeasurement(initial.id, input)
        : addBodyMeasurement(input);
    },
    onSuccess: async (result) => {
      if (!result.success) {
        setError(result.message);
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: trackingQueryKeys.measurements,
      });
      await queryClient.invalidateQueries({ queryKey: ["my-profile"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      onSaved(result.message);
      onClose();
    },
    onError: (mutationError: unknown) => {
      setError(getTrackingErrorMessage(mutationError));
    },
  });

  const validate = (): string | null => {
    if (!measuredAt || dayjs(measuredAt).isAfter(dayjs(), "day")) {
      return "Choose a valid measurement date";
    }

    if (height.trim() !== "" && (!numberOrNull(height) || Number(height) <= 0)) {
      return "Height must be greater than 0";
    }

    for (const field of BODY_MEASUREMENT_FIELDS) {
      const value = measurements[field.key] ?? "";

      if (value.trim() === "") {
        continue;
      }

      if (!numberOrNull(value) || Number(value) <= 0) {
        return `${field.label} must be a positive number`;
      }
    }

    for (const field of BODY_COMPOSITION_FIELDS) {
      const value = composition[field.key] ?? "";

      if (value.trim() === "") {
        continue;
      }

      const parsed = numberOrNull(value);

      if (parsed === null || (field.validation === "positive" && parsed <= 0)) {
        return `${field.label} is invalid`;
      }

      if (field.validation === "percentage" && (parsed < 0 || parsed > 100)) {
        return `${field.label} must be between 0 and 100`;
      }

      if (["visceralFat", "bmr", "metabolicAge"].includes(field.key) && !Number.isInteger(parsed)) {
        return `${field.label} must be a whole number`;
      }
    }

    const hasMeasurement = [
      height,
      ...Object.values(measurements),
    ].some((value) => value.trim() !== "");
    const hasComposition = Object.values(composition).some(
      (value) => value.trim() !== "",
    );

    if (!hasMeasurement && !hasComposition) {
      return "Enter at least one measurement or body composition value";
    }

    return null;
  };

  const handleSubmit = (): void => {
    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    mutation.mutate();
  };

  const updateMeasurement = (key: string, value: string): void => {
    setMeasurements((current) => ({ ...current, [key]: value }));
  };

  const updateComposition = (key: string, value: string): void => {
    setComposition((current) => ({ ...current, [key]: value }));
  };

  return (
    <Dialog fullWidth maxWidth="md" onClose={onClose} open={open}>
      <DialogTitle sx={{ fontWeight: 800 }}>
        {initial ? "Edit measurement" : "Add measurement"}
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2.5} sx={{ pt: 0.5 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
              gap: 2,
            }}
          >
            <DateField
              disableFuture
              label="Measurement date"
              onChange={(value) => setMeasuredAt(value ?? dayjs().format("YYYY-MM-DD"))}
              required
              value={measuredAt}
            />
            <NumberField
              label="Height"
              min={1}
              onChange={setHeight}
              step={0.1}
              unit="cm"
              value={height}
            />
            <FormSelect
              label="Source"
              onChange={setSource}
              options={BODY_COMPOSITION_SOURCE_OPTIONS}
              value={source}
            />
            <TextField
              fullWidth
              label="Notes"
              onChange={(event) => setNotes(event.target.value)}
              value={notes}
            />
          </Box>

          <Tabs
            allowScrollButtonsMobile
            onChange={(_, value: number) => setTab(value)}
            value={tab}
            variant="scrollable"
          >
            <Tab label="Measurements" />
            <Tab label="Body composition" />
          </Tabs>

          {tab === 0 ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                  md: "repeat(3, minmax(0, 1fr))",
                },
                gap: 2,
              }}
            >
              {BODY_MEASUREMENT_FIELDS.map((field) => (
                <NumberField
                  key={field.key}
                  label={field.label}
                  min={0.1}
                  onChange={(value) => updateMeasurement(field.key, value)}
                  placeholder="Optional"
                  unit={field.unit}
                  value={measurements[field.key] ?? ""}
                />
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                  md: "repeat(3, minmax(0, 1fr))",
                },
                gap: 2,
              }}
            >
              {BODY_COMPOSITION_FIELDS.map((field) => (
                <NumberField
                  key={field.key}
                  label={field.label}
                  max={field.validation === "percentage" ? 100 : undefined}
                  min={field.validation === "percentage" ? 0 : 0.1}
                  onChange={(value) => updateComposition(field.key, value)}
                  placeholder="Optional"
                  unit={field.unit || undefined}
                  value={composition[field.key] ?? ""}
                />
              ))}
            </Box>
          )}
          <Typography color="text.secondary" variant="caption">
            All fields are optional, but add at least one measurement value. Each
            new record is kept in your history.
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button disabled={mutation.isPending} onClick={onClose}>
          Cancel
        </Button>
        <Button
          disabled={mutation.isPending}
          onClick={handleSubmit}
          startIcon={
            mutation.isPending ? <CircularProgress color="inherit" size={16} /> : undefined
          }
          variant="contained"
        >
          {mutation.isPending ? "Saving..." : "Save measurement"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MeasurementDialog;
