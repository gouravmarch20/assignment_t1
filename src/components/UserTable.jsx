import React, { useEffect, useMemo, useState, useCallback } from "react";

const API_URL = "https://jsonplaceholder.typicode.com/users";

export default function UsersTablePage({ showToast }) {
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
        // normalize shape we need
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

  // Mock update: update user locally and close modal
  const handleSaveUser = useCallback((updated) => {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    setEditingUser(null);
    showToast("Update User", "success");
  }, []);

  // UI helpers
  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Users Table</h2>

        <div className="bg-white p-4 rounded-lg shadow mb-4">
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
          />
        </div>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
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
                    // re-trigger fetch by toggling apiUrl state — quick and dirty: call fetch again
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
              <thead className="bg-gray-100 text-left text-gray-700">
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
                      className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
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
                              // mock delete
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
          <Pagination page={page} totalPages={totalPages} setPage={setPage} />
        </div>
      </div>

      {editingUser && (
        <EditModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
}

function Filters({
  search,
  setSearch,
  companyFilter,
  setCompanyFilter,
  companies,
  onClear,
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-center">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search name / email / phone"
        className="border px-3 py-2 rounded w-full sm:w-1/2"
      />

      <select
        value={companyFilter}
        onChange={(e) => setCompanyFilter(e.target.value)}
        className="border px-3 py-2 rounded w-full sm:w-1/4"
      >
        {companies.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <div className="flex gap-2">
        <button
          onClick={onClear}
          className="px-3 py-2 bg-red-500 text-white rounded"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

function Pagination({ page, totalPages, setPage }) {
  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, start + 4);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        disabled={page === 1}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Prev
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => setPage(p)}
          className={`px-3 py-1 border rounded ${
            p === page ? "bg-indigo-600 text-white" : ""
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        disabled={page === totalPages}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}

function EditModal({ user, onClose, onSave }) {
  const [form, setForm] = useState({ ...user });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => setForm({ ...user }), [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErr(null);
    // basic validation
    if (!form.name.trim()) return setErr("Name required");
    if (!form.email.trim()) return setErr("Email required");
    setSaving(true);
    // mock network delay
    setTimeout(() => {
      onSave(form);
      setSaving(false);
    }, 700);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6">
        <h3 className="text-lg font-medium mb-4">Edit User</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs text-gray-600">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600">Email</label>
            <input
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600">Phone</label>
            <input
              value={form.phone}
              onChange={(e) =>
                setForm((f) => ({ ...f, phone: e.target.value }))
              }
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          {err && <div className="text-red-600 text-sm">{err}</div>}

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded border"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-3 py-2 bg-indigo-600 text-white rounded"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
