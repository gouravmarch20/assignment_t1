// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./page/HomePage";
import SettingPage from "./page/SettingPage";
import LoginPage from "./page/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { useThemeStore } from "./store/themeStore";

const App = () => {
  const { theme } = useThemeStore();

  return (
    <div
      className={`h-[100vh] ${theme === "dark" ? "bg-black" : "bg-blue-100"}`}
    >
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/setting"
            element={
              <ProtectedRoute>
                <SettingPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
