import React from "react";

export default function PopularMembers() {
  const members = [
    {
      name: "John Doe",
      status: "Available",
      skills: "React, TypeScript",
      rating: "4.8",
      endorsements: 15,
    },
    {
      name: "Jane Smith",
      status: "Busy",
      skills: "UI/UX Design",
      rating: "4.9",
      endorsements: 15,
    },
    {
      name: "Mike Johnson",
      status: "Available",
      skills: "Machine Learning",
      rating: "4.7",
      endorsements: 15,
    },
    {
      name: "Sarah Williams",
      status: "Available",
      skills: "Academic Writing",
      rating: "5.0",
      endorsements: 15,
    },
  ];

  return (
    <div className="w-full bg-white rounded-3xl shadow-lg border border-purple-200 p-6 text-gray-900 hover:shadow-purple-300/40 transition">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg text-gray-900">Popular Members</h2>
        <button className="text-sm px-3 py-1 rounded-lg border border-purple-300 text-purple-700 hover:bg-purple-50 transition">View All</button>
      </div>

      <div className="space-y-4">
        {members.map((m, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 rounded-2xl border border-purple-100 hover:border-purple-300 transition"
          >
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#6C38FF] via-[#4C2AFF] to-[#EC38F5] text-white flex items-center justify-center text-xs font-bold shadow-lg">IMG</div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-900">{m.name}</p>
                <span
                  className={`text-xs px-2 py-0.5 rounded-xl border ${
                    m.status === "Available"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-red-50 text-red-700 border-red-200"
                  }`}
                >
                  {m.status}
                </span>
              </div>

              <p className="text-sm text-gray-600">{m.skills}</p>

              <div className="flex items-center text-xs text-gray-500 mt-1">
                ⭐ {m.rating} <span className="mx-2 text-gray-300">•</span> {m.endorsements} endorsements
              </div>
            </div>

            <button className="px-3 py-1.5 text-sm rounded-xl bg-linear-to-r from-[#7D4DF4] to-[#A589FD] text-white shadow hover:opacity-90 transition">
              View Profile
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
