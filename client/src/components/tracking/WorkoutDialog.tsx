import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { DateField } from "../onboarding/DateField";
import { NumberField } from "../onboarding/NumberField";
import {
  addWorkout,
  getTrackingErrorMessage,
  trackingQueryKeys,
  updateWorkout,
} from "../../api/trackingApi";
import type { WorkoutSession } from "../../types/tracking";

interface WorkoutDialogProps {
  open: boolean;
  date: string;
  initial?: WorkoutSession | null;
  onClose: () => void;
  onSaved: (message: string) => void;
}

interface ExerciseForm {
  key: string;
  exerciseName: string;
  sets: string;
  reps: string;
  weightKg: string;
  durationMinutes: string;
  distanceKm: string;
  caloriesBurned: string;
}

const WORKOUT_TYPES = [
  { value: "strength", label: "Strength training" },
  { value: "cardio", label: "Cardio" },
  { value: "flexibility", label: "Flexibility / mobility" },
  { value: "sports", label: "Sports" },
  { value: "full_body", label: "Full body" },
  { value: "other", label: "Other" },
];
const INTENSITIES = ["low", "moderate", "high"];

const numberOrNull = (value: string): number | null =>
  value.trim() === "" ? null : Number(value);

const blankExercise = (): ExerciseForm => ({
  key: crypto.randomUUID(),
  exerciseName: "",
  sets: "",
  reps: "",
  weightKg: "",
  durationMinutes: "",
  distanceKm: "",
  caloriesBurned: "",
});

