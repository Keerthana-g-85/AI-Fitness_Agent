import dayjs from "dayjs";

export const isPositiveNumber = (value: string): boolean => {
  if (value.trim() === "") {
    return false;
  }

  const numberValue = Number(value);

  return Number.isFinite(numberValue) && numberValue > 0;
};

export const isNonNegativeNumber = (value: string): boolean => {
  if (value.trim() === "") {
    return true;
  }

  const numberValue = Number(value);

  return Number.isFinite(numberValue) && numberValue >= 0;
};

export const isPercentage = (value: string): boolean => {
  if (value.trim() === "") {
    return true;
  }

  const numberValue = Number(value);

  return (
    Number.isFinite(numberValue) && numberValue >= 0 && numberValue <= 100
  );
};

export const isOvernightShift = (
  startTime: string | null,
  endTime: string | null,
): boolean => Boolean(startTime && endTime && endTime < startTime);

export const isFutureDate = (value: string | null): boolean => {
  if (!value) {
    return true;
  }

  const date = dayjs(value);

  return date.isValid() && date.startOf("day").isAfter(dayjs().startOf("day"));
};

export const isNotFutureDate = (value: string | null): boolean => {
  if (!value) {
    return true;
  }

  const date = dayjs(value);

  return date.isValid() && !date.startOf("day").isAfter(dayjs().startOf("day"));
};
