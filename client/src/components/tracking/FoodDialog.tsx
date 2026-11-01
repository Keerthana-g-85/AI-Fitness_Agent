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
  addFoodIntake,
  getTrackingErrorMessage,
  trackingQueryKeys,
  updateFoodIntake,
} from "../../api/trackingApi";
import type { FoodIntake } from "../../types/tracking";

interface FoodDialogProps {
  open: boolean;
  date: string;
  initial?: FoodIntake | null;
  onClose: () => void;
  onSaved: (message: string) => void;
}

const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"] as const;

const numberOrNull = (value: string): number | null =>
  value.trim() === "" ? null : Number(value);

const FoodDialog = ({ open, date, initial, onClose, onSaved }: FoodDialogProps) => {
  const queryClient = useQueryClient();
  const [foodName, setFoodName] = useState("");
  const [mealType, setMealType] = useState("breakfast");
  const [servingSize, setServingSize] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [fiber, setFiber] = useState("");
  const [consumedOn, setConsumedOn] = useState(date);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setFoodName(initial?.foodName ?? "");
    setMealType(initial?.mealType ?? "breakfast");
    setServingSize(initial?.servingSize ?? "");
    setCalories(initial ? String(initial.calories) : "");
    setProtein(initial?.proteinG == null ? "" : String(initial.proteinG));
    setCarbs(initial?.carbsG == null ? "" : String(initial.carbsG));
    setFat(initial?.fatG == null ? "" : String(initial.fatG));
    setFiber(initial?.fiberG == null ? "" : String(initial.fiberG));
    setConsumedOn(initial?.consumedOn ?? date);
    setNotes(initial?.notes ?? "");
    setError(null);
  }, [open, initial, date]);

  const mutation = useMutation({
    mutationFn: async () => {
      const input = {
        foodName: foodName.trim(),
        mealType,
        servingSize: servingSize.trim() || null,
        calories: numberOrNull(calories) ?? 0,
        proteinG: numberOrNull(protein),
        carbsG: numberOrNull(carbs),
        fatG: numberOrNull(fat),
        fiberG: numberOrNull(fiber),
        consumedOn,
        notes: notes.trim() || null,
      };

      return initial
        ? updateFoodIntake(initial.id, input)
        : addFoodIntake(input);
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
    if (!foodName.trim()) {
      setError("Food name is required");
      return;
    }

    if (calories.trim() === "" || Number(calories) < 0) {
      setError("Enter calories as zero or more");
      return;
    }

    setError(null);
    mutation.mutate();
  };

  return (
    <Dialog fullWidth maxWidth="sm" onClose={onClose} open={open}>
      <DialogTitle sx={{ fontWeight: 800 }}>
        {initial ? "Edit food" : "Add food"}
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ pt: 0.5 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            autoFocus
            fullWidth
            label="Food name"
            onChange={(event) => setFoodName(event.target.value)}
            required
            value={foodName}
          />
          <TextField
            fullWidth
            label="Meal"
            onChange={(event) => setMealType(event.target.value)}
            select
            value={mealType}
          >
            {MEAL_TYPES.map((meal) => (
              <MenuItem key={meal} sx={{ textTransform: "capitalize" }} value={meal}>
                {meal}
              </MenuItem>
            ))}
          </TextField>
          <DateField
            disableFuture
            label="Date"
            onChange={(value) => setConsumedOn(value ?? date)}
            required
            value={consumedOn}
          />
          <TextField
            fullWidth
            label="Serving size"
            onChange={(event) => setServingSize(event.target.value)}
            placeholder="e.g. 1 cup, 150 g"
            value={servingSize}
          />
          <NumberField
            label="Calories"
            min={0}
            onChange={setCalories}
            required
            step={1}
            unit="kcal"
            value={calories}
          />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <NumberField label="Protein" min={0} onChange={setProtein} unit="g" value={protein} />
            <NumberField label="Carbs" min={0} onChange={setCarbs} unit="g" value={carbs} />
            <NumberField label="Fat" min={0} onChange={setFat} unit="g" value={fat} />
            <NumberField label="Fiber" min={0} onChange={setFiber} unit="g" value={fiber} />
          </Stack>
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
          {mutation.isPending ? "Saving..." : "Save food"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FoodDialog;
