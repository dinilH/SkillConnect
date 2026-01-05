import { useState } from "react";
import { X, Plus, Trash2, Star, FlaskConical } from "lucide-react";

export default function SkillsOnboardingModal({ isOpen, onClose, onComplete, userId, onSkillsUpdate }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({
    title: "",
    sub: "",
    rating: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Common skill suggestions for quick add and autosuggest
  const COMMON_SKILLS = [
    "Web Development",
    "UI/UX Design",
    "JavaScript",
    "React",
    "Node.js",
    "Python",
    "Java",
    "C++",
    "Data Analysis",
    "Machine Learning",
    "Cloud Computing",
    "Video Editing",
    "Entrepreneurship",
    "Project Management",
    "Graphic Design",
    "SQL",
    "NoSQL",
    "Django",
    "Flask",
    "Tailwind CSS"
  ];

  // Dynamic subcategory suggestions based on skill name
  const getSubcategorySuggestions = (skillName) => {
    const skill = skillName.toLowerCase();
    
    const subcategoryMap = {
      'web development': ['Frontend', 'Backend', 'Full Stack', 'React', 'Vue.js', 'Angular'],
      'javascript': ['React', 'Vue.js', 'Node.js', 'Express', 'TypeScript', 'Next.js'],
      'python': ['Django', 'Flask', 'FastAPI', 'Data Science', 'Machine Learning', 'Automation'],
      'ui/ux design': ['Figma', 'Adobe XD', 'Sketch', 'Wireframing', 'Prototyping', 'User Research'],
      'graphic design': ['Photoshop', 'Illustrator', 'Logo Design', 'Branding', 'Typography', 'InDesign'],
      'data analysis': ['Excel', 'Python', 'R', 'SQL', 'Tableau', 'Power BI'],
      'machine learning': ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Deep Learning', 'NLP', 'Computer Vision'],
      'cloud computing': ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'DevOps'],
      'java': ['Spring Boot', 'Hibernate', 'Maven', 'Android', 'JavaFX', 'Servlets'],
      'react': ['Hooks', 'Redux', 'Next.js', 'React Native', 'Context API', 'Material-UI'],
      'node.js': ['Express', 'MongoDB', 'REST API', 'GraphQL', 'Socket.io', 'Nest.js'],
    };

    // Find matching skill
    for (const [key, values] of Object.entries(subcategoryMap)) {
      if (skill.includes(key) || key.includes(skill)) {
        return values;
      }
    }

    // Default suggestions if no match
    return ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  };

  const subcategorySuggestions = getSubcategorySuggestions(newSkill.title);

  if (!isOpen) return null;

  const handleAddSkill = () => {
    if (newSkill.title.trim() && newSkill.rating > 0) {
      setSkills([...skills, { ...newSkill }]);
      setNewSkill({ title: "", sub: "", rating: 0 });
    }
  };

  const handleRemoveSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleSkipForNow = () => {
    onClose();
    onComplete();
  };

  const handleComplete = async () => {
    if (skills.length === 0) {
      handleSkipForNow();
      return;
    }

    setIsSubmitting(true);
    try {
      const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${apiBase}/profile/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify({ skills }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update user in localStorage and context
        if (onSkillsUpdate && data.user) {
          onSkillsUpdate(data.user);
        }
        onComplete();
        onClose();
      } else {
        alert(data.message || "Failed to save skills. Please try again.");
      }
    } catch (error) {
      console.error("Error saving skills:", error);
      alert("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    {
      title: "Welcome to SkillConnect! 🎉",
      subtitle: "Let's set up your profile by adding your skills",
      content: (
        <div className="text-center py-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
            <FlaskConical className="w-12 h-12 text-white" />
          </div>
          <p className="text-gray-600 mb-4">
            Adding your skills helps others find you and allows you to:
          </p>
          <ul className="text-left max-w-md mx-auto space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">•</span>
              <span>Connect with peers who share similar interests</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">•</span>
              <span>Get matched with relevant skill requests</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">•</span>
              <span>Showcase your expertise to the community</span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: "Add Your Skills",
      subtitle: "Rate your proficiency from 1-5 stars",
      content: (
        <div className="space-y-6">
          {/* Add New Skill Form */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-800 mb-3">Add a Skill</h4>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Skill name (e.g., JavaScript, Design Thinking)"
                value={newSkill.title}
                onChange={(e) => setNewSkill({ ...newSkill, title: e.target.value })}
                className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
                onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                list="skill-suggestions"
              />
              <datalist id="skill-suggestions">
                {COMMON_SKILLS.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
              <input
                type="text"
                placeholder="Subcategory (optional, e.g., React, UI/UX)"
                value={newSkill.sub}
                onChange={(e) => setNewSkill({ ...newSkill, sub: e.target.value })}
                className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
                onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                list="subskill-suggestions"
              />
              <datalist id="subskill-suggestions">
                {subcategorySuggestions.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
              <div>
                <p className="text-xs text-gray-600 mb-2">Proficiency Level</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setNewSkill({ ...newSkill, rating })}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          rating <= newSkill.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleAddSkill}
                disabled={!newSkill.title.trim() || newSkill.rating === 0}
                className="w-full py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Skill
              </button>
            </div>
          </div>

          {/* Skills List */}
          {skills.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-3">Your Skills ({skills.length})</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3 hover:border-purple-300 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">{skill.title}</p>
                      {skill.sub && <p className="text-xs text-gray-500">{skill.sub}</p>}
                      <div className="flex gap-0.5 mt-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i <= skill.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveSkill(index)}
                      className="ml-3 p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {skills.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-sm">
              No skills added yet. Add at least one skill to continue.
            </div>
          )}
        </div>
      ),
    },
  ];

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 relative">
          <button
            onClick={handleSkipForNow}
            className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold mb-1">{currentStepData.title}</h2>
          <p className="text-purple-100 text-sm">{currentStepData.subtitle}</p>
          
          {/* Progress Dots */}
          <div className="flex gap-2 mt-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full transition-all ${
                  index === currentStep
                    ? "bg-white"
                    : index < currentStep
                    ? "bg-purple-300"
                    : "bg-purple-400/30"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-240px)]">
          {currentStepData.content}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 flex justify-between items-center bg-gray-50">
          <div className="text-sm text-gray-500">
            {skills.length === 0 ? 'Add at least one skill to continue' : `${skills.length} skill${skills.length > 1 ? 's' : ''} added`}
          </div>
          
          <div className="flex gap-3">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-6 py-2 border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 font-medium text-sm transition-all"
              >
                Back
              </button>
            )}
            
            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 font-medium text-sm transition-all"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={isSubmitting || skills.length === 0}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed font-medium text-sm transition-all"
              >
                {isSubmitting ? "Saving..." : "Complete Setup"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
