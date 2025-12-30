import { useEffect, useState } from "react";

export default function ViewApplications({ isOpen, onClose, request }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    if (!isOpen) return;

    const fetchApplications = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/applyToHelp/${request._id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch");
        setApplications(data.applications || []);
      } catch (err) {
        console.error(err);
        alert("Failed to load applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [isOpen, request._id]);

  if (!isOpen) return null;

  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-200">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-[#8b5cf6] via-[#7c3aed] to-[#8b5cf6] px-8 py-6">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-2xl font-bold text-white pr-8">
            Responses for "{request.title}"
          </h2>
        </div>

        {/* Content */}
        <div className="p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">Loading applications...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-gray-600 font-medium">No applications yet</p>
              <p className="text-gray-400 text-sm mt-1">Check back later for new responses</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {applications.map((app) => (
                <div
                  key={app._id}
                  className="group bg-white border-2 border-purple-200 rounded-2xl p-6 hover:shadow-xl hover:border-purple-400 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg text-gray-800 group-hover:text-purple-600 transition-colors">
                      {app.name}
                    </h3>
                    <span className="text-xs text-gray-400 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                      {new Date(app.createdAt).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm text-gray-600">{app.email}</span>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="flex flex-wrap gap-2">
                        {app.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium border border-purple-300"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {app.message && (
                      <div className="mt-3 pt-3 border-t border-purple-100">
                        <div className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-indigo-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                          </svg>
                          <p className="text-sm text-gray-600 leading-relaxed">{app.message}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f3e8ff;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #a78bfa;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #8b5cf6;
        }
      `}</style>
    </div>
  );
}
