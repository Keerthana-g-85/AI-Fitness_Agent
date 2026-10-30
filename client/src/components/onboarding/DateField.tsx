import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

interface DateFieldProps {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
  required?: boolean;
  error?: string;
  helperText?: string;
  minDate?: Dayjs;
  maxDate?: Dayjs;
  disableFuture?: boolean;
}

export const DateField = ({
  label,
  value,
  onChange,
  required = false,
  error,
  helperText,
  minDate,
  maxDate,
  disableFuture = false,
}: DateFieldProps) => {
  const dateValue = value && dayjs(value).isValid() ? dayjs(value) : null;

  return (
    <DatePicker
      disableFuture={disableFuture}
      format="DD MMM YYYY"
      label={label}
      maxDate={maxDate}
      minDate={minDate}
      onChange={(newValue) =>
        onChange(
          newValue && newValue.isValid() ? newValue.format("YYYY-MM-DD") : null,
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
      value={dateValue}
    />
  );
};
