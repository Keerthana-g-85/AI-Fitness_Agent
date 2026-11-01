import { Box, Card, CardContent, Typography } from "@mui/material";
import type { MeasurementRecord } from "../../types/tracking";

export type ProgressMetric =
  | "weightKg"
  | "waistCm"
  | "bodyFatPercentage"
  | "muscleMassKg"
  | "bmi";

export const PROGRESS_METRICS: ReadonlyArray<{
  value: ProgressMetric;
  label: string;
  unit: string;
  from: "measurement" | "composition";
}> = [
  { value: "weightKg", label: "Weight", unit: "kg", from: "measurement" },
  { value: "waistCm", label: "Waist", unit: "cm", from: "measurement" },
  {
    value: "bodyFatPercentage",
    label: "Body fat",
    unit: "%",
    from: "composition",
  },
  {
    value: "muscleMassKg",
    label: "Muscle mass",
    unit: "kg",
    from: "composition",
  },
  { value: "bmi", label: "BMI", unit: "", from: "composition" },
];

const getValue = (
  record: MeasurementRecord,
  metric: ProgressMetric,
  source: "measurement" | "composition",
): number | null => {
  if (source === "composition") {
    const value = record.composition?.[metric as keyof typeof record.composition];
    return typeof value === "number" ? value : null;
  }

  const value = (record as unknown as Record<string, unknown>)[metric];
  return typeof value === "number" ? value : null;
};

interface MeasurementProgressChartProps {
  records: MeasurementRecord[];
  metric: ProgressMetric;
}

const WIDTH = 720;
const HEIGHT = 260;
const PADDING_X = 52;
const PADDING_Y = 32;

const MeasurementProgressChart = ({
  records,
  metric,
}: MeasurementProgressChartProps) => {
  const meta = PROGRESS_METRICS.find((item) => item.value === metric);
  const points = [...records]
    .reverse()
    .map((record) => ({
      date: record.measuredAt ?? record.createdAt.slice(0, 10),
      value: getValue(record, metric, meta?.from ?? "measurement"),
    }))
    .filter((point): point is { date: string; value: number } => point.value !== null);

  if (!meta) {
    return null;
  }

  if (points.length < 2) {
    return (
      <Card elevation={0} variant="outlined">
        <CardContent sx={{ p: 4, textAlign: "center" }}>
          <Typography color="text.secondary" variant="body2">
            Add at least two records with {meta.label.toLowerCase()} to see your
            progress chart.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const values = points.map((point) => point.value);
  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const spread = rawMax - rawMin || Math.max(rawMax * 0.1, 1);
  const min = rawMin - spread * 0.12;
  const max = rawMax + spread * 0.12;
  const plotWidth = WIDTH - PADDING_X * 2;
  const plotHeight = HEIGHT - PADDING_Y * 2;
  const xFor = (index: number): number =>
    PADDING_X + (points.length === 1 ? plotWidth / 2 : (index / (points.length - 1)) * plotWidth);
  const yFor = (value: number): number =>
    PADDING_Y + ((max - value) / (max - min)) * plotHeight;
  const linePoints = points
    .map((point, index) => `${xFor(index)},${yFor(point.value)}`)
    .join(" ");
  const areaPoints = `${PADDING_X},${HEIGHT - PADDING_Y} ${linePoints} ${WIDTH - PADDING_X},${HEIGHT - PADDING_Y}`;

  return (
    <Card elevation={0} variant="outlined">
      <CardContent sx={{ p: 2.5 }}>
        <Typography sx={{ fontWeight: 700 }} variant="subtitle1">
          {meta.label} progress
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 1 }} variant="caption">
          {points.length} records · {points[0]?.date} to {points[points.length - 1]?.date}
        </Typography>
        <Box sx={{ width: "100%", overflowX: "auto" }}>
          <svg
            aria-label={`${meta.label} progress chart`}
            role="img"
            style={{ display: "block", width: "100%", minWidth: 480, height: "auto" }}
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          >
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = PADDING_Y + ratio * plotHeight;
              const value = max - ratio * (max - min);

              return (
                <g key={ratio}>
                  <line
                    stroke="#d9e5e2"
                    strokeDasharray="4 4"
                    x1={PADDING_X}
                    x2={WIDTH - PADDING_X}
                    y1={y}
                    y2={y}
                  />
                  <text fill="#6b807c" fontSize="11" x={8} y={y + 4}>
                    {value.toFixed(1)}
                  </text>
                </g>
              );
            })}
            <polygon fill="rgba(15, 118, 110, 0.12)" points={areaPoints} />
            <polyline
              fill="none"
              points={linePoints}
              stroke="#0f766e"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
            />
            {points.map((point, index) => (
              <g key={`${point.date}-${index}`}>
                <circle
                  cx={xFor(index)}
                  cy={yFor(point.value)}
                  fill="#ffffff"
                  r="5"
                  stroke="#0f766e"
                  strokeWidth="3"
                />
                <title>
                  {point.date}: {point.value} {meta.unit}
                </title>
              </g>
            ))}
            <text fill="#6b807c" fontSize="11" textAnchor="start" x={PADDING_X} y={HEIGHT - 8}>
              {points[0]?.date}
            </text>
            <text fill="#6b807c" fontSize="11" textAnchor="end" x={WIDTH - PADDING_X} y={HEIGHT - 8}>
              {points[points.length - 1]?.date}
            </text>
          </svg>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MeasurementProgressChart;
