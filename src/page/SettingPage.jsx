import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useThemeStore } from "../store/themeStore";

const LOCALSTORAGE_KEY = "app_settings_v1";

const defaultSettings = {
  darkMode: false,
  notifications: {
    email: true,
    sms: false,
    push: true,
  },
};

export default function SettingsPage() {
  // Initialize from localStorage directly
  const [settings, setSettings] = useState(() => {
    try {
      const raw = localStorage.getItem(LOCALSTORAGE_KEY);
      return raw ? JSON.parse(raw) : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });
  const { theme, toggleTheme } = useThemeStore();
  // Persist to localStorage whenever settings change
  useEffect(() => {
    try {
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error("Failed to save settings", e);
    }
  }, [settings]);

  // Apply dark mode
  useEffect(() => {
    const root = document.documentElement;
    if (settings.darkMode) {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme");
    }
  }, [settings.darkMode]);

  function updateSettings(patch) {
    toggleTheme();
    setSettings((prev) => ({ ...prev, ...patch }));
  }

  function toggleNotification(key) {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: !prev.notifications[key] },
    }));
  }

  function resetToDefaults() {
    setSettings(defaultSettings);
    try {
      localStorage.removeItem(LOCALSTORAGE_KEY);
    } catch (e) {
      console.warn("Failed to reset settings", e);
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1>{theme}</h1>
      <Header />
      <h1 className="text-2xl font-semibold mb-4">Settings</h1>

      {/* Appearance Section */}
      <section className="mb-6 bg-white/80 dark:bg-blue-100/70 p-4 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-lg font-medium">Appearance</h2>
            <p className="text-sm text-gray-500">
              Toggle dark mode for the app UI.
            </p>
          </div>

          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.darkMode}
              onChange={(e) => updateSettings({ darkMode: e.target.checked })}
              className="sr-only"
            />
            <div
              className={`w-12 h-6 flex items-center bg-gray-300 dark:bg-gray-700 rounded-full p-1 transition-colors ${
                settings.darkMode ? "justify-end" : "justify-start"
              }`}
            >
              <div className="w-4 h-4 bg-white rounded-full shadow" />
            </div>
          </label>
        </div>
      </section>

      {/* Notifications Section */}
      <section className="mb-6 bg-white/80 dark:bg-blue-100/70 p-4 rounded-2xl shadow-sm">
        <h2 className="text-lg font-medium mb-2">Notifications</h2>
        <p className="text-sm text-gray-500 mb-4">
          Choose how you'd like to receive updates.
        </p>

        <div className="space-y-3">
          {Object.entries(settings.notifications).map(([key, value]) => (
            <label key={key} className="flex items-center justify-between">
              <div>
                <div className="capitalize font-medium">{key}</div>
                <div className="text-sm text-gray-500">
                  {getNotificationDescription(key)}
                </div>
              </div>

              <input
                type="checkbox"
                checked={value}
                onChange={() => toggleNotification(key)}
                className="w-5 h-5"
              />
            </label>
          ))}
        </div>
      </section>

      <button
        onClick={resetToDefaults}
        className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm"
      >
        Reset
      </button>
    </div>
  );
}

function getNotificationDescription(key) {
  switch (key) {
    case "email":
      return "Receive updates by email.";
    case "sms":
      return "Receive short SMS alerts.";
    case "push":
      return "Receive push notifications on this device.";
    default:
      return "";
  }
}
