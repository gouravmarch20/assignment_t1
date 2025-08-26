import React from "react";
import { useNavigate } from "react-router-dom";
import { setCookie } from "../utils/cookies";

const COOKIE_KEY = "auth_user";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    const dummyUser = { id: 1, name: "Test User" };
    setCookie(COOKIE_KEY, JSON.stringify(dummyUser), 1); // 1 day
    navigate("/", { replace: true });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md w-80 text-center">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <button
          onClick={handleLogin}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Login as Test User
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
