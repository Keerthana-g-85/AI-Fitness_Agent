import { MenuItem, TextField } from "@mui/material";

interface FormSelectProps {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  helperText?: string;
}

export const FormSelect = ({
  label,
  value,
  options,
  onChange,
  required = false,
  error,
  helperText,
}: FormSelectProps) => (
  <TextField
    error={Boolean(error)}
    fullWidth
    helperText={error ?? helperText}
    label={label}
    onChange={(event) => onChange(event.target.value)}
    required={required}
    select
    slotProps={{ select: { displayEmpty: true } }}
    value={value}
  >
    <MenuItem disabled={required} value="">
      <em>{required ? "Select an option" : "None"}</em>
    </MenuItem>
    {options.map((option) => (
      <MenuItem key={option} value={option}>
        {option}
      </MenuItem>
    ))}
  </TextField>
);
