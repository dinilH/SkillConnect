import { useState } from "react"
import {
  Home,
  MessageCircle,
  Bell,
  User,
  Search,
  Github,
  Linkedin,
  Globe,
  Star,
  FlaskConical,
  MoreHorizontal,
  X,
  ThumbsUp,
  Share2,
  Send,
  Handshake,
  ChevronLeft,
} from "lucide-react"

export default function ProfileViewerView({ onBack }) {
  const [feedbackItems, setFeedbackItems] = useState([
    { id: 1, name: "Person1", rating: 4, comment: "Great collaborator!" },
    { id: 2, name: "Person2", rating: 3, comment: "Good work overall" },
    { id: 3, name: "Person3", rating: 4, comment: "Very professional" },
  ])

  const [newFeedback, setNewFeedback] = useState({ rating: 0, comment: "" })
  const [hoverRating, setHoverRating] = useState(0)

  const handleFeedbackSubmit = () => {
    if (newFeedback.rating > 0 && newFeedback.comment.trim()) {
      const feedback = {
        id: feedbackItems.length + 1,
        name: "Visitor Name",
        rating: newFeedback.rating,
        comment: newFeedback.comment,
      }
      setFeedbackItems([...feedbackItems, feedback])
      setNewFeedback({ rating: 0, comment: "" })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* ================= HEADER ================= */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6 flex-1">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>
            <div className="w-10 h-10 border-2 border-gray-400 flex items-center justify-center bg-gray-50">
              <span className="text-xs font-bold text-gray-500">LOGO</span>
            </div>
            <div className="relative w-full max-w-md">
              <span className="absolute left-3 top-2.5 text-gray-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search (Skills / Name )"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <nav className="flex items-center gap-8">
            <NavItem icon={<Home className="w-6 h-6" />} label="Home" />
            <NavItem icon={<MessageCircle className="w-6 h-6" />} label="Messaging" />
            <NavItem icon={<Bell className="w-6 h-6" />} label="Notifications" />
            <NavItem icon={<User className="w-6 h-6" />} label="Me" />
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* ================= LEFT COLUMN ================= */}
          <div className="flex-1 min-w-0">
            {/* --- Profile Card --- */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
              {/* Cover Image */}
              <div className="h-40 bg-gradient-to-r from-slate-400 to-slate-500 relative"></div>

              <div className="px-6 pb-6">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Left: Avatar & Bio */}
                  <div className="flex-1">
                    <div className="-mt-20 mb-6 inline-block relative z-10">
                      <div className="w-32 h-32 rounded-full border-4 border-white bg-blue-500 overflow-hidden flex items-center justify-center shadow-lg">
                        <img
                          src="/user-profile-illustration.png"
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-2xl font-bold">Person name (He/Him)</h1>
                        <span className="text-blue-500 text-xs flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                          Verified
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 font-medium">Product Manager/Student...</p>
                      <p className="text-sm text-gray-500">University Name</p>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-sm font-semibold mb-1">About</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Passionate product manager with expertise in digital transformation. Creative problem solver
                        committed to user-centric design and innovation.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <button className="w-full flex items-center justify-center gap-2 border border-gray-400 py-2 rounded hover:bg-gray-50 font-medium text-sm transition-colors">
                        Projects
                      </button>
                      <div className="flex gap-3">
                        <button className="flex-1 border border-gray-400 py-2 rounded hover:bg-gray-50 font-medium text-sm">
                          Poke for Help
                        </button>

                        <button className="flex-1 border w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-medium text-sm transition-colors">
                          Send Message <Send className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  </div>

                  {/* Right: Skills Box */}
                  <div className="md:w-64">
                    <div className="border border-gray-300 rounded p-4 h-full">
                      <h3 className="font-bold text-sm mb-4">Skills</h3>
                      <div className="space-y-4">
                        <SkillItem
                          icon={<FlaskConical className="w-4 h-4" />}
                          title="Web App development"
                          sub="( With React )"
                          stars={4}
                        />
                        <SkillItem
                          icon={<FlaskConical className="w-4 h-4" />}
                          title="Mobile App Developm"
                          sub="( With Kotlin )"
                          stars={3}
                        />
                        <SkillItem
                          icon={<FlaskConical className="w-4 h-4" />}
                          title="Programming"
                          sub="( With Python, JAVA )"
                          stars={3}
                        />
                      </div>
                      <button className="mt-4 px-3 py-1 text-xs border border-gray-300 rounded text-gray-500 hover:bg-gray-50">
                        See More
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* --- Posts Feed --- */}
            <div className="space-y-4">
              <PostCard
                name="Name"
                time="3d ago"
                content="###################################################################"
                hasImage={true}
              />
              <PostCard
                name="Name"
                time="5d ago"
                content="###################################################################"
                hasImage={true}
              />
            </div>
          </div>

          {/* ================= RIGHT COLUMN ================= */}
          <div className="w-full lg:w-80 space-y-6">
            {/* --- Portfolio Links --- */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="font-bold text-gray-800 mb-4">Portfolio Links</h3>
              <div className="space-y-3">
                <PortfolioLink icon={<Github className="w-6 h-6" />} title="GITHUB" url="www............" />
                <PortfolioLink icon={<Linkedin className="w-6 h-6" />} title="LINKEDIN" url="www............" />
                <PortfolioLink icon={<Globe className="w-6 h-6" />} title="OWN WEB" url="www............" />
              </div>
              <div className="mt-4 flex justify-center border-t pt-2">
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* --- Feedback (Viewer can only add, not see others' feedback) --- */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1 bg-gray-800 rounded-full text-white">
                  <Star className="w-3 h-3 fill-white" />
                </div>
                <h3 className="font-bold">Feedback</h3>
              </div>

              <div className="border-t pt-4">
                <p className="text-xs font-semibold mb-3 text-gray-700">Rate this profile</p>
                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button
                      key={i}
                      onMouseEnter={() => setHoverRating(i)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setNewFeedback({ ...newFeedback, rating: i })}
                      className="p-1"
                    >
                      <Star
                        className={`w-5 h-5 transition-colors ${
                          i <= (hoverRating || newFeedback.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Share your feedback..."
                    value={newFeedback.comment}
                    onChange={(e) => setNewFeedback({ ...newFeedback, comment: e.target.value })}
                    className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={handleFeedbackSubmit}
                    disabled={newFeedback.rating === 0 || !newFeedback.comment.trim()}
                    className="p-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* --- Similar Profiles --- */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="font-bold text-sm mb-4">Other Similar Skills Profiles</h3>
              <div className="space-y-4">
                <SimilarProfile name="Alex Johnson" role="Senior Product Designer" showRating={true} />
                <SimilarProfile name="Jamie Smith" role="UX Research Lead" showRating={true} />
                <SimilarProfile name="Chris Brown" role="Head of Product Mgmt" showRating={true} />
                <SimilarProfile name="Dana Lee" role="Chief Usability Officer" showRating={true} />
                <SimilarProfile name="Pat Kim" role="Director of User Exp" showRating={true} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// Helper Components
function NavItem({ icon, label }) {
  return (
    <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-900 group">
      <div className="group-hover:scale-110 transition-transform">{icon}</div>
      <span className="text-[10px] uppercase font-medium tracking-wide">{label}</span>
    </button>
  )
}

function SkillItem({ icon, title, sub, stars }) {
  return (
    <div className="flex flex-col">
      <div className="flex items-start gap-2 mb-1">
        <div className="p-1 border border-gray-300 rounded">{icon}</div>
        <div>
          <p className="text-xs font-bold leading-tight">{title}</p>
          <p className="text-[10px] text-gray-500">{sub}</p>
        </div>
      </div>
      <div className="flex gap-0.5 pl-8">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`p-0.5 border border-gray-400 rounded-sm ${i <= stars ? "bg-gray-600" : "bg-transparent"}`}
          >
            <Star className={`w-2 h-2 ${i <= stars ? "fill-white text-white" : "text-gray-300"}`} />
          </div>
        ))}
      </div>
    </div>
  )
}

function PostCard({ name, time, content, hasImage }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm">{name}</h4>
            <p className="text-xs text-gray-500">{time}</p>
          </div>
        </div>
        <div className="flex gap-2 text-gray-400">
          <MoreHorizontal className="w-5 h-5 cursor-pointer" />
          <X className="w-5 h-5 cursor-pointer" />
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-4">{content}</p>
      {hasImage && <div className="h-48 bg-gray-200 rounded-md mb-4"></div>}
      <div className="flex justify-between border-t border-gray-100 pt-3">
        <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600 text-sm">
          <ThumbsUp className="w-4 h-4" /> Like
        </button>
        <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600 text-sm">
          <MessageCircle className="w-4 h-4" /> Comment
        </button>
        <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600 text-sm">
          <Share2 className="w-4 h-4" /> Share
        </button>
        <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600 text-sm">
          <Send className="w-4 h-4" /> Send
        </button>
      </div>
    </div>
  )
}

function PortfolioLink({ icon, title, url }) {
  return (
    <div className="flex items-center gap-3 p-3 border border-gray-300 rounded hover:bg-gray-50 cursor-pointer">
      <div className="text-gray-700">{icon}</div>
      <div className="flex-1 overflow-hidden">
        <p className="text-xs font-bold uppercase">{title}</p>
        <div className="flex items-center gap-1 text-gray-500">
          <span className="text-xs">🔗</span>
          <p className="text-[10px] truncate">{url}</p>
        </div>
      </div>
    </div>
  )
}

function SimilarProfile({ name, role, showRating }) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)

  return (
      <div className="flex flex-col gap-2 border-b border-gray-100 pb-3 last:border-0">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-8 h-8 rounded-full bg-gray-800 flex-shrink-0"></div>
            <div className="min-w-0">
              <p className="text-xs font-bold">{name}</p>
              <p className="text-[10px] text-gray-500 truncate">{role}</p>
            </div>
          </div>
          {showRating && (
              <div className="flex gap-0.5 ml-2">
                {[1, 2, 3, 4, 5].map((i) => (
                    <button
                        key={i}
                        onMouseEnter={() => setHoverRating(i)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(i)}
                        className="p-0.5"
                    >
                      <Star
                          className={`w-3 h-3 transition-colors ${
                              i <= (hoverRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                      />
                    </button>
                ))}
              </div>
          )}
        </div>
        <button className="w-full text-center border border-gray-400 rounded py-1 text-[10px] font-medium hover:bg-gray-50">
          View Profile
        </button>
      </div>
  )
}
