import { FaSearch, FaFilter } from "react-icons/fa";
import Button2 from "../../../components/ui/button";

export default function SearchBar({ onFilterClick }) {
  return (
    <div className="flex items-center gap-4 w-full mt-15 pt-6 pl-6 pr-6 ">

      {/* Search Field */}
      <div className="
        flex items-center
        bg-white
        shadow-lg border border-white/30 
        rounded-2xl px-5 py-4
        w-[100%] max-w-5xl

      ">
        <FaSearch className="text-purple-600 text-lg" />
        <input
          type="text"
          placeholder="Search skills here..."
          className="ml-3 w-full outline-none text-gray-800 font-medium text-sm bg-white"
        />
      </div>

      {/* Search Button */}
      <Button2>
        Search

      </Button2>

      {/* Filter Button */}
      <button
        onClick={onFilterClick}
        className="
          px-6 py-4 rounded-2xl
          border border-purple-300
          bg-white shadow-md hover:bg-purple-50
          flex items-center gap-2 text-purple-700 font-medium
          transition
        "
      >
        <FaFilter />
        Filters
      </button>
    </div>
  );
}
