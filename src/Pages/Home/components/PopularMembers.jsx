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
    <div className="w-full bg-white backdrop-blur-xl border border-white/40 shadow-xl rounded-2xl p-6 text-gray-900">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold text-lg">Popular Members / Top Helpers</h2>
        <button className="text-sm text-blue-600 hover:underline">View All</button>
      </div>

      <div className="space-y-4">
        {members.map((m, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 border rounded-lg"
          >
            <div className="w-12 h-12 bg-gray-200 rounded" />

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold">{m.name}</p>
                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    m.status === "Available"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {m.status}
                </span>
              </div>

              <p className="text-sm text-gray-600">{m.skills}</p>

              <div className="flex items-center text-xs text-gray-500 mt-1">
                ⭐ {m.rating} &nbsp; • &nbsp; {m.endorsements} endorsements
              </div>
            </div>

            <button className="border px-3 py-1 text-sm rounded hover:bg-gray-50">
              View Profile
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
