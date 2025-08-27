"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useThemeStore } from "../store/themeStore";
import Pagination from "./Pagination";
import Filters from "./UserFilter";

const API_URL = "https://jsonplaceholder.typicode.com/users";

export default function UsersTablePage({ showToast }) {
  const { theme, toggleTheme } = useThemeStore();

  const apiUrl = API_URL;
  const pageSize = 5;
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // UI state
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [companyFilter, setCompanyFilter] = useState("All");
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  // Modal
  const [editingUser, setEditingUser] = useState(null);

  // Fetch users
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    fetch(apiUrl)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (!mounted) return;
        const normalized = data.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.phone || "",
          company: u.company?.name || "",
          website: u.website || "",
          address: u.address ? `${u.address.city}, ${u.address.street}` : "",
        }));
        setUsers(normalized);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || "Failed to fetch users");
      })
      .finally(() => mounted && setLoading(false));

    return () => (mounted = false);
  }, [apiUrl]);

  // Derived lists
  const companies = useMemo(() => {
    const setc = new Set(users.map((u) => u.company).filter(Boolean));
    return ["All", ...Array.from(setc)];
  }, [users]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      if (companyFilter !== "All" && u.company !== companyFilter) return false;
      if (!q) return true;
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.toLowerCase().includes(q)
      );
    });
  }, [users, search, companyFilter]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const A = (a[sortKey] || "").toString().toLowerCase();
      const B = (b[sortKey] || "").toString().toLowerCase();
      if (A === B) return 0;
      if (sortDir === "asc") return A < B ? -1 : 1;
      return A > B ? -1 : 1;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page, pageSize]);

  const handleSaveUser = useCallback((updated) => {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    setEditingUser(null);
    showToast("Update User", "success");
  }, []);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  // theme classes
  const bgClass = theme === "dark" ? "bg-gray-900" : "bg-gray-50";
  const textClass = theme === "dark" ? "text-gray-200" : "text-gray-800";
  const tableBg = theme === "dark" ? "bg-gray-800" : "bg-white";
  const tableText = theme === "dark" ? "text-gray-200" : "text-gray-700";
  const tableHeader =
    theme === "dark"
      ? "bg-gray-700 text-gray-200"
      : "bg-gray-100 text-gray-700";

  return (
    <div className={`min-h-screen p-6 ${bgClass} ${textClass}`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Users Table</h2>
          <button onClick={toggleTheme} className="px-3 py-2 border rounded">
            Toggle Theme
          </button>
        </div>

        <div className={`${tableBg} p-4 rounded-lg shadow mb-4`}>
          <Filters
            search={search}
            setSearch={setSearch}
            companyFilter={companyFilter}
            setCompanyFilter={setCompanyFilter}
            companies={companies}
            onClear={() => {
              setSearch("");
              setCompanyFilter("All");
              setPage(1);
            }}
            theme={theme}
          />
        </div>

        <div className={`${tableBg} rounded-lg shadow overflow-x-auto`}>
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Loading users...
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-600">
              <div>Failed to load users: {error}</div>
              <div className="mt-3">
                <button
                  onClick={() => {
                    setError(null);
                    setLoading(true);
                    fetch(apiUrl)
                      .then((r) => r.json())
                      .then((data) =>
                        setUsers(
                          data.map((u) => ({
                            id: u.id,
                            name: u.name,
                            email: u.email,
                            phone: u.phone || "",
                            company: u.company?.name || "",
                            website: u.website || "",
                            address: u.address
                              ? `${u.address.city}, ${u.address.street}`
                              : "",
                          }))
                        )
                      )
                      .catch((e) => setError(e.message))
                      .finally(() => setLoading(false));
                  }}
                  className="px-3 py-1 bg-indigo-600 text-white rounded"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className={`${tableHeader} text-left`}>
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th
                    className="px-4 py-3 cursor-pointer"
                    onClick={() => toggleSort("name")}
                  >
                    Name{" "}
                    {sortKey === "name" ? (sortDir === "asc" ? "▲" : "▼") : ""}
                  </th>
                  <th
                    className="px-4 py-3 cursor-pointer"
                    onClick={() => toggleSort("email")}
                  >
                    Email{" "}
                    {sortKey === "email" ? (sortDir === "asc" ? "▲" : "▼") : ""}
                  </th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  pageData.map((u, idx) => (
                    <tr
                      key={u.id}
                      className={
                        idx % 2 === 0
                          ? tableBg
                          : theme === "dark"
                          ? "bg-gray-700"
                          : "bg-gray-50"
                      }
                    >
                      <td className="px-4 py-3">
                        {(page - 1) * pageSize + idx + 1}
                      </td>
                      <td className="px-4 py-3">{u.name}</td>
                      <td className="px-4 py-3">{u.email}</td>
                      <td className="px-4 py-3">{u.phone}</td>
                      <td className="px-4 py-3">{u.company}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingUser(u)}
                            className="px-2 py-1 bg-green-50 text-green-700 rounded text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (!confirm("Delete this user (mock)?")) return;
                              showToast("User delete", "success");
                              setUsers((prev) =>
                                prev.filter((x) => x.id !== u.id)
                              );
                            }}
                            className="px-2 py-1 bg-red-50 text-red-700 rounded text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600">
            Showing {(page - 1) * pageSize + 1} -{" "}
            {Math.min(page * pageSize, sorted.length)} of {sorted.length}
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            setPage={setPage}
            theme={theme}
          />
        </div>
      </div>

      {editingUser && (
        <EditModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleSaveUser}
          theme={theme}
        />
      )}
    </div>
  );
}
