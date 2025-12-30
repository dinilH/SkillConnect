import React from "react";

export default function SkillRequests() {
  const requests = [
    { title: "Need help with React Hooks", skill: "React", priority: "High" },
    { title: "Looking for UI/UX feedback", skill: "Design", priority: "Medium" },
    { title: "Help with Calculus assignment", skill: "Math", priority: "High" },
  ];

  return (
    <div className="w-full bg-white rounded-3xl shadow-lg border border-purple-200 p-6 text-gray-900 hover:shadow-purple-300/40 transition">
      <h2 className="font-semibold text-lg mb-4 text-gray-900">Featured Skill Requests</h2>

      <div className="space-y-4">
        {requests.map((r, i) => (
          <div
            key={i}
            className="p-4 rounded-2xl border border-purple-100 hover:border-purple-300 transition flex justify-between items-start"
          >
            <div>
              <p className="font-medium text-gray-900">{r.title}</p>
              <p className="text-xs text-gray-600 mt-1">
                <span className="font-semibold">Skill:</span> {r.skill}
              </p>
            </div>

            <span
              className={`text-xs px-2 py-0.5 rounded-xl border ${
                r.priority === "High"
                  ? "text-red-700 border-red-300 bg-red-50"
                  : "text-yellow-700 border-yellow-300 bg-yellow-50"
              }`}
            >
              {r.priority}
            </span>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 py-2 text-sm rounded-xl bg-linear-to-r from-[#7D4DF4] to-[#A589FD] text-white shadow hover:opacity-90 transition">
        View All Requests
      </button>
    </div>
  );
}
