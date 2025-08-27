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
    // Tailwind dark/light toggle via class
    <div className={theme === "dark" ? "bg-black" : ""}>
      <div
        className={`min-h-screen  ${
          theme === "dark" ? "bg-grey-100" : "bg-blue-100"
        }`}
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
    </div>
  );
};

export default App;
