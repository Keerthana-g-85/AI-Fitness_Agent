import dayjs from "dayjs";

export const formatTime = (value: string | null): string => {
  if (!value) {
    return "";
  }

  const time = dayjs(`2000-01-01T${value}`);

  return time.isValid() ? time.format("hh:mm A") : "";
};
