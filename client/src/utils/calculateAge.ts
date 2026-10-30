import dayjs from "dayjs";

export const calculateAge = (dateOfBirth: string | null): number | null => {
  if (!dateOfBirth) {
    return null;
  }

  const birthDate = dayjs(dateOfBirth);

  if (!birthDate.isValid() || birthDate.isAfter(dayjs(), "day")) {
    return null;
  }

  return dayjs().diff(birthDate, "year");
};
