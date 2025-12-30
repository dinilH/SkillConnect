import React from "react";

export default function SkillCategories() {
  const categories = [
    "UI/UX Design",
    "Web Development",
    "Cloud Computing",
    "Video Editing",
    "Entrepreneurship",
  ];

  return (
    <div className="w-full flex justify-center py-8">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-lg border border-purple-200 p-6 hover:shadow-purple-300/40 transition">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Skill Categories</h2>
        <div className="flex flex-wrap gap-3">
          {categories.map((skill, index) => (
            <span
              key={index}
              className="px-4 py-2 text-sm font-semibold rounded-xl text-purple-700 border border-purple-500 shadow-md bg-white hover:bg-purple-50 transition cursor-pointer"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
