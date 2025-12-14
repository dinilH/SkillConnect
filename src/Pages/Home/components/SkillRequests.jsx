import React from "react";

export default function SkillRequests() {
  const requests = [
    { title: "Need help with React Hooks", skill: "React", priority: "High" },
    { title: "Looking for UI/UX feedback", skill: "Design", priority: "Medium" },
    { title: "Help with Calculus assignment", skill: "Math", priority: "High" },
  ];

  return (
    <div className="w-full bg-white backdrop-blur-xl border border-white/40 shadow-xl rounded-2xl p-6 text-gray-900">
      <h2 className="font-semibold text-lg mb-3">Featured Skill Requests</h2>

      <div className="space-y-4">
        {requests.map((r, i) => (
          <div
            key={i}
            className="border rounded-lg p-4 flex justify-between items-start"
          >
            <div>
              <p className="font-medium">{r.title}</p>
              <p className="text-xs text-gray-500 mt-1">
                <span className="font-semibold">Skill:</span> {r.skill}
              </p>
            </div>

            <span
              className={`text-xs px-2 py-0.5 rounded border ${
                r.priority === "High"
                  ? "text-red-600 border-red-300 bg-red-50"
                  : "text-yellow-600 border-yellow-300 bg-yellow-50"
              }`}
            >
              {r.priority}
            </span>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 py-2 border rounded-lg text-sm hover:bg-gray-50">
        View All Requests
      </button>
    </div>
  );
}
