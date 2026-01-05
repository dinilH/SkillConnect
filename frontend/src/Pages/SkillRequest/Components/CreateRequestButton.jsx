import { useState } from "react";
import { useAuth } from "../../../AuthContext";
import { useModal } from "../../../ModalContext";

export default function CreateRequestButton({ onRequestCreated }) {
  const { user, isAuthenticated } = useAuth();
  const { openAuthModal } = useModal();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    tags: [],
    category: "General",
    priority: "Medium",
    estimatedTime: "",
  });
  const [tagInput, setTagInput] = useState("");

  const handleClick = () => {
    if (!isAuthenticated) {
      openAuthModal("signin");
      return;
    }
    setShowModal(true);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm({ ...form, tags: [...form.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag) => {
    setForm({ ...form, tags: form.tags.filter((t) => t !== tag) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/skill-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify({
          ...form,
          authorId: user.id || user.userId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Skill request created successfully!");
        setShowModal(false);
        setForm({
          title: "",
          description: "",
          tags: [],
          category: "General",
          priority: "Medium",
          estimatedTime: "",
        });
        if (onRequestCreated) onRequestCreated();
      } else {
        alert("Failed to create request: " + data.message);
      }
    } catch (error) {
      console.error("Error creating request:", error);
      alert("Failed to create request");
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="px-5 py-2 rounded-xl text-white font-semibold bg-gradient-to-r from-[#6C38FF] to-[#A589FD] shadow-lg shadow-purple-300/40 backdrop-blur-xl border border-white/20 hover:scale-105 transition"
      >
        + Create Request
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-purple-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Create Skill Request</h2>
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 rounded-lg border border-purple-300 text-purple-700 hover:bg-purple-50 transition"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border-2 border-purple-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border-2 border-purple-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500 h-32"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full border-2 border-purple-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option>General</option>
                    <option>Frontend</option>
                    <option>Backend</option>
                    <option>Design</option>
                    <option>Marketing</option>
                    <option>Academic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    className="w-full border-2 border-purple-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Time
                </label>
                <input
                  type="text"
                  placeholder="e.g., 1-2 hours, 3-4 hours"
                  value={form.estimatedTime}
                  onChange={(e) => setForm({ ...form, estimatedTime: e.target.value })}
                  className="w-full border-2 border-purple-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                    placeholder="Add a tag..."
                    className="flex-1 border-2 border-purple-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-2"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-purple-900 hover:text-purple-700"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 rounded-xl border border-purple-300 text-purple-700 hover:bg-purple-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-[#7D4DF4] to-[#A589FD] text-white shadow hover:opacity-90 transition"
                >
                  Create Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
