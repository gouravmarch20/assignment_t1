import React from "react";
import { Navigate } from "react-router-dom";
import { getCookie } from "../utils/cookies";

const COOKIE_KEY = "auth_user";

export default function ProtectedRoute({ children }) {
  const user = getCookie(COOKIE_KEY);
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
