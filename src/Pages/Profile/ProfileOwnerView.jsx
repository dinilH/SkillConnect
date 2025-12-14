import { useState } from "react"
import NavBar from "../../components/NavBar.jsx";
import {
  Home,
  MessageCircle,
  Bell,
  User,
  Search,
  PenTool,
  Github,
  Linkedin,
  Globe,
  Star,
  FlaskConical,
  ImageIcon,
  Calendar,
  MoreHorizontal,
  X,
  ThumbsUp,
  Share2,
  Send,
  ChevronLeft,
  Upload,
  Video,

} from "lucide-react"

export default function ProfileOwnerView() {
  // --- State Management ---
  const [posts, setPosts] = useState([
    {
      id: 1,
      name: "Person Name",
      time: "3d ago",
      content: "Just finished a great workshop on UX Accessibility. It's amazing how small changes can make such a big difference for users.",
      hasImage: true,
    },
    {
      id: 2,
      name: "Person Name",
      time: "5d ago",
      content: "Looking for recommendations for advanced React patterns. Drop your favorite resources below! 👇",
      hasImage: false,
    },
  ])

  const [portfolioLinks, setPortfolioLinks] = useState([
    { id: 1, title: "GitHub", url: "github.com/alex", icon: <Github className="w-5 h-5" /> },
    { id: 2, title: "LinkedIn", url: "linkedin.com/in/alex", icon: <Linkedin className="w-5 h-5" /> },
    { id: 3, title: "Website", url: "alex.dev", icon: <Globe className="w-5 h-5" /> },
  ]);

  const [showPortfolioEditor, setShowPortfolioEditor] = useState(false);
  const [newPortfolio, setNewPortfolio] = useState({ title: "", url: "" });
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [editId, setEditId] = useState(null); // <-- Important




  const [feedbackItems] = useState([
    { id: 1, name: "Sarah J.", rating: 5, comment: "Great collaborator and clear communicator!" },
    { id: 2, name: "Mike T.", rating: 3, comment: "Good technical skills, delivered on time." },
    { id: 3, name: "Jessica R.", rating: 4, comment: "Very professional approach." },
  ])

  // Modals State
  const [showEditModal, setShowEditModal] = useState(false)
  const [showPostModal, setShowPostModal] = useState(false)
  const [newPostContent, setNewPostContent] = useState("")

  const [profileData, setProfileData] = useState({
    coverImage: "from-blue-600 to-cyan-500",
    profileImage: "/user-profile-illustration.png", // Replace with your actual image path
    name: "Alex Anderson",
    pronouns: "(He/Him)",
    position: "Product Manager | UX Enthusiast",
    university: "Stanford University",
    description:
        "Passionate product manager with expertise in digital transformation. Creative problem solver committed to user-centric design and innovation.",
    skills: [
      { id: 1, title: "Web App Dev", sub: "(React/Next.js)", rating: 4 },
      { id: 2, title: "Mobile Dev", sub: "(Kotlin/Swift)", rating: 3 },
      { id: 3, title: "Backend", sub: "(Python/Django)", rating: 3 },
    ],
  })

  // We keep a separate state for the form so we can cancel edits without saving
  const [editFormData, setEditFormData] = useState(profileData)

  // --- Handlers ---

  const handlePostSubmit = () => {
    if (newPostContent.trim()) {
      const post = {
        id: posts.length + 1,
        name: profileData.name,
        time: "Just now",
        content: newPostContent,
        hasImage: false,
      }
      setPosts([post, ...posts])
      setNewPostContent("")
      setShowPostModal(false)
    }
  }

  const handleOpenEditModal = () => {
    setEditFormData(profileData) // Reset form to current data
    setShowEditModal(true)
  }

  const handleSaveProfile = () => {
    setProfileData(editFormData)
    setShowEditModal(false)
  }
  // eslint-disable-next-line no-unused-vars
  const [coverImageFile, setCoverImageFile] = useState(null);

// eslint-disable-next-line no-unused-vars
  const [profileImageFile, setProfileImageFile] = useState(null);


  const [showPokesPopup, setShowPokesPopup] = useState(false);
  const [newPokesCount, setNewPokesCount] = useState(3);

  // Example data: list of people who poked you
  const [pokesData] = useState([
    { id: 1, name: "Alice", avgRating: 4, avatar: "/avatar1.png" },
    { id: 2, name: "Bob", avgRating: 5, avatar: "/avatar2.png" },
    { id: 3, name: "Charlie", avgRating: 3, avatar: "/avatar3.png" },
  ]);




  return (

      <div className="min-h-screen bg-[#FFFFFF] font-sans text-gray-900">
        <NavBar />
        <main className="max-w-7xl mx-auto px-0 sm:px-4 py-6 pt-28">


        <div className="flex flex-col lg:flex-row gap-6">

            {/* ================= LEFT COLUMN (Profile & Feed) ================= */}
            <div className="flex-1 min-w-0">

              {/* --- Profile Card --- */}
              <div className="bg-white sm:rounded-xl shadow-[0_0_20px_#A589FD] overflow-hidden mb-4 relative">


              {/* Cover Image */}
                <div
                    className="h-40 sm:h-48 relative group rounded-b-xl overflow-hidden"
                    style={
                      profileData.coverImage?.startsWith("blob:")
                          ? { backgroundImage: `url(${profileData.coverImage})`, backgroundSize: "cover", backgroundPosition: "center" }
                          : { }
                    }
                >
                  {!profileData.coverImage?.startsWith("blob:") && (
                      <div className={`absolute inset-0 bg-gradient-to-r ${profileData.coverImage}`} />
                  )}

                  {/* Edit Button */}
                  <button
                      onClick={handleOpenEditModal}
                      className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur rounded-full shadow-sm hover:bg-[#E2D0F8] text-[#7D4DF4] transition-all opacity-0 group-hover:opacity-100 z-10"
                  >
                    <PenTool className="w-4 h-4" />
                  </button>
                </div>

                <div className="px-4 sm:px-8 pb-8 relative">
                  {/* Avatar */}
                  <div className="-mt-16 mb-4 flex justify-between items-end">
                    <div className="w-32 h-32 rounded-full border-4 border-white bg-white overflow-hidden shadow-md">
                      <img
                          src={profileData.profileImage || "/placeholder.svg"}
                          alt="Profile"
                          className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="mb-2 hidden sm:block">
                      <button
                          onClick={handleOpenEditModal}
                          className="flex items-center gap-2 border border-[#7D4DF4] text-[#7D4DF4] px-4 py-1.5 rounded-full hover:bg-[#E2D0F8] font-semibold text-sm transition-colors"
                      >
                        <PenTool className="w-3 h-3" /> Edit Profile
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row gap-8">

                    {/* Left: Info */}
                    <div className="flex-1">
                      <div className="mb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">

                          <h1 className="text-2xl font-bold text-black">
                            {profileData.name} <span className="text-gray-600 text-lg font-normal">{profileData.pronouns}</span>
                          </h1>

                          <span className="w-fit flex  items-center gap-1 text-blue-700 bg-blue-50 border border-blue-200 text-[12px] px-2 py-0.5 rounded font-medium">
                          <Star className="w-3 h-4 text-yellow-500 fill-yellow-500" />4.5
                        </span>
                        </div>

                        <p className="text-base text-black font-medium mb-1">{profileData.position}</p>
                        <p className="text-sm text-gray-600 font-medium">{profileData.university}</p>

                        <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                          <Globe className="w-3 h-3" /> Colombo, Western Province, Sri Lanka
                        </p>
                      </div>

                      <div className="mb-6 p-4 bg-[#E2D0F8] rounded-lg border border-[#A589FD]">
                        <h3 className="text-sm font-semibold mb-2 text-black">About</h3>
                        <p className="text-sm text-gray-700 leading-relaxed">{profileData.description}</p>
                      </div>

                      {/* Mobile Edit Button */}
                      <button
                          onClick={handleOpenEditModal}
                          className="w-full sm:hidden mb-4 flex items-center justify-center gap-2 border border-[#A589FD] py-2 rounded-full hover:bg-[#E2D0F8] font-semibold text-gray-700 text-sm"
                      >
                        Edit Profile
                      </button>

                      <div className="flex gap-3">

                        {/* Pokes button */}
                        <button
                            onClick={() => {
                              setShowPokesPopup(true);
                              setNewPokesCount(0);
                            }}
                            className=" rounded-full relative flex-1 bg-gradient-to-r text-white font-semibold bg-linear-to-r from-[#7D4DF4] to-[#A589FD] hover:to-[#703BEA]
           font-semibold text-sm shadow-sm transition-all"



                        >
                          Pokes
                          {newPokesCount > 0 && (
                              <span className="absolute top-0 right-0 -mt-1 -mr-1 w-5 h-5 text-xs flex items-center justify-center bg-red-500 text-white rounded-full">
      {newPokesCount}
    </span>
                          )}
                        </button>


                        {/* Share Profile */}
                        <button className="flex-1 border border-[#A589FD] py-2 rounded-full hover:bg-[#E2D0F8] text-black font-semibold text-sm transition-colors">
                          Share Profile
                        </button>
                      </div>
                    </div>

                    {/* ================= Pokes Popup ================= */}
                    {showPokesPopup && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn border-[#A589FD]">

                          {/* Backdrop */}
                          <div
                              className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
                              onClick={() => setShowPokesPopup(false)}
                          ></div>

                          {/* Popup */}
                          <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 animate-slideUp">

                            <div className="flex justify-between items-center mb-4">
                              <h3 className="text-lg font-semibold text-black border-b pb-1 w-full">
                                Who poked you 👆
                              </h3>
                            </div>

                            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">

                              {pokesData.length === 0 && (
                                  <p className="text-sm text-gray-600 text-center py-4">
                                    No one poked you yet 🙂
                                  </p>
                              )}

                              {pokesData.map((poked) => (
                                  <div
                                      key={poked.id}
                                      className="flex items-center justify-between p-3 rounded-xl border border-[#A589FD] hover:bg-[#E2D0F8] transition-colors"
                                  >
                                    <div className="flex items-center gap-3">
                                      <img
                                          src={poked.avatar}
                                          alt={poked.name}
                                          className="w-10 h-10 rounded-full border object-cover shadow-sm"
                                      />
                                      <span className="font-medium text-black">
                            {poked.name}
                          </span>
                                    </div>

                                    <div className="flex gap-1">
                                      {[1, 2, 3, 4, 5].map((i) => (
                                          <Star
                                              key={i}
                                              className={`w-4 h-4 ${
                                                  i <= poked.avgRating
                                                      ? "fill-yellow-400 text-yellow-400"
                                                      : "text-gray-300"
                                              }`}
                                          />
                                      ))}
                                    </div>
                                  </div>
                              ))}

                            </div>

                            <button
                                className="mt-5 w-full py-2 bg-[#7D4DF4] text-white rounded-full hover:bg-[#6939E8] font-semibold text-sm transition-all shadow-md"
                                onClick={() => setShowPokesPopup(false)}
                            >
                              Close
                            </button>
                          </div>
                        </div>
                    )}




                    {/* Right: Skills Box */}
                    <div className="lg:w-64 flex-shrink-0  ">
                      <div className="bg-white border  rounded-lg p-4 shadow-sm h-full bg-[#A589FD] border-[#A589FD]">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-bold text-sm">Top Skills</h3>
                          <PenTool
                              className="w-3 h-3 text-gray-400 cursor-pointer hover:text-blue-600"
                              onClick={handleOpenEditModal}
                          />
                        </div>
                        <div className="space-y-4">
                          {profileData.skills
                              .sort((a, b) => b.rating - a.rating)
                              .slice(0, showAllSkills ? profileData.skills.length : 3)
                              .map((skill) => (
                                  <SkillItem
                                      key={skill.id}
                                      icon={<FlaskConical className="w-4 h-4" />}
                                      title={skill.title}
                                      sub={skill.sub}
                                      stars={skill.rating}
                                  />
                              ))}
                        </div>

                        {profileData.skills.length > 3 && (
                            <button
                                className="w-full mt-4 py-2 text-xs font-semibold text-gray-500 border-t hover:bg-gray-50 transition-colors"
                                onClick={() => setShowAllSkills(!showAllSkills)}
                            >
                              {showAllSkills
                                  ? `Show top 3 skills`
                                  : `Show all ${profileData.skills.length} skills`}
                            </button>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* --- Start a Post (Trigger) --- */}
              <div className="bg-white sm:rounded-xl shadow-[0_0_20px_#A589FD] p-4 mb-4">
                <div className="flex gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                    <img src={profileData.profileImage} alt="Me" className="w-full h-full object-cover" />
                  </div>
                  <button
                      onClick={() => setShowPostModal(true)}
                      className="flex-1 text-left border border-gray-400 rounded-full px-5 py-3 text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors"
                  >
                    Start a post, {profileData.name.split(' ')[0]}...
                  </button>
                </div>
                <div className="flex justify-between px-4 pt-2">
                  <ActionButton icon={<ImageIcon className="w-5 h-5 text-blue-500" />} label="Media" onClick={() => setShowPostModal(true)} />
                  <ActionButton icon={<Calendar className="w-5 h-5 text-yellow-600" />} label="Event" onClick={() => setShowPostModal(true)} />
                  <ActionButton icon={<PenTool className="w-5 h-5 text-red-500" />} label="Write article" onClick={() => setShowPostModal(true)} />
                </div>
              </div>

              {/* --- Feed Posts --- */}
              <div className="space-y-4 ">
                {posts.map((post) => (
                    <PostCard key={post.id} {...post} currentUserImage={profileData.profileImage} />
                ))}
              </div>
            </div>

            {/* ================= RIGHT COLUMN ================= */}
            <div className="w-full lg:w-80 space-y-4">

              {/* --- Portfolio Links --- */}
              <div className="bg-[#FFFFFF] rounded-xl shadow-[0_0_20px_#A589FD] p-4">

                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-black text-sm">Portfolio Links</h3>

                  <button
                      onClick={() => setShowPortfolioEditor(true)}
                      className="text-black hover:text-[#7D4DF4]"
                  >
                    <PenTool className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-3">
                  {portfolioLinks.map((item) => (
                      <PortfolioLink
                          key={item.id}
                          icon={item.icon}
                          title={item.title}
                          url={item.url}
                          onEdit={() => {
                            setEditId(item.id);                      // switching to UPDATE mode
                            setNewPortfolio({ title: item.title, url: item.url });
                            setShowPortfolioEditor(true);
                          }}
                      />

                  ))}
                </div>

              </div>
              {showPortfolioEditor && (
                  <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                    <div className="bg-white w-80 p-5 rounded-xl shadow-xl space-y-4">

                      <h2 className="text-sm font-semibold text-black">
                        {editId ? "Update Portfolio Link" : "Add Portfolio Link"}
                      </h2>

                      <input
                          type="text"
                          placeholder="Platform Name (e.g., GitHub)"
                          value={newPortfolio.title}
                          onChange={(e) => setNewPortfolio({ ...newPortfolio, title: e.target.value })}
                          className="w-full border border-[#E2D0F8] px-3 py-2 rounded-md text-sm focus:ring-[#7D4DF4] focus:border-[#7D4DF4] focus:ring-1"
                      />

                      <input
                          type="text"
                          placeholder="URL (e.g., github.com/username)"
                          value={newPortfolio.url}
                          onChange={(e) => setNewPortfolio({ ...newPortfolio, url: e.target.value })}
                          className="w-full border border-[#E2D0F8] px-3 py-2 rounded-md text-sm focus:ring-[#7D4DF4] focus:border-[#7D4DF4] focus:ring-1"
                      />

                      <div className="flex justify-end gap-2">
                        <button
                            className="px-3 py-2 bg-[#E2D0F8] rounded-md text-sm hover:bg-[#A589FD] text-black"
                            onClick={() => {
                              setShowPortfolioEditor(false);
                              setEditId(null);
                              setNewPortfolio({ title: "", url: "" });
                            }}
                        >
                          Cancel
                        </button>

                        <button
                            className="px-3 py-2 bg-[#7D4DF4] text-white rounded-md text-sm hover:bg-[#A589FD]"
                            onClick={() => {
                              if (editId) {
                                // UPDATE EXISTING
                                setPortfolioLinks((prev) =>
                                    prev.map((item) =>
                                        item.id === editId
                                            ? { ...item, title: newPortfolio.title, url: newPortfolio.url }
                                            : item
                                    )
                                );
                              } else {
                                // ADD NEW
                                setPortfolioLinks((prev) => [
                                  ...prev,
                                  {
                                    id: Date.now(),
                                    title: newPortfolio.title,
                                    url: newPortfolio.url,
                                    icon: <Globe className="w-5 h-5" />,
                                  },
                                ]);
                              }

                              // Reset popup
                              setNewPortfolio({ title: "", url: "" });
                              setEditId(null);
                              setShowPortfolioEditor(false);
                            }}
                        >
                          {editId ? "Update" : "Add"}
                        </button>
                      </div>

                    </div>
                  </div>
              )}




              {/* --- Feedback --- */}
              <div className="bg-[#FFFFFF] rounded-xl shadow-[0_0_20px_#A589FD] p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-sm text-black">Feedback</h3>
                  <span className="text-xs bg-[#E3F9C2] text-black px-2 py-1 rounded-full font-medium">4.8 Avg</span>
                </div>
                <div className="space-y-4 mb-4">
                  {feedbackItems.map((item) => (
                      <div key={item.id} className="border-b border-[#A589FD] pb-3 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs font-bold text-black">{item.name}</span>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Star
                                    key={i}
                                    className={`w-2.5 h-2.5 ${
                                        i <= item.rating ? "fill-[#FFD700] text-[#FFD700]" : "text-[#E2D0F8]"
                                    }`}
                                />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-black italic">"{item.comment}"</p>
                      </div>
                  ))}
                </div>
              </div>

              {/* --- Similar Profiles --- */}
              <div className="bg-[#FFFFFF] rounded-xl shadow-[0_0_20px_#A589FD] p-4">
                <h3 className="font-bold text-sm mb-4 text-black">Similar skills Peers</h3>
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

        {/* ================= MODALS ================= */}

        {/* --- 1. CREATE POST POPUP --- */}
        {showPostModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 border-[#A589FD]">
              {/* Backdrop */}
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPostModal(false)}></div>

              {/* Modal Content */}
              <div className="bg-[#FFFFFF] rounded-xl shadow-2xl w-full max-w-lg relative z-10 flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-4 border-b border-[#A589FD]">
                  <h2 className="text-lg font-semibold text-black">Create a post</h2>
                  <button onClick={() => setShowPostModal(false)} className="text-black hover:bg-[#E2D0F8] p-2 rounded-full transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-4 flex-1 overflow-y-auto">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#E2D0F8] overflow-hidden">
                      <img src={profileData.profileImage} alt="Me" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-black">{profileData.name}</h4>
                      <button className="text-xs border border-[#E2D0F8] rounded-full px-2 py-0.5 text-black flex items-center gap-1 font-medium">
                        <Globe className="w-3 h-3" /> Anyone
                      </button>
                    </div>
                  </div>

                  <textarea
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      placeholder="What do you want to talk about?"
                      className="w-full h-40 resize-none text-base outline-none text-black placeholder:text-[#A589FD]"
                      autoFocus
                  />

                  {/* Visual placeholder for rich text actions */}
                  <div className="flex items-center gap-4 mt-2">
                    <button className="text-black hover:bg-[#E2D0F8] p-2 rounded-full"><ImageIcon className="w-5 h-5"/></button>
                    <button className="text-black hover:bg-[#E2D0F8] p-2 rounded-full"><Video className="w-5 h-5"/></button>
                    <button className="text-black hover:bg-[#E2D0F8] p-2 rounded-full"><Calendar className="w-5 h-5"/></button>
                    <button className="text-black hover:bg-[#E2D0F8] p-2 rounded-full"><MoreHorizontal className="w-5 h-5"/></button>
                  </div>
                </div>

                <div className="p-4 border-t border-[#E2D0F8] flex justify-end gap-3 bg-[#E2D0F8] rounded-b-xl">
                  <button
                      onClick={() => setShowPostModal(false)}
                      className="px-4 py-1.5 text-black font-medium hover:bg-[#A589FD] rounded-full transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                      disabled={!newPostContent.trim()}
                      onClick={handlePostSubmit}
                      className="px-6 py-1.5 bg-[#7D4DF4] text-white font-semibold rounded-full hover:bg-[#A589FD] disabled:bg-[#E2D0F8] disabled:cursor-not-allowed transition-colors"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
        )}

        {/* --- 2. EDIT PROFILE POPUP --- */}

        {showEditModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

              {/* Backdrop */}
              <div
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                  onClick={() => setShowEditModal(false)}
              />

              {/* Modal */}
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl relative z-10 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-800">Edit Profile</h2>
                  <button
                      onClick={() => setShowEditModal(false)}
                      className="text-gray-500 hover:bg-gray-100 p-2 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* BODY */}
                <div className="p-6 overflow-y-auto custom-scrollbar">

                  {/* Hidden Upload Inputs */}
                  <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="coverUpload"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setCoverImageFile(file);
                          const url = URL.createObjectURL(file);
                          setEditFormData({ ...editFormData, coverImage: url });
                        }
                      }}
                  />

                  <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="profileUpload"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setProfileImageFile(file);
                          const url = URL.createObjectURL(file);
                          setEditFormData({ ...editFormData, profileImage: url });
                        }
                      }}
                  />

                  {/* COVER IMAGE + GRADIENT */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Cover Image / Gradient
                      </label>

                      <button
                          className="text-xs text-blue-600 hover:underline"
                          onClick={() => document.getElementById("coverUpload").click()}
                      >
                        Upload Image
                      </button>
                    </div>

                    {/* COVER PREVIEW (only if user uploaded image) */}
                    {editFormData.coverImage?.startsWith("blob:") && (
                        <img
                            src={editFormData.coverImage}
                            className="w-full h-32 rounded-lg object-cover border mb-3"
                        />
                    )}

                    {/* Gradient Options */}
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {[
                        "from-blue-600 to-cyan-500",
                        "from-purple-600 to-pink-500",
                        "from-emerald-500 to-teal-700",
                        "from-orange-400 to-red-500",
                      ].map((gradient) => (
                          <button
                              key={gradient}
                              onClick={() =>
                                  setEditFormData({ ...editFormData, coverImage: gradient })
                              }
                              className={`w-20 h-12 bg-gradient-to-r ${gradient} rounded-lg border-2 flex-shrink-0 transition-all ${
                                  editFormData.coverImage === gradient
                                      ? "border-black ring-2 ring-black ring-offset-1"
                                      : "border-transparent"
                              }`}
                          />
                      ))}
                    </div>
                  </div>

                  {/* PROFILE IMAGE */}
                  <div className="flex items-center gap-6 mb-8 p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="relative">
                      <img
                          src={editFormData.profileImage || "/placeholder.svg"}
                          alt="Profile Preview"
                          className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-sm"
                      />

                      <div className="absolute bottom-0 right-0 bg-blue-600 p-1.5 rounded-full text-white border-2 border-white cursor-pointer"
                           onClick={() => document.getElementById("profileUpload").click()}
                      >
                        <Upload className="w-3 h-3" />
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900">Profile Photo</h3>
                      <p className="text-xs text-gray-500 mb-2">Recommended: 400×400px</p>

                      <button
                          className="text-xs font-semibold text-blue-600 hover:underline"
                          onClick={() => document.getElementById("profileUpload").click()}
                      >
                        Change Photo
                      </button>
                    </div>
                  </div>

                  {/* PERSONAL INFO */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                      <input
                          type="text"
                          value={editFormData.name}
                          onChange={(e) =>
                              setEditFormData({ ...editFormData, name: e.target.value })
                          }
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Pronouns</label>
                      <input
                          type="text"
                          value={editFormData.pronouns}
                          onChange={(e) =>
                              setEditFormData({ ...editFormData, pronouns: e.target.value })
                          }
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Headline</label>
                      <input
                          type="text"
                          value={editFormData.position}
                          onChange={(e) =>
                              setEditFormData({ ...editFormData, position: e.target.value })
                          }
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">University</label>
                      <input
                          type="text"
                          value={editFormData.university}
                          onChange={(e) =>
                              setEditFormData({ ...editFormData, university: e.target.value })
                          }
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                      />
                    </div>
                  </div>

                  {/* DESCRIPTION */}
                  <div className="mb-8">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">About</label>
                    <textarea
                        value={editFormData.description}
                        onChange={(e) =>
                            setEditFormData({ ...editFormData, description: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm resize-none h-24"
                    />
                  </div>

                  {/* SKILLS */}
                  <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                    <label className="block text-sm font-bold text-blue-900 mb-3">Highlighted Skills</label>

                    <div className="space-y-3">
                      {editFormData.skills.map((skill, idx) => (
                          <div
                              key={skill.id}
                              className="bg-white border border-gray-200 rounded-lg p-3 flex flex-col sm:flex-row gap-3 items-start sm:items-center"
                          >
                            <div className="flex-1 w-full grid grid-cols-2 gap-2">
                              <input
                                  type="text"
                                  value={skill.title}
                                  onChange={(e) => {
                                    const newSkills = [...editFormData.skills];
                                    newSkills[idx].title = e.target.value;
                                    setEditFormData({ ...editFormData, skills: newSkills });
                                  }}
                                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs font-semibold"
                                  placeholder="Skill"
                              />
                              <input
                                  type="text"
                                  value={skill.sub}
                                  onChange={(e) => {
                                    const newSkills = [...editFormData.skills];
                                    newSkills[idx].sub = e.target.value;
                                    setEditFormData({ ...editFormData, skills: newSkills });
                                  }}
                                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs text-gray-500"
                                  placeholder="Detail"
                              />
                            </div>

                            {/* Rating stars */}
                            <div className="flex gap-1 ml-auto">
                              {[1, 2, 3, 4, 5].map((i) => (
                                  <button
                                      key={i}
                                      onClick={() => {
                                        const newSkills = [...editFormData.skills];
                                        newSkills[idx].rating = i;
                                        setEditFormData({ ...editFormData, skills: newSkills });
                                      }}
                                      className="p-1 hover:scale-110 transition-transform"
                                  >
                                    <Star
                                        className={`w-4 h-4 ${
                                            i <= skill.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                        }`}
                                    />
                                  </button>
                              ))}
                            </div>
                          </div>
                      ))}
                    </div>

                    {/* Add Skill Button */}
                    <button
                        type="button"
                        onClick={() =>
                            setEditFormData({
                              ...editFormData,
                              skills: [
                                ...editFormData.skills,
                                { id: Date.now(), title: "", sub: "", rating: 0 },
                              ],
                            })
                        }
                        className="mt-3 px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                    >
                      + Add Skill
                    </button>
                  </div>

                </div>

                {/* FOOTER */}
                <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                  <button className="text-sm text-red-500 font-semibold hover:underline">
                    Delete Account
                  </button>

                  <div className="flex gap-3">
                    <button
                        onClick={() => setShowEditModal(false)}
                        className="px-5 py-2 border border-gray-300 rounded-full hover:bg-gray-200 text-gray-700 font-medium"
                    >
                      Cancel
                    </button>

                    <button
                        onClick={handleSaveProfile}
                        className="px-5 py-2 bg-blue-600 text-white rounded-full font-medium shadow-md hover:bg-blue-700 hover:shadow-lg"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
        )}
      </div>
  )
}

// --- Helper Components ---

function NavItem({ icon, label, active }) {
  return (
      <button className={`flex flex-col items-center gap-1 group relative h-full justify-center w-16 ${active ? 'border-b-2 border-black' : ''}`}>
        <div className={`transition-transform duration-200 group-hover:-translate-y-1 ${active ? 'text-black' : 'text-gray-500 group-hover:text-gray-900'}`}>
          {icon}
        </div>
        <span className={`text-[10px] sm:text-xs ${active ? 'text-black font-semibold' : 'text-gray-500 group-hover:text-gray-900'}`}>
        {label}
      </span>
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
              <div
                  key={i}
                  className={`p-0.5 rounded-sm`}
              >
                <Star className={`w-3 h-3 ${i <= stars ? "fill-gray-700 text-gray-700" : "text-gray-200"}`} />
              </div>
          ))}
        </div>
      </div>
  )
}

