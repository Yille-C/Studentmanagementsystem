import { useState, useEffect } from 'react';
import { Student, Grade } from '../App';
import { TrendingUp, Target, AlertCircle } from 'lucide-react';
import api from '../services/api';

interface PredictionsProps {
  students: Student[];
  grades: Grade[];
}

interface PredictionData {
  studentId: string;
  subject: string;
  predicted_grade: number;
  trend: string;
  confidence: string;
}

export function Predictions({ students, grades }: PredictionsProps) {
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string>('');

  useEffect(() => {
    if (selectedStudent && grades.length > 0) {
      loadPredictions(selectedStudent);
    }
  }, [selectedStudent, grades]);

  const loadPredictions = async (studentId: string) => {
    setLoading(true);
    try {
      // Get unique subjects for this student
      const studentGrades = grades.filter(g => g.studentId === studentId);
      const subjects = [...new Set(studentGrades.map(g => g.subject))];
      
      if (subjects.length > 0) {
        // Get prediction for first subject (or iterate through all)
        const response = await api.predictStudentGrade(studentId, subjects[0]);
        
        if (response.success && !response.prediction.error) {
          setPredictions([{
            studentId,
            subject: subjects[0],
            predicted_grade: response.prediction.predicted_grade,
            trend: response.prediction.trend,
            confidence: response.prediction.confidence
          }]);
        }
      }
    } catch (error) {
      console.error('Failed to load predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const predictNextSemesterGrade = (studentId: string): number | null => {
    const apiPrediction = predictions.find(p => p.studentId === studentId);
    if (apiPrediction) {
      return apiPrediction.predicted_grade;
    }

    const studentGrades = grades
      .filter((g) => g.studentId === studentId)
      .map((g) => g.finalGrade || 0);

    if (studentGrades.length === 0) return null;

    // Simple linear trend prediction
    const avg = studentGrades.reduce((a, b) => a + b, 0) / studentGrades.length;
    
    if (studentGrades.length < 2) return avg;

    // Calculate trend (difference between first half and second half)
    const mid = Math.floor(studentGrades.length / 2);
    const firstHalfAvg = studentGrades.slice(0, mid).reduce((a, b) => a + b, 0) / mid;
    const secondHalfAvg = studentGrades.slice(mid).reduce((a, b) => a + b, 0) / (studentGrades.length - mid);
    const trend = secondHalfAvg - firstHalfAvg;

    // Predict next semester (current avg + trend)
    let predictedGrade = avg + trend;
    
    // Clamp between 0 and 100
    predictedGrade = Math.max(0, Math.min(100, predictedGrade));

    return predictedGrade;
  };

  const predictPerformancePattern = (studentId: string) => {
    const studentGrades = grades
      .filter((g) => g.studentId === studentId)
      .map((g) => g.finalGrade || 0);

    if (studentGrades.length === 0) return null;

    const avg = studentGrades.reduce((a, b) => a + b, 0) / studentGrades.length;
    const latest = studentGrades[studentGrades.length - 1];

    let pattern = '';
    let recommendation = '';

    if (studentGrades.length >= 2) {
      const trend = studentGrades[studentGrades.length - 1] - studentGrades[0];
      
      if (trend > 5) {
        pattern = 'Improving';
        recommendation = 'Student is showing positive progress. Continue current study methods.';
      } else if (trend < -5) {
        pattern = 'Declining';
        recommendation = 'Student needs additional support. Consider tutoring or counseling.';
      } else {
        pattern = 'Stable';
        recommendation = 'Student is maintaining consistent performance. Encourage to aim higher.';
      }
    } else {
      pattern = 'Insufficient Data';
      recommendation = 'Need more grades to establish a pattern.';
    }

    // Check for volatility
    if (studentGrades.length >= 3) {
      const variance = studentGrades.reduce((sum, grade) => sum + Math.pow(grade - avg, 2), 0) / studentGrades.length;
      const stdDev = Math.sqrt(variance);
      
      if (stdDev > 15) {
        pattern += ' (Inconsistent)';
        recommendation += ' Performance is inconsistent - help student develop better study habits.';
      }
    }

    return {
      pattern,
      average: avg,
      latest,
      recommendation,
    };
  };

  const getPredictionConfidence = (gradesCount: number): string => {
    if (gradesCount === 0) return 'No data';
    if (gradesCount === 1) return 'Very Low';
    if (gradesCount === 2) return 'Low';
    if (gradesCount <= 4) return 'Medium';
    return 'High';
  };

  return (
    <div>
      <h2 className="mb-6 text-indigo-900">Predictions & Insights</h2>

      {students.length === 0 || grades.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>No data available for predictions. Add students and grades first.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {students.map((student) => {
            const prediction = predictNextSemesterGrade(student.id);
            const pattern = predictPerformancePattern(student.id);
            const studentGradesCount = grades.filter((g) => g.studentId === student.id).length;
            const confidence = getPredictionConfidence(studentGradesCount);

            if (!prediction || !pattern) return null;

            return (
              <div key={student.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-indigo-900">{student.name}</h3>
                    <p className="text-gray-500">{student.course}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600">Confidence</p>
                    <p className={`${
                      confidence === 'High' ? 'text-green-600' :
                      confidence === 'Medium' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {confidence}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-blue-600" />
                      <p className="text-gray-700">Predicted Grade</p>
                    </div>
                    <p className="text-blue-900">{prediction.toFixed(2)}</p>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-gray-700 mb-2">Current Average</p>
                    <p className="text-purple-900">{pattern.average.toFixed(2)}</p>
                  </div>

                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <p className="text-gray-700 mb-2">Latest Grade</p>
                    <p className="text-indigo-900">{pattern.latest.toFixed(2)}</p>
                  </div>
                </div>

                <div className={`p-4 rounded-lg mb-3 ${
                  pattern.pattern.includes('Improving') ? 'bg-green-50' :
                  pattern.pattern.includes('Declining') ? 'bg-red-50' :
                  'bg-gray-50'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className={`w-4 h-4 ${
                      pattern.pattern.includes('Improving') ? 'text-green-600' :
                      pattern.pattern.includes('Declining') ? 'text-red-600' :
                      'text-gray-600'
                    }`} />
                    <p className={`${
                      pattern.pattern.includes('Improving') ? 'text-green-900' :
                      pattern.pattern.includes('Declining') ? 'text-red-900' :
                      'text-gray-900'
                    }`}>
                      Pattern: {pattern.pattern}
                    </p>
                  </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-amber-900 mb-1">Recommendation</p>
                      <p className="text-gray-700">{pattern.recommendation}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-gray-500">
                  <p>Based on {studentGradesCount} grade{studentGradesCount !== 1 ? 's' : ''}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="text-blue-900 mb-2">About Predictions</p>
        <p className="text-gray-700">
          Predictions are based on historical grade trends and patterns. Confidence increases with more data points.
          These predictions should be used as guidance tools and not as definitive outcomes.
        </p>
      </div>
    </div>
  );
}
