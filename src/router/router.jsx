import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import Login from "../pages/Login";
import { AuthProvider } from "../context/AuthContext";
import { dashboardRouter } from "../pages/router";
import { Suspense } from "react";
import Loader from "../components/Loader";
import NotFound from "../components/NotFound";

const AppRouter = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <AuthProvider>
          <ProtectedRoute />
        </AuthProvider>
      ),
      children: [...dashboardRouter],
    },
    {
      path: "/login",
      element: (
        <AuthProvider>
          <Login />
        </AuthProvider>
      ),
    },
    {
      path: "/*",
      element: <NotFound />,
    },
  ]);
  return (
    <Suspense fallback={<Loader />}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default AppRouter;
