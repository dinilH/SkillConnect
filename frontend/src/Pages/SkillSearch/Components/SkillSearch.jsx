import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import HorizontalFilters from "./HorizontalFilters";
import ProfileCard from "./ProfileCard";
import NavBar from "../../../components/NavBar";
import { useAuth } from "../../../AuthContext";

export default function SkillSearch() {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [currentUserSkills, setCurrentUserSkills] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
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

  // Fetch suggested users based on current user's skills
  useEffect(() => {
    if (user?.id || user?.userId) {
      fetchSuggestedUsers();
    }
  }, [user]);

  useEffect(() => {
    // Only fetch users if there's an actual search/filter criteria
    if (hasSearched) {
      fetchUsers();
    }
  }, [filters, hasSearched]);

  const fetchSuggestedUsers = async () => {
    try {
      const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const userId = user?.id || user?.userId;
      
      console.log("Fetching suggested users for userId:", userId);
      
      // Get current user's profile to find their skills
      const profileResponse = await fetch(`${apiBase}/profile/${userId}`, {
        credentials: 'include'
      });
      const profileData = await profileResponse.json();
      
      console.log("Profile data:", profileData);
      
      // Store current user's skills for comparison
      const userSkills = profileData.success && profileData.user?.skills ? profileData.user.skills : [];
      setCurrentUserSkills(userSkills);
      
      // Fetch users based on current user's skills or just get top rated users
      let query = "";
      if (userSkills.length > 0) {
        // Get the user's skill categories
        const userSkillTitles = userSkills.map(s => s.title).join(',');
        query = userSkillTitles;
        console.log("User has skills:", query);
      } else {
        console.log("User has no skills, fetching top users");
      }
      
      // Fetch users with similar or complementary skills
      const searchUrl = query 
        ? `${apiBase}/search/users?query=${query}&userId=${userId}`
        : `${apiBase}/search/users?userId=${userId}`;
      
      console.log("Fetching from:", searchUrl);
      
      const response = await fetch(searchUrl);
      const data = await response.json();
      
      console.log("Suggested users response:", data);
      
      if (data.success && data.data?.length > 0) {
        // Filter out current user and get top 10 suggested users
        const suggested = data.data
          .filter(u => u._id !== userId)
          .slice(0, 10);
        console.log("Setting suggested users:", suggested);
        setSuggestedUsers(suggested);
      } else {
        console.log("No suggested users found via search; falling back to /users");
        // Fallback: fetch general users list
        const allUsersRes = await fetch(`${apiBase}/users`, { credentials: 'include' });
        const allUsersData = await allUsersRes.json();
        if (allUsersData.success && Array.isArray(allUsersData.users)) {
          const fallbackSuggested = allUsersData.users
            .filter(u => u._id !== userId)
            .slice(0, 10);
          setSuggestedUsers(fallbackSuggested);
        }
      }
    } catch (error) {
      console.error("Error fetching suggested users:", error);
    }
  };

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
    setHasSearched(true);
    setFilters({ ...filters, query: searchQuery });
  };

  const handleFilterChange = (newFilters) => {
    setHasSearched(true);
    setFilters({ ...filters, ...newFilters });
  };

  // Helper function to determine why a user is suggested
  const getSuggestionReason = (suggestedUser) => {
    if (!suggestedUser.skills || suggestedUser.skills.length === 0) {
      return "Active member";
    }

    // If current user has no skills, suggest based on suggested user's top skill
    if (!currentUserSkills || currentUserSkills.length === 0) {
      const topSkill = suggestedUser.skills[0];
      return `Skilled in ${topSkill.title}`;
    }

    // Find skills that the suggested user has that current user doesn't have or is less proficient in
    const currentUserSkillMap = new Map(
      currentUserSkills.map(skill => [skill.title.toLowerCase(), skill.rating || 0])
    );

    // Look for skills where suggested user excels
    for (const skill of suggestedUser.skills) {
      const skillTitle = skill.title.toLowerCase();
      const currentUserRating = currentUserSkillMap.get(skillTitle);
      
      // If current user doesn't have this skill
      if (currentUserRating === undefined) {
        return `Skilled in ${skill.title}`;
      }
      
      // If suggested user has higher proficiency
      if ((skill.rating || 0) > currentUserRating) {
        return `Expert in ${skill.title}`;
      }
    }

    // Fallback: show the suggested user's top skill
    const topSkill = suggestedUser.skills[0];
    return `Skilled in ${topSkill.title}`;
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

        {/* Suggested Skilled Persons Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Suggested for You</h2>
          <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-purple-100">
            <div className="flex gap-4 min-w-max">
              {suggestedUsers && suggestedUsers.length > 0 ? (
                suggestedUsers.map((suggestedUser) => (
                  <div
                    key={suggestedUser._id}
                    className="w-72 bg-white rounded-2xl shadow-lg p-5 border border-purple-200 hover:shadow-purple-300/40 transition flex-shrink-0 cursor-pointer"
                    onClick={() => navigate(`/profile/${suggestedUser._id}`)}
                  >
                    {/* Profile Avatar */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#7D4DF4] to-[#A589FD] flex items-center justify-center text-white text-xl font-bold shadow-md">
                        {(suggestedUser.firstName||'')[0]?.toUpperCase()}{(suggestedUser.lastName||'')[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-base truncate">
                          {suggestedUser.firstName} {suggestedUser.lastName}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-purple-600 font-medium">
                          <span>💡 {getSuggestionReason(suggestedUser)}</span>
                          {suggestedUser.isOnline && (
                            <>
                              <span>•</span>
                              <span className="text-green-600 font-semibold">● Online</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Headline */}
                    {suggestedUser.headline && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {suggestedUser.headline}
                      </p>
                    )}

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1.5">
                      {suggestedUser.skills?.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs font-semibold rounded-lg bg-purple-100 text-purple-700 border border-purple-200"
                        >
                          {skill.title}
                        </span>
                      ))}
                      {suggestedUser.skills?.length > 3 && (
                        <span className="px-2 py-1 text-xs font-semibold text-gray-500">
                          +{suggestedUser.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                // Placeholder cards to keep the section visible
                Array.from({ length: 5 }).map((_, idx) => {
                  const gradients = [
                    'from-purple-200 to-pink-200',
                    'from-blue-200 to-cyan-200',
                    'from-green-200 to-emerald-200',
                    'from-orange-200 to-yellow-200',
                    'from-rose-200 to-purple-200'
                  ];
                  const gradient = gradients[idx % gradients.length];
                  return (
                  <div key={idx} className="w-72 bg-white rounded-2xl shadow-md p-5 border border-purple-200 flex-shrink-0">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${gradient} animate-pulse shadow-md`} />
                      <div className="flex-1">
                        <div className={`h-4 bg-gradient-to-r ${gradient} rounded w-32 mb-2 animate-pulse`} />
                        <div className={`h-3 bg-gradient-to-r ${gradient} rounded w-24 animate-pulse`} />
                      </div>
                    </div>
                    <div className={`h-3 bg-gradient-to-r ${gradient} rounded w-full mb-2 animate-pulse`} />
                    <div className={`h-3 bg-gradient-to-r ${gradient} rounded w-3/4 animate-pulse`} />
                  </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
        
        {/* Search Functionality and Results Card */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 border border-purple-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Search Matching Skilled Individuals</h2>
          
          <SearchBar onSearch={handleSearch} userSkills={currentUserSkills} />

          <HorizontalFilters onFilterChange={handleFilterChange} />
          
          {/* Search Results */}
          {hasSearched && (
            <div className="mt-8 pt-6 border-t border-purple-100">
              {searchLoading ? (
                <p className="text-gray-700 mb-4 text-sm">Loading...</p>
              ) : (
                <>
                  <p className="text-gray-700 mb-4 text-sm font-medium">{users.length} results found</p>
                  <div className="flex flex-col gap-6">
                    {users.map((u) => (
                      <ProfileCard key={u._id} user={u} />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

