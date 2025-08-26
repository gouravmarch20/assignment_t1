import React from "react";
import { NavLink } from "react-router-dom";

export default function Header({}) {
  return (
    <header className="bg-white shadow-sm sticky top-0 ">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Logo + Title */}
        <div className="flex items-center gap-3">
          <NavLink to="/">
            <div className="sm:hidden w-15 h-10 bg-indigo-600 text-white flex items-center justify-center rounded">
              PD{" "}
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

          <div className="flex items-center gap-2 sm:gap-4">
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
              Setting Page
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  );
}
