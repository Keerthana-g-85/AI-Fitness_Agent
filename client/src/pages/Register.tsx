import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  getRegistrationErrorMessage,
  registerUser,
} from "../api/userApi";
import type { RegisterResponse } from "../api/userApi";
import {
  EMPTY_REGISTER_FORM,
  validateField,
  validateRegisterForm,
} from "../validation/register";
import type {
  RegisterErrors,
  RegisterField,
  RegisterFormValues,
} from "../validation/register";

interface Feedback {
  severity: "success" | "error";
  message: string;
}

interface PasswordVisibilityToggleProps {
  visible: boolean;
  onToggle: () => void;
}

const PasswordVisibilityToggle = ({
  visible,
  onToggle,
}: PasswordVisibilityToggleProps) => (
  <InputAdornment position="end">
    <IconButton
      aria-label={visible ? "Hide password" : "Show password"}
      edge="end"
      onClick={onToggle}
      onMouseDown={(event) => event.preventDefault()}
      size="small"
    >
      <Typography
        component="span"
        variant="caption"
        sx={{ fontWeight: 700, letterSpacing: "0.02em" }}
      >
        {visible ? "Hide" : "Show"}
      </Typography>
    </IconButton>
  </InputAdornment>
);

const RegisterPage = () => {
  const [values, setValues] = useState<RegisterFormValues>(EMPTY_REGISTER_FORM);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutate: submitRegistration, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: (response: RegisterResponse) => {
      if (!response.success) {
        setFeedback({ severity: "error", message: response.message });
        return;
      }

      setValues(EMPTY_REGISTER_FORM);
      setErrors({});
      setFeedback({ severity: "success", message: response.message });
    },
    onError: (error: unknown) => {
      setFeedback({
        severity: "error",
        message: getRegistrationErrorMessage(error),
      });
    },
  });

  const handleChange =
    (field: RegisterField) =>
    (event: ChangeEvent<HTMLInputElement>): void => {
      const { value } = event.target;
      const nextValues = { ...values, [field]: value };

      setValues(nextValues);
      setErrors((currentErrors) => {
        const nextErrors = { ...currentErrors };

        if (nextErrors[field]) {
          const fieldError = validateField(field, nextValues);

          if (fieldError) {
            nextErrors[field] = fieldError;
          } else {
            delete nextErrors[field];
          }
        }

        if (field === "password" && nextValues.confirmPassword) {
          const confirmPasswordError = validateField(
            "confirmPassword",
            nextValues,
          );

          if (confirmPasswordError) {
            nextErrors.confirmPassword = confirmPasswordError;
          } else {
            delete nextErrors.confirmPassword;
          }
        }

        return nextErrors;
      });

      if (feedback) {
        setFeedback(null);
      }
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (isPending) {
      return;
    }

    const nextErrors = validateRegisterForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setFeedback(null);
      return;
    }

    submitRegistration({
      name: values.name.trim(),
      email: values.email.trim(),
      password: values.password,
    });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 2, sm: 3 },
        py: { xs: 4, sm: 6 },
        background:
          "radial-gradient(circle at 15% 20%, #ccfbf1 0, transparent 45%), radial-gradient(circle at 85% 80%, #dbeafe 0, transparent 40%), #f3f7f6",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 520,
          borderRadius: { xs: 3, sm: 4 },
          border: "1px solid",
          borderColor: "rgba(15, 118, 110, 0.12)",
          boxShadow: "0 24px 70px rgba(19, 42, 39, 0.12)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            height: 6,
            background: "linear-gradient(90deg, #0f766e, #14b8a6, #5eead4)",
          }}
        />

        <Box sx={{ p: { xs: 3, sm: 5 } }}>
          <Stack spacing={0.75} sx={{ mb: 3.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 1 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  fontWeight: 800,
                  fontSize: 20,
                  background: "linear-gradient(135deg, #0f766e, #14b8a6)",
                  boxShadow: "0 8px 20px rgba(15, 118, 110, 0.25)",
                }}
              >
                F
              </Box>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  color: "text.secondary",
                  letterSpacing: "0.08em",
                }}
              >
                FITNESS AGENT
              </Typography>
            </Box>

            <Typography variant="h4">Create your account</Typography>
            <Typography variant="body2" color="text.secondary">
              Join Fitness Agent and start building healthier habits today.
            </Typography>
          </Stack>

          {feedback && (
            <Alert severity={feedback.severity} sx={{ mb: 2.5 }}>
              {feedback.message}
            </Alert>
          )}

          <Box component="form" noValidate onSubmit={handleSubmit}>
            <Stack spacing={2.25}>
              <TextField
                autoComplete="name"
                error={Boolean(errors.name)}
                fullWidth
                helperText={errors.name}
                id="name"
                label="Name"
                onChange={handleChange("name")}
                required
                value={values.name}
              />

              <TextField
                autoComplete="email"
                error={Boolean(errors.email)}
                fullWidth
                helperText={errors.email}
                id="email"
                label="Email"
                onChange={handleChange("email")}
                required
                type="email"
                value={values.email}
              />

              <TextField
                autoComplete="new-password"
                error={Boolean(errors.password)}
                fullWidth
                helperText={
                  errors.password ??
                  "Use 8+ characters with uppercase, lowercase, number and special character."
                }
                id="password"
                label="Password"
                onChange={handleChange("password")}
                required
                slotProps={{
                  input: {
                    endAdornment: (
                      <PasswordVisibilityToggle
                        onToggle={() => setShowPassword((visible) => !visible)}
                        visible={showPassword}
                      />
                    ),
                  },
                }}
                type={showPassword ? "text" : "password"}
                value={values.password}
              />

              <TextField
                autoComplete="new-password"
                error={Boolean(errors.confirmPassword)}
                fullWidth
                helperText={errors.confirmPassword}
                id="confirmPassword"
                label="Confirm Password"
                onChange={handleChange("confirmPassword")}
                required
                slotProps={{
                  input: {
                    endAdornment: (
                      <PasswordVisibilityToggle
                        onToggle={() =>
                          setShowConfirmPassword((visible) => !visible)
                        }
                        visible={showConfirmPassword}
                      />
                    ),
                  },
                }}
                type={showConfirmPassword ? "text" : "password"}
                value={values.confirmPassword}
              />

              <Button
                disabled={isPending}
                fullWidth
                size="large"
                startIcon={
                  isPending ? (
                    <CircularProgress color="inherit" size={18} />
                  ) : undefined
                }
                sx={{ mt: 1, py: 1.4 }}
                type="submit"
                variant="contained"
              >
                {isPending ? "Creating account..." : "Register"}
              </Button>
            </Stack>
          </Box>

          <Typography
            color="text.secondary"
            sx={{ display: "block", mt: 3, textAlign: "center" }}
            variant="caption"
          >
            Your password is hashed securely before it is stored.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default RegisterPage;
