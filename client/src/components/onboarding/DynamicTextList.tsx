import AddIcon from "@mui/icons-material/Add";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import {
  Button,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";

interface DynamicTextListProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
  addLabel: string;
}

export const DynamicTextList = ({
  label,
  values,
  onChange,
  placeholder,
  addLabel,
}: DynamicTextListProps) => {
  const updateValue = (index: number, value: string) => {
    onChange(values.map((item, itemIndex) => (itemIndex === index ? value : item)));
  };

  return (
    <Stack spacing={1.5}>
      {values.map((value, index) => (
        <Stack direction="row" key={index} spacing={1}>
          <TextField
            fullWidth
            label={`${label} ${index + 1}`}
            onChange={(event) => updateValue(index, event.target.value)}
            placeholder={placeholder}
            value={value}
          />
          <IconButton
            aria-label={`Remove ${label.toLowerCase()} ${index + 1}`}
            color="error"
            onClick={() =>
              onChange(values.filter((_, itemIndex) => itemIndex !== index))
            }
          >
            <DeleteForeverOutlinedIcon />
          </IconButton>
        </Stack>
      ))}
      <Button
        onClick={() => onChange([...values, ""])}
        startIcon={<AddIcon />}
        sx={{ alignSelf: "flex-start" }}
        variant="outlined"
      >
        {addLabel}
      </Button>
    </Stack>
  );
};
