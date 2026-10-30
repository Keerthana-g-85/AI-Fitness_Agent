import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { OnboardingProvider } from "./context/OnboardingContext";
import { theme } from "./theme";

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: false,
    },
  },
});

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <OnboardingProvider>
            <App />
          </OnboardingProvider>
        </QueryClientProvider>
      </LocalizationProvider>
    </ThemeProvider>
  </StrictMode>,
);
