import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavBar from "../../../components/NavBar";
import CreateRequestButton from "./CreateRequestButton";
import RequestCard from "./RequestCard";
import { useAuth } from "../../../AuthContext";
import { ChevronDown, ChevronUp } from "lucide-react";
import ApplyToHelpDialog from "../../../components/ApplyToHelpDialog";

export default function SkillRequests() {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [myRequests, setMyRequests] = useState([]);
  const [assignedRequests, setAssignedRequests] = useState([]);
  const [otherRequests, setOtherRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "All Categories",
    priority: "All Urgencies",
    status: "",
  });
  const [showMyRequests, setShowMyRequests] = useState(true);
  const [showAssignedRequests, setShowAssignedRequests] = useState(true);
  const [showOtherRequests, setShowOtherRequests] = useState(true);
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requestToOpenResponses, setRequestToOpenResponses] = useState(null);

  // Check if we need to auto-open responses for a specific request (from notification)
  useEffect(() => {
    if (location.state?.openResponsesForRequest) {
      setRequestToOpenResponses(location.state.openResponsesForRequest);
      setShowMyRequests(true); // Expand My Requests section
      // Clear the state so it doesn't persist
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  // Redirect to home if not authenticated or when user logs out
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate, loading]);

  useEffect(() => {
    fetchRequests();
  }, [filters, user]);

  const fetchRequests = async () => {
    setRequestsLoading(true);
    try {
      const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      // Fetch my requests
      if (isAuthenticated && user) {
        const myResponse = await fetch(
          `${apiBase}/skill-requests/my/${user.id || user.userId}`
        );
        const myData = await myResponse.json();
        if (myData.success) {
          setMyRequests(myData.requests);
        }

        // Fetch assigned requests (where user is the helper)
        const assignedResponse = await fetch(
          `${apiBase}/skill-requests/assigned/${user.id || user.userId}`
        );
        const assignedData = await assignedResponse.json();
        if (assignedData.success) {
          setAssignedRequests(assignedData.requests);
        }
      }

      // Fetch other requests
      const params = new URLSearchParams();
      if (filters.category !== "All Categories") params.append("category", filters.category);
      if (filters.priority !== "All Urgencies") params.append("priority", filters.priority);
      if (user) params.append("userId", user.id || user.userId);

      const othersResponse = await fetch(
        `${apiBase}/skill-requests?${params}`
      );
      const othersData = await othersResponse.json();
      if (othersData.success) {
        setOtherRequests(othersData.requests);
      }
    } catch (error) {
      console.error("Error fetching skill requests:", error);
    } finally {
      setRequestsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Client-side filter function for requests
  const applyFilters = (requests) => {
    return requests.filter((request) => {
      // Category filter
      if (filters.category !== "All Categories" && request.category !== filters.category) {
        return false;
      }
      // Priority filter
      if (filters.priority !== "All Urgencies" && request.priority !== filters.priority) {
        return false;
      }
      // Status filter
      if (filters.status && request.status !== filters.status) {
        return false;
      }
      return true;
    });
  };

  // Get filtered requests
  const filteredMyRequests = applyFilters(myRequests);
  const filteredAssignedRequests = applyFilters(assignedRequests);
  const filteredOtherRequests = otherRequests; // Already filtered by backend

  const handleApplyToHelp = async (message) => {
    if (!isAuthenticated) {
      alert("Please login to apply for this request");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/skill-requests/${selectedRequest._id}/respond`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: 'include',
          body: JSON.stringify({
            userId: user.id || user.userId,
            message,
          }),
        }
      );

      const result = await response.json();
      if (result.success) {
        alert("Your response has been submitted!");
        fetchRequests();
      } else {
        alert(result.message || "Failed to submit response");
      }
    } catch (error) {
      console.error("Error applying to help:", error);
      alert("Failed to submit response");
    }
  };

  const openApplyDialog = (request) => {
    setSelectedRequest(request);
    setShowApplyDialog(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3E8FF] to-white w-full">
      <NavBar />

      <div className="max-w-7xl mx-auto pt-28 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#7D4DF4] to-[#A589FD] mb-3">Skill Request Board</h1>
            <p className="text-lg md:text-xl text-gray-700 font-medium">Request help from skilled members or offer your expertise to assist others in their projects.</p>
          </div>
          <CreateRequestButton onRequestCreated={fetchRequests} />
        </div>

        {/* Search Row (Dropdowns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="h-12 rounded-xl bg-white border border-purple-300 shadow-sm flex items-center px-4 text-sm font-medium text-gray-700">
            <select
              className="w-full bg-transparent outline-none text-gray-700 text-sm cursor-pointer"
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
            >
              <option>All Categories</option>
              <option>Frontend</option>
              <option>Backend</option>
              <option>Design</option>
              <option>Marketing</option>
              <option>Academic</option>
              <option>General</option>
            </select>
          </div>

          <div className="h-12 rounded-xl bg-white border border-purple-300 shadow-sm flex items-center px-4 text-sm font-medium text-gray-700">
            <select
              className="w-full bg-transparent outline-none text-gray-700 text-sm cursor-pointer"
              value={filters.priority}
              onChange={(e) => handleFilterChange("priority", e.target.value)}
            >
              <option>All Urgencies</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>
          </div>

          <div className="h-12 rounded-xl bg-white border border-purple-300 shadow-sm flex items-center px-4 text-sm font-medium text-gray-700">
            <select
              className="w-full bg-transparent outline-none text-gray-700 text-sm cursor-pointer"
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <button
            onClick={() => setFilters({ category: "All Categories", priority: "All Urgencies", status: "" })}
            className="h-12 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 border border-gray-300 shadow-sm px-4 text-sm font-semibold text-gray-700 transition-all"
          >
            Clear Filters
          </button>
        </div>

        {loading ? (
          <div className="mt-10 text-center text-gray-500">Loading requests...</div>
        ) : (
          <>
            {/* My Requests & Assigned Requests Section - Side by Side */}
            {isAuthenticated && (
              <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* My Requests Section */}
                <div>
                  <button
                    onClick={() => setShowMyRequests(!showMyRequests)}
                    className="w-full flex justify-between items-center bg-gradient-to-r from-[#7D4DF4] to-[#A589FD] text-white px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all"
                  >
                    <span className="text-lg font-bold">
                      My Skill Requests ({filteredMyRequests.length})
                    </span>
                    {showMyRequests ? (
                      <ChevronUp className="w-6 h-6" />
                    ) : (
                      <ChevronDown className="w-6 h-6" />
                    )}
                  </button>

                  {showMyRequests && (
                    <div className="mt-4 space-y-4">
                      {filteredMyRequests.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-purple-200 p-8 text-center text-gray-500">
                          {myRequests.length === 0 
                            ? "You haven't created any skill requests yet." 
                            : "No requests match the current filters."}
                        </div>
                      ) : (
                        filteredMyRequests.map((request) => (
                          <RequestCard
                            key={request._id}
                            data={request}
                            isOwner={true}
                            onUpdate={fetchRequests}
                            autoOpenResponses={requestToOpenResponses === request._id}
                          />
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Assigned Requests Section */}
                <div>
                  <button
                    onClick={() => setShowAssignedRequests(!showAssignedRequests)}
                    className="w-full flex justify-between items-center bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all"
                  >
                    <span className="text-lg font-bold">
                      Assigned Skill Requests ({filteredAssignedRequests.length})
                    </span>
                    {showAssignedRequests ? (
                      <ChevronUp className="w-6 h-6" />
                    ) : (
                      <ChevronDown className="w-6 h-6" />
                    )}
                  </button>

                  {showAssignedRequests && (
                    <div className="mt-4 space-y-4">
                      {filteredAssignedRequests.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-purple-200 p-8 text-center text-gray-500">
                          {assignedRequests.length === 0 
                            ? "You haven't been assigned to any requests yet." 
                            : "No assigned requests match the current filters."}
                        </div>
                      ) : (
                        filteredAssignedRequests.map((request) => (
                          <RequestCard
                            key={request._id}
                            data={request}
                            isOwner={false}
                            isAssigned={true}
                            onUpdate={fetchRequests}
                          />
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Other Requests Section - Accordion */}
            <div className="mt-10">
              <button
                onClick={() => setShowOtherRequests(!showOtherRequests)}
                className="w-full flex justify-between items-center bg-purple-600 text-white px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl hover:bg-purple-700 transition-all"
              >
                <span className="text-lg font-bold">
                  Available Skill Requests ({filteredOtherRequests.length})
                </span>
                {showOtherRequests ? (
                  <ChevronUp className="w-6 h-6" />
                ) : (
                  <ChevronDown className="w-6 h-6" />
                )}
              </button>

              {showOtherRequests && (
                <div className="mt-4 space-y-4 pb-10">
                  {filteredOtherRequests.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-purple-200 p-8 text-center text-gray-500">
                      No skill requests available at the moment.
                    </div>
                  ) : (
                    filteredOtherRequests.map((request) => (
                      <RequestCard
                        key={request._id}
                        data={request}
                        isOwner={false}
                        onUpdate={fetchRequests}
                        onApplyToHelp={openApplyDialog}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Apply to Help Dialog */}
      <ApplyToHelpDialog
        isOpen={showApplyDialog}
        onClose={() => setShowApplyDialog(false)}
        onSubmit={handleApplyToHelp}
        requestTitle={selectedRequest?.title || ""}
      />
    </div>
  );
}
