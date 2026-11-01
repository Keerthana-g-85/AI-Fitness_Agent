import { useState } from "react";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import FitnessCenterOutlinedIcon from "@mui/icons-material/FitnessCenterOutlined";
import BedtimeOutlinedIcon from "@mui/icons-material/BedtimeOutlined";
import SportsSoccerOutlinedIcon from "@mui/icons-material/SportsSoccerOutlined";
import StraightenOutlinedIcon from "@mui/icons-material/StraightenOutlined";
import { AppHeader } from "../../components/AppHeader";
import { DateField } from "../../components/onboarding/DateField";
import FoodDialog from "../../components/tracking/FoodDialog";
import WaterDialog from "../../components/tracking/WaterDialog";
import WorkoutDialog from "../../components/tracking/WorkoutDialog";
import SleepDialog from "../../components/tracking/SleepDialog";
import SportsDialog from "../../components/tracking/SportsDialog";
import {
  deleteFoodIntake,
  deleteSleepRecord,
  deleteSportsActivity,
  deleteWaterIntake,
  deleteWorkout,
  getDailyTracking,
  getTrackingErrorMessage,
  trackingQueryKeys,
} from "../../api/trackingApi";
import type {
  FoodIntake,
  SleepRecord,
  SportsActivity,
  WaterIntake,
  WorkoutSession,
} from "../../types/tracking";

type DeleteTarget =
  | { type: "food"; id: string; label: string }
  | { type: "water"; id: string; label: string }
  | { type: "workout"; id: string; label: string }
  | { type: "sleep"; id: string; label: string }
  | { type: "sport"; id: string; label: string };

const formatNumber = (value: number, unit = ""): string =>
  `${Number.isInteger(value) ? value : value.toFixed(1)}${unit ? ` ${unit}` : ""}`;

const formatMinutes = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;

  if (hours === 0) {
    return `${remaining} min`;
  }

  return remaining === 0 ? `${hours} hr` : `${hours} hr ${remaining} min`;
};

const capitalize = (value: string): string =>
  value.charAt(0).toUpperCase() + value.slice(1);

const EmptyTab = ({ message }: { message: string }) => (
  <Card elevation={0} variant="outlined" sx={{ p: 4, textAlign: "center" }}>
    <Typography color="text.secondary" variant="body2">
      {message}
    </Typography>
  </Card>
);

