import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
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
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import MonitorWeightOutlinedIcon from "@mui/icons-material/MonitorWeightOutlined";
import StraightenOutlinedIcon from "@mui/icons-material/StraightenOutlined";
import PercentOutlinedIcon from "@mui/icons-material/PercentOutlined";
import FitnessCenterOutlinedIcon from "@mui/icons-material/FitnessCenterOutlined";
import { AppHeader } from "../../components/AppHeader";
import MeasurementDialog from "../../components/measurements/MeasurementDialog";
import MeasurementProgressChart, {
  PROGRESS_METRICS,
} from "../../components/measurements/MeasurementProgressChart";
import type { ProgressMetric } from "../../components/measurements/MeasurementProgressChart";
import {
  deleteBodyMeasurement,
  getBodyMeasurementHistory,
  getTrackingErrorMessage,
  trackingQueryKeys,
} from "../../api/trackingApi";
import {
  getMyProfile,
  profileQueryKeys,
} from "../../api/profileApi";
import type { MeasurementRecord } from "../../types/tracking";

const NOT_RECORDED = "—";

const formatNumber = (
  value: number | null | undefined,
  unit = "",
): string =>
  value == null
    ? NOT_RECORDED
    : `${Number.isInteger(value) ? value : value.toFixed(1)}${unit ? ` ${unit}` : ""}`;

const latestValue = (
  record: MeasurementRecord | undefined,
  key: string,
  compositionKey?: string,
): number | null => {
  if (!record) {
    return null;
  }

  if (compositionKey) {
    const value =
      record.composition?.[compositionKey as keyof NonNullable<typeof record.composition>];
    return typeof value === "number" ? value : null;
  }

  const value = (record as unknown as Record<string, unknown>)[key];
  return typeof value === "number" ? value : null;
};

const DeltaChip = ({
  current,
  previous,
  unit,
}: {
  current: number | null;
  previous: number | null;
  unit: string;
}) => {
  if (current == null || previous == null) {
    return null;
  }

  const difference = current - previous;

  if (Math.abs(difference) < 0.05) {
    return <Chip label="No change" size="small" variant="outlined" />;
  }

  return (
    <Chip
      color={difference < 0 ? "success" : "default"}
      label={`${difference > 0 ? "+" : ""}${difference.toFixed(1)} ${unit} vs previous`}
      size="small"
      variant="outlined"
    />
  );
};

