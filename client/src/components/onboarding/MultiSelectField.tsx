import {
  Box,
  Checkbox,
  ListItemText,
  MenuItem,
  TextField,
} from "@mui/material";

interface MultiSelectFieldProps {
  label: string;
  value: string[];
  options: readonly string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  disabledOptions?: readonly string[];
}

export const MultiSelectField = ({
  label,
  value,
  options,
  onChange,
  placeholder = "Select options",
  required = false,
  error,
  helperText,
  disabledOptions = [],
}: MultiSelectFieldProps) => (
  <TextField
    error={Boolean(error)}
    fullWidth
    helperText={error ?? helperText}
    label={label}
    onChange={(event) => {
      const nextValue = event.target.value;
      onChange(typeof nextValue === "string" ? nextValue.split(",") : nextValue);
    }}
    required={required}
    select
    slotProps={{
      select: {
        displayEmpty: true,
        multiple: true,
        renderValue: (selected) => {
          const selectedValues = Array.isArray(selected)
            ? selected.map(String)
            : [];

          if (selectedValues.length === 0) {
            return (
              <Box component="span" sx={{ color: "text.disabled" }}>
                {placeholder}
              </Box>
            );
          }

          return selectedValues.join(", ");
        },
      },
    }}
    value={value}
  >
    {options.map((option) => {
      const selected = value.includes(option);
      const disabled = !selected && disabledOptions.includes(option);

      return (
        <MenuItem disabled={disabled} key={option} value={option}>
          <Checkbox checked={selected} size="small" />
          <ListItemText primary={option} />
        </MenuItem>
      );
    })}
  </TextField>
);
