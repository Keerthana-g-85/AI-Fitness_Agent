import {
  Box,
  LinearProgress,
  Step,
  StepLabel,
  Stepper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ONBOARDING_STEPS } from "../../types/onboarding";

interface OnboardingStepperProps {
  activeStep: number;
}

export const OnboardingStepper = ({ activeStep }: OnboardingStepperProps) => {
  const theme = useTheme();
  const compact = useMediaQuery(theme.breakpoints.down("md"));
  const currentStep =
    ONBOARDING_STEPS[activeStep] ?? ONBOARDING_STEPS[0];
  const progress = ((activeStep + 1) / ONBOARDING_STEPS.length) * 100;

  return (
    <Stack spacing={compact ? 1.5 : 2.5}>
      <Stack
        direction="row"
        spacing={2}
        sx={{ alignItems: "center", justifyContent: "space-between" }}
      >
        <Typography
          color="primary.main"
          sx={{ fontWeight: 800, letterSpacing: "0.08em" }}
          variant="caption"
        >
          STEP {activeStep + 1} OF {ONBOARDING_STEPS.length}
        </Typography>
        <Typography sx={{ fontWeight: 700 }} variant="body2">
          {currentStep?.label}
        </Typography>
      </Stack>

      {compact ? (
        <Box>
          <LinearProgress
            sx={{ height: 8, borderRadius: 4 }}
            value={progress}
            variant="determinate"
          />
        </Box>
      ) : (
        <Stepper activeStep={activeStep} alternativeLabel>
          {ONBOARDING_STEPS.map((step) => (
            <Step key={step.path}>
              <StepLabel
                sx={{
                  "& .MuiStepLabel-label": {
                    fontSize: "0.75rem",
                    mt: 0.5,
                  },
                }}
              >
                {step.shortLabel}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      )}
    </Stack>
  );
};
