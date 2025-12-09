import { useState, useEffect } from 'react';
import { Student, Grade, Attendance } from '../App';
import { TrendingUp, TrendingDown, Award, AlertTriangle, Calendar } from 'lucide-react';
import api from '../services/api';

interface DataAnalyticsProps {
  students: Student[];
  grades: Grade[];
  attendance: Attendance[];
}

export function DataAnalytics({ students, grades, attendance }: DataAnalyticsProps) {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, [grades, attendance]);

  const loadAnalytics = async () => {
    if (grades.length === 0) return;
    
    setLoading(true);
    try {
      const response = await api.getClassAnalytics();
      if (response.success) {
        setAnalytics(response.analytics);
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const computeGradeStatistics = () => {
    if (analytics) {
      return { avg: analytics.mean, stdDev: analytics.std_deviation };
    }
    
    if (grades.length === 0) return null;

    const finalGrades = grades.map((g) => g.finalGrade || 0);
    const avg = finalGrades.reduce((a, b) => a + b, 0) / finalGrades.length;

    const variance = finalGrades.reduce((sum, grade) => sum + Math.pow(grade - avg, 2), 0) / finalGrades.length;
    const stdDev = Math.sqrt(variance);

    return { avg, stdDev };
  };

  const getGradeDistribution = () => {
    const distribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    grades.forEach((grade) => {
      const finalGrade = grade.finalGrade || 0;
      if (finalGrade >= 90) distribution.A++;
      else if (finalGrade >= 80) distribution.B++;
      else if (finalGrade >= 70) distribution.C++;
      else if (finalGrade >= 60) distribution.D++;
      else distribution.F++;
    });
    return distribution;
  };

  const getBestAndWorstStudents = () => {
    const studentGrades = new Map<string, number[]>();
    
    grades.forEach((grade) => {
      if (!studentGrades.has(grade.studentId)) {
        studentGrades.set(grade.studentId, []);
      }
      studentGrades.get(grade.studentId)!.push(grade.finalGrade || 0);
    });

    const studentAverages = Array.from(studentGrades.entries()).map(([studentId, gradeList]) => ({
      studentId,
      average: gradeList.reduce((a, b) => a + b, 0) / gradeList.length,
    }));

    studentAverages.sort((a, b) => b.average - a.average);

    return {
      best: studentAverages.slice(0, 3),
      worst: studentAverages.slice(-3).reverse(),
    };
  };

  const getAttendanceTrends = () => {
    const dateMap = new Map<string, { present: number; absent: number }>();

    attendance.forEach((record) => {
      if (!dateMap.has(record.date)) {
        dateMap.set(record.date, { present: 0, absent: 0 });
      }
      const data = dateMap.get(record.date)!;
      if (record.status === 'present') data.present++;
      else data.absent++;
    });

    const trends = Array.from(dateMap.entries())
      .map(([date, data]) => ({
        date,
        present: data.present,
        absent: data.absent,
        rate: (data.present / (data.present + data.absent)) * 100,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return trends;
  };

  const stats = computeGradeStatistics();
  const distribution = getGradeDistribution();
  const { best, worst } = getBestAndWorstStudents();
  const attendanceTrends = getAttendanceTrends();

  const getStudentName = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    return student ? student.name : 'Unknown';
  };

  const overallAttendanceRate = attendance.length > 0
    ? (attendance.filter((a) => a.status === 'present').length / attendance.length) * 100
    : 0;

  return (
    <div>
      <h2 className="mb-6 text-indigo-900">Data Analytics</h2>

      {grades.length === 0 && attendance.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>No data available for analytics. Add grades and attendance records first.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {stats && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
              <h3 className="mb-4 text-indigo-900">Grade Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-gray-600 mb-1">Average Grade</p>
                  <p className="text-indigo-900">{stats.avg.toFixed(2)}</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-gray-600 mb-1">Standard Deviation</p>
                  <p className="text-indigo-900">{stats.stdDev.toFixed(2)}</p>
                </div>
              </div>

              <h4 className="mb-3 text-gray-700">Grade Distribution</h4>
              <div className="grid grid-cols-5 gap-2">
                {Object.entries(distribution).map(([letter, count]) => (
                  <div key={letter} className="bg-white p-4 rounded-lg text-center">
                    <p className="text-gray-600">{letter}</p>
                    <p className="text-indigo-900">{count}</p>
                    <div className="mt-2 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          letter === 'A'
                            ? 'bg-green-500'
                            : letter === 'B'
                            ? 'bg-blue-500'
                            : letter === 'C'
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${(count / grades.length) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {best.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-green-600" />
                  <h3 className="text-green-900">Top Performing Students</h3>
                </div>
                <div className="space-y-3">
                  {best.map((student, index) => (
                    <div key={student.studentId} className="bg-white p-3 rounded-lg flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-700 rounded-full">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p>{getStudentName(student.studentId)}</p>
                        <p className="text-gray-500">Average: {student.average.toFixed(2)}</p>
                      </div>
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <h3 className="text-red-900">Students Needing Support</h3>
                </div>
                <div className="space-y-3">
                  {worst.map((student, index) => (
                    <div key={student.studentId} className="bg-white p-3 rounded-lg flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-red-100 text-red-700 rounded-full">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p>{getStudentName(student.studentId)}</p>
                        <p className="text-gray-500">Average: {student.average.toFixed(2)}</p>
                      </div>
                      <TrendingDown className="w-5 h-5 text-red-600" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {attendanceTrends.length > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="text-blue-900">Attendance Trends</h3>
              </div>
              <div className="bg-white p-4 rounded-lg mb-4">
                <p className="text-gray-600 mb-1">Overall Attendance Rate</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        overallAttendanceRate >= 80
                          ? 'bg-green-500'
                          : overallAttendanceRate >= 60
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${overallAttendanceRate}%` }}
                    />
                  </div>
                  <span className="text-indigo-900">{overallAttendanceRate.toFixed(1)}%</span>
                </div>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {attendanceTrends.slice(-10).map((trend) => (
                  <div key={trend.date} className="bg-white p-3 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="text-gray-700">{new Date(trend.date).toLocaleDateString()}</p>
                      <p className="text-gray-500">
                        Present: {trend.present} | Absent: {trend.absent}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`${trend.rate >= 80 ? 'text-green-600' : trend.rate >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {trend.rate.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
