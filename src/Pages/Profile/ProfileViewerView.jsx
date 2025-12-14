import { useState } from "react"
import NavBar from "../../components/NavBar";

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
  ChevronLeft,
  CheckCircle,
  UserPlus,
  Mail
} from "lucide-react"

export default function ProfileViewerView() {
  // --- State ---
  const [isConnected, setIsConnected] = useState(false)

  const [feedbackItems, setFeedbackItems] = useState([
    { id: 1, name: "Sarah J.", rating: 5, comment: "An absolute pleasure to work with!" },
    { id: 2, name: "Mike T.", rating: 4, comment: "Great technical skills and communication." },
    { id: 3, name: "Jessica R.", rating: 4, comment: "Delivered the project on time." },
  ])

  // State for the NEW feedback being written by the viewer
  const [newFeedback, setNewFeedback] = useState({ rating: 0, comment: "" })
  const [hoverRating, setHoverRating] = useState(0)

  const handleFeedbackSubmit = () => {
    if (newFeedback.rating > 0 && newFeedback.comment.trim()) {
      const feedback = {
        id: feedbackItems.length + 1,
        name: "You", // In a real app, this would be the viewer's name
        rating: newFeedback.rating,
        comment: newFeedback.comment,
      }
      setFeedbackItems([feedback, ...feedbackItems])
      setNewFeedback({ rating: 0, comment: "" })
    }
  }

  return (
      <div className="min-h-screen bg-[#FFFFFF] font-sans text-gray-800">

        <NavBar />


        <main className="max-w-7xl mx-auto px-0 sm:px-4 py-6 pt-28">

          <div className="flex flex-col lg:flex-row gap-6">


          {/* ================= LEFT COLUMN ================= */}
            <div className="flex-1 min-w-0">
              {/* --- Profile Card --- */}
              <div className="bg-white sm:rounded-xl shadow-[0_0_20px_#A589FD] overflow-hidden mb-4 relative">
                {/* Cover Image */}
                <div className="h-40 sm:h-48 bg-gradient-to-r from-slate-500 to-slate-700 relative"></div>

                <div className="px-4 sm:px-8 pb-8 relative">
                  {/* Avatar */}
                  <div className="-mt-16 mb-4 inline-block relative z-10">
                    <div className="w-32 h-32 rounded-full border-4 border-white bg-white overflow-hidden shadow-md">
                      <img
                          src="/user-profile-illustration.png"
                          alt="Profile"
                          className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left: Info */}
                    <div className="flex-1">
                      <div className="mb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                          <h1 className="text-2xl font-bold text-gray-900">
                            Alex Anderson <span className="text-gray-500 text-lg font-normal">(He/Him)</span>
                          </h1>
                          <span className="w-fit flex  items-center gap-1 text-blue-700 bg-blue-50 border border-blue-200 text-[12px] px-2 py-0.5 rounded font-medium">
                          <Star className="w-3 h-4 text-yellow-500 fill-yellow-500" />4.5
                        </span>
                        </div>
                        <p className="text-base text-gray-900 font-medium mb-1">Product Manager | UX Enthusiast</p>
                        <p className="text-sm text-gray-500 font-medium">Stanford University</p>
                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                          <Globe className="w-3 h-3" /> Colombo, Western Province, Sri Lanka
                        </p>
                      </div>

                      {/* About Section */}
                      <div className="mb-6 p-4  rounded-lg bg-[#E2D0F8] rounded-lg border border-[#A589FD]">
                        <h3 className="text-sm font-semibold mb-2 text-gray-900">About</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Passionate product manager with expertise in digital transformation. Creative problem solver committed to user-centric design and innovation.
                        </p>
                      </div>

                      {/* Action Buttons (Viewer Perspective) */}
                      <div className="flex gap-3 mb-4">
                        <button
                            onClick={() => setIsConnected(!isConnected)}
                            className={`flex-1 flex  bg-gradient-to-r from-[#7D4DF4] to-[#00F0FF] items-center justify-center gap-2 py-2 rounded-full font-semibold text-sm transition-colors ${
                                isConnected
                                    ? "bg-white border border-gray-400 text-white hover:bg-gray-50"
                                    : " text-white font-semibold bg-linear-to-r from-[#7D4DF4] to-[#A589FD] shadow-md shadow-[#7D4DF4]/40 hover:opacity-90 transition"
                            }`}


                        >
                          {isConnected ? (
                              <>Poked</>
                          ) : (
                              <><UserPlus className="w-4 h-4" /> poke for help</>
                          )}
                        </button>

                        <button className="flex-1 flex items-center justify-center gap-2 border border-blue-600 text-blue-600 py-2 rounded-full hover:bg-blue-50 font-semibold text-sm transition-colors">
                          <Mail className="w-4 h-4" /> Message
                        </button>

                        <button className="px-3 border border-gray-400 rounded-full hover:bg-gray-50 text-gray-600">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Right: Skills Box */}
                    <div className="lg:w-64 flex-shrink-0">
                      <div className="bg-white border  rounded-lg p-4 shadow-sm h-full bg-[#A589FD] border-[#A589FD]">
                        <h3 className="font-bold text-sm mb-4">Top Skills</h3>
                        <div className="space-y-4">
                          <SkillItem
                              icon={<FlaskConical className="w-4 h-4" />}
                              title="Web App Dev"
                              sub="(React)"
                              stars={4}
                          />
                          <SkillItem
                              icon={<FlaskConical className="w-4 h-4" />}
                              title="Mobile Dev"
                              sub="(Kotlin)"
                              stars={3}
                          />
                          <SkillItem
                              icon={<FlaskConical className="w-4 h-4" />}
                              title="Programming"
                              sub="(Python)"
                              stars={3}
                          />
                        </div>
                        <button className="w-full mt-4 py-2 text-xs font-semibold text-gray-500 border-t hover:bg-gray-50 transition-colors">
                          Show all skills
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* --- Posts Feed --- */}
              <div className="space-y-4">
                <PostCard
                    name="Alex Anderson"
                    time="3d ago"
                    content="Just finished a great workshop on UX Accessibility. It's amazing how small changes can make such a big difference for users."
                    hasImage={true}
                />
                <PostCard
                    name="Alex Anderson"
                    time="5d ago"
                    content="Looking for recommendations for advanced React patterns. Drop your favorite resources below! 👇"
                    hasImage={false}
                />
              </div>
            </div>

            {/* ================= RIGHT COLUMN ================= */}
            <div className="w-full lg:w-80 space-y-4">

              {/* --- Portfolio Links --- */}
              <div className="bg-[#FFFFFF] rounded-xl shadow-[0_0_20px_#A589FD] p-4">
                <h3 className="font-bold text-gray-900 mb-4 text-sm">Portfolio Links</h3>
                <div className="space-y-3">
                  <PortfolioLink icon={<Github className="w-5 h-5" />} title="GitHub" url="github.com/alex" />
                  <PortfolioLink icon={<Linkedin className="w-5 h-5" />} title="LinkedIn" url="linkedin.com/in/alex" />
                  <PortfolioLink icon={<Globe className="w-5 h-5" />} title="Website" url="alex.dev" />
                </div>
              </div>

              {/* --- Feedback Section (Interactive) --- */}
              <div className="bg-white rounded-xl shadow-[0_0_20px_#A589FD] border border-gray-300 p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm">Feedback</h3>
                    <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full text-gray-600 font-medium">12 Reviews</span>
                  </div>
                  <div className="flex gap-0.5">

                    <span className="text-xs bg-[#E3F9C2] text-black px-2 py-1 rounded-full font-medium">4.8 Avg</span>
                  </div>
                </div>

                {/* Add Feedback Input */}
                <div className="bg-blue-50/50 rounded-lg p-3 border border-blue-100 shadow-[0_0_10px_#A589FD] mb-4">
                  <p className="text-xs font-semibold mb-2 text-gray-700">Leave a review for Alex</p>
                  <div className="flex gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <button
                            key={i}
                            onMouseEnter={() => setHoverRating(i)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setNewFeedback({ ...newFeedback, rating: i })}
                            className="p-0.5 focus:outline-none transition-transform hover:scale-110"
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
                        placeholder="Write a comment..."
                        value={newFeedback.comment}
                        onChange={(e) => setNewFeedback({ ...newFeedback, comment: e.target.value })}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    <button
                        onClick={handleFeedbackSubmit}
                        disabled={newFeedback.rating === 0 || !newFeedback.comment.trim()}
                        className="p-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-md transition-colors shadow-sm"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Feedback List */}
                <div className=" space-y-4 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                  {feedbackItems.map((item) => (
                      <div key={item.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs font-bold text-gray-800">{item.name}</span>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Star
                                    key={i}
                                    className={`w-2.5 h-2.5 ${
                                        i <= item.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"
                                    }`}
                                />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 italic">"{item.comment}"</p>
                      </div>
                  ))}
                </div>
              </div>

              {/* --- Similar Profiles --- */}
              <div className="bg-[#FFFFFF] rounded-xl shadow-[0_0_20px_#A589FD] p-4">
                <h3 className="font-bold text-sm mb-4 text-black">People with similar skills</h3>
                <div className="space-y-4">
                  {/* These are read-only views with Average ratings */}
                  <SimilarProfile name="Alex Johnson" role="Senior Product Designer" avgRating={4.8} />
                  <SimilarProfile name="Jamie Smith" role="UX Research Lead" avgRating={4.5} />
                  <SimilarProfile name="Chris Brown" role="Head of Product Mgmt" avgRating={4.9} />
                  <SimilarProfile name="Dana Lee" role="Chief Usability Officer" avgRating={4.2} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
  )
}

