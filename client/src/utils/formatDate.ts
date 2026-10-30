import dayjs from "dayjs";

export const formatDate = (value: string | null): string => {
  if (!value) {
    return "";
  }

  const date = dayjs(value);

  return date.isValid() ? date.format("DD MMM YYYY") : "";
};
