import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { deleteCookie } from "../utils/cookies";
const COOKIE_KEY = "auth_user";

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    deleteCookie(COOKIE_KEY);
    navigate("/login", { replace: true });
  };

  return (
    <header className="bg-white shadow-sm sticky top-0">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Logo + Title */}
        <div className="flex items-center gap-3">
          <NavLink to="/">
            <div className="sm:hidden w-15 h-10 bg-indigo-600 text-white flex items-center justify-center rounded">
              PD
            </div>
          </NavLink>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-2 sm:gap-4">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-3 py-2 rounded transition-colors ${
                isActive
                  ? "bg-indigo-100 text-indigo-700 font-medium"
                  : "bg-gray-50 hover:bg-gray-100"
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/setting"
            end
            className={({ isActive }) =>
              `px-3 py-2 rounded transition-colors ${
                isActive
                  ? "bg-indigo-100 text-indigo-700 font-medium"
                  : "bg-gray-50 hover:bg-gray-100"
              }`
            }
          >
            Setting
          </NavLink>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
