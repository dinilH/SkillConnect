import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import Filters from "./Filters";
import ProfileCard from "./ProfileCard";
import NavBar from "../../../components/NavBar";
import { useAuth } from "../../../AuthContext";

export default function SkillSearch() {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [filters, setFilters] = useState({
    query: "",
    category: "",
    skillLevel: "",
    availability: "",
    minRating: "",
    verifiedOnly: false,
  });

  // Redirect to home if not authenticated or when user logs out
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate, loading]);

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    setSearchLoading(true);
    try {
      const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const params = new URLSearchParams();
      
      if (filters.query) params.append("query", filters.query);
      if (filters.category) params.append("category", filters.category);
      if (filters.skillLevel) params.append("skillLevel", filters.skillLevel);
      if (filters.availability) params.append("availability", filters.availability);
      if (filters.minRating) params.append("minRating", filters.minRating);
      if (filters.verifiedOnly) params.append("verifiedOnly", "true");
      if (user) params.append("userId", user.id || user.userId);

      const response = await fetch(`${apiBase}/search/users?${params}`);
      const data = await response.json();

      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  const handleSearch = (searchQuery) => {
    setFilters({ ...filters, query: searchQuery });
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#F3E8FF] to-white w-full">
      <NavBar />

      <div className="max-w-7xl mx-auto pt-32 px-4 sm:px-6 lg:px-8">
        {/* Description */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#7D4DF4] to-[#A589FD] mb-3">Skill Search</h1>
          <p className="text-lg md:text-xl text-gray-700 font-medium">Find talented members by searching for specific skills, expertise levels, or filter by categories to connect with the right people.</p>
        </div>
        
        <SearchBar onSearch={handleSearch} />

        <div className="mt-8 flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-64 shrink-0">
            <Filters onFilterChange={handleFilterChange} />
          </div>

          <div className="flex-1">
            {loading ? (
              <p className="text-gray-700 mb-4 text-sm">Loading...</p>
            ) : (
              <>
                <p className="text-gray-700 mb-4 text-sm">{users.length} results found</p>
                <div className="flex flex-col gap-6">
                  {users.map((u) => (
                    <ProfileCard key={u._id} user={u} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

