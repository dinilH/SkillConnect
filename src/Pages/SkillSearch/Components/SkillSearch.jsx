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
    <div className="bg-gradient-to-br from-[#F3E8FF] to-white w-5xl shadow-xl rounded-3xl">

<NavBar/>
      <SearchBar />

      <div className="mt-10 flex gap-6 pl-6">
        <Filters />

        <div className="flex-1 pr-6">
          <p className="text-gray-700 mb-4 text-sm">{users.length} results found</p>
          <div className="flex flex-col gap-6">
            {users.map((u, i) => (
              <ProfileCard key={i} user={u} />
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

