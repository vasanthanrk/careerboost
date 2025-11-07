import { Navigate, Outlet } from "react-router-dom";

export default function PublicRoute() {
  const token = localStorage.getItem("token");

  if (token) {
    // Already logged in → redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // Not logged in → allow access to login/signup pages
  return <Outlet />;
}