// --- Helper Components ---

function NavItem({ icon, label }) {
  return (
      <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-900 group">
        <div className="group-hover:scale-110 transition-transform">{icon}</div>
        <span className="text-[10px] sm:text-xs font-medium tracking-wide">{label}</span>
      </button>
  )
}

function SkillItem({ icon, title, sub, stars }) {
  return (
      <div className="flex items-center justify-between group cursor-default">
        <div className="flex items-start gap-3">
          <div className="p-1.5 bg-gray-100 rounded text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">{icon}</div>
          <div>
            <p className="text-sm font-bold leading-tight text-gray-800">{title}</p>
            <p className="text-[11px] text-gray-500">{sub}</p>
          </div>
        </div>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-0.5 rounded-sm">
                <Star className={`w-3 h-3 ${i <= stars ? "fill-gray-700 text-gray-700" : "text-gray-200"}`} />
              </div>
          ))}
        </div>
      </div>
  )
}

function PostCard({ name, time, content, hasImage }) {
  return (
      <div className="bg-white rounded-xl shadow-[0_0_20px_#A589FD] border border-gray-300 p-0 overflow-hidden">
        <div className="p-4 pb-2">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-800 overflow-hidden">
                {/* Placeholder Avatar */}
                <div className="w-full h-full bg-slate-300"></div>
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900 hover:text-blue-600 cursor-pointer">{name}</h4>
                <p className="text-xs text-gray-500">{time}</p>
              </div>
            </div>
            <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-800 mb-2 whitespace-pre-line leading-relaxed">{content}</p>
        </div>

        {hasImage && (
            <div className="w-full h-64 bg-gray-200 mb-2"></div>
        )}
        <div className="px-4 py-2 border-t border-gray-100">
          <div className="flex justify-between pt-1">
            <button className="flex items-center gap-1.5 px-3 py-2 rounded text-gray-600 hover:bg-gray-100 font-medium text-sm transition-colors flex-1 justify-center">
              <ThumbsUp className="w-4 h-4" /> <span className="hidden sm:inline">Like</span>
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded text-gray-600 hover:bg-gray-100 font-medium text-sm transition-colors flex-1 justify-center">
              <MessageCircle className="w-4 h-4" /> <span className="hidden sm:inline">Comment</span>
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded text-gray-600 hover:bg-gray-100 font-medium text-sm transition-colors flex-1 justify-center">
              <Share2 className="w-4 h-4" /> <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>
      </div>
  )
}

