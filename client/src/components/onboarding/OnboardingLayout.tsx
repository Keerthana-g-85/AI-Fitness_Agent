import { Box, Paper, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";
import { OnboardingStepper } from "./OnboardingStepper";

interface OnboardingLayoutProps {
  stepIndex: number;
  title: string;
  description?: string;
  children: ReactNode;
}

export const OnboardingLayout = ({
  stepIndex,
  title,
  description,
  children,
}: OnboardingLayoutProps) => (
  <Box
    sx={{
      minHeight: "100vh",
      px: { xs: 2, sm: 3 },
      py: { xs: 3, sm: 5 },
      background:
        "radial-gradient(circle at 12% 10%, #ccfbf1 0, transparent 38%), radial-gradient(circle at 88% 90%, #dbeafe 0, transparent 36%), #f3f7f6",
    }}
  >
    <Box sx={{ width: "100%", maxWidth: 1040, mx: "auto" }}>
      <Stack
        direction="row"
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2.5,
        }}
      >
        <Stack
          direction="row"
          spacing={1.25}
          sx={{ alignItems: "center" }}
        >
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontWeight: 800,
              fontSize: 19,
              background: "linear-gradient(135deg, #0f766e, #14b8a6)",
              boxShadow: "0 8px 20px rgba(15, 118, 110, 0.25)",
            }}
          >
            F
          </Box>
          <Typography
            sx={{
              fontWeight: 700,
              color: "text.secondary",
              letterSpacing: "0.08em",
            }}
            variant="subtitle1"
          >
            FITNESS AGENT
          </Typography>
        </Stack>
        <Typography color="text.secondary" variant="body2">
          Profile setup
        </Typography>
      </Stack>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 1.75, sm: 2.25 },
          mb: 2.5,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "rgba(15, 118, 110, 0.12)",
          backgroundColor: "rgba(255, 255, 255, 0.76)",
        }}
      >
        <OnboardingStepper activeStep={stepIndex} />
      </Paper>

      <Paper
        elevation={0}
        sx={{
          borderRadius: { xs: 3, sm: 4 },
          border: "1px solid",
          borderColor: "rgba(15, 118, 110, 0.12)",
          boxShadow: "0 24px 70px rgba(19, 42, 39, 0.1)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            height: 6,
            background: "linear-gradient(90deg, #0f766e, #14b8a6, #5eead4)",
          }}
        />
        <Box sx={{ p: { xs: 2.5, sm: 4 } }}>
          <Stack spacing={0.75} sx={{ mb: 3.5 }}>
            <Typography variant="h4">{title}</Typography>
            {description && (
              <Typography color="text.secondary" variant="body2">
                {description}
              </Typography>
            )}
          </Stack>
          {children}
        </Box>
      </Paper>
    </Box>
  </Box>
);