const WorkoutDialog = ({
  open,
  date,
  initial,
  onClose,
  onSaved,
}: WorkoutDialogProps) => {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [workoutType, setWorkoutType] = useState("strength");
  const [performedOn, setPerformedOn] = useState(date);
  const [duration, setDuration] = useState("");
  const [calories, setCalories] = useState("");
  const [intensity, setIntensity] = useState("moderate");
  const [notes, setNotes] = useState("");
  const [exercises, setExercises] = useState<ExerciseForm[]>([blankExercise()]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setName(initial?.name ?? "");
    setWorkoutType(initial?.workoutType ?? "strength");
    setPerformedOn(initial?.performedOn ?? date);
    setDuration(initial ? String(initial.durationMinutes) : "");
    setCalories(initial?.caloriesBurned == null ? "" : String(initial.caloriesBurned));
    setIntensity(initial?.intensity ?? "moderate");
    setNotes(initial?.notes ?? "");
    setExercises(
      initial && initial.exercises.length > 0
        ? initial.exercises.map((exercise) => ({
            key: exercise.id,
            exerciseName: exercise.exerciseName,
            sets: exercise.sets == null ? "" : String(exercise.sets),
            reps: exercise.reps == null ? "" : String(exercise.reps),
            weightKg: exercise.weightKg == null ? "" : String(exercise.weightKg),
            durationMinutes:
              exercise.durationMinutes == null ? "" : String(exercise.durationMinutes),
            distanceKm: exercise.distanceKm == null ? "" : String(exercise.distanceKm),
            caloriesBurned:
              exercise.caloriesBurned == null ? "" : String(exercise.caloriesBurned),
          }))
        : [blankExercise()],
    );
    setError(null);
  }, [open, initial, date]);

  const updateExercise = (key: string, updates: Partial<ExerciseForm>): void => {
    setExercises((current) =>
      current.map((item) => (item.key === key ? { ...item, ...updates } : item)),
    );
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const input = {
        name: name.trim(),
        workoutType,
        performedOn,
        durationMinutes: Number(duration),
        caloriesBurned: numberOrNull(calories),
        intensity,
        notes: notes.trim() || null,
        exercises: exercises
          .filter((exercise) => exercise.exerciseName.trim())
          .map((exercise) => ({
            exerciseName: exercise.exerciseName.trim(),
            sets: numberOrNull(exercise.sets),
            reps: numberOrNull(exercise.reps),
            weightKg: numberOrNull(exercise.weightKg),
            durationMinutes: numberOrNull(exercise.durationMinutes),
            distanceKm: numberOrNull(exercise.distanceKm),
            caloriesBurned: numberOrNull(exercise.caloriesBurned),
          })),
      };

      return initial ? updateWorkout(initial.id, input) : addWorkout(input);
    },
    onSuccess: async (result) => {
      if (!result.success) {
        setError(result.message);
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: trackingQueryKeys.daily(performedOn),
      });
      onSaved(result.message);
      onClose();
    },
    onError: (mutationError: unknown) => {
      setError(getTrackingErrorMessage(mutationError));
    },
  });

  const handleSubmit = (): void => {
    if (!name.trim()) {
      setError("Workout name is required");
      return;
    }

    if (!Number.isInteger(Number(duration)) || Number(duration) <= 0) {
      setError("Enter a positive workout duration");
      return;
    }

    if (
      exercises.some(
        (exercise) =>
          !exercise.exerciseName.trim() &&
          [exercise.sets, exercise.reps, exercise.weightKg, exercise.durationMinutes, exercise.distanceKm, exercise.caloriesBurned].some(
            (value) => value.trim() !== "",
          ),
      )
    ) {
      setError("Add a name for every exercise");
      return;
    }

    setError(null);
    mutation.mutate();
  };

  return (
    <Dialog fullWidth maxWidth="md" onClose={onClose} open={open}>
      <DialogTitle sx={{ fontWeight: 800 }}>
        {initial ? "Edit workout" : "Log workout"}
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
            <TextField
              fullWidth
              label="Workout name"
              onChange={(event) => setName(event.target.value)}
              required
              value={name}
            />
            <TextField
              fullWidth
              label="Workout type"
              onChange={(event) => setWorkoutType(event.target.value)}
              select
              value={workoutType}
            >
              {WORKOUT_TYPES.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <DateField
              disableFuture
              label="Workout date"
              onChange={(value) => setPerformedOn(value ?? date)}
              required
              value={performedOn}
            />
            <NumberField
              label="Duration"
              min={1}
              onChange={setDuration}
              required
              step={1}
              unit="min"
              value={duration}
            />
            <NumberField
              label="Calories burned"
              min={0}
              onChange={setCalories}
              step={1}
              unit="kcal"
              value={calories}
            />
            <TextField
              fullWidth
              label="Intensity"
              onChange={(event) => setIntensity(event.target.value)}
              select
              value={intensity}
            >
              {INTENSITIES.map((option) => (
                <MenuItem key={option} sx={{ textTransform: "capitalize" }} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <TextField
            fullWidth
            label="Notes"
            multiline
            onChange={(event) => setNotes(event.target.value)}
            rows={2}
            value={notes}
          />

          <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
            <Typography sx={{ fontWeight: 700 }} variant="subtitle1">
              Exercises
            </Typography>
            <Button
              onClick={() => setExercises((current) => [...current, blankExercise()])}
              size="small"
              startIcon={<AddIcon />}
            >
              Add exercise
            </Button>
          </Stack>

          {exercises.map((exercise, index) => (
            <Card elevation={0} key={exercise.key} variant="outlined">
              <CardContent sx={{ p: 2 }}>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                    <Typography color="text.secondary" variant="caption">
                      Exercise {index + 1}
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <IconButton
                      aria-label="Remove exercise"
                      color="error"
                      disabled={exercises.length === 1}
                      onClick={() =>
                        setExercises((current) =>
                          current.filter((item) => item.key !== exercise.key),
                        )
                      }
                      size="small"
                    >
                      <DeleteOutlineOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                  <TextField
                    fullWidth
                    label="Exercise name"
                    onChange={(event) =>
                      updateExercise(exercise.key, { exerciseName: event.target.value })
                    }
                    value={exercise.exerciseName}
                  />
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "repeat(2, minmax(0, 1fr))",
                        md: "repeat(3, minmax(0, 1fr))",
                      },
                      gap: 1.5,
                    }}
                  >
                    <NumberField label="Sets" min={1} onChange={(value) => updateExercise(exercise.key, { sets: value })} step={1} value={exercise.sets} />
                    <NumberField label="Reps" min={1} onChange={(value) => updateExercise(exercise.key, { reps: value })} step={1} value={exercise.reps} />
                    <NumberField label="Weight" min={0} onChange={(value) => updateExercise(exercise.key, { weightKg: value })} unit="kg" value={exercise.weightKg} />
                    <NumberField label="Duration" min={1} onChange={(value) => updateExercise(exercise.key, { durationMinutes: value })} step={1} unit="min" value={exercise.durationMinutes} />
                    <NumberField label="Distance" min={0} onChange={(value) => updateExercise(exercise.key, { distanceKm: value })} unit="km" value={exercise.distanceKm} />
                    <NumberField label="Calories" min={0} onChange={(value) => updateExercise(exercise.key, { caloriesBurned: value })} step={1} unit="kcal" value={exercise.caloriesBurned} />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))}
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
          {mutation.isPending ? "Saving..." : "Save workout"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WorkoutDialog;