function PortfolioLink({ icon, title, url }) {
  return (
      <div className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-md cursor-pointer transition-all bg-gray-50">
        <div className="text-gray-700 bg-white p-2 rounded shadow-sm">{icon}</div>
        <div className="flex-1 overflow-hidden">
          <p className="text-xs font-bold uppercase text-gray-800 tracking-wide">{title}</p>
          <p className="text-xs text-blue-600 truncate">{url}</p>
        </div>
        <ChevronLeft className="w-4 h-4 text-gray-400 rotate-180" />
      </div>
  )
}

function SimilarProfile({ name, role, avgRating }) {
  return (
      <div className="flex items-center gap-3 border-b border-gray-100 pb-3 last:border-0 last:pb-0">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0"></div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <p className="text-sm font-semibold text-gray-900 truncate">{name}</p>
            {/* Static Average Rating Display */}
            <div className="flex items-center gap-1 bg-yellow-50 px-1.5 py-0.5 rounded border border-yellow-100">
              <Star className="w-2.5 h-2.5 fill-orange-400 text-orange-400" />
              <span className="text-[10px] font-bold text-orange-600">{avgRating}</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 truncate">{role}</p>
          <button className="mt-1 text-xs  bg-gradient-to-r text-white font-semibold bg-linear-to-r from-[#7D4DF4] to-[#A589FD] shadow-md shadow-[#7D4DF4]/40 hover:opacity-90 transition rounded-full px-3 py-1 hover:border-black hover:text-gray-700 transition-colors">
            View Profile
          </button>
        </div>
      </div>
  )
}