import React from "react";

const UserFilter = ({
  search,
  setSearch,
  companyFilter,
  setCompanyFilter,
  companies,
  onClear,
  theme,
}) => {
  const inputBg =
    theme === "dark" ? "bg-gray-700 text-gray-200" : "bg-white text-gray-800";
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-center">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search name / email / phone"
        className={`border px-3 py-2 rounded w-full sm:w-1/2 ${inputBg}`}
      />
      <select
        value={companyFilter}
        onChange={(e) => setCompanyFilter(e.target.value)}
        className={`border px-3 py-2 rounded w-full sm:w-1/4 ${inputBg}`}
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
};

export default UserFilter;
