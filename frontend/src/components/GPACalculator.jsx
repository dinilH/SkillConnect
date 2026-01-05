import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useModal } from '../ModalContext';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';

export default function GPACalculator() {
  const { isAuthenticated, user, updateUser } = useAuth();
  const { openAuthModal } = useModal();
  const [courses, setCourses] = useState([
    { id: 1, name: '', credits: '', grade: '' }
  ]);
  const [gpa, setGpa] = useState(null);
  const [currentGpa, setCurrentGpa] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showPastModules, setShowPastModules] = useState(false);
  const [pastModules, setPastModules] = useState([]);
  const [loadingModules, setLoadingModules] = useState(false);

  const gradePoints = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'F': 0.0
  };

  const addCourse = () => {
    setCourses([...courses, { id: Date.now(), name: '', credits: '', grade: '' }]);
  };

  const removeCourse = (id) => {
    if (courses.length > 1) {
      setCourses(courses.filter(course => course.id !== id));
    }
  };

  const updateCourse = (id, field, value) => {
    setCourses(courses.map(course => 
      course.id === id ? { ...course, [field]: value } : course
    ));
  };

  const calculateGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;

    // Calculate from current courses
    for (let course of courses) {
      if (course.credits && course.grade) {
        const credits = parseFloat(course.credits);
        const points = gradePoints[course.grade];
        
        if (!isNaN(credits) && points !== undefined) {
          totalPoints += credits * points;
          totalCredits += credits;
        }
      }
    }

    // Include past modules in calculation
    for (let module of pastModules) {
      const credits = parseFloat(module.credits);
      const points = gradePoints[module.grade];
      
      if (!isNaN(credits) && points !== undefined) {
        totalPoints += credits * points;
        totalCredits += credits;
      }
    }

    if (totalCredits > 0) {
      const calculated = (totalPoints / totalCredits).toFixed(2);
      setGpa(calculated);
      // persist locally to show "current GPA" next visits
      try {
        localStorage.setItem('skillconnect_current_gpa', calculated);
        localStorage.setItem('skillconnect_gpa_last_calculated', new Date().toISOString());
        setCurrentGpa(calculated);
      } catch {}
    } else {
      setGpa(null);
    }
  };

  const resetCalculator = () => {
    setCourses([{ id: Date.now(), name: '', credits: '', grade: '' }]);
    setGpa(null);
  };

  const saveGPA = async () => {
    if (!isAuthenticated) {
      openAuthModal('signin');
      return;
    }

    if (gpa === null) {
      alert('Please calculate your GPA first');
      return;
    }

    setSaving(true);
    try {
      // Prepare modules data from current courses
      const modulesToSave = courses
        .filter(course => course.name && course.credits && course.grade)
        .map(course => ({
          name: course.name,
          credits: parseFloat(course.credits),
          grade: course.grade,
          semester: '', // Can be extended to capture semester info
          year: new Date().getFullYear(),
          completedAt: new Date()
        }));

      const response = await fetch(`http://localhost:5000/api/users/${user.id || user.userId}/gpa`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ 
          gpa,
          modules: modulesToSave
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('GPA and modules saved successfully!');
        // Update user context with new GPA
        updateUser({ ...user, gpa: parseFloat(gpa) });
        // Reload past modules
        fetchModuleHistory();
        // Reset current courses
        setCourses([{ id: Date.now(), name: '', credits: '', grade: '' }]);
      } else {
        alert('Failed to save GPA: ' + data.message);
      }
    } catch (error) {
      console.error('Error saving GPA:', error);
      alert('Failed to save GPA. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const fetchModuleHistory = async () => {
    if (!isAuthenticated || !user) return;

    setLoadingModules(true);
    try {
      const response = await fetch(`http://localhost:5000/api/users/${user.id || user.userId}/modules`, {
        credentials: 'include'
      });

      const data = await response.json();
      if (data.success) {
        setPastModules(data.moduleHistory || []);
        if (data.gpa) {
          setCurrentGpa(data.gpa);
        }
      }
    } catch (error) {
      console.error('Error fetching module history:', error);
    } finally {
      setLoadingModules(false);
    }
  };

  const deleteModule = async (moduleId) => {
    if (!window.confirm('Are you sure you want to delete this module?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/users/${user.id || user.userId}/modules/${moduleId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const data = await response.json();
      if (data.success) {
        setPastModules(data.moduleHistory || []);
        alert('Module deleted successfully!');
      } else {
        alert('Failed to delete module: ' + data.message);
      }
    } catch (error) {
      console.error('Error deleting module:', error);
      alert('Failed to delete module. Please try again.');
    }
  };

  // Load previously calculated GPA, if any
  useEffect(() => {
    try {
      const stored = localStorage.getItem('skillconnect_current_gpa');
      if (stored) {
        setCurrentGpa(stored);
      }
    } catch {}
  }, []);

  // Fetch module history when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchModuleHistory();
    }
  }, [isAuthenticated, user]);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">GPA Calculator</h2>
        <button
          onClick={resetCalculator}
          className="text-sm text-gray-600 hover:text-gray-800 underline"
        >
          Reset
        </button>
      </div>

      {currentGpa && isAuthenticated && (
        <div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <p className="text-sm text-gray-700">
            Your current GPA is <span className="font-semibold text-purple-700">{currentGpa}</span>
          </p>
        </div>
      )}

      {/* Past Modules Section - Collapsible */}
      {isAuthenticated && pastModules.length > 0 && (
        <div className="mb-4 border border-purple-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setShowPastModules(!showPastModules)}
            className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-800">Past Modules ({pastModules.length})</h3>
              <span className="text-xs text-gray-600">
                Total Credits: {pastModules.reduce((sum, m) => sum + parseFloat(m.credits || 0), 0)}
              </span>
            </div>
            {showPastModules ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </button>
          
          {showPastModules && (
            <div className="p-4 bg-white max-h-64 overflow-y-auto">
              {loadingModules ? (
                <p className="text-sm text-gray-500 text-center py-4">Loading modules...</p>
              ) : (
                <div className="space-y-2">
                  {pastModules.map((module) => (
                    <div
                      key={module._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 text-sm">{module.name}</p>
                        <div className="flex gap-3 mt-1">
                          <span className="text-xs text-gray-600">{module.credits} credits</span>
                          <span className="text-xs font-semibold text-purple-600">Grade: {module.grade}</span>
                          {module.year && (
                            <span className="text-xs text-gray-500">{module.year}</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteModule(module._id)}
                        className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete module"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="space-y-4">
        {courses.map((course, index) => (
          <div key={course.id} className="grid grid-cols-12 gap-3 items-center">
            <div className="col-span-12 sm:col-span-5">
              <input
                type="text"
                placeholder="Course Name (optional)"
                value={course.name}
                onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
              />
            </div>
            
            <div className="col-span-5 sm:col-span-2">
              <input
                type="number"
                placeholder="Credits"
                value={course.credits}
                onChange={(e) => updateCourse(course.id, 'credits', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
                min="0"
                step="0.5"
              />
            </div>
            
            <div className="col-span-5 sm:col-span-3">
              <select
                value={course.grade}
                onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
              >
                <option value="">Grade</option>
                {Object.keys(gradePoints).map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>
            
            <div className="col-span-2 sm:col-span-2">
              <button
                onClick={() => removeCourse(course.id)}
                className="w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={courses.length === 1}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addCourse}
        className="mt-4 w-full py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-purple-500 hover:text-purple-600 transition font-medium"
      >
        + Add Course
      </button>

      <button
        onClick={calculateGPA}
        className="mt-6 w-full bg-gradient-to-r from-[#7D4DF4] to-[#A589FD] text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
      >
        Calculate GPA
      </button>

      {gpa !== null && (
        <>
          <div className="mt-6 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border-2 border-purple-200">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Your GPA</p>
              <p className="text-5xl font-bold text-purple-600">{gpa}</p>
              <p className="text-sm text-gray-500 mt-2">out of 4.0</p>
            </div>
          </div>

          {isAuthenticated ? (
            <button
              onClick={saveGPA}
              disabled={saving}
              className="mt-4 w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save GPA to Profile'}
            </button>
          ) : (
            <div className="mt-6 p-6">
              <p className="text-lg font-semibold text-gray-800 mb-4 text-center">
                Want to see the leaderboard?
              </p>
              <button
                onClick={() => openAuthModal('signin')}
                className="w-full sm:w-auto mx-auto block px-8 py-3 bg-green-600 text-white text-base rounded-lg font-semibold hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Login to Save GPA
              </button>
            </div>
          )}
        </>
      )}

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          <strong>Note:</strong> This calculator uses the standard 4.0 GPA scale. 
          Enter your course credits and select the grade you received to calculate your GPA.
          {pastModules.length > 0 && (
            <span className="block mt-1 text-purple-700 font-medium">
              ✓ Your past modules are automatically included in the calculation.
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
