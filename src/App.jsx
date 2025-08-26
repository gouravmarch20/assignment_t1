import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./page/HomePage";
import SettingPage from "./page/SettingPage";
import Header from "./components/Header";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
     
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/setting" element={<SettingPage />} />

        </Routes>
      </div>
    </Router>
  );
};

export default App;
