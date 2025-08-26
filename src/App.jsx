// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./page/HomePage";
import SettingPage from "./page/SettingPage";
import LoginPage from "./page/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
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
  );
};

export default App;