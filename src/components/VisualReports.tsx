import { useState, useEffect } from 'react';
import { Student, Grade, Attendance } from '../App';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../services/api';

interface VisualReportsProps {
  students: Student[];
  grades: Grade[];
  attendance: Attendance[];
}

export function VisualReports({ students, grades, attendance }: VisualReportsProps) {
  const [charts, setCharts] = useState<{
    gradeDistribution: string | null;
    attendance: string | null;
    classPerformance: string | null;
  }>({
    gradeDistribution: null,
    attendance: null,
    classPerformance: null,
  });
  const [loading, setLoading] = useState(false);
  const [showBackendCharts, setShowBackendCharts] = useState(false);

  useEffect(() => {
    if (showBackendCharts && (grades.length > 0 || attendance.length > 0)) {
      loadBackendCharts();
    }
  }, [showBackendCharts, grades, attendance]);

  const loadBackendCharts = async () => {
    setLoading(true);
    try {
      const [distChart, attChart, perfChart] = await Promise.all([
        api.getGradeDistributionChart(),
        api.getAttendanceChart(),
        api.getClassPerformanceChart(),
      ]);

      setCharts({
        gradeDistribution: distChart.success ? distChart.chart : null,
        attendance: attChart.success ? attChart.chart : null,
        classPerformance: perfChart.success ? perfChart.chart : null,
      });
    } catch (error) {
      console.error('Failed to load backend charts:', error);
    } finally {
      setLoading(false);
    }
  };
  const getGradeDistributionData = () => {
    const distribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    grades.forEach((grade) => {
      const finalGrade = grade.finalGrade || 0;
      if (finalGrade >= 90) distribution.A++;
      else if (finalGrade >= 80) distribution.B++;
      else if (finalGrade >= 70) distribution.C++;
      else if (finalGrade >= 60) distribution.D++;
      else distribution.F++;
    });

    return Object.entries(distribution).map(([name, value]) => ({ name, value }));
  };

  const getGradeTrendData = () => {
    const subjectGrades = new Map<string, number[]>();

    grades.forEach((grade) => {
      if (!subjectGrades.has(grade.subject)) {
        subjectGrades.set(grade.subject, []);
      }
      subjectGrades.get(grade.subject)!.push(grade.finalGrade || 0);
    });

    return Array.from(subjectGrades.entries()).map(([subject, gradesList]) => ({
      subject,
      average: gradesList.reduce((a, b) => a + b, 0) / gradesList.length,
      count: gradesList.length,
    }));
  };

  const getAttendanceData = () => {
    const dateMap = new Map<string, { present: number; absent: number }>();

    attendance.forEach((record) => {
      if (!dateMap.has(record.date)) {
        dateMap.set(record.date, { present: 0, absent: 0 });
      }
      const data = dateMap.get(record.date)!;
      if (record.status === 'present') data.present++;
      else data.absent++;
    });

    return Array.from(dateMap.entries())
      .map(([date, data]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        present: data.present,
        absent: data.absent,
        total: data.present + data.absent,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-10); // Last 10 days
  };

  const gradeDistribution = getGradeDistributionData();
  const gradeTrend = getGradeTrendData();
  const attendanceData = getAttendanceData();

  const COLORS = {
    A: '#22c55e',
    B: '#3b82f6',
    C: '#eab308',
    D: '#f97316',
    F: '#ef4444',
  };

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-indigo-900">Visual Reports</h2>
        <button
          onClick={() => setShowBackendCharts(!showBackendCharts)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          {showBackendCharts ? 'Show Frontend Charts' : 'Show Backend Charts (NumPy/Matplotlib)'}
        </button>
      </div>

      {showBackendCharts ? (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-xl font-semibold text-indigo-900 mb-4">Backend-Generated Charts</h3>
            {loading ? (
              <div className="text-center py-12">Loading charts from backend...</div>
            ) : (
              <div className="space-y-6">
                {charts.gradeDistribution && (
                  <div>
                    <h4 className="font-medium mb-2">Grade Distribution (Matplotlib)</h4>
                    <img src={charts.gradeDistribution} alt="Grade Distribution" className="w-full rounded-lg shadow" />
                  </div>
                )}
                {charts.attendance && (
                  <div>
                    <h4 className="font-medium mb-2">Attendance Statistics (Matplotlib)</h4>
                    <img src={charts.attendance} alt="Attendance" className="w-full rounded-lg shadow" />
                  </div>
                )}
                {charts.classPerformance && (
                  <div>
                    <h4 className="font-medium mb-2">Class Performance (Matplotlib)</h4>
                    <img src={charts.classPerformance} alt="Class Performance" className="w-full rounded-lg shadow" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : grades.length === 0 && attendance.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <PieChart className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>No data available for reports. Add grades and attendance records first.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {gradeDistribution.some(d => d.value > 0) && (
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="mb-4 text-indigo-900">Grade Distribution (Pie Chart)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={gradeDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {gradeDistribution.map((entry) => (
                      <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-4 flex-wrap">
                {gradeDistribution.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: COLORS[entry.name as keyof typeof COLORS] }}
                    />
                    <span className="text-gray-700">
                      {entry.name}: {entry.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {gradeTrend.length > 0 && (
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="mb-4 text-indigo-900">Grade Trends by Subject (Line Chart)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={gradeTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="average"
                    stroke="#6366f1"
                    strokeWidth={2}
                    name="Average Grade"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {attendanceData.length > 0 && (
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="mb-4 text-indigo-900">Attendance Over Time (Bar Chart)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="present" fill="#22c55e" name="Present" />
                  <Bar dataKey="absent" fill="#ef4444" name="Absent" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {gradeTrend.length > 0 && (
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="mb-4 text-indigo-900">Subject Performance Summary</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-gray-700">Subject</th>
                      <th className="px-4 py-3 text-left text-gray-700">Average Grade</th>
                      <th className="px-4 py-3 text-left text-gray-700">Number of Grades</th>
                      <th className="px-4 py-3 text-left text-gray-700">Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gradeTrend.map((item) => (
                      <tr key={item.subject} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3">{item.subject}</td>
                        <td className="px-4 py-3">{item.average.toFixed(2)}</td>
                        <td className="px-4 py-3">{item.count}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                              <div
                                className={`h-2 rounded-full ${
                                  item.average >= 90
                                    ? 'bg-green-500'
                                    : item.average >= 80
                                    ? 'bg-blue-500'
                                    : item.average >= 70
                                    ? 'bg-yellow-500'
                                    : 'bg-red-500'
                                }`}
                                style={{ width: `${item.average}%` }}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
