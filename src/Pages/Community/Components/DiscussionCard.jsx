import React from "react";

export default function DiscussionCard({ d }) {
  return (
    <div className="bg-white border rounded-lg shadow-sm p-4 flex gap-4">
      <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-sm">IMG</div>

      <div className="flex-1">
        <h3 className="text-lg font-medium">{d.title}</h3>

        <div className="flex items-center gap-3 text-xs text-gray-500 mt-2 flex-wrap">
          <span>by {d.author}</span>
          <span className="w-px h-4 bg-gray-300" />
          <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-700">{d.category}</span>
          {d.tags?.map((t) => (
            <span key={t} className="ml-2 text-xs text-gray-500">#{t}</span>
          ))}
          <span className="text-gray-400">• Last activity: {d.lastActivity}</span>
        </div>

        <div className="flex gap-8 mt-3 text-sm text-gray-700">
          <span><strong>{d.replies}</strong> replies</span>
          <span><strong>{d.views}</strong> views</span>
        </div>
      </div>
    </div>
  );
}
