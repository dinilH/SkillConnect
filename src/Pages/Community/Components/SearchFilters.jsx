import React from "react";

export default function SearchFilters({
  search,
  setSearch,
  allTags,
  selectedTags,
  toggleTag,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
}) {
  return (
    <div className="mb-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="col-span-1 lg:col-span-2">
        <div className="relative">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search discussions, authors, or content..."
            className="w-full border-2 border-purple-300 rounded-md px-4 py-2 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          {search && (
            <button onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-purple-600 hover:text-purple-800 transition-colors font-medium">
              Clear
            </button>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`text-sm px-3 py-1 rounded-full border transition-all ${selectedTags.includes(tag) ? "bg-purple-600 text-white border-purple-600" : "bg-white text-purple-700 border-purple-300 hover:border-purple-500"}`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
          className="border-2 border-purple-300 rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
          <option>All</option>
          <option>Academics</option>
          <option>Coding</option>
          <option>Events</option>
          <option>General</option>
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
          className="border-2 border-purple-300 rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
          <option value="recent">Sort: Recent</option>
          <option value="views">Sort: Most views</option>
          <option value="replies">Sort: Most replies</option>
        </select>
      </div>
    </div>
  );
}
