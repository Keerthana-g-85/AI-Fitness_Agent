import { Link as RouterLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import FitnessCenterOutlinedIcon from "@mui/icons-material/FitnessCenterOutlined";
import MonitorWeightOutlinedIcon from "@mui/icons-material/MonitorWeightOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import HeightOutlinedIcon from "@mui/icons-material/HeightOutlined";
import DirectionsRunOutlinedIcon from "@mui/icons-material/DirectionsRunOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import StraightenOutlinedIcon from "@mui/icons-material/StraightenOutlined";
import PercentOutlinedIcon from "@mui/icons-material/PercentOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import { AppHeader } from "../components/AppHeader";
import {
  getDashboard,
  getProfileErrorMessage,
  profileQueryKeys,
} from "../api/profileApi";
import { useAuth } from "../context/AuthContext";

const formatNumber = (value: number | null | undefined, unit = ""): string =>
  value === null || value === undefined
    ? "Not provided"
    : `${Number.isInteger(value) ? value : value.toFixed(1)}${unit ? ` ${unit}` : ""}`;

const DashboardPage = () => {
  const { user } = useAuth();
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: profileQueryKeys.dashboard,
    queryFn: getDashboard,
    retry: false,
  });

  const displayName = data?.user.name ?? user?.name ?? "there";
  const fitnessGoal = data?.fitnessGoal;
  const latestMeasurement = data?.latestBodyMeasurement;
  const onboardingComplete = data?.user.onboardingCompleted ?? false;

  const overviewItems = [
    {
      label: "Current Weight",
      value: formatNumber(fitnessGoal?.currentWeightKg ?? latestMeasurement?.weightKg, "kg"),
      icon: <MonitorWeightOutlinedIcon color="primary" />,
    },
    {
      label: "Target Weight",
      value: formatNumber(fitnessGoal?.targetWeightKg, "kg"),
      icon: <FlagOutlinedIcon color="primary" />,
    },
    {
      label: "Height",
      value: formatNumber(data?.profile?.heightCm, "cm"),
      icon: <HeightOutlinedIcon color="primary" />,
    },
    {
      label: "Primary Fitness Goal",
      value: fitnessGoal?.primaryGoal ?? "Not provided",
      icon: <FitnessCenterOutlinedIcon color="primary" />,
    },
    {
      label: "Activity Level",
      value: data?.profile?.activityLevel ?? "Not provided",
      icon: <DirectionsRunOutlinedIcon color="primary" />,
    },
    {
      label: "Onboarding Status",
      value: onboardingComplete ? "Completed" : "In progress",
      icon: <CheckCircleOutlineOutlinedIcon color="primary" />,
    },
  ];

  const navigationItems = [
    {
      label: "Daily Tracking",
      description: "Log food, water, workouts, sleep and sports for today.",
      to: "/tracking",
      icon: <EventNoteOutlinedIcon />,
    },
    {
      label: "My Profile",
      description: "Review and update your personal information.",
      to: "/profile",
      icon: <PersonOutlineOutlinedIcon />,
    },
    {
      label: "Fitness Goals",
      description: "See your current target and goal timeline.",
      to: "/profile#fitness-goals",
      icon: <FitnessCenterOutlinedIcon />,
    },
    {
      label: "Body Measurements",
      description: "View measurement history, compare records and progress.",
      to: "/profile/measurements",
      icon: <StraightenOutlinedIcon />,
    },
    {
      label: "Body Composition",
      description: "Check body fat, muscle and metabolic details.",
      to: "/profile#body-composition",
      icon: <PercentOutlinedIcon />,
    },
  ];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppHeader />
      <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 5 } }}>
        {isError && (
          <Alert
            action={
              <Button color="inherit" onClick={() => void refetch()} size="small">
                Retry
              </Button>
            }
            severity="error"
            sx={{ mb: 3 }}
          >
            {getProfileErrorMessage(error)}
          </Alert>
        )}

        <Stack spacing={4}>
          <Box
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: 4,
              color: "#ffffff",
              background:
                "linear-gradient(135deg, #115e59 0%, #0f766e 55%, #14b8a6 100%)",
              boxShadow: "0 24px 60px rgba(15, 118, 110, 0.24)",
            }}
          >
            <Stack spacing={1.25}>
              <Typography
                sx={{ opacity: 0.82, fontWeight: 700, letterSpacing: "0.08em" }}
                variant="caption"
              >
                DASHBOARD
              </Typography>
              <Typography sx={{ fontWeight: 800 }} variant="h4">
                Welcome back, {displayName}
              </Typography>
              <Typography sx={{ maxWidth: 680, opacity: 0.9 }} variant="body1">
                {onboardingComplete
                  ? fitnessGoal
                    ? `Keep building momentum toward ${fitnessGoal.primaryGoal.toLowerCase()}. Your latest profile details are ready below.`
                    : "Your profile is ready. Review your fitness details and keep moving forward."
                  : "Complete your onboarding to unlock your personalized fitness overview."}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ pt: 1, flexWrap: "wrap", rowGap: 1 }}>
                <Chip
                  label={onboardingComplete ? "Onboarding complete" : "Onboarding in progress"}
                  size="small"
                  sx={{ bgcolor: "rgba(255,255,255,0.16)", color: "#ffffff" }}
                />
                {fitnessGoal && (
                  <Chip
                    label={fitnessGoal.primaryGoal}
                    size="small"
                    sx={{ bgcolor: "rgba(255,255,255,0.16)", color: "#ffffff" }}
                  />
                )}
              </Stack>
              <Stack direction="row" spacing={1} sx={{ pt: 1.5, flexWrap: "wrap", rowGap: 1 }}>
                <Button
                  component={RouterLink}
                  startIcon={<EventNoteOutlinedIcon />}
                  sx={{ bgcolor: "#ffffff", color: "primary.dark", "&:hover": { bgcolor: "#f0fdfa" } }}
                  to="/tracking"
                  variant="contained"
                >
                  Track today
                </Button>
                <Button
                  component={RouterLink}
                  startIcon={<StraightenOutlinedIcon />}
                  sx={{ color: "#ffffff", borderColor: "rgba(255,255,255,0.5)" }}
                  to="/profile/measurements"
                  variant="outlined"
                >
                  Measurements
                </Button>
              </Stack>
            </Stack>
          </Box>

          <Box>
            <Stack
              direction="row"
              sx={{ alignItems: "center", justifyContent: "space-between", mb: 2 }}
            >
              <Box>
                <Typography sx={{ fontWeight: 800 }} variant="h5">
                  Fitness Overview
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  Your current health and fitness snapshot.
                </Typography>
              </Box>
              {isFetching && !isLoading && (
                <CircularProgress size={20} />
              )}
            </Stack>

            {isLoading ? (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, minmax(0, 1fr))",
                    lg: "repeat(3, minmax(0, 1fr))",
                  },
                  gap: 2,
                }}
              >
                {[0, 1, 2, 3, 4, 5].map((item) => (
                  <Card key={item} elevation={0} variant="outlined">
                    <CardContent>
                      <CircularProgress size={20} />
                    </CardContent>
                  </Card>
                ))}
              </Box>
            ) : (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, minmax(0, 1fr))",
                    lg: "repeat(3, minmax(0, 1fr))",
                  },
                  gap: 2,
                }}
              >
                {overviewItems.map((item) => (
                  <Card
                    elevation={0}
                    key={item.label}
                    variant="outlined"
                    sx={{
                      borderRadius: 3,
                      borderColor: "rgba(15, 118, 110, 0.14)",
                      backgroundColor: "#ffffff",
                    }}
                  >
                    <CardContent sx={{ p: 2.5 }}>
                      <Stack spacing={1.5}>
                        <Box
                          sx={{
                            width: 42,
                            height: 42,
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "rgba(15, 118, 110, 0.08)",
                          }}
                        >
                          {item.icon}
                        </Box>
                        <Box>
                          <Typography color="text.secondary" variant="body2">
                            {item.label}
                          </Typography>
                          <Typography sx={{ fontWeight: 800, mt: 0.4 }} variant="h6">
                            {item.value}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 800, mb: 0.5 }} variant="h5">
              Explore Your Profile
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }} variant="body2">
              Jump directly to the details you want to review or update.
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                  lg: "repeat(4, minmax(0, 1fr))",
                },
                gap: 2,
              }}
            >
              {navigationItems.map((item) => (
                <Card
                  component={RouterLink}
                  elevation={0}
                  key={item.label}
                  to={item.to}
                  variant="outlined"
                  sx={{
                    borderRadius: 3,
                    borderColor: "rgba(15, 118, 110, 0.14)",
                    color: "inherit",
                    textDecoration: "none",
                    transition: "transform 160ms ease, box-shadow 160ms ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 14px 34px rgba(19, 42, 39, 0.1)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Stack spacing={1.25}>
                      <Box sx={{ color: "primary.main" }}>{item.icon}</Box>
                      <Typography sx={{ fontWeight: 700 }} variant="subtitle1">
                        {item.label}
                      </Typography>
                      <Typography color="text.secondary" variant="body2">
                        {item.description}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default DashboardPage;
