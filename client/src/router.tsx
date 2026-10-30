import { createBrowserRouter, Navigate } from "react-router-dom";
import RegisterPage from "./pages/Register";

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
    path: "*",
    element: <Navigate to="/register" replace />,
  },
]);
