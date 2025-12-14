import React from "react";

export default function ActiveMembers() {
  const active = [
    { name: "Alex Brown", time: "Just now" },
    { name: "Emma Davis", time: "2 min ago" },
    { name: "Chris Wilson", time: "5 min ago" },
  ];

  return (
    <div className="w-full bg-white backdrop-blur-xl border border-white/40 shadow-xl rounded-2xl p-6 text-gray-900">
      <h2 className="font-semibold text-lg mb-3">Active Members Now</h2>

      <div className="space-y-3">
        {active.map((m, i) => (
          <div
            key={i}
            className="flex items-center justify-between border rounded-lg p-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded" />

              <div>
                <p className="font-medium">{m.name}</p>
                <div className="flex items-center text-xs text-gray-500 gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  {m.time}
                </div>
              </div>
            </div>

            <button className="border px-3 py-1 text-sm rounded hover:bg-gray-50">
              Message
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
