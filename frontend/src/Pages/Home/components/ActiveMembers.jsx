import React from "react";

export default function ActiveMembers() {
  const active = [
    { name: "Alex Brown", time: "Just now" },
    { name: "Emma Davis", time: "2 min ago" },
    { name: "Chris Wilson", time: "5 min ago" },
  ];

  return (
    <div className="w-full bg-white rounded-3xl shadow-lg border border-purple-200 p-6 text-gray-900 hover:shadow-purple-300/40 transition">
      <h2 className="font-semibold text-lg mb-4 text-gray-900">Active Members Now</h2>

      <div className="space-y-3">
        {active.map((m, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-4 rounded-2xl border border-purple-100 hover:border-purple-300 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-linear-to-br from-[#6C38FF] via-[#4C2AFF] to-[#EC38F5] text-white flex items-center justify-center text-[10px] font-bold shadow">IMG</div>

              <div>
                <p className="font-medium text-gray-900">{m.name}</p>
                <div className="flex items-center text-xs text-gray-500 gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  {m.time}
                </div>
              </div>
            </div>

            <button className="px-3 py-1.5 text-sm rounded-xl bg-linear-to-r from-[#7D4DF4] to-[#A589FD] text-white shadow hover:opacity-90 transition">
              Message
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
