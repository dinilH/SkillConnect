export default function Filters() {
  return (
    <div className="
    p-6
      bg-white/50 backdrop-blur-xl
      rounded-3xl shadow-xl border border-white/30
      h-fit
      text-left
    ">
      {/* Title */}
      <h2 className="text-base font-bold text-gray-700 mb-2">
        Filters
      </h2>

      {/* Category */}
      <div className="mb-6">
        <p className="text-base font-bold text-gray-700 mb-2">Category</p>
        <input
          type="text"
          className="w-full px-3 py-2 rounded-xl border border-purple-300 outline-none"
          placeholder="Search category..."
        />
        <hr className="border-gray-300 mt-4" />
      </div>
      

      {/* Skill Level */}
      <div className="mb-6">
        <p className="text-base font-bold text-gray-700 mb-2">Skill Level</p>
        <div className="flex flex-col gap-2">
          {["Beginner", "Intermediate", "Advanced", "Expert"].map((level) => (
            <label
              key={level}
              className="flex items-center gap-2 text-gray-700 text-sm"
            >
              {level}
            </label>
          ))}
        </div>
        <hr className="border-gray-300 mt-4" />

      </div>

      {/* Availability */}
      <div className="mb-6">
        <p className="text-base font-bold text-gray-700 mb-2">Availability</p>
        <div className="flex flex-col gap-2">
          {["Available Now", "Busy"].map((item) => (
            <label
              key={item}
              className="flex items-center gap-2 text-gray-700 text-sm"
            >
              {item}
            </label>
          ))}
        </div>
        <hr className="border-gray-300 mt-4" />

      </div>

      {/* Maximum Rating */}
      <div className="mb-6">
        <p className="text-base font-bold text-gray-700 mb-2">Maximum Rating</p>
        <div className="flex flex-col gap-2 text-yellow-400 text-xl">
          {[
            { stars: 5, label: " & up" },
            { stars: 4, label: " & up" },
            { stars: 3, label: " & up" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-1">
              {Array.from({ length: item.stars }).map((_, i) => (
                <span key={i}>★</span>
              ))}
              <span className="text-xs text-black ml-1">{item.label}</span>
            </div>
          ))}
        </div>
        <hr className="border-gray-300 mt-4" />

      </div>

      {/* Verified / Other */}
      <div className="mb-2">
        <p className="text-base font-bold text-gray-700 mb-2">Other</p>

        <label className="flex items-center gap-2 text-gray-700 text-sm">
          Verified Only
        </label>
      </div>
    </div>
  );
}