const ItemActions = ({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <Stack direction="row" spacing={0.5}>
    <IconButton aria-label="Edit entry" onClick={onEdit} size="small">
      <EditOutlinedIcon fontSize="small" />
    </IconButton>
    <IconButton aria-label="Delete entry" color="error" onClick={onDelete} size="small">
      <DeleteOutlineOutlinedIcon fontSize="small" />
    </IconButton>
  </Stack>
);

const DailyTrackingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialDate = searchParams.get("date");
  const [date, setDate] = useState(
    initialDate && dayjs(initialDate).isValid()
      ? dayjs(initialDate).format("YYYY-MM-DD")
      : dayjs().format("YYYY-MM-DD"),
  );
  const [tab, setTab] = useState(0);
  const [snackbar, setSnackbar] = useState<string | null>(null);
  const [foodOpen, setFoodOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodIntake | null>(null);
  const [waterOpen, setWaterOpen] = useState(false);
  const [editingWater, setEditingWater] = useState<WaterIntake | null>(null);
  const [workoutOpen, setWorkoutOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<WorkoutSession | null>(null);
  const [sleepOpen, setSleepOpen] = useState(false);
  const [editingSleep, setEditingSleep] = useState<SleepRecord | null>(null);
  const [sportOpen, setSportOpen] = useState(false);
  const [editingSport, setEditingSport] = useState<SportsActivity | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

  const queryClient = useQueryClient();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: trackingQueryKeys.daily(date),
    queryFn: () => getDailyTracking(date),
    retry: false,
  });

  const changeDate = (nextDate: string): void => {
    setDate(nextDate);
    setSearchParams({ date: nextDate }, { replace: true });
  };

  const refreshDate = async (): Promise<void> => {
    await queryClient.invalidateQueries({ queryKey: trackingQueryKeys.daily(date) });
    await queryClient.invalidateQueries({ queryKey: trackingQueryKeys.measurements });
  };

  const deletion = useMutation({
    mutationFn: async (target: DeleteTarget) => {
      switch (target.type) {
        case "food":
          return deleteFoodIntake(target.id);
        case "water":
          return deleteWaterIntake(target.id);
        case "workout":
          return deleteWorkout(target.id);
        case "sleep":
          return deleteSleepRecord(target.id);
        case "sport":
          return deleteSportsActivity(target.id);
      }
    },
    onSuccess: async (result) => {
      if (!result.success) {
        setSnackbar(result.message);
        return;
      }

      await refreshDate();
      setDeleteTarget(null);
      setSnackbar(result.message);
    },
    onError: (mutationError: unknown) => {
      setSnackbar(getTrackingErrorMessage(mutationError));
    },
  });

  const notifySaved = async (message: string): Promise<void> => {
    await refreshDate();
    setSnackbar(message);
  };

  const isToday = date === dayjs().format("YYYY-MM-DD");
  const daily = data;

  const summaryItems = [
    {
      label: "Calories eaten",
      value: formatNumber(daily?.totalCaloriesConsumed ?? 0, "kcal"),
      icon: <RestaurantOutlinedIcon color="primary" />,
    },
    {
      label: "Water",
      value: `${(daily?.totalWaterMl ?? 0).toLocaleString()} ml`,
      icon: <WaterDropOutlinedIcon color="primary" />,
      hint: daily?.dailyWaterTargetMl
        ? `Target ${daily.dailyWaterTargetMl.toLocaleString()} ml`
        : undefined,
    },
    {
      label: "Workout calories",
      value: formatNumber(daily?.totalWorkoutCalories ?? 0, "kcal"),
      icon: <FitnessCenterOutlinedIcon color="primary" />,
    },
    {
      label: "Sleep",
      value: daily?.sleepRecord
        ? formatMinutes(daily.sleepRecord.durationMinutes)
        : "Not logged",
      icon: <BedtimeOutlinedIcon color="primary" />,
      hint: daily?.sleepGoalMinutes
        ? `Goal ${formatMinutes(daily.sleepGoalMinutes)}`
        : undefined,
    },
    {
      label: "Sports calories",
      value: formatNumber(daily?.totalSportCalories ?? 0, "kcal"),
      icon: <SportsSoccerOutlinedIcon color="primary" />,
    },
  ];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppHeader />
      <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 5 } }}>
        <Stack spacing={3}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ alignItems: { xs: "stretch", sm: "center" }, justifyContent: "space-between" }}
          >
            <Box>
              <Typography sx={{ fontWeight: 800 }} variant="h4">
                Daily Tracking
              </Typography>
              <Typography color="text.secondary" variant="body1">
                Log food, water, workouts, sleep and sports in one place.
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
              <Button
                component={RouterLink}
                startIcon={<StraightenOutlinedIcon />}
                to="/profile/measurements"
                variant="outlined"
              >
                Measurements
              </Button>
              <Button component={RouterLink} to="/profile" variant="outlined">
                Profile
              </Button>
            </Stack>
          </Stack>

          <Card elevation={0} variant="outlined">
            <CardContent sx={{ p: 2 }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                sx={{ alignItems: { xs: "stretch", sm: "center" } }}
              >
                <IconButton
                  aria-label="Previous day"
                  onClick={() => changeDate(dayjs(date).subtract(1, "day").format("YYYY-MM-DD"))}
                >
                  <ArrowBackIosNewIcon fontSize="small" />
                </IconButton>
                <Box sx={{ minWidth: 220 }}>
                  <DateField
                    disableFuture
                    label="Tracking date"
                    onChange={(value) => {
                      if (value) {
                        changeDate(value);
                      }
                    }}
                    value={date}
                  />
                </Box>
                <IconButton
                  aria-label="Next day"
                  disabled={isToday}
                  onClick={() => changeDate(dayjs(date).add(1, "day").format("YYYY-MM-DD"))}
                >
                  <ArrowForwardIosIcon fontSize="small" />
                </IconButton>
                <Button
                  disabled={isToday}
                  onClick={() => changeDate(dayjs().format("YYYY-MM-DD"))}
                  size="small"
                >
                  Today
                </Button>
                <Box sx={{ flexGrow: 1 }} />
                <Typography color="text.secondary" variant="body2">
                  {dayjs(date).format("dddd, DD MMMM YYYY")}
                </Typography>
              </Stack>
            </CardContent>
          </Card>

          {isError && (
            <Alert
              action={
                <Button color="inherit" onClick={() => void refetch()} size="small">
                  Retry
                </Button>
              }
              severity="error"
            >
              {getTrackingErrorMessage(error)}
            </Alert>
          )}

          {isLoading ? (
            <Stack spacing={2} sx={{ alignItems: "center", py: 8 }}>
              <CircularProgress />
              <Typography color="text.secondary" variant="body2">
                Loading your day...
              </Typography>
            </Stack>
          ) : (
            <>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(2, minmax(0, 1fr))",
                    md: "repeat(5, minmax(0, 1fr))",
                  },
                  gap: 1.5,
                }}
              >
                {summaryItems.map((item) => (
                  <Card elevation={0} key={item.label} variant="outlined" sx={{ borderRadius: 3 }}>
                    <CardContent sx={{ p: 2 }}>
                      <Stack spacing={1}>
                        <Box sx={{ color: "primary.main" }}>{item.icon}</Box>
                        <Box>
                          <Typography color="text.secondary" variant="caption">
                            {item.label}
                          </Typography>
                          <Typography sx={{ fontWeight: 800 }} variant="h6">
                            {item.value}
                          </Typography>
                          {item.hint && (
                            <Typography color="text.secondary" variant="caption">
                              {item.hint}
                            </Typography>
                          )}
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Box>

              <Card elevation={0} variant="outlined" sx={{ borderRadius: 3 }}>
                <Tabs
                  allowScrollButtonsMobile
                  onChange={(_, value: number) => setTab(value)}
                  value={tab}
                  variant="scrollable"
                >
                  <Tab label={`Food (${daily?.foodIntakes.length ?? 0})`} />
                  <Tab label={`Water (${daily?.waterIntakes.length ?? 0})`} />
                  <Tab label={`Workouts (${daily?.workouts.length ?? 0})`} />
                  <Tab label="Sleep" />
                  <Tab label={`Sports (${daily?.sportsActivities.length ?? 0})`} />
                </Tabs>
                <Divider />
                <Box sx={{ p: { xs: 2, sm: 3 } }}>
                  {tab === 0 && (
                    <Stack spacing={2}>
                      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                        <Typography sx={{ fontWeight: 700 }} variant="h6">
                          Food log
                        </Typography>
                        <Button
                          onClick={() => {
                            setEditingFood(null);
                            setFoodOpen(true);
                          }}
                          startIcon={<AddIcon />}
                          variant="contained"
                          size="small"
                        >
                          Add food
                        </Button>
                      </Stack>
                      {!daily || daily.foodIntakes.length === 0 ? (
                        <EmptyTab message="No food logged for this day." />
                      ) : (
                        daily.foodIntakes.map((food) => (
                          <Card elevation={0} key={food.id} variant="outlined">
                            <CardContent sx={{ p: 2 }}>
                              <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between" }}>
                                <Box>
                                  <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap", rowGap: 1 }}>
                                    <Typography sx={{ fontWeight: 700 }}>{food.foodName}</Typography>
                                    <Chip label={capitalize(food.mealType)} size="small" />
                                    {food.servingSize && (
                                      <Typography color="text.secondary" variant="caption">
                                        {food.servingSize}
                                      </Typography>
                                    )}
                                  </Stack>
                                  <Typography color="text.secondary" sx={{ mt: 0.75 }} variant="body2">
                                    {formatNumber(food.calories, "kcal")}
                                    {food.proteinG != null && ` · Protein ${formatNumber(food.proteinG, "g")}`}
                                    {food.carbsG != null && ` · Carbs ${formatNumber(food.carbsG, "g")}`}
                                    {food.fatG != null && ` · Fat ${formatNumber(food.fatG, "g")}`}
                                  </Typography>
                                  {food.notes && (
                                    <Typography color="text.secondary" sx={{ mt: 0.5 }} variant="caption">
                                      {food.notes}
                                    </Typography>
                                  )}
                                </Box>
                                <ItemActions
                                  onDelete={() =>
                                    setDeleteTarget({ type: "food", id: food.id, label: food.foodName })
                                  }
                                  onEdit={() => {
                                    setEditingFood(food);
                                    setFoodOpen(true);
                                  }}
                                />
                              </Stack>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </Stack>
                  )}

                  {tab === 1 && (
                    <Stack spacing={2}>
                      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                        <Typography sx={{ fontWeight: 700 }} variant="h6">
                          Water log
                        </Typography>
                        <Button
                          onClick={() => {
                            setEditingWater(null);
                            setWaterOpen(true);
                          }}
                          startIcon={<AddIcon />}
                          size="small"
                          variant="contained"
                        >
                          Add water
                        </Button>
                      </Stack>
                      {!daily || daily.waterIntakes.length === 0 ? (
                        <EmptyTab message="No water logged for this day." />
                      ) : (
                        daily.waterIntakes.map((water) => (
                          <Card elevation={0} key={water.id} variant="outlined">
                            <CardContent sx={{ p: 2 }}>
                              <Stack direction="row" spacing={2} sx={{ alignItems: "center", justifyContent: "space-between" }}>
                                <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                                  <WaterDropOutlinedIcon color="primary" />
                                  <Box>
                                    <Typography sx={{ fontWeight: 700 }}>
                                      {water.amountMl.toLocaleString()} ml
                                    </Typography>
                                    <Typography color="text.secondary" variant="caption">
                                      {dayjs(water.createdAt).format("hh:mm A")}
                                      {water.notes ? ` · ${water.notes}` : ""}
                                    </Typography>
                                  </Box>
                                </Stack>
                                <ItemActions
                                  onDelete={() =>
                                    setDeleteTarget({ type: "water", id: water.id, label: "water entry" })
                                  }
                                  onEdit={() => {
                                    setEditingWater(water);
                                    setWaterOpen(true);
                                  }}
                                />
                              </Stack>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </Stack>
                  )}

                  {tab === 2 && (
                    <Stack spacing={2}>
                      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                        <Typography sx={{ fontWeight: 700 }} variant="h6">
                          Workouts
                        </Typography>
                        <Button
                          onClick={() => {
                            setEditingWorkout(null);
                            setWorkoutOpen(true);
                          }}
                          startIcon={<AddIcon />}
                          size="small"
                          variant="contained"
                        >
                          Log workout
                        </Button>
                      </Stack>
                      {!daily || daily.workouts.length === 0 ? (
                        <EmptyTab message="No workouts logged for this day." />
                      ) : (
                        daily.workouts.map((workout) => (
                          <Card elevation={0} key={workout.id} variant="outlined">
                            <CardContent sx={{ p: 2 }}>
                              <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between" }}>
                                <Box sx={{ flexGrow: 1 }}>
                                  <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap", rowGap: 1 }}>
                                    <Typography sx={{ fontWeight: 700 }}>{workout.name}</Typography>
                                    <Chip label={capitalize(workout.workoutType.replace("_", " "))} size="small" />
                                    {workout.intensity && <Chip label={capitalize(workout.intensity)} size="small" variant="outlined" />}
                                  </Stack>
                                  <Typography color="text.secondary" sx={{ mt: 0.75 }} variant="body2">
                                    {formatMinutes(workout.durationMinutes)}
                                    {workout.caloriesBurned != null && ` · ${formatNumber(workout.caloriesBurned, "kcal")}`}
                                  </Typography>
                                  {workout.exercises.length > 0 && (
                                    <Stack spacing={0.5} sx={{ mt: 1.25 }}>
                                      {workout.exercises.map((exercise) => (
                                        <Typography color="text.secondary" key={exercise.id} variant="body2">
                                          {exercise.exerciseName}
                                          {exercise.sets != null && exercise.reps != null
                                            ? ` · ${exercise.sets} × ${exercise.reps}`
                                            : ""}
                                          {exercise.weightKg != null ? ` · ${formatNumber(exercise.weightKg, "kg")}` : ""}
                                          {exercise.durationMinutes != null ? ` · ${formatMinutes(exercise.durationMinutes)}` : ""}
                                          {exercise.distanceKm != null ? ` · ${formatNumber(exercise.distanceKm, "km")}` : ""}
                                        </Typography>
                                      ))}
                                    </Stack>
                                  )}
                                  {workout.notes && (
                                    <Typography color="text.secondary" sx={{ mt: 0.75 }} variant="caption">
                                      {workout.notes}
                                    </Typography>
                                  )}
                                </Box>
                                <ItemActions
                                  onDelete={() =>
                                    setDeleteTarget({ type: "workout", id: workout.id, label: workout.name })
                                  }
                                  onEdit={() => {
                                    setEditingWorkout(workout);
                                    setWorkoutOpen(true);
                                  }}
                                />
                              </Stack>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </Stack>
                  )}

                  {tab === 3 && (
                    <Stack spacing={2}>
                      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                        <Typography sx={{ fontWeight: 700 }} variant="h6">
                          Sleep
                        </Typography>
                        <Button
                          onClick={() => {
                            setEditingSleep(daily?.sleepRecord ?? null);
                            setSleepOpen(true);
                          }}
                          startIcon={<AddIcon />}
                          size="small"
                          variant="contained"
                        >
                          {daily?.sleepRecord ? "Edit sleep" : "Log sleep"}
                        </Button>
                      </Stack>
                      {!daily?.sleepRecord ? (
                        <EmptyTab message="No sleep logged for this day." />
                      ) : (
                        <Card elevation={0} variant="outlined">
                          <CardContent sx={{ p: 2 }}>
                            <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between" }}>
                              <Box>
                                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                                  <BedtimeOutlinedIcon color="primary" />
                                  <Typography sx={{ fontWeight: 700 }} variant="h6">
                                    {formatMinutes(daily.sleepRecord.durationMinutes)}
                                  </Typography>
                                  {daily.sleepRecord.quality && (
                                    <Chip label={capitalize(daily.sleepRecord.quality)} size="small" />
                                  )}
                                </Stack>
                                <Typography color="text.secondary" sx={{ mt: 0.75 }} variant="body2">
                                  {daily.sleepRecord.bedTime ? `Bed ${daily.sleepRecord.bedTime}` : ""}
                                  {daily.sleepRecord.bedTime && daily.sleepRecord.wakeTime ? " · " : ""}
                                  {daily.sleepRecord.wakeTime ? `Wake ${daily.sleepRecord.wakeTime}` : ""}
                                </Typography>
                                {daily.sleepRecord.notes && (
                                  <Typography color="text.secondary" sx={{ mt: 0.5 }} variant="caption">
                                    {daily.sleepRecord.notes}
                                  </Typography>
                                )}
                              </Box>
                              <ItemActions
                                onDelete={() =>
                                  setDeleteTarget({ type: "sleep", id: daily.sleepRecord?.id ?? "", label: "sleep record" })
                                }
                                onEdit={() => {
                                  setEditingSleep(daily.sleepRecord ?? null);
                                  setSleepOpen(true);
                                }}
                              />
                            </Stack>
                          </CardContent>
                        </Card>
                      )}
                    </Stack>
                  )}

                  {tab === 4 && (
                    <Stack spacing={2}>
                      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                        <Typography sx={{ fontWeight: 700 }} variant="h6">
                          Sports
                        </Typography>
                        <Button
                          onClick={() => {
                            setEditingSport(null);
                            setSportOpen(true);
                          }}
                          startIcon={<AddIcon />}
                          size="small"
                          variant="contained"
                        >
                          Log sport
                        </Button>
                      </Stack>
                      {!daily || daily.sportsActivities.length === 0 ? (
                        <EmptyTab message="No sports activities logged for this day." />
                      ) : (
                        daily.sportsActivities.map((sport) => (
                          <Card elevation={0} key={sport.id} variant="outlined">
                            <CardContent sx={{ p: 2 }}>
                              <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between" }}>
                                <Box>
                                  <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap", rowGap: 1 }}>
                                    <Typography sx={{ fontWeight: 700 }}>{sport.sportName}</Typography>
                                    {sport.intensity && <Chip label={capitalize(sport.intensity)} size="small" />}
                                  </Stack>
                                  <Typography color="text.secondary" sx={{ mt: 0.75 }} variant="body2">
                                    {formatMinutes(sport.durationMinutes)}
                                    {sport.caloriesBurned != null && ` · ${formatNumber(sport.caloriesBurned, "kcal")}`}
                                    {sport.location ? ` · ${sport.location}` : ""}
                                  </Typography>
                                  {sport.notes && (
                                    <Typography color="text.secondary" sx={{ mt: 0.5 }} variant="caption">
                                      {sport.notes}
                                    </Typography>
                                  )}
                                </Box>
                                <ItemActions
                                  onDelete={() =>
                                    setDeleteTarget({ type: "sport", id: sport.id, label: sport.sportName })
                                  }
                                  onEdit={() => {
                                    setEditingSport(sport);
                                    setSportOpen(true);
                                  }}
                                />
                              </Stack>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </Stack>
                  )}
                </Box>
              </Card>
            </>
          )}
        </Stack>
      </Container>

      <FoodDialog
        date={date}
        initial={editingFood}
        onClose={() => setFoodOpen(false)}
        onSaved={(message) => void notifySaved(message)}
        open={foodOpen}
      />
      <WaterDialog
        date={date}
        initial={editingWater}
        onClose={() => setWaterOpen(false)}
        onSaved={(message) => void notifySaved(message)}
        open={waterOpen}
      />
      <WorkoutDialog
        date={date}
        initial={editingWorkout}
        onClose={() => setWorkoutOpen(false)}
        onSaved={(message) => void notifySaved(message)}
        open={workoutOpen}
      />
      <SleepDialog
        date={date}
        initial={editingSleep}
        onClose={() => setSleepOpen(false)}
        onSaved={(message) => void notifySaved(message)}
        open={sleepOpen}
      />
      <SportsDialog
        date={date}
        initial={editingSport}
        onClose={() => setSportOpen(false)}
        onSaved={(message) => void notifySaved(message)}
        open={sportOpen}
      />

      <Dialog onClose={() => setDeleteTarget(null)} open={Boolean(deleteTarget)}>
        <DialogTitle sx={{ fontWeight: 800 }}>Delete entry?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Remove {deleteTarget?.label} from this day? This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button disabled={deletion.isPending} onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button
            color="error"
            disabled={deletion.isPending}
            onClick={() => {
              if (deleteTarget) {
                deletion.mutate(deleteTarget);
              }
            }}
            variant="contained"
          >
            {deletion.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        autoHideDuration={4000}
        onClose={() => setSnackbar(null)}
        open={Boolean(snackbar)}
      >
        <Alert onClose={() => setSnackbar(null)} severity="success">
          {snackbar}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DailyTrackingPage;
