import React from "react";

export default function DiscussionCard({ d }) {
  return (
    <div className="bg-white border-2 border-purple-200 rounded-lg shadow-md hover:shadow-lg p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4 transition-shadow">
      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-300 to-purple-400 rounded flex-shrink-0 flex items-center justify-center text-white text-xs sm:text-sm font-semibold">IMG</div>

      <div className="flex-1 min-w-0">
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 text-left line-clamp-2">{d.title}</h3>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-xs text-gray-600 mt-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-gray-700">by <span className="font-medium text-slate-800 truncate">{d.author}</span></span>
            <span className="w-px h-3 bg-purple-300 hidden sm:block" />
            <span className="px-2 py-0.5 bg-purple-100 rounded text-purple-700 font-medium whitespace-nowrap">{d.category}</span>
          </div>
          <span className="text-gray-500">• {d.lastActivity}</span>
        </div>

        <div className="flex flex-wrap gap-1 mt-2">
          {d.tags?.slice(0, 2).map((t) => (
            <span key={t} className="text-xs text-purple-600 font-medium">#{t}</span>
          ))}
          {d.tags?.length > 2 && <span className="text-xs text-gray-500">+{d.tags.length - 2}</span>}
        </div>

        <div className="flex gap-4 sm:gap-8 mt-2 text-xs sm:text-sm text-gray-700">
          <span><strong className="text-slate-900">{d.replies}</strong> <span className="text-gray-600 hidden sm:inline">replies</span></span>
          <span><strong className="text-slate-900">{d.views}</strong> <span className="text-gray-600 hidden sm:inline">views</span></span>
        </div>
      </div>
    </div>
  );
}
