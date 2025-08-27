import React from 'react'

const Pagination = ({ page, totalPages, setPage, theme }) => {
    const activeClass = theme === "dark" ? "bg-indigo-500 text-white" : "bg-indigo-600 text-white";
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
        className={`px-3 py-1 border rounded ${p === page ? activeClass : ""}`}
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
  )
}

export default Pagination