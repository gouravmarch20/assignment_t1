import React from "react";

const EditModal = ({ user, onClose, onSave, theme }) => {
  const [form, setForm] = useState({ ...user });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => setForm({ ...user }), [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErr(null);
    if (!form.name.trim()) return setErr("Name required");
    if (!form.email.trim()) return setErr("Email required");
    setSaving(true);
    setTimeout(() => {
      onSave(form);
      setSaving(false);
    }, 700);
  };

  const modalBg =
    theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className={`rounded-lg w-full max-w-lg p-6 ${modalBg}`}>
        <h3 className="text-lg font-medium mb-4">Edit User</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs text-gray-400">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className={`w-full border px-3 py-2 rounded ${
                theme === "dark"
                  ? "bg-gray-700 text-gray-200"
                  : "bg-white text-gray-800"
              }`}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400">Email</label>
            <input
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              className={`w-full border px-3 py-2 rounded ${
                theme === "dark"
                  ? "bg-gray-700 text-gray-200"
                  : "bg-white text-gray-800"
              }`}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400">Phone</label>
            <input
              value={form.phone}
              onChange={(e) =>
                setForm((f) => ({ ...f, phone: e.target.value }))
              }
              className={`w-full border px-3 py-2 rounded ${
                theme === "dark"
                  ? "bg-gray-700 text-gray-200"
                  : "bg-white text-gray-800"
              }`}
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
};

export default EditModal;
