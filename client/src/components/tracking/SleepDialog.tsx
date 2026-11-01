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
import { TimeField } from "../onboarding/TimeField";
import {
  getTrackingErrorMessage,
  saveSleepRecord,
  trackingQueryKeys,
  updateSleepRecord,
} from "../../api/trackingApi";
import type { SleepRecord } from "../../types/tracking";

interface SleepDialogProps {
  open: boolean;
  date: string;
  initial?: SleepRecord | null;
  onClose: () => void;
  onSaved: (message: string) => void;
}

const QUALITIES = ["poor", "fair", "good", "excellent"];

const SleepDialog = ({ open, date, initial, onClose, onSaved }: SleepDialogProps) => {
  const queryClient = useQueryClient();
  const [sleepDate, setSleepDate] = useState(date);
  const [bedTime, setBedTime] = useState("");
  const [wakeTime, setWakeTime] = useState("");
  const [duration, setDuration] = useState("");
  const [quality, setQuality] = useState("good");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setSleepDate(initial?.sleepDate ?? date);
    setBedTime(initial?.bedTime ?? "");
    setWakeTime(initial?.wakeTime ?? "");
    setDuration(initial ? String(initial.durationMinutes) : "");
    setQuality(initial?.quality ?? "good");
    setNotes(initial?.notes ?? "");
    setError(null);
  }, [open, initial, date]);

  const mutation = useMutation({
    mutationFn: async () => {
      const input = {
        sleepDate,
        bedTime: bedTime || null,
        wakeTime: wakeTime || null,
        durationMinutes: Number(duration),
        quality,
        notes: notes.trim() || null,
      };

      return initial
        ? updateSleepRecord(initial.id, input)
        : saveSleepRecord(input);
    },
    onSuccess: async (result) => {
      if (!result.success) {
        setError(result.message);
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: trackingQueryKeys.daily(sleepDate),
      });
      onSaved(result.message);
      onClose();
    },
    onError: (mutationError: unknown) => {
      setError(getTrackingErrorMessage(mutationError));
    },
  });

  const handleSubmit = (): void => {
    if (!Number.isInteger(Number(duration)) || Number(duration) <= 0) {
      setError("Enter a positive sleep duration");
      return;
    }

    setError(null);
    mutation.mutate();
  };

  return (
    <Dialog fullWidth maxWidth="sm" onClose={onClose} open={open}>
      <DialogTitle sx={{ fontWeight: 800 }}>
        {initial ? "Edit sleep" : "Log sleep"}
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ pt: 0.5 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <DateField
            disableFuture
            label="Sleep date (morning you woke up)"
            onChange={(value) => setSleepDate(value ?? date)}
            required
            value={sleepDate}
          />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TimeField
              label="Bed time"
              onChange={(value) => setBedTime(value ?? "")}
              value={bedTime || null}
            />
            <TimeField
              label="Wake time"
              onChange={(value) => setWakeTime(value ?? "")}
              value={wakeTime || null}
            />
          </Stack>
          <NumberField
            label="Duration"
            min={1}
            onChange={setDuration}
            required
            step={15}
            unit="min"
            value={duration}
          />
          <TextField
            fullWidth
            label="Sleep quality"
            onChange={(event) => setQuality(event.target.value)}
            select
            value={quality}
          >
            {QUALITIES.map((option) => (
              <MenuItem key={option} sx={{ textTransform: "capitalize" }} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
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
          {mutation.isPending ? "Saving..." : "Save sleep"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SleepDialog;
