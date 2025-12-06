import { useState } from 'react';
import { Student, Grade } from '../App';
import { Plus, Calculator, TrendingUp } from 'lucide-react';

interface GradeManagementProps {
  students: Student[];
  grades: Grade[];
  setGrades: (grades: Grade[]) => void;
}

export function GradeManagement({ students, grades, setGrades }: GradeManagementProps) {
  const [formData, setFormData] = useState({
    studentId: '',
    subject: '',
    midterm: '',
    finals: '',
    quizzes: '',
    projects: '',
  });

  const computeFinalGrade = (grade: Omit<Grade, 'finalGrade'>): number => {
    // Weighted average: Midterm 30%, Finals 40%, Quizzes 15%, Projects 15%
    return (
      grade.midterm * 0.3 +
      grade.finals * 0.4 +
      grade.quizzes * 0.15 +
      grade.projects * 0.15
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newGrade: Grade = {
      studentId: formData.studentId,
      subject: formData.subject,
      midterm: parseFloat(formData.midterm),
      finals: parseFloat(formData.finals),
      quizzes: parseFloat(formData.quizzes),
      projects: parseFloat(formData.projects),
    };
    newGrade.finalGrade = computeFinalGrade(newGrade);
    setGrades([...grades, newGrade]);
    setFormData({ studentId: '', subject: '', midterm: '', finals: '', quizzes: '', projects: '' });
  };

  const computeStatistics = () => {
    if (grades.length === 0) return null;

    const finalGrades = grades.map((g) => g.finalGrade || 0);
    const avg = finalGrades.reduce((a, b) => a + b, 0) / finalGrades.length;
    const min = Math.min(...finalGrades);
    const max = Math.max(...finalGrades);
    
    const variance = finalGrades.reduce((sum, grade) => sum + Math.pow(grade - avg, 2), 0) / finalGrades.length;
    const stdDev = Math.sqrt(variance);

    return { avg, min, max, stdDev };
  };

  const stats = computeStatistics();

  const getStudentName = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    return student ? student.name : 'Unknown';
  };

  const getLetterGrade = (grade: number) => {
    if (grade >= 90) return 'A';
    if (grade >= 80) return 'B';
    if (grade >= 70) return 'C';
    if (grade >= 60) return 'D';
    return 'F';
  };

  return (
    <div>
      <h2 className="mb-6" style={{ color: '#1B262C' }}>Grade Management</h2>

      <form onSubmit={handleSubmit} className="p-6 rounded-lg mb-6" style={{ backgroundColor: '#F8F9FA' }}>
        <h3 className="mb-4" style={{ color: '#1B262C' }}>Add Grade</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2">Student</label>
            <select
              required
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Select student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Subject</label>
            <input
              type="text"
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="e.g., Mathematics"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Midterm (0-100)</label>
            <input
              type="number"
              required
              min="0"
              max="100"
              step="0.01"
              value={formData.midterm}
              onChange={(e) => setFormData({ ...formData, midterm: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Finals (0-100)</label>
            <input
              type="number"
              required
              min="0"
              max="100"
              step="0.01"
              value={formData.finals}
              onChange={(e) => setFormData({ ...formData, finals: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Quizzes (0-100)</label>
            <input
              type="number"
              required
              min="0"
              max="100"
              step="0.01"
              value={formData.quizzes}
              onChange={(e) => setFormData({ ...formData, quizzes: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Projects (0-100)</label>
            <input
              type="number"
              required
              min="0"
              max="100"
              step="0.01"
              value={formData.projects}
              onChange={(e) => setFormData({ ...formData, projects: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 text-black rounded-lg transition-colors"
          style={{ backgroundColor: '#FFD700' }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#E6C200'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FFD700'}
        >
          <Plus className="w-4 h-4" />
          Add Grade
        </button>
      </form>

      {stats && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="w-5 h-5" style={{ color: '#3282B8' }} />
            <h3 style={{ color: '#1B262C' }}>Grade Statistics</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <p className="text-gray-600 mb-1">Average</p>
              <p style={{ color: '#1B262C' }}>{stats.avg.toFixed(2)}</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <p className="text-gray-600 mb-1">Std Deviation</p>
              <p style={{ color: '#1B262C' }}>{stats.stdDev.toFixed(2)}</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <p className="text-gray-600 mb-1">Highest</p>
              <p className="text-green-600">{stats.max.toFixed(2)}</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <p className="text-gray-600 mb-1">Lowest</p>
              <p className="text-red-600">{stats.min.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      {grades.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>No grades recorded yet. Add grades using the form above.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-gray-700">Student</th>
                <th className="px-4 py-3 text-left text-gray-700">Subject</th>
                <th className="px-4 py-3 text-left text-gray-700">Midterm</th>
                <th className="px-4 py-3 text-left text-gray-700">Finals</th>
                <th className="px-4 py-3 text-left text-gray-700">Quizzes</th>
                <th className="px-4 py-3 text-left text-gray-700">Projects</th>
                <th className="px-4 py-3 text-left text-gray-700">Final Grade</th>
                <th className="px-4 py-3 text-left text-gray-700">Letter</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((grade, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">{getStudentName(grade.studentId)}</td>
                  <td className="px-4 py-3">{grade.subject}</td>
                  <td className="px-4 py-3">{grade.midterm}</td>
                  <td className="px-4 py-3">{grade.finals}</td>
                  <td className="px-4 py-3">{grade.quizzes}</td>
                  <td className="px-4 py-3">{grade.projects}</td>
                  <td className="px-4 py-3">{grade.finalGrade?.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded ${
                        getLetterGrade(grade.finalGrade || 0) === 'A'
                          ? 'bg-green-100 text-green-700'
                          : getLetterGrade(grade.finalGrade || 0) === 'B'
                          ? 'bg-blue-100 text-blue-700'
                          : getLetterGrade(grade.finalGrade || 0) === 'C'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {getLetterGrade(grade.finalGrade || 0)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}