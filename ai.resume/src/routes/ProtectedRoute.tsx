import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { authService } from "../services/authService";

interface JwtPayload {
  exp: number; // standard JWT expiry field
  [key: string]: any;
}

export default function ProtectedRoute() {
  const [isValid, setIsValid] = useState(null);
  useEffect(() => {
    const checkToken = async () => {
      const valid = await authService.verifyToken();
      setIsValid(valid);
      if (!valid) 
        authService.logout();
    };
    checkToken();
  }, []);

  if (isValid === null) {
    return <div className="flex justify-center items-center h-screen">Checking session...</div>;
  }

  return isValid ? <Outlet /> : <Navigate to="/login" replace />;
}
