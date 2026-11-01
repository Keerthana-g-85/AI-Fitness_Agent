import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  Link as RouterLink,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { getAuthErrorMessage } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import type { LoginResponse } from "../types/profile";
import {
  EMPTY_LOGIN_FORM,
  validateLoginField,
  validateLoginForm,
} from "../validation/login";
import type {
  LoginErrors,
  LoginField,
  LoginFormValues,
} from "../validation/login";

interface LoginLocationState {
  from?: string;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [values, setValues] = useState<LoginFormValues>(EMPTY_LOGIN_FORM);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: submitLogin, isPending } = useMutation({
    mutationFn: login,
    onSuccess: (response: LoginResponse) => {
      if (!response.success) {
        setFeedback(response.message);
        return;
      }

      const state = location.state as LoginLocationState | null;
      const destination =
        state?.from && state.from.startsWith("/") ? state.from : "/dashboard";

      navigate(destination, { replace: true });
    },
    onError: (error: unknown) => {
      setFeedback(getAuthErrorMessage(error));
    },
  });

  const handleChange =
    (field: LoginField) =>
    (event: ChangeEvent<HTMLInputElement>): void => {
      const nextValues = { ...values, [field]: event.target.value };
      setValues(nextValues);
      setErrors((currentErrors) => {
        if (!currentErrors[field]) {
          return currentErrors;
        }

        const nextErrors = { ...currentErrors };
        const fieldError = validateLoginField(field, nextValues);

        if (fieldError) {
          nextErrors[field] = fieldError;
        } else {
          delete nextErrors[field];
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

    const nextErrors = validateLoginForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setFeedback(null);
      return;
    }

    submitLogin({
      email: values.email.trim(),
      password: values.password,
      rememberMe: values.rememberMe,
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

            <Typography variant="h4">Welcome back</Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to continue to your AI Fitness Agent dashboard.
            </Typography>
          </Stack>

          {feedback && (
            <Alert severity="error" sx={{ mb: 2.5 }}>
              {feedback}
            </Alert>
          )}

          <Box component="form" noValidate onSubmit={handleSubmit}>
            <Stack spacing={2.25}>
              <TextField
                autoComplete="email"
                autoFocus
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
                autoComplete="current-password"
                error={Boolean(errors.password)}
                fullWidth
                helperText={errors.password}
                id="password"
                label="Password"
                onChange={handleChange("password")}
                required
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                          edge="end"
                          onClick={() => setShowPassword((visible) => !visible)}
                          onMouseDown={(event) => event.preventDefault()}
                          size="small"
                        >
                          <Typography
                            component="span"
                            variant="caption"
                            sx={{ fontWeight: 700, letterSpacing: "0.02em" }}
                          >
                            {showPassword ? "Hide" : "Show"}
                          </Typography>
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                type={showPassword ? "text" : "password"}
                value={values.password}
              />

              <Stack
                direction="row"
                spacing={1}
                sx={{
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  rowGap: 1,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.rememberMe}
                      onChange={(event) =>
                        setValues((current) => ({
                          ...current,
                          rememberMe: event.target.checked,
                        }))
                      }
                      size="small"
                    />
                  }
                  label="Remember me"
                />
                <Link href="mailto:support@aifitnessagent.com" variant="body2">
                  Forgot password?
                </Link>
              </Stack>

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
                {isPending ? "Signing in..." : "Login"}
              </Button>
            </Stack>
          </Box>

          <Typography
            color="text.secondary"
            sx={{ display: "block", mt: 3, textAlign: "center" }}
            variant="body2"
          >
            New to AI Fitness Agent?{" "}
            <Link component={RouterLink} to="/register" underline="hover">
              Create an account
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
