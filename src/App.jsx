import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import Step1Personal from "./pages/Step1Personal";
import Step2Finance from "./pages/Step2Finance";
import Step3Situation from "./pages/Step3Situation";
import Review from "./pages/Review";
import Success from "./pages/Success";
import RequireStep from "./routes/RequireStep";

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
  return <RouterProvider router={router} />;
}
