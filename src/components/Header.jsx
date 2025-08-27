import { NavLink, useNavigate } from "react-router-dom";
import { deleteCookie } from "../utils/cookies";
import { useThemeStore } from "../store/themeStore";

const COOKIE_KEY = "auth_user";

export default function Header() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useThemeStore();

  const handleLogout = () => {
    deleteCookie(COOKIE_KEY);
    navigate("/login", { replace: true });
  };

  // Theme classes
  const headerBg = theme === "dark" ? "bg-gray-900 text-gray-200" : "bg-white text-gray-800";
  const linkActive = theme === "dark" ? "bg-indigo-600 text-white font-medium" : "bg-indigo-100 text-indigo-700 font-medium";
  const linkInactive = theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-50 hover:bg-gray-100";

  return (
    <header className={`${headerBg} shadow-sm sticky top-0 transition-colors`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Navigation */}
        <div className="flex items-center gap-2 sm:gap-4">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-3 py-2 rounded transition-colors whitespace-nowrap ${isActive ? linkActive : linkInactive}`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/setting"
            end
            className={({ isActive }) =>
              `px-3 py-2 rounded transition-colors whitespace-nowrap ${isActive ? linkActive : linkInactive}`
            }
          >
            Setting
          </NavLink>

          {/* Toggle Theme */}
          <button
            onClick={toggleTheme}
            className="px-3 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors min-w-[70px]"
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors min-w-[70px]"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}