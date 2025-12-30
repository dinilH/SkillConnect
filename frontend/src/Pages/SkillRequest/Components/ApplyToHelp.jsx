import { useState } from "react";

export default function ApplyToHelp({ isOpen, onClose, request, onSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  if (!isOpen) return null;

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleSubmit = async () => {
    if (!name || !email) {
      alert("Name and email are required!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/applyToHelp/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: request._id,
          name,
          email,
          skills: selectedSkills,
          message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Server error");
      }

      // Success
      onSuccess?.();
      onClose();
      // Reset form
      setName("");
      setEmail("");
      setSelectedSkills([]);
      setMessage("");
    } catch (err) {
      console.error(err);
      alert(`Failed to submit application: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-200">
        
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
            Apply to Help
          </h2>
          <p className="text-white/80 text-sm mt-1">Share your skills and help others succeed</p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-5">
          
          {/* Name Input */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold mb-2 text-gray-700">
              <svg className="w-4 h-4 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Your Name *
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 outline-none focus:border-[#8b5cf6] transition-colors"
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold mb-2 text-gray-700">
              <svg className="w-4 h-4 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 outline-none focus:border-[#8b5cf6] transition-colors"
            />
          </div>

          {/* Skills Selection */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold mb-3 text-gray-700">
              <svg className="w-4 h-4 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              I can help with:
            </label>
            <div className="flex flex-wrap gap-2">
              {request?.skills?.map((skill, i) => (
                <label
                  key={i}
                  className={`group flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium cursor-pointer transition-all duration-200 border-2 ${
                    selectedSkills.includes(skill)
                      ? "bg-[#8b5cf6] text-white border-[#8b5cf6] shadow-md"
                      : "bg-white text-gray-700 border-gray-200 hover:border-[#8b5cf6] hover:bg-[#8b5cf6]/5"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedSkills.includes(skill)}
                    onChange={() => toggleSkill(skill)}
                    className="hidden"
                  />
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                    selectedSkills.includes(skill)
                      ? "bg-white border-white"
                      : "bg-white border-gray-300"
                  }`}>
                    {selectedSkills.includes(skill) && (
                      <svg className="w-3 h-3 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  {skill}
                </label>
              ))}
            </div>
          </div>

          {/* Message Textarea */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold mb-2 text-gray-700">
              <svg className="w-4 h-4 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Message (Optional)
            </label>
            <textarea
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us more about your experience and how you can help..."
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 resize-none outline-none focus:border-[#8b5cf6] transition-colors"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] hover:from-[#7c3aed] hover:to-[#6d28d9] text-white font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Sending...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Send Application
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
