import { useState } from "react";

export default function CreateRequest({ onClose, onSuccess }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [skills, setSkills] = useState(["", "", "", ""]);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const handleSkillChange = (index, value) => {
    const updated = [...skills];
    updated[index] = value;
    setSkills(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await fetch(`${API_URL}/request/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          priority,
          skills: skills.filter(Boolean),
          description,
        }),
      });
      onClose();
      onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-200 max-h-[90vh] overflow-y-auto">
        
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-[#8b5cf6] via-[#7c3aed] to-[#8b5cf6] px-8 py-6 sticky top-0 z-10">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-2xl font-bold text-white pr-8 text-center">
            Post a New Request
          </h2>
          <p className="text-white/80 text-sm mt-1 text-center">Need help? Let the community know!</p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          
          {/* Title Input */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold mb-2 text-gray-700">
              <svg className="w-4 h-4 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              Title *
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What help do you need?"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 outline-none focus:border-[#8b5cf6] transition-colors"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold mb-2 text-gray-700">
              <svg className="w-4 h-4 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 outline-none focus:border-[#8b5cf6] transition-colors bg-white"
            >
              <option value="">Select Category</option>
              <option>Frontend</option>
              <option>Backend</option>
              <option>UI/UX</option>
              <option>Mobile Development</option>
              <option>DevOps</option>
              <option>Data Science</option>
              <option>Others</option>
            </select>
          </div>

          {/* Priority Selection */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold mb-3 text-gray-700">
              <svg className="w-4 h-4 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Priority
            </label>
            <div className="flex gap-3">
              {["Low", "Medium", "High"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-200 border-2 ${
                    priority === p
                      ? p === "Low"
                        ? "bg-green-500 text-white border-green-500 shadow-lg shadow-green-500/30"
                        : p === "Medium"
                        ? "bg-yellow-400 text-white border-yellow-400 shadow-lg shadow-yellow-400/30"
                        : "bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/30"
                      : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Skills Selection */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold mb-3 text-gray-700">
              <svg className="w-4 h-4 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              Required Skills
            </label>
            <div className="grid grid-cols-2 gap-3">
              {skills.map((skill, i) => (
                <select
                  key={i}
                  value={skill}
                  onChange={(e) => handleSkillChange(i, e.target.value)}
                  className="px-4 py-3 rounded-xl border-2 border-gray-200 outline-none focus:border-[#8b5cf6] transition-colors bg-white"
                >
                  <option value="">{`Skill ${i + 1}`}</option>
                  <option>React</option>
                  <option>Node.js</option>
                  <option>MongoDB</option>
                  <option>Figma</option>
                  <option>Python</option>
                  <option>TypeScript</option>
                  <option>AWS</option>
                  <option>Docker</option>
                </select>
              ))}
            </div>
          </div>

          {/* Description Textarea */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold mb-2 text-gray-700">
              <svg className="w-4 h-4 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              Description *
            </label>
            <textarea
              rows="5"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your request in detail... What are you trying to achieve? What specific help do you need?"
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
                Posting...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Post Request
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
