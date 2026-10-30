import dayjs from "dayjs";

export const calculateDuration = (
  startDate: string | null,
  endDate: string | null,
): string => {
  if (!startDate || !endDate) {
    return "";
  }

  const start = dayjs(startDate);
  const end = dayjs(endDate);

  if (!start.isValid() || !end.isValid() || end.isBefore(start, "day")) {
    return "";
  }

  const days = end.diff(start, "day") + 1;

  return `${days} ${days === 1 ? "day" : "days"}`;
};
