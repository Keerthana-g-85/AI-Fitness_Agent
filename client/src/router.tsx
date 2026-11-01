import type { ReactNode } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute, PublicOnlyRoute } from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import DashboardPage from "./pages/Dashboard";
import DailyTrackingPage from "./pages/tracking/DailyTrackingPage";
import BodyMeasurementsPage from "./pages/measurements/BodyMeasurementsPage";
import ProfileEditPage from "./pages/profile/ProfileEditPage";
import LoginPage from "./pages/Login";
import ProfileManagementPage from "./pages/Profile";
import RegisterPage from "./pages/Register";
import AllergiesPage from "./pages/onboarding/Allergies";
import FoodPreferencesPage from "./pages/onboarding/FoodPreferences";
import BodyCompositionPage from "./pages/onboarding/BodyComposition";
import FitnessGoalPage from "./pages/onboarding/FitnessGoal";
import MedicalHistoryPage from "./pages/onboarding/MedicalHistory";
import MedicationsPage from "./pages/onboarding/Medications";
import OnboardingReviewPage from "./pages/onboarding/OnboardingReview";
import PersonalizationPage from "./pages/onboarding/Personalization";
import OnboardingProfilePage from "./pages/onboarding/Profile";
import WorkLifePage from "./pages/onboarding/WorkLife";
import WorkoutPreferencesPage from "./pages/onboarding/WorkoutPreferences";

const ProfileRoute = () => {
  const { user } = useAuth();

  return user?.onboardingCompleted ? (
    <ProfileManagementPage />
  ) : (
    <OnboardingProfilePage />
  );
};

const protect = (element: ReactNode) => (
  <ProtectedRoute>{element}</ProtectedRoute>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/login",
    element: (
      <PublicOnlyRoute>
        <LoginPage />
      </PublicOnlyRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicOnlyRoute>
        <RegisterPage />
      </PublicOnlyRoute>
    ),
  },
  {
    path: "/dashboard",
    element: protect(<DashboardPage />),
  },
  {
    path: "/profile",
    element: protect(<ProfileRoute />),
  },
  {
    path: "/tracking",
    element: protect(<DailyTrackingPage />),
  },
  {
    path: "/profile/measurements",
    element: protect(<BodyMeasurementsPage />),
  },
  {
    path: "/profile/edit/personal",
    element: protect(<ProfileEditPage section="basic" />),
  },
  {
    path: "/profile/edit/fitness-goals",
    element: protect(<ProfileEditPage section="fitnessGoal" />),
  },
  {
    path: "/profile/edit/nutrition",
    element: protect(<ProfileEditPage section="food" />),
  },
  {
    path: "/profile/edit/workout",
    element: protect(<ProfileEditPage section="workout" />),
  },
  {
    path: "/profile/edit/medical-history",
    element: protect(<ProfileEditPage section="medicalHistories" />),
  },
  {
    path: "/profile/edit/medications",
    element: protect(<ProfileEditPage section="medications" />),
  },
  {
    path: "/profile/edit/allergies",
    element: protect(<ProfileEditPage section="allergies" />),
  },
  {
    path: "/profile/edit/work-life",
    element: protect(<ProfileEditPage section="workLifeAndPersonalization" />),
  },
  {
    path: "/profile/edit/preferences",
    element: protect(<ProfileEditPage section="preferences" />),
  },
  {
    path: "/fitness-goal",
    element: protect(<FitnessGoalPage />),
  },
  {
    path: "/body-composition",
    element: protect(<BodyCompositionPage />),
  },
  {
    path: "/medical-history",
    element: protect(<MedicalHistoryPage />),
  },
  {
    path: "/medications",
    element: protect(<MedicationsPage />),
  },
  {
    path: "/allergies",
    element: protect(<AllergiesPage />),
  },
  {
    path: "/food-preferences",
    element: protect(<FoodPreferencesPage />),
  },
  {
    path: "/workout-preferences",
    element: protect(<WorkoutPreferencesPage />),
  },
  {
    path: "/work-life",
    element: protect(<WorkLifePage />),
  },
  {
    path: "/personalization",
    element: protect(<PersonalizationPage />),
  },
  {
    path: "/review",
    element: protect(<OnboardingReviewPage />),
  },
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
]);
