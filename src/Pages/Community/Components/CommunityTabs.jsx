import React from "react";

export default function CommunityTabs({ tabs, active, setActive }) {
  return (
    <div className="flex bg-white border-2 border-purple-300 rounded-lg overflow-x-auto shadow-sm">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => setActive(t)}
          className={`px-3 sm:px-6 py-2 text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${active === t ? "bg-purple-600 text-white font-semibold" : "text-gray-700 hover:text-purple-600 border-r border-purple-200"}`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
