import { useState } from 'react';
import { Student, Attendance } from '../App';
import { Calendar, Check, X, BarChart2 } from 'lucide-react';
import api from '../services/api';

interface AttendanceTrackingProps {
  students: Student[];
  attendance: Attendance[];
  setAttendance: (attendance: Attendance[]) => void;
}

export function AttendanceTracking({ students, attendance, setAttendance }: AttendanceTrackingProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showSummary, setShowSummary] = useState(false);
  const [loading, setLoading] = useState(false);

  const markAttendance = async (studentId: string, status: 'present' | 'absent') => {
    const existingIndex = attendance.findIndex(
      (a) => a.studentId === studentId && a.date === selectedDate
    );

    setLoading(true);
    try {
      const attendanceData = { studentId, date: selectedDate, status };
      
      if (existingIndex >= 0) {
        // Update existing - for now just add new record
        const response = await api.addAttendance(attendanceData);
        if (response.success) {
          const newAttendance = [...attendance];
          newAttendance[existingIndex] = response.attendance;
          setAttendance(newAttendance);
        }
      } else {
        const response = await api.addAttendance(attendanceData);
        if (response.success) {
          setAttendance([...attendance, response.attendance]);
        }
      }
    } catch (error: any) {
      alert('Error: ' + (error.message || 'Failed to mark attendance'));
    } finally {
      setLoading(false);
    }
  };

  const getAttendanceStatus = (studentId: string) => {
    const record = attendance.find(
      (a) => a.studentId === studentId && a.date === selectedDate
    );
    return record?.status;
  };

  const getAttendanceRate = (studentId: string) => {
    const studentRecords = attendance.filter((a) => a.studentId === studentId);
    if (studentRecords.length === 0) return 0;
    const presentCount = studentRecords.filter((a) => a.status === 'present').length;
    return (presentCount / studentRecords.length) * 100;
  };

  const getStudentAttendanceSummary = (studentId: string) => {
    const studentRecords = attendance.filter((a) => a.studentId === studentId);
    const presentCount = studentRecords.filter((a) => a.status === 'present').length;
    const absentCount = studentRecords.filter((a) => a.status === 'absent').length;
    return { total: studentRecords.length, present: presentCount, absent: absentCount };
  };

  const getDailyAttendanceSummary = () => {
    const dailyRecords = attendance.filter((a) => a.date === selectedDate);
    const presentCount = dailyRecords.filter((a) => a.status === 'present').length;
    const absentCount = dailyRecords.filter((a) => a.status === 'absent').length;
    return { present: presentCount, absent: absentCount, total: dailyRecords.length };
  };

  const dailySummary = getDailyAttendanceSummary();

  return (
    <div>
      <h2 className="mb-6 text-indigo-900">Attendance Tracking</h2>

      <div className="bg-indigo-50 p-6 rounded-lg mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
          <div className="flex-1">
            <label className="block text-gray-700 mb-2">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowSummary(!showSummary)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <BarChart2 className="w-4 h-4" />
            {showSummary ? 'Hide Summary' : 'Show Summary'}
          </button>
        </div>

        {dailySummary.total > 0 && (
          <div className="bg-white p-4 rounded-lg">
            <p className="text-gray-700 mb-2">Daily Summary for {new Date(selectedDate).toLocaleDateString()}</p>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-green-600">Present: {dailySummary.present}</span>
              </div>
              <div className="flex items-center gap-2">
                <X className="w-4 h-4 text-red-600" />
                <span className="text-red-600">Absent: {dailySummary.absent}</span>
              </div>
              <div className="text-gray-600">
                Total: {dailySummary.total}
              </div>
            </div>
          </div>
        )}
      </div>

      {students.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>No students available. Add students first to track attendance.</p>
        </div>
      ) : showSummary ? (
        <div className="overflow-x-auto">
          <h3 className="mb-4 text-indigo-900">Attendance Summary by Student</h3>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-gray-700">Student</th>
                <th className="px-4 py-3 text-left text-gray-700">Total Days</th>
                <th className="px-4 py-3 text-left text-gray-700">Present</th>
                <th className="px-4 py-3 text-left text-gray-700">Absent</th>
                <th className="px-4 py-3 text-left text-gray-700">Attendance Rate</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => {
                const summary = getStudentAttendanceSummary(student.id);
                const rate = getAttendanceRate(student.id);
                return (
                  <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">{student.name}</td>
                    <td className="px-4 py-3">{summary.total}</td>
                    <td className="px-4 py-3 text-green-600">{summary.present}</td>
                    <td className="px-4 py-3 text-red-600">{summary.absent}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                          <div
                            className={`h-2 rounded-full ${
                              rate >= 80 ? 'bg-green-500' : rate >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${rate}%` }}
                          />
                        </div>
                        <span className="text-gray-700">{rate.toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          <h3 className="mb-4 text-indigo-900">
            Mark Attendance for {new Date(selectedDate).toLocaleDateString()}
          </h3>
          <div className="space-y-3">
            {students.map((student) => {
              const status = getAttendanceStatus(student.id);
              return (
                <div
                  key={student.id}
                  className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between"
                >
                  <div>
                    <p>{student.name}</p>
                    <p className="text-gray-500">{student.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => markAttendance(student.id, 'present')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        status === 'present'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-green-100'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      Present
                    </button>
                    <button
                      onClick={() => markAttendance(student.id, 'absent')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        status === 'absent'
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-red-100'
                      }`}
                    >
                      <X className="w-4 h-4" />
                      Absent
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
