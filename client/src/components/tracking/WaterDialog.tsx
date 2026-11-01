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
  Stack,
  TextField,
} from "@mui/material";
import { DateField } from "../onboarding/DateField";
import { NumberField } from "../onboarding/NumberField";
import {
  addWaterIntake,
  getTrackingErrorMessage,
  trackingQueryKeys,
  updateWaterIntake,
} from "../../api/trackingApi";
import type { WaterIntake } from "../../types/tracking";

interface WaterDialogProps {
  open: boolean;
  date: string;
  initial?: WaterIntake | null;
  onClose: () => void;
  onSaved: (message: string) => void;
}

const QUICK_AMOUNTS = [250, 500, 750, 1000];

const WaterDialog = ({ open, date, initial, onClose, onSaved }: WaterDialogProps) => {
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState("250");
  const [consumedOn, setConsumedOn] = useState(date);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setAmount(initial ? String(initial.amountMl) : "250");
    setConsumedOn(initial?.consumedOn ?? date);
    setNotes(initial?.notes ?? "");
    setError(null);
  }, [open, initial, date]);

  const mutation = useMutation({
    mutationFn: async () => {
      const input = {
        amountMl: Number(amount),
        consumedOn,
        notes: notes.trim() || null,
      };

      return initial
        ? updateWaterIntake(initial.id, input)
        : addWaterIntake(input);
    },
    onSuccess: async (result) => {
      if (!result.success) {
        setError(result.message);
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: trackingQueryKeys.daily(consumedOn),
      });
      onSaved(result.message);
      onClose();
    },
    onError: (mutationError: unknown) => {
      setError(getTrackingErrorMessage(mutationError));
    },
  });

  const handleSubmit = (): void => {
    if (!Number.isInteger(Number(amount)) || Number(amount) <= 0) {
      setError("Enter a positive water amount");
      return;
    }

    setError(null);
    mutation.mutate();
  };

  return (
    <Dialog fullWidth maxWidth="xs" onClose={onClose} open={open}>
      <DialogTitle sx={{ fontWeight: 800 }}>
        {initial ? "Edit water entry" : "Log water"}
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ pt: 0.5 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
            {QUICK_AMOUNTS.map((value) => (
              <Button
                key={value}
                onClick={() => setAmount(String(value))}
                size="small"
                variant={amount === String(value) ? "contained" : "outlined"}
              >
                {value} ml
              </Button>
            ))}
          </Stack>
          <NumberField
            label="Amount"
            min={1}
            onChange={setAmount}
            required
            step={50}
            unit="ml"
            value={amount}
          />
          <DateField
            disableFuture
            label="Date"
            onChange={(value) => setConsumedOn(value ?? date)}
            required
            value={consumedOn}
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
          {mutation.isPending ? "Saving..." : "Save water"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WaterDialog;
