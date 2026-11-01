import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { DateField } from "../onboarding/DateField";
import { NumberField } from "../onboarding/NumberField";
import {
  addSportsActivity,
  getTrackingErrorMessage,
  trackingQueryKeys,
  updateSportsActivity,
} from "../../api/trackingApi";
import { SPORTS_OPTIONS } from "../../types/onboarding";
import type { SportsActivity } from "../../types/tracking";

interface SportsDialogProps {
  open: boolean;
  date: string;
  initial?: SportsActivity | null;
  onClose: () => void;
  onSaved: (message: string) => void;
}

const INTENSITIES = ["low", "moderate", "high"];

const numberOrNull = (value: string): number | null =>
  value.trim() === "" ? null : Number(value);

const SportsDialog = ({ open, date, initial, onClose, onSaved }: SportsDialogProps) => {
  const queryClient = useQueryClient();
  const [sportName, setSportName] = useState("Football");
  const [activityDate, setActivityDate] = useState(date);
  const [duration, setDuration] = useState("");
  const [intensity, setIntensity] = useState("moderate");
  const [calories, setCalories] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setSportName(initial?.sportName ?? "Football");
    setActivityDate(initial?.activityDate ?? date);
    setDuration(initial ? String(initial.durationMinutes) : "");
    setIntensity(initial?.intensity ?? "moderate");
    setCalories(initial?.caloriesBurned == null ? "" : String(initial.caloriesBurned));
    setLocation(initial?.location ?? "");
    setNotes(initial?.notes ?? "");
    setError(null);
  }, [open, initial, date]);

  const mutation = useMutation({
    mutationFn: async () => {
      const input = {
        sportName: sportName.trim(),
        activityDate,
        durationMinutes: Number(duration),
        intensity,
        caloriesBurned: numberOrNull(calories),
        location: location.trim() || null,
        notes: notes.trim() || null,
      };

      return initial
        ? updateSportsActivity(initial.id, input)
        : addSportsActivity(input);
    },
    onSuccess: async (result) => {
      if (!result.success) {
        setError(result.message);
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: trackingQueryKeys.daily(activityDate),
      });
      onSaved(result.message);
      onClose();
    },
    onError: (mutationError: unknown) => {
      setError(getTrackingErrorMessage(mutationError));
    },
  });

  const handleSubmit = (): void => {
    if (!sportName.trim()) {
      setError("Sport name is required");
      return;
    }

    if (!Number.isInteger(Number(duration)) || Number(duration) <= 0) {
      setError("Enter a positive activity duration");
      return;
    }

    setError(null);
    mutation.mutate();
  };

  return (
    <Dialog fullWidth maxWidth="sm" onClose={onClose} open={open}>
      <DialogTitle sx={{ fontWeight: 800 }}>
        {initial ? "Edit sports activity" : "Log sports activity"}
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ pt: 0.5 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            fullWidth
            label="Sport"
            onChange={(event) => setSportName(event.target.value)}
            select
            value={sportName}
          >
            {SPORTS_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <DateField
            disableFuture
            label="Activity date"
            onChange={(value) => setActivityDate(value ?? date)}
            required
            value={activityDate}
          />
          <NumberField
            label="Duration"
            min={1}
            onChange={setDuration}
            required
            step={5}
            unit="min"
            value={duration}
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
            label="Location"
            onChange={(event) => setLocation(event.target.value)}
            value={location}
          />
          <TextField
            fullWidth
            label="Notes"
            multiline
            onChange={(event) => setNotes(event.target.value)}
            rows={2}
            value={notes}
          />
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
          {mutation.isPending ? "Saving..." : "Save activity"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SportsDialog;
