import { useState } from "react";

export default function HorizontalFilters({ onFilterChange }) {
  const [category, setCategory] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [availability, setAvailability] = useState("");

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategory(value);
    onFilterChange({ category: value });
  };

  const handleSkillLevelChange = (e) => {
    const value = e.target.value;
    setSkillLevel(value);
    onFilterChange({ skillLevel: value });
  };

  const handleAvailabilityChange = (e) => {
    const value = e.target.value;
    setAvailability(value);
    onFilterChange({ availability: value });
  };

  const handleClearFilters = () => {
    setCategory("");
    setSkillLevel("");
    setAvailability("");
    onFilterChange({ 
      category: "", 
      skillLevel: "", 
      availability: ""
    });
  };

  return (
    <div className="w-full bg-white/50 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 p-4 mb-6">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Category Dropdown */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
          <select
            value={category}
            onChange={handleCategoryChange}
            className="w-full px-4 py-2 rounded-xl border border-purple-300 outline-none focus:ring-2 focus:ring-purple-400 bg-white text-gray-700 cursor-pointer"
          >
            <option value="">All Categories</option>
            <option value="Programming">Programming</option>
            <option value="Design">Design</option>
            <option value="Data Science">Data Science</option>
            <option value="Business">Business</option>
            <option value="Communication">Communication</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Skill Level Selector */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Skill Level</label>
          <select
            value={skillLevel}
            onChange={handleSkillLevelChange}
            className="w-full px-4 py-2 rounded-xl border border-purple-300 outline-none focus:ring-2 focus:ring-purple-400 bg-white text-gray-700 cursor-pointer"
          >
            <option value="">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Expert">Expert</option>
          </select>
        </div>

        {/* Availability Selector */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Availability</label>
          <select
            value={availability}
            onChange={handleAvailabilityChange}
            className="w-full px-4 py-2 rounded-xl border border-purple-300 outline-none focus:ring-2 focus:ring-purple-400 bg-white text-gray-700 cursor-pointer"
          >
            <option value="">All Users</option>
            <option value="Available Now">Online</option>
            <option value="Busy">Offline</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        <div className="flex items-end">
          <button
            onClick={handleClearFilters}
            className="px-6 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold transition border border-purple-300"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
}
