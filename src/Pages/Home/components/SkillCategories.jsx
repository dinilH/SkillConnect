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
    <div className="w-full flex justify-center py-10">
      <div className="w-full max-w-5xl bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Skill Categories</h2>
        <div className="flex flex-wrap gap-4">
          {categories.map((skill, index) => (
            <div
              key={index}
              className="px-6 py-3 bg-gray-100 border rounded-xl shadow-sm text-gray-700 font-medium hover:shadow transition duration-200 cursor-pointer"
            >
              {skill}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
