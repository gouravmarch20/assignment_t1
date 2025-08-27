import React, { useState, useMemo, useCallback } from "react";
import Header from "../components/Header";
import Toast from "../components/Toast";
import UserTable from "../components/UserTable";

function HomePage() {
  // toast
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = useCallback((message, type = "success") => {
    setToast({ show: true, message, type });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto p-6">
        <UserTable showToast={showToast} />
      </main>

      <Toast
        message={toast.message}
        show={toast.show}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}

export default HomePage;
