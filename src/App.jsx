import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { lazy } from "react";
import RootLayout from "./layouts/RootLayout";
import Review from "./pages/Review";
import Success from "./pages/Success";
import RequireStep from "./routes/RequireStep";
import ErrorBoundary from "./components/ErrorBoundary";

const Step1Personal = lazy(() => import("./pages/Step1Personal"));
const Step2Finance = lazy(() => import("./pages/Step2Finance"));
const Step3Situation = lazy(() => import("./pages/Step3Situation"));

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <Navigate to="/step-1" replace /> },
      { path: "/step-1", element: <Step1Personal /> },
      {
        path: "/step-2",
        element: (
          <RequireStep minStep={2}>
            <Step2Finance />
          </RequireStep>
        ),
      },
      {
        path: "/step-3",
        element: (
          <RequireStep minStep={3}>
            <Step3Situation />
          </RequireStep>
        ),
      },
      {
        path: "/review",
        element: (
          <RequireStep minStep={4}>
            <Review />
          </RequireStep>
        ),
      },
      { path: "/success", element: <Success /> },
      { path: "*", element: <Navigate to="/step-1" replace /> },
    ],
  },
]);

export default function App() {
  return (
    <ErrorBoundary>
        <RouterProvider router={router} />
    </ErrorBoundary>
  ); 
}
