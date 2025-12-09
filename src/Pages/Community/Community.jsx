import React, { useState, useMemo } from "react";
import NavBar from "../../components/NavBar";

export default function CommunityPage() {
  const tabs = ["Discussions", "Mentorship", "Events", "Groups"];
  const [activeTab, setActiveTab] = useState("Discussions");

  const initialData = [
    {
      id: 1,
      title: "Best practices for learning React in 2024?",
      author: "Alex Chen",
      replies: 23,
      views: 145,
      category: "Coding",
      tags: ["React", "Learning", "BestPractices"],
      lastActivity: "5m ago",
      content: "What are the best resources and routine to learn React effectively?",
    },
    {
      id: 2,
      title: "Looking for study group - Data Structures",
      author: "Sarah Johnson",
      replies: 12,
      views: 89,
      category: "Academics",
      tags: ["DSA", "StudyGroup"],
      lastActivity: "1h ago",
      content: "Forming a study group to prepare for upcoming exams.",
    },
  ];

  const allTags = [
    "React",
    "JavaScript",
    "DSA",
    "WebDev",
    "Career",
    "StudyGroup",
    "BestPractices",
    "Learning",
  ];

  const [discussions, setDiscussions] = useState(initialData);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState("recent");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // new discussion form state
  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "",
    tags: [],
    content: "",
  });

  function toggleTag(tag) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function toggleFormTag(tag) {
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter((t) => t !== tag) : [...f.tags, tag],
    }));
  }

  function filteredDiscussions() {
    return discussions
      .filter((d) => {
        if (selectedCategory !== "All" && d.category !== selectedCategory) return false;
        if (selectedTags.length > 0 && !selectedTags.every((t) => d.tags.includes(t))) return false;
        if (search.trim() !== "") {
          const s = search.toLowerCase();
          return (
            d.title.toLowerCase().includes(s) ||
            d.author.toLowerCase().includes(s) ||
            d.content.toLowerCase().includes(s)
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "recent") return b.id - a.id; // crude recent by id
        if (sortBy === "views") return b.views - a.views;
        if (sortBy === "replies") return b.replies - a.replies;
        return 0;
      });
  }

  const visible = useMemo(filteredDiscussions, [discussions, search, selectedCategory, selectedTags, sortBy]);

  function openModal() {
    setForm({ title: "", author: "", category: "", tags: [], content: "" });
    setIsModalOpen(true);
  }

  function submitForm(e) {
    e.preventDefault();
    const newItem = {
      id: Date.now(),
      title: form.title || "Untitled",
      author: form.author || "Anonymous",
      replies: 0,
      views: 0,
      category: form.category || "General",
      tags: form.tags,
      lastActivity: "just now",
      content: form.content || "",
    };
    setDiscussions((d) => [newItem, ...d]);
    setIsModalOpen(false);
  }

  return (<>
    <NavBar />
    <div className=" bg-gradient-to-br from-[#F3E8FF] to-white w-5xl shadow-xl rounded-3xl mt-15 h-[80vh] mt-20">
      <div className="max-w-6xl mx-auto p-6">
        {/* Title */}
        <h1 className="text-2xl font-semibold mb-6 text-slate-900">Community</h1>

        {/* Tabs + New Button */}
        <div className="flex items-center justify-between mb-6">
        <div className="flex bg-white border rounded-lg overflow-hidden shadow-sm">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-6 py-2 text-sm ${activeTab === t ? "bg-gray-100 font-semibold" : "text-gray-600"}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={openModal}
            className="bg-gray-900 text-white px-4 py-2 rounded shadow hover:bg-black"
          >
            New Discussion
          </button>
        </div>
      </div>

      {/* Search + Filters Row */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-2">
          <div className="relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search discussions, authors, or content..."
              className="w-full border-2 border-purple-300 rounded-md px-4 py-2 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-purple-600 hover:text-purple-800 transition-colors font-medium"
              >
                Clear
              </button>
            )}
          </div>

          {/* Tag pills (search-level quick filters) */}
          <div className="mt-3 flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`text-sm px-3 py-1 rounded-full border transition-all ${selectedTags.includes(tag) ? "bg-purple-600 text-white border-purple-600" : "bg-white text-purple-700 border-purple-300 hover:border-purple-500"}`}>
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex flex-col gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border-2 border-purple-300 rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option>All</option>
            <option>Academics</option>
            <option>Coding</option>
            <option>Events</option>
            <option>General</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border-2 border-purple-300 rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="recent">Sort: Recent</option>
            <option value="views">Sort: Most views</option>
            <option value="replies">Sort: Most replies</option>
          </select>
        </div>
      </div>

      {/* Discussion list */}
      <div className="space-y-4">
        {visible.map((d) => (
          <div key={d.id} className="bg-white border rounded-lg shadow-sm p-4 flex gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-sm">IMG</div>

            <div className="flex-1">
              <h3 className="text-lg font-medium">{d.title}</h3>

              <div className="flex items-center gap-3 text-xs text-gray-500 mt-2 flex-wrap">
                <span>by {d.author}</span>
                <span className="w-px h-4 bg-gray-300" />
                <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-700">{d.category}</span>
                {d.tags.map((t) => (
                  <span key={t} className="ml-2 text-xs text-gray-500">#{t}</span>
                ))}
                <span className="text-gray-400">• Last activity: {d.lastActivity}</span>
              </div>

              <div className="flex gap-8 mt-3 text-sm text-gray-700">
                <span><strong>{d.replies}</strong> replies</span>
                <span><strong>{d.views}</strong> views</span>
              </div>
            </div>
          </div>
        ))}

        {visible.length === 0 && (
          <div className="text-center text-gray-500 py-10 bg-white border rounded">No discussions match your filters.</div>
        )}
      </div>
      </div>

      {/* New Discussion Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">New Discussion</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500">Close</button>
            </div>

            <form onSubmit={submitForm} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600">Title</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full border-2 border-purple-300 rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600">Author</label>
                  <input
                    value={form.author}
                    onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                    className="w-full border-2 border-purple-300 rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600">Category</label>
                  <input
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full border-2 border-purple-300 rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600">Tags (pick)</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {allTags.map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => toggleFormTag(t)}
                      className={`px-3 py-1 rounded-full text-sm border transition-all ${form.tags.includes(t) ? "bg-purple-600 text-white border-purple-600" : "bg-white text-purple-700 border-purple-300 hover:border-purple-500"}`}>
                      #{t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600">Content</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  className="w-full border-2 border-purple-300 rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent h-28"
                />
              </div>

              <div className="flex items-center justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-gray-900 text-white rounded">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  
  </>
);
}
