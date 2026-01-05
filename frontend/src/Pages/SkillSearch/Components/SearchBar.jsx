import { useState, useEffect, useRef } from "react";
import { FaSearch, FaFilter } from "react-icons/fa";
import Button2 from "../../../components/ui/button";

export default function SearchBar({ onSearch, onFilterClick, userSkills = [] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  // Common skill suggestions
  const commonSkills = [
    "JavaScript", "Python", "Java", "C++", "React", "Node.js", 
    "SQL", "HTML/CSS", "Machine Learning", "Data Analysis",
    "UI/UX Design", "Project Management", "Communication", "Leadership"
  ];

  useEffect(() => {
    // Close suggestions when clicking outside
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // Generate suggestions based on user input and user's skills
    if (searchQuery.length > 0) {
      const filtered = [
        ...userSkills.map(s => s.title),
        ...commonSkills
      ]
        .filter(skill => 
          skill.toLowerCase().includes(searchQuery.toLowerCase()) &&
          skill.toLowerCase() !== searchQuery.toLowerCase()
        )
        .slice(0, 5);
      
      setSuggestions([...new Set(filtered)]); // Remove duplicates
      setShowSuggestions(true);
    } else {
      // Show user's skills as suggestions when search is empty
      setSuggestions(userSkills.slice(0, 5).map(s => s.title));
      setShowSuggestions(false);
    }
  }, [searchQuery, userSkills]);

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery);
      setShowSuggestions(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    if (onSearch) {
      onSearch(suggestion);
    }
  };

  const handleFocus = () => {
    if (searchQuery.length === 0 && userSkills.length > 0) {
      setSuggestions(userSkills.slice(0, 5).map(s => s.title));
      setShowSuggestions(true);
    }
  };

  return (
    <div className="flex items-center justify-center gap-4 w-full mb-6" ref={searchRef}>

      {/* Search Field */}
      <div className="relative w-full max-w-3xl">
        <div className="
          flex items-center
          bg-white
          shadow-md border-2 border-purple-200 
          rounded-2xl px-6 py-5
          w-full
          hover:border-purple-400 transition-colors
        ">
          <FaSearch className="text-purple-600 text-xl" />
          <input
            type="text"
            placeholder="Search skills here..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={handleFocus}
            className="ml-4 w-full outline-none text-gray-800 font-medium text-base bg-white"
          />
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-purple-200 py-2 z-50 max-h-60 overflow-y-auto">
            {searchQuery.length === 0 && userSkills.length > 0 && (
              <div className="px-4 py-2 text-xs text-gray-500 font-semibold">
                Your Skills - Click to search
              </div>
            )}
            {suggestions.map((suggestion, idx) => (
              <div
                key={idx}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-4 py-2 hover:bg-purple-50 cursor-pointer text-sm text-gray-700 transition flex items-center gap-2"
              >
                <FaSearch className="text-purple-400 text-xs" />
                <span>{suggestion}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Search Button */}
      <Button2 onClick={handleSearch}>
        Search
      </Button2>
    </div>
  );
}
