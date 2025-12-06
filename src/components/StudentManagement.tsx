import { useState } from 'react';
import { Student } from '../App';
import { Plus, Edit2, Trash2, Save, X, Users } from 'lucide-react';

interface StudentManagementProps {
  students: Student[];
  setStudents: (students: Student[]) => void;
}

export function StudentManagement({ students, setStudents }: StudentManagementProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    course: '',
    enrollmentDate: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setStudents(
        students.map((s) =>
          s.id === editingId ? { ...formData, id: editingId } : s
        )
      );
      setEditingId(null);
    } else {
      const newStudent: Student = {
        ...formData,
        id: Date.now().toString(),
      };
      setStudents([...students, newStudent]);
      setIsAdding(false);
    }
    setFormData({ name: '', email: '', course: '', enrollmentDate: new Date().toISOString().split('T')[0] });
  };

  const handleEdit = (student: Student) => {
    setEditingId(student.id);
    setFormData({
      name: student.name,
      email: student.email,
      course: student.course,
      enrollmentDate: student.enrollmentDate,
    });
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this student?')) {
      setStudents(students.filter((s) => s.id !== id));
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: '', email: '', course: '', enrollmentDate: new Date().toISOString().split('T')[0] });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 style={{ color: '#1B262C' }}>Student Management</h2>
        {!isAdding && !editingId && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 text-black rounded-lg transition-colors"
            style={{ backgroundColor: '#FFD700' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#E6C200'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FFD700'}
          >
            <Plus className="w-4 h-4" />
            Register Student
          </button>
        )}
      </div>

      {(isAdding || editingId) && (
        <form onSubmit={handleSubmit} className="p-6 rounded-lg mb-6" style={{ backgroundColor: '#F8F9FA' }}>
          <h3 className="mb-4" style={{ color: '#1B262C' }}>
            {editingId ? 'Edit Student' : 'Register New Student'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-2" style={{ color: '#1B262C' }}>Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                style={{ '--tw-ring-color': '#3282B8' } as React.CSSProperties}
                placeholder="Enter student name"
              />
            </div>
            <div>
              <label className="block mb-2" style={{ color: '#1B262C' }}>Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                style={{ '--tw-ring-color': '#3282B8' } as React.CSSProperties}
                placeholder="student@example.com"
              />
            </div>
            <div>
              <label className="block mb-2" style={{ color: '#1B262C' }}>Course</label>
              <input
                type="text"
                required
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                style={{ '--tw-ring-color': '#3282B8' } as React.CSSProperties}
                placeholder="e.g., Computer Science"
              />
            </div>
            <div>
              <label className="block mb-2" style={{ color: '#1B262C' }}>Enrollment Date</label>
              <input
                type="date"
                required
                value={formData.enrollmentDate}
                onChange={(e) => setFormData({ ...formData, enrollmentDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                style={{ '--tw-ring-color': '#3282B8' } as React.CSSProperties}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors"
              style={{ backgroundColor: '#3282B8' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0F4C75'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3282B8'}
            >
              <Save className="w-4 h-4" />
              {editingId ? 'Update' : 'Register'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </form>
      )}

      {students.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>No students registered yet. Click "Register Student" to add one.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-gray-700">Name</th>
                <th className="px-4 py-3 text-left text-gray-700">Email</th>
                <th className="px-4 py-3 text-left text-gray-700">Course</th>
                <th className="px-4 py-3 text-left text-gray-700">Enrollment Date</th>
                <th className="px-4 py-3 text-left text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">{student.name}</td>
                  <td className="px-4 py-3">{student.email}</td>
                  <td className="px-4 py-3">{student.course}</td>
                  <td className="px-4 py-3">{new Date(student.enrollmentDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(student)}
                        className="p-2 hover:bg-blue-50 rounded transition-colors"
                        style={{ color: '#3282B8' }}
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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