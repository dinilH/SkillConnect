

import NavBar from "../../../components/NavBar";
import CreateRequestButton from "./CreateRequestButton";
import RequestCard from "./RequestCard";

export default function SkillRequests() {
  const requests = [
    {
      title: "Need help with React Hooks and State Management",
      description: "Working on complex project, struggling with state...",
      tags: ["React", "JavaScript", "Frontend"],
      time: "2-3 hours",
      responses: 5,
      priority: "High",
      author: "Alex Chen",
      posted: "2 hours ago",
    },
    {
      title: "UI/UX feedback needed for mobile app design",
      description: "Created first draft screens, need expert review...",
      tags: ["UI/UX", "Mobile", "Figma"],
      time: "1 hour",
      responses: 3,
      priority: "Medium",
      author: "Sarah Johnson",
      posted: "5 hours ago",
    },
    {
      title: "Help with Calculus II - Integration problems",
      description: "Need help with integration by parts...",
      tags: ["Calculus", "Math", "Integration"],
      time: "1-2 hours",
      responses: 7,
      priority: "High",
      author: "Mike Wilson",
      posted: "1 day ago",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-[#F3E8FF] to-white w-full">

      <NavBar />

      <div className="max-w-7xl mx-auto pt-8 px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex justify-between items-center">
          <p className="text-lg font-bold text-gray-900">Skill Request Board</p>
          <CreateRequestButton />
        </div>

{/* Search Row (Dropdowns) */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
  {[
    {
      label: "All Categories",
      options: ["Frontend", "Backend", "Design", "Marketing"],
    },
    {
      label: "All Urgencies",
      options: ["Low", "Medium", "High", "Critical"],
    },
    {
      label: "All Departments",
      options: ["IT", "HR", "Finance", "Operations"],
    },
    {
      label: "Recents",
      options: ["Today", "This Week", "This Month"],
    },
  ].map((item, i) => (
    <div key={i} className="h-12 rounded-xl bg-white border border-purple-300 shadow-sm flex items-center px-4 text-sm font-medium text-gray-700">
      <select
        className="
          w-full bg-transparent outline-none
          text-gray-700 text-sm
          cursor-pointer
          appearance-none
        
        "
      >
        <option>{item.label}</option>
        {item.options.map((op, index) => (
          <option key={index}>{op}</option>
        ))}
      </select>

      {/* Arrow */}
    </div>
  ))}
</div>



        {/* Request List */}
        <div className="mt-10">
          {requests.map((r, i) => (
            <RequestCard key={i} data={r} />
          ))}
        </div>

      </div>
    </div>
  );
}
