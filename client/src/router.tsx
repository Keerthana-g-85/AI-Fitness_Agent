import { createBrowserRouter, Navigate } from "react-router-dom";
import RegisterPage from "./pages/Register";
import AllergiesPage from "./pages/onboarding/Allergies";
import FoodPreferencesPage from "./pages/onboarding/FoodPreferences";
import BodyCompositionPage from "./pages/onboarding/BodyComposition";
import BodyMeasurementsPage from "./pages/onboarding/BodyMeasurements";
import FitnessGoalPage from "./pages/onboarding/FitnessGoal";
import MedicalHistoryPage from "./pages/onboarding/MedicalHistory";
import MedicationsPage from "./pages/onboarding/Medications";
import OnboardingReviewPage from "./pages/onboarding/OnboardingReview";
import PersonalizationPage from "./pages/onboarding/Personalization";
import ProfilePage from "./pages/onboarding/Profile";
import WorkLifePage from "./pages/onboarding/WorkLife";
import WorkoutPreferencesPage from "./pages/onboarding/WorkoutPreferences";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/register" replace />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/fitness-goal",
    element: <FitnessGoalPage />,
  },
  {
    path: "/body-measurements",
    element: <BodyMeasurementsPage />,
  },
  {
    path: "/body-composition",
    element: <BodyCompositionPage />,
  },
  {
    path: "/medical-history",
    element: <MedicalHistoryPage />,
  },
  {
    path: "/medications",
    element: <MedicationsPage />,
  },
  {
    path: "/allergies",
    element: <AllergiesPage />,
  },
  {
    path: "/food-preferences",
    element: <FoodPreferencesPage />,
  },
  {
    path: "/workout-preferences",
    element: <WorkoutPreferencesPage />,
  },
  {
    path: "/work-life",
    element: <WorkLifePage />,
  },
  {
    path: "/personalization",
    element: <PersonalizationPage />,
  },
  {
    path: "/review",
    element: <OnboardingReviewPage />,
  },
  {
    path: "*",
    element: <Navigate to="/register" replace />,
  },
]);
