import { InputAdornment, TextField } from "@mui/material";

interface NumberFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  unit?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}

export const NumberField = ({
  label,
  value,
  onChange,
  unit,
  required = false,
  error,
  helperText,
  placeholder,
  min,
  max,
  step = 0.1,
}: NumberFieldProps) => (
  <TextField
    error={Boolean(error)}
    fullWidth
    helperText={error ?? helperText}
    label={label}
    onChange={(event) => onChange(event.target.value)}
    placeholder={placeholder}
    required={required}
    slotProps={{
      htmlInput: { min, max, step },
      input: unit
        ? {
            endAdornment: (
              <InputAdornment position="end">{unit}</InputAdornment>
            ),
          }
        : undefined,
    }}
    type="number"
    value={value}
  />
);
