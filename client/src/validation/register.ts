export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export type RegisterField = keyof RegisterFormValues;

export type RegisterErrors = Partial<Record<RegisterField, string>>;

export const EMPTY_REGISTER_FORM: RegisterFormValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_LENGTH_REGEX = /.{8,}/;
const UPPERCASE_REGEX = /[A-Z]/;
const LOWERCASE_REGEX = /[a-z]/;
const NUMBER_REGEX = /[0-9]/;
const SPECIAL_CHARACTER_REGEX = /[!@#$%^&*(),.?":{}|<>_\-+=\\[\]\/;'`~]/;

const validateName = (value: string): string | undefined => {
  if (!value.trim()) {
    return "Name is required";
  }

  return undefined;
};

const validateEmail = (value: string): string | undefined => {
  const email = value.trim();

  if (!email) {
    return "Email is required";
  }

  if (!EMAIL_REGEX.test(email)) {
    return "Enter a valid email address";
  }

  return undefined;
};

const validatePassword = (value: string): string | undefined => {
  if (!value) {
    return "Password is required";
  }

  if (!MIN_LENGTH_REGEX.test(value)) {
    return "Password must be at least 8 characters";
  }

  if (!UPPERCASE_REGEX.test(value)) {
    return "Password must contain at least one uppercase letter";
  }

  if (!LOWERCASE_REGEX.test(value)) {
    return "Password must contain at least one lowercase letter";
  }

  if (!NUMBER_REGEX.test(value)) {
    return "Password must contain at least one number";
  }

  if (!SPECIAL_CHARACTER_REGEX.test(value)) {
    return "Password must contain at least one special character";
  }

  return undefined;
};

const validateConfirmPassword = (
  value: string,
  password: string,
): string | undefined => {
  if (!value) {
    return "Confirm password is required";
  }

  if (value !== password) {
    return "Passwords do not match";
  }

  return undefined;
};

export const validateField = (
  field: RegisterField,
  values: RegisterFormValues,
): string | undefined => {
  switch (field) {
    case "name":
      return validateName(values.name);
    case "email":
      return validateEmail(values.email);
    case "password":
      return validatePassword(values.password);
    case "confirmPassword":
      return validateConfirmPassword(values.confirmPassword, values.password);
  }
};

export const validateRegisterForm = (
  values: RegisterFormValues,
): RegisterErrors => {
  const errors: RegisterErrors = {};

  (Object.keys(values) as RegisterField[]).forEach((field) => {
    const error = validateField(field, values);

    if (error) {
      errors[field] = error;
    }
  });

  return errors;
};
