import dayjs from "dayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

interface TimeFieldProps {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
  required?: boolean;
  error?: string;
  helperText?: string;
}

export const TimeField = ({
  label,
  value,
  onChange,
  required = false,
  error,
  helperText,
}: TimeFieldProps) => {
  const timeValue = value ? dayjs(`2000-01-01T${value}`) : null;

  return (
    <TimePicker
      format="hh:mm A"
      label={label}
      onChange={(newValue) =>
        onChange(
          newValue && newValue.isValid() ? newValue.format("HH:mm") : null,
        )
      }
      slotProps={{
        textField: {
          fullWidth: true,
          required,
          error: Boolean(error),
          helperText: error ?? helperText,
        },
      }}
      value={timeValue}
    />
  );
};