function ActionButton({ icon, label, onClick }) {
  return (
      <button
          onClick={onClick}
          className="flex items-center gap-2 text-gray-500 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors text-sm font-medium"
      >
        {icon}
        <span className="hidden sm:inline">{label}</span>
      </button>
  )
}

function PostCard({ name, time, content, hasImage, currentUserImage }) {
  return (
      <div className="bg-white rounded-xl shadow-[0_0_20px_#A589FD] p-0 overflow-hidden ">
        <div className="p-4 pb-2">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-800 overflow-hidden">
                <img src={currentUserImage || "/placeholder.svg"} alt="" className="w-full h-full object-cover"/>
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900 hover:text-blue-600 cursor-pointer">{name}</h4>
                <p className="text-xs text-gray-500">{time} • <Globe className="w-3 h-3 inline"/> </p>
              </div>
            </div>
            <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-800 mb-2 whitespace-pre-line leading-relaxed">{content}</p>
        </div>

        {hasImage && (
            <div className="w-full h-64 bg-gray-200 mb-2">
              <img src="/placeholder.svg" alt="Post content" className="w-full h-full object-cover" />
            </div>
        )}

        <div className="px-4 py-2 border-t border-gray-100 ">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <div className="flex items-center gap-1"><ThumbsUp className="w-3 h-3 bg-blue-500 text-white rounded-full p-0.5"/> 128</div>
            <div>5 comments • 2 shares</div>
          </div>
          <div className="flex justify-between border-t border-gray-100 pt-2">
            <PostAction icon={<ThumbsUp className="w-4 h-4" />} label="Like" />
            <PostAction icon={<MessageCircle className="w-4 h-4" />} label="Comment" />
            <PostAction icon={<Share2 className="w-4 h-4" />} label="Repost" />
            <PostAction icon={<Send className="w-4 h-4" />} label="Send" />
          </div>
        </div>
      </div>
  )
}
function PostAction({ icon, label }) {
  return (
      <button className="flex items-center gap-1.5 px-3 py-2 rounded text-gray-600 hover:bg-gray-100 font-medium text-sm transition-colors flex-1 justify-center">
        {icon}
        <span className="hidden sm:inline">{label}</span>
      </button>
  )
}

function PortfolioLink({ icon, title, url, onEdit }) {
  return (
      <div className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-md cursor-pointer transition-all bg-gray-50">

        <div className="text-gray-700 bg-white p-2 rounded shadow-sm">{icon}</div>

        <div className="flex-1 overflow-hidden">
          <p className="text-xs font-bold uppercase text-gray-800 tracking-wide">{title}</p>
          <p className="text-xs text-blue-600 truncate">{url}</p>
        </div>

        {/* EDIT BUTTON */}
        <button onClick={onEdit} className="text-gray-400 hover:text-[#7D4DF4]">
          <PenTool className="w-4 h-4" />
        </button>
      </div>
  );
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
