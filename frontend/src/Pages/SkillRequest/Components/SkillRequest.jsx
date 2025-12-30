import { useEffect, useState } from "react";
import NavBar from "../../../components/NavBar";
import CreateRequestButton from "./CreateRequestButton";
import RequestCard from "./RequestCard";
import CreateRequest from "./CreateRequest";

export default function SkillRequests() {
  const [openCreate, setOpenCreate] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState(""); // Filter state
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // FETCH REQUESTS FROM BACKEND
  const fetchRequests = async () => {
    try {
      const res = await fetch(`${API_URL}/requests`);
      const data = await res.json();
      setRequests(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Get unique categories for the dropdown
  const categories = Array.from(new Set(requests.map((r) => r.category)));

  return (
    <>
      <NavBar />

      <div className="bg-gradient-to-br from-[#F3E8FF] to-white w-5xl shadow-xl rounded-3xl mt-20 h-[80vh] p-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <p className="text-lg font-bold text-gray-900">Skill Request Board</p>
          <CreateRequestButton onClick={() => setOpenCreate(true)} />
        </div>

        {/* Filter Dropdown */}
        <div className="flex justify-end mt-4">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border rounded-lg px-3 py-2 text-gray-700"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Request Cards */}
        <div className="mt-10 space-y-4 overflow-y-auto h-[65%]">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : requests
              .filter((r) => !filterCategory || r.category === filterCategory)
              .map((r) => <RequestCard key={r._id} data={r} />)}
        </div>
      </div>

      {/* CREATE REQUEST POPUP */}
      {openCreate && (
        <CreateRequest
          onClose={() => setOpenCreate(false)}
          onSuccess={fetchRequests}
        />
      )}
    </>
  );
}
