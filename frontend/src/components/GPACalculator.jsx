import { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useModal } from '../ModalContext';

export default function GPACalculator() {
  const { isAuthenticated, user } = useAuth();
  const { openAuthModal } = useModal();
  const [courses, setCourses] = useState([
    { id: 1, name: '', credits: '', grade: '' }
  ]);
  const [gpa, setGpa] = useState(null);
  const [saving, setSaving] = useState(false);

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

    if (totalCredits > 0) {
      setGpa((totalPoints / totalCredits).toFixed(2));
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
      const response = await fetch(`http://localhost:5000/api/users/${user.id || user.userId}/gpa`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ gpa })
      });

      const data = await response.json();
      if (data.success) {
        alert('GPA saved successfully!');
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

          <button
            onClick={saveGPA}
            disabled={saving}
            className="mt-4 w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : isAuthenticated ? 'Save GPA to Profile' : 'Login to Save GPA'}
          </button>
        </>
      )}

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          <strong>Note:</strong> This calculator uses the standard 4.0 GPA scale. 
          Enter your course credits and select the grade you received to calculate your GPA.
        </p>
      </div>
    </div>
  );
}
