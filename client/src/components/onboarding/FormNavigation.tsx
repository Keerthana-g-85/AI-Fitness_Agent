import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, Button, CircularProgress, Stack } from "@mui/material";

interface FormNavigationProps {
  onBack: () => void;
  onNext: () => void;
  backLabel?: string;
  nextLabel?: string;
  nextDisabled?: boolean;
  nextPending?: boolean;
}

export const FormNavigation = ({
  onBack,
  onNext,
  backLabel = "Back",
  nextLabel = "Next",
  nextDisabled = false,
  nextPending = false,
}: FormNavigationProps) => (
  <Stack
    direction={{ xs: "column-reverse", sm: "row" }}
    spacing={1.5}
    sx={{
      mt: 4,
      pt: 3,
      borderTop: 1,
      borderColor: "divider",
      justifyContent: "space-between",
    }}
  >
    <Button
      color="inherit"
      onClick={onBack}
      startIcon={<ArrowBackIcon />}
      sx={{ color: "text.secondary" }}
    >
      {backLabel}
    </Button>
    <Box>
      <Button
        disabled={nextDisabled || nextPending}
        endIcon={
          nextPending ? (
            <CircularProgress color="inherit" size={18} />
          ) : (
            <ArrowForwardIcon />
          )
        }
        onClick={onNext}
        size="large"
        sx={{ px: 3 }}
        variant="contained"
      >
        {nextLabel}
      </Button>
    </Box>
  </Stack>
);
