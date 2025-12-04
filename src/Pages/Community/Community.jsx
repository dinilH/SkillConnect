import React, { useState, useMemo } from "react";
import NavBar from "../../components/NavBar";
import CommunityTabs from "./Components/CommunityTabs";
import SearchFilters from "./Components/SearchFilters";
import DiscussionList from "./Components/DiscussionList";
import NewDiscussionModal from "./Components/NewDiscussionModal";
import Button2 from "../../components/ui/button";

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

export default function CommunityPage() {
  const tabs = ["Discussions", "Mentorship", "Events", "Groups"];
  const [activeTab, setActiveTab] = useState("Discussions");
  const [discussions, setDiscussions] = useState(initialData);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState("recent");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // new discussion form state (passed to modal)
  const [form, setForm] = useState({ title: "", author: "", category: "", tags: [], content: "" });

  function toggleTag(tag) {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  function submitForm(formData) {
    const newItem = {
      id: Date.now(),
      title: formData.title || "Untitled",
      author: formData.author || "Anonymous",
      replies: 0,
      views: 0,
      category: formData.category || "General",
      tags: formData.tags || [],
      lastActivity: "just now",
      content: formData.content || "",
    };
    setDiscussions((d) => [newItem, ...d]);
    setIsModalOpen(false);
  }

  function filteredDiscussions() {
    return discussions
      .filter((d) => {
        if (selectedCategory !== "All" && d.category !== selectedCategory) return false;
        if (selectedTags.length > 0 && !selectedTags.every((t) => d.tags.includes(t))) return false;
        if (search.trim() !== "") {
          const s = search.toLowerCase();
          return d.title.toLowerCase().includes(s) || d.author.toLowerCase().includes(s) || d.content.toLowerCase().includes(s);
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "recent") return b.id - a.id;
        if (sortBy === "views") return b.views - a.views;
        if (sortBy === "replies") return b.replies - a.replies;
        return 0;
      });
  }

  const visible = useMemo(filteredDiscussions, [discussions, search, selectedCategory, selectedTags, sortBy]);

  return (
    <>
      <NavBar />
      <div className="bg-gradient-to-br from-[#F3E8FF] to-white w-full shadow-xl rounded-3xl mt-20 px-6 py-8 min-h-[80vh]">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-semibold mb-6 text-slate-900">Community</h1>

          <div className="flex items-center justify-between mb-6">
            <CommunityTabs tabs={tabs} active={activeTab} setActive={setActiveTab} />
            <div>
              <Button2 onClick={() => { setForm({ title: "", author: "", category: "", tags: [], content: "" }); setIsModalOpen(true); }}>
                New Discussion
              </Button2>
            </div>
          </div>

          <SearchFilters
            search={search}
            setSearch={setSearch}
            allTags={allTags}
            selectedTags={selectedTags}
            toggleTag={toggleTag}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />

          <DiscussionList discussions={visible} />
        </div>
      </div>

      {isModalOpen && (
        <NewDiscussionModal
          allTags={allTags}
          form={form}
          setForm={setForm}
          onClose={() => setIsModalOpen(false)}
          onSubmit={submitForm}
        />
      )}
    </>
  );
}