const MeasurementPage = () => {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<MeasurementRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MeasurementRecord | null>(null);
  const [snackbar, setSnackbar] = useState<string | null>(null);
  const [metric, setMetric] = useState<ProgressMetric>("weightKg");
  const [leftId, setLeftId] = useState("");
  const [rightId, setRightId] = useState("");

  const historyQuery = useQuery({
    queryKey: trackingQueryKeys.measurements,
    queryFn: () => getBodyMeasurementHistory(100),
    retry: false,
  });
  const profileQuery = useQuery({
    queryKey: profileQueryKeys.me,
    queryFn: getMyProfile,
    retry: false,
  });

  const records = historyQuery.data ?? [];
  const latest = records[0];
  const previous = records[1];

  useEffect(() => {
    if (records.length === 0) {
      return;
    }

    setLeftId((current) =>
      records.some((record) => record.id === current) ? current : records[0]?.id ?? "",
    );
    setRightId((current) =>
      records.some((record) => record.id === current)
        ? current
        : records[1]?.id ?? records[0]?.id ?? "",
    );
  }, [records]);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBodyMeasurement(id),
    onSuccess: async (result) => {
      if (!result.success) {
        setSnackbar(result.message);
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: trackingQueryKeys.measurements,
      });
      await queryClient.invalidateQueries({ queryKey: profileQueryKeys.me });
      await queryClient.invalidateQueries({ queryKey: profileQueryKeys.dashboard });
      setDeleteTarget(null);
      setSnackbar(result.message);
    },
    onError: (mutationError: unknown) => {
      setSnackbar(getTrackingErrorMessage(mutationError));
    },
  });

  const left = records.find((record) => record.id === leftId);
  const right = records.find((record) => record.id === rightId);

  const comparisonRows = useMemo(
    () => [
      {
        label: "Weight",
        unit: "kg",
        left: latestValue(left, "weightKg"),
        right: latestValue(right, "weightKg"),
      },
      {
        label: "Waist",
        unit: "cm",
        left: latestValue(left, "waistCm"),
        right: latestValue(right, "waistCm"),
      },
      {
        label: "Hip",
        unit: "cm",
        left: latestValue(left, "hipCm"),
        right: latestValue(right, "hipCm"),
      },
      {
        label: "Chest",
        unit: "cm",
        left: latestValue(left, "chestCm"),
        right: latestValue(right, "chestCm"),
      },
      {
        label: "Body fat",
        unit: "%",
        left: latestValue(left, "bodyFatPercentage", "bodyFatPercentage"),
        right: latestValue(right, "bodyFatPercentage", "bodyFatPercentage"),
      },
      {
        label: "Muscle mass",
        unit: "kg",
        left: latestValue(left, "muscleMassKg", "muscleMassKg"),
        right: latestValue(right, "muscleMassKg", "muscleMassKg"),
      },
      {
        label: "BMI",
        unit: "",
        left: latestValue(left, "bmi", "bmi"),
        right: latestValue(right, "bmi", "bmi"),
      },
    ],
    [left, right],
  );

  const hydration = profileQuery.data?.profile?.heightCm ?? null;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppHeader />
      <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 5 } }}>
        <Button
          color="inherit"
          component={RouterLink}
          startIcon={<ArrowBackIcon />}
          sx={{ color: "text.secondary", mb: 2 }}
          to="/profile"
        >
          Back to profile
        </Button>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ alignItems: { xs: "stretch", sm: "center" }, justifyContent: "space-between", mb: 3 }}
        >
          <Box>
            <Typography sx={{ fontWeight: 800 }} variant="h4">
              Body Measurements
            </Typography>
            <Typography color="text.secondary" variant="body1">
              Every measurement is saved as a new record so you can see progress
              over time.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
            <Button component={RouterLink} to="/tracking" variant="outlined">
              Daily tracking
            </Button>
            <Button
              onClick={() => {
                setEditing(null);
                setDialogOpen(true);
              }}
              startIcon={<AddIcon />}
              variant="contained"
            >
              Add measurement
            </Button>
          </Stack>
        </Stack>

        {historyQuery.isLoading && (
          <Stack spacing={2} sx={{ alignItems: "center", py: 8 }}>
            <CircularProgress />
            <Typography color="text.secondary" variant="body2">
              Loading measurement history...
            </Typography>
          </Stack>
        )}

        {historyQuery.isError && (
          <Alert
            action={
              <Button color="inherit" onClick={() => void historyQuery.refetch()} size="small">
                Retry
              </Button>
            }
            severity="error"
            sx={{ mb: 3 }}
          >
            {getTrackingErrorMessage(historyQuery.error)}
          </Alert>
        )}

        {!historyQuery.isLoading && !historyQuery.isError && (
          <Stack spacing={3}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, minmax(0, 1fr))",
                  md: "repeat(4, minmax(0, 1fr))",
                },
                gap: 1.5,
              }}
            >
              {[
                {
                  label: "Weight",
                  value: latestValue(latest, "weightKg"),
                  unit: "kg",
                  previous: latestValue(previous, "weightKg"),
                  icon: <MonitorWeightOutlinedIcon color="primary" />,
                },
                {
                  label: "Waist",
                  value: latestValue(latest, "waistCm"),
                  unit: "cm",
                  previous: latestValue(previous, "waistCm"),
                  icon: <StraightenOutlinedIcon color="primary" />,
                },
                {
                  label: "Body fat",
                  value: latestValue(latest, "bodyFatPercentage", "bodyFatPercentage"),
                  unit: "%",
                  previous: latestValue(previous, "bodyFatPercentage", "bodyFatPercentage"),
                  icon: <PercentOutlinedIcon color="primary" />,
                },
                {
                  label: "Muscle mass",
                  value: latestValue(latest, "muscleMassKg", "muscleMassKg"),
                  unit: "kg",
                  previous: latestValue(previous, "muscleMassKg", "muscleMassKg"),
                  icon: <FitnessCenterOutlinedIcon color="primary" />,
                },
              ].map((item) => (
                <Card elevation={0} key={item.label} variant="outlined" sx={{ borderRadius: 3 }}>
                  <CardContent sx={{ p: 2 }}>
                    <Stack spacing={1}>
                      {item.icon}
                      <Box>
                        <Typography color="text.secondary" variant="caption">
                          {item.label}
                        </Typography>
                        <Typography sx={{ fontWeight: 800 }} variant="h6">
                          {formatNumber(item.value, item.unit)}
                        </Typography>
                      </Box>
                      <DeltaChip current={item.value} previous={item.previous} unit={item.unit} />
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Box>

            {latest ? (
              <Typography color="text.secondary" variant="body2">
                Latest record: {latest.measuredAt ? dayjs(latest.measuredAt).format("DD MMM YYYY") : dayjs(latest.createdAt).format("DD MMM YYYY")}
                {latest.source ? ` · ${latest.source}` : ""}
              </Typography>
            ) : (
              <Alert severity="info">
                No measurements yet. Add your first record to start tracking
                progress.
              </Alert>
            )}

            <Card elevation={0} variant="outlined">
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  sx={{ alignItems: { xs: "stretch", sm: "center" }, justifyContent: "space-between", mb: 2 }}
                >
                  <Typography sx={{ fontWeight: 700 }} variant="h6">
                    Progress
                  </Typography>
                  <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel>Metric</InputLabel>
                    <Select
                      label="Metric"
                      onChange={(event) => setMetric(event.target.value as ProgressMetric)}
                      value={metric}
                    >
                      {PROGRESS_METRICS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
                <MeasurementProgressChart metric={metric} records={records} />
              </CardContent>
            </Card>

            <Card elevation={0} variant="outlined">
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography sx={{ fontWeight: 700, mb: 2 }} variant="h6">
                  Compare records
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <FormControl fullWidth size="small">
                    <InputLabel>First record</InputLabel>
                    <Select
                      label="First record"
                      onChange={(event) => setLeftId(event.target.value)}
                      value={leftId}
                    >
                      {records.map((record) => (
                        <MenuItem key={record.id} value={record.id}>
                          {record.measuredAt ? dayjs(record.measuredAt).format("DD MMM YYYY") : dayjs(record.createdAt).format("DD MMM YYYY")}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth size="small">
                    <InputLabel>Second record</InputLabel>
                    <Select
                      label="Second record"
                      onChange={(event) => setRightId(event.target.value)}
                      value={rightId}
                    >
                      {records.map((record) => (
                        <MenuItem key={record.id} value={record.id}>
                          {record.measuredAt ? dayjs(record.measuredAt).format("DD MMM YYYY") : dayjs(record.createdAt).format("DD MMM YYYY")}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                {records.length < 2 ? (
                  <Typography color="text.secondary" variant="body2">
                    Add at least two records to compare changes.
                  </Typography>
                ) : (
                  <Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
                    <Box component="thead">
                      <Box component="tr">
                        {["Metric", "First", "Second", "Change"].map((heading) => (
                          <Box
                            component="th"
                            key={heading}
                            sx={{
                              textAlign: "left",
                              py: 1,
                              borderBottom: 1,
                              borderColor: "divider",
                              fontSize: 13,
                              color: "text.secondary",
                            }}
                          >
                            {heading}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                    <Box component="tbody">
                      {comparisonRows.map((row) => {
                        const change =
                          row.left != null && row.right != null
                            ? row.right - row.left
                            : null;

                        return (
                          <Box component="tr" key={row.label}>
                            <Box component="td" sx={{ py: 1.1, borderBottom: 1, borderColor: "divider" }}>
                              {row.label}
                            </Box>
                            <Box component="td" sx={{ py: 1.1, borderBottom: 1, borderColor: "divider" }}>
                              {formatNumber(row.left, row.unit)}
                            </Box>
                            <Box component="td" sx={{ py: 1.1, borderBottom: 1, borderColor: "divider" }}>
                              {formatNumber(row.right, row.unit)}
                            </Box>
                            <Box
                              component="td"
                              sx={{
                                py: 1.1,
                                borderBottom: 1,
                                borderColor: "divider",
                                color: change == null ? "text.secondary" : change < 0 ? "success.main" : "text.primary",
                                fontWeight: 600,
                              }}
                            >
                              {change == null
                                ? NOT_RECORDED
                                : `${change > 0 ? "+" : ""}${change.toFixed(1)}${row.unit ? ` ${row.unit}` : ""}`}
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>

            <Box>
              <Typography sx={{ fontWeight: 700, mb: 1.5 }} variant="h6">
                History
              </Typography>
              {records.length === 0 ? (
                <Card elevation={0} variant="outlined" sx={{ p: 4, textAlign: "center" }}>
                  <Typography color="text.secondary" variant="body2">
                    Your measurement history will appear here.
                  </Typography>
                </Card>
              ) : (
                <Stack spacing={1.5}>
                  {records.map((record) => (
                    <Card elevation={0} key={record.id} variant="outlined">
                      <CardContent sx={{ p: 2 }}>
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          spacing={2}
                          sx={{ justifyContent: "space-between" }}
                        >
                          <Box>
                            <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap", rowGap: 1 }}>
                              <Typography sx={{ fontWeight: 700 }}>
                                {record.measuredAt ? dayjs(record.measuredAt).format("DD MMM YYYY") : dayjs(record.createdAt).format("DD MMM YYYY")}
                              </Typography>
                              {record.id === latest?.id && <Chip color="primary" label="Latest" size="small" />}
                              {record.source && <Chip label={record.source} size="small" variant="outlined" />}
                            </Stack>
                            <Typography color="text.secondary" sx={{ mt: 0.75 }} variant="body2">
                              Weight {formatNumber(record.weightKg, "kg")} · Waist {formatNumber(record.waistCm, "cm")} · Hip {formatNumber(record.hipCm, "cm")}
                            </Typography>
                            {(record.composition?.bodyFatPercentage != null ||
                              record.composition?.muscleMassKg != null ||
                              record.composition?.bmi != null) && (
                              <Typography color="text.secondary" sx={{ mt: 0.25 }} variant="body2">
                                Body fat {formatNumber(record.composition?.bodyFatPercentage, "%")} · Muscle {formatNumber(record.composition?.muscleMassKg, "kg")} · BMI {formatNumber(record.composition?.bmi)}
                              </Typography>
                            )}
                            {record.notes && (
                              <Typography color="text.secondary" sx={{ mt: 0.5 }} variant="caption">
                                {record.notes}
                              </Typography>
                            )}
                          </Box>
                          <Stack direction="row" spacing={0.5}>
                            <IconButton
                              aria-label="Edit measurement"
                              onClick={() => {
                                setEditing(record);
                                setDialogOpen(true);
                              }}
                              size="small"
                            >
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              aria-label="Delete measurement"
                              color="error"
                              onClick={() => setDeleteTarget(record)}
                              size="small"
                            >
                              <DeleteOutlineOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              )}
            </Box>
          </Stack>
        )}
      </Container>

      <MeasurementDialog
        defaultHeight={hydration}
        initial={editing}
        onClose={() => setDialogOpen(false)}
        onSaved={(message) => setSnackbar(message)}
        open={dialogOpen}
      />

      <Dialog onClose={() => setDeleteTarget(null)} open={Boolean(deleteTarget)}>
        <DialogTitle sx={{ fontWeight: 800 }}>Delete measurement?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Remove the record from{" "}
            {deleteTarget?.measuredAt
              ? dayjs(deleteTarget.measuredAt).format("DD MMM YYYY")
              : "this date"}
            ? This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button disabled={deleteMutation.isPending} onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button
            color="error"
            disabled={deleteMutation.isPending}
            onClick={() => {
              if (deleteTarget) {
                deleteMutation.mutate(deleteTarget.id);
              }
            }}
            variant="contained"
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
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

export default MeasurementPage;
