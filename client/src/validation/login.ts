export interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export type LoginField = "email" | "password";

export type LoginErrors = Partial<Record<LoginField, string>>;

export const EMPTY_LOGIN_FORM: LoginFormValues = {
  email: "",
  password: "",
  rememberMe: false,
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateLoginField = (
  field: LoginField,
  values: LoginFormValues,
): string | undefined => {
  if (field === "email") {
    const email = values.email.trim();

    if (!email) {
      return "Email is required";
    }

    if (!EMAIL_REGEX.test(email)) {
      return "Enter a valid email address";
    }
  }

  if (field === "password" && !values.password) {
    return "Password is required";
  }

  return undefined;
};

export const validateLoginForm = (
  values: LoginFormValues,
): LoginErrors => {
  const errors: LoginErrors = {};

  (["email", "password"] as LoginField[]).forEach((field) => {
    const error = validateLoginField(field, values);

    if (error) {
      errors[field] = error;
    }
  });

  return errors;
};
