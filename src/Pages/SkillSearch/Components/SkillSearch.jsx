import SearchBar from "./SearchBar";
import Filters from "./Filters";
import ProfileCard from "./ProfileCard";
import NavBar from "../../../components/NavBar";

export default function SkillSearch() {
  const users = [
    {
      name: "Sarah Williams",
      rating: "5.0",
      time: "< 1 hour",
      skills: ["React", "TypeScript", "Node.js"],
      level: "Expert",
    },
    {
      name: "Mike Johnson",
      rating: "4.8",
      time: "< 3 hours",
      skills: ["Python", "Machine Learning", "Data Science"],
      level: "Advanced",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-[#F3E8FF] to-white w-full">

      <NavBar />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <SearchBar />

        <div className="mt-8 flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-64 shrink-0">
            <Filters />
          </div>

          <div className="flex-1">
            <p className="text-gray-700 mb-4 text-sm">{users.length} results found</p>
            <div className="flex flex-col gap-6">
              {users.map((u, i) => (
                <ProfileCard key={i} user={u} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

