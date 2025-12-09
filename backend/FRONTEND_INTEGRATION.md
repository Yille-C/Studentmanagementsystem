# Frontend Integration Guide

Complete guide for connecting your React/HTML frontend to the Flask backend.

## 🔧 Configuration

### Step 1: Update API Base URL

Create a config file in your frontend:

```javascript
// src/config/api.js
export const API_BASE_URL = 'http://localhost:5000/api';
```

### Step 2: Create API Service

```javascript
// src/services/api.js
const API_BASE_URL = 'http://localhost:5000/api';

class APIService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Students
  async getStudents() {
    return this.request('/students');
  }

  async getStudent(id) {
    return this.request(`/students/${id}`);
  }

  async addStudent(studentData) {
    return this.request('/students', {
      method: 'POST',
      body: JSON.stringify(studentData),
    });
  }

  async updateStudent(id, studentData) {
    return this.request(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(studentData),
    });
  }

  async deleteStudent(id) {
    return this.request(`/students/${id}`, {
      method: 'DELETE',
    });
  }

  // Grades
  async getGrades(studentId = null) {
    const query = studentId ? `?studentId=${studentId}` : '';
    return this.request(`/grades${query}`);
  }

  async addGrade(gradeData) {
    return this.request('/grades', {
      method: 'POST',
      body: JSON.stringify(gradeData),
    });
  }

  async updateGrade(id, gradeData) {
    return this.request(`/grades/${id}`, {
      method: 'PUT',
      body: JSON.stringify(gradeData),
    });
  }

  async deleteGrade(id) {
    return this.request(`/grades/${id}`, {
      method: 'DELETE',
    });
  }

  // Attendance
  async getAttendance(studentId = null) {
    const query = studentId ? `?studentId=${studentId}` : '';
    return this.request(`/attendance${query}`);
  }

  async addAttendance(attendanceData) {
    return this.request('/attendance', {
      method: 'POST',
      body: JSON.stringify(attendanceData),
    });
  }

  // Analytics
  async getStudentAnalytics(studentId) {
    return this.request(`/analytics/student/${studentId}`);
  }

  async getClassAnalytics() {
    return this.request('/analytics/class');
  }

  async getGradeDistribution() {
    return this.request('/analytics/distribution');
  }

  // Predictions
  async predictStudentGrade(studentId, subject) {
    return this.request(`/predictions/student/${studentId}?subject=${subject}`);
  }

  async predictAllGrades(subject = null) {
    const query = subject ? `?subject=${subject}` : '';
    return this.request(`/predictions/all${query}`);
  }

  // Charts
  async getGradeDistributionChart(studentId = null) {
    const query = studentId ? `?studentId=${studentId}` : '';
    return this.request(`/charts/grade-distribution${query}`);
  }

  async getGradeProgressChart(studentId, subject = null) {
    const query = subject ? `?subject=${subject}` : '';
    return this.request(`/charts/grade-progress/${studentId}${query}`);
  }

  async getAttendanceChart(studentId = null) {
    const query = studentId ? `?studentId=${studentId}` : '';
    return this.request(`/charts/attendance${query}`);
  }

  async getSubjectComparisonChart(studentId) {
    return this.request(`/charts/subject-comparison/${studentId}`);
  }

  async getClassPerformanceChart() {
    return this.request('/charts/class-performance');
  }

  // Data
  async exportData() {
    return this.request('/data/export');
  }

  async importData(data) {
    return this.request('/data/import', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export default new APIService();
```

## 📝 Usage Examples in React Components

### StudentManagement Component

```jsx
import { useEffect, useState } from 'react';
import api from '../services/api';

export function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const response = await api.getStudents();
      setStudents(response.students);
    } catch (error) {
      console.error('Failed to load students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (studentData) => {
    try {
      const response = await api.addStudent(studentData);
      if (response.success) {
        setStudents([...students, response.student]);
        alert('Student added successfully!');
      }
    } catch (error) {
      alert('Failed to add student: ' + error.message);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (!confirm('Are you sure?')) return;
    
    try {
      await api.deleteStudent(studentId);
      setStudents(students.filter(s => s.id !== studentId));
      alert('Student deleted successfully!');
    } catch (error) {
      alert('Failed to delete student: ' + error.message);
    }
  };

  // ... render UI
}
```

### DataAnalytics Component

```jsx
import { useEffect, useState } from 'react';
import api from '../services/api';

export function DataAnalytics({ students }) {
  const [analytics, setAnalytics] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const loadClassAnalytics = async () => {
    try {
      const response = await api.getClassAnalytics();
      setAnalytics(response.analytics);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  const loadStudentAnalytics = async (studentId) => {
    try {
      const response = await api.getStudentAnalytics(studentId);
      setAnalytics(response.analytics);
      setSelectedStudent(studentId);
    } catch (error) {
      console.error('Failed to load student analytics:', error);
    }
  };

  return (
    <div>
      <button onClick={loadClassAnalytics}>Class Analytics</button>
      
      <select onChange={(e) => loadStudentAnalytics(e.target.value)}>
        <option value="">Select Student</option>
        {students.map(s => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>

      {analytics && (
        <div>
          <h3>Analytics Results</h3>
          <p>Mean: {analytics.mean}</p>
          <p>Median: {analytics.median}</p>
          <p>Std Dev: {analytics.std_deviation}</p>
          <p>Attendance: {analytics.attendance_percentage}%</p>
        </div>
      )}
    </div>
  );
}
```

### Predictions Component

```jsx
import { useState } from 'react';
import api from '../services/api';

export function Predictions({ students }) {
  const [prediction, setPrediction] = useState(null);

  const handlePredict = async (studentId, subject) => {
    try {
      const response = await api.predictStudentGrade(studentId, subject);
      setPrediction(response.prediction);
    } catch (error) {
      alert('Failed to generate prediction: ' + error.message);
    }
  };

  return (
    <div>
      {prediction && !prediction.error && (
        <div>
          <h3>Prediction Results</h3>
          <p>Predicted Grade: {prediction.predicted_grade}</p>
          <p>Trend: {prediction.trend}</p>
          <p>Confidence: {prediction.confidence}</p>
          <p>R²: {prediction.r_squared}</p>
        </div>
      )}
    </div>
  );
}
```

### VisualReports Component

```jsx
import { useEffect, useState } from 'react';
import api from '../services/api';

export function VisualReports({ students }) {
  const [charts, setCharts] = useState({
    distribution: null,
    progress: null,
    attendance: null,
  });

  const loadCharts = async (studentId = null) => {
    try {
      const [dist, prog, att] = await Promise.all([
        api.getGradeDistributionChart(studentId),
        studentId ? api.getGradeProgressChart(studentId) : null,
        api.getAttendanceChart(studentId),
      ]);

      setCharts({
        distribution: dist.chart,
        progress: prog?.chart,
        attendance: att.chart,
      });
    } catch (error) {
      console.error('Failed to load charts:', error);
    }
  };

  return (
    <div>
      <button onClick={() => loadCharts()}>Load Class Charts</button>
      
      <div className="charts">
        {charts.distribution && (
          <img src={charts.distribution} alt="Grade Distribution" />
        )}
        {charts.progress && (
          <img src={charts.progress} alt="Grade Progress" />
        )}
        {charts.attendance && (
          <img src={charts.attendance} alt="Attendance" />
        )}
      </div>
    </div>
  );
}
```

### DataPersistence Component

```jsx
import api from '../services/api';

export function DataPersistence({ appData, setAppData }) {
  const handleExport = async () => {
    try {
      const response = await api.exportData();
      const dataStr = JSON.stringify(response.data, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `student_data_${new Date().toISOString()}.json`;
      a.click();
      alert('Data exported successfully!');
    } catch (error) {
      alert('Failed to export data: ' + error.message);
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const response = await api.importData(data);
      
      if (response.success) {
        alert(`Import completed!\n` +
          `Students: ${response.stats.students_imported}\n` +
          `Grades: ${response.stats.grades_imported}\n` +
          `Attendance: ${response.stats.attendance_imported}`);
        
        // Reload data
        window.location.reload();
      }
    } catch (error) {
      alert('Failed to import data: ' + error.message);
    }
  };

  return (
    <div>
      <button onClick={handleExport}>Export Data</button>
      <input type="file" accept=".json" onChange={handleImport} />
    </div>
  );
}
```

## 🔄 Update App.tsx

Replace your state management with API calls:

```jsx
// In App.tsx
import { useEffect } from 'react';
import api from './services/api';

export default function App() {
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [studentsRes, gradesRes, attendanceRes] = await Promise.all([
        api.getStudents(),
        api.getGrades(),
        api.getAttendance(),
      ]);

      setStudents(studentsRes.students);
      setGrades(gradesRes.grades);
      setAttendance(attendanceRes.attendance);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  // ... rest of your component
}
```

## 🚀 Testing the Connection

1. Start the backend:
```bash
cd backend
python app.py
```

2. Start the frontend:
```bash
npm run dev
```

3. Open browser console and check for CORS errors
4. Try adding a student from the UI
5. Check if data appears in MySQL database

## 🐛 Common Issues

### CORS Error
- Backend has CORS enabled by default
- Make sure backend is running on port 5000
- Check browser console for exact error

### Network Error
- Verify backend is running: http://localhost:5000/api/health
- Check if firewall is blocking connection
- Ensure correct port in API_BASE_URL

### Data Not Appearing
- Check browser Network tab for API responses
- Verify API responses in browser DevTools
- Check for JavaScript errors in console

## 📱 Mobile/Production

For production deployment:

1. Update API_BASE_URL to your production backend URL
2. Enable HTTPS
3. Update CORS settings in backend to specific origin
4. Add authentication/authorization

---

**Your frontend is now connected to the backend! 🎉**
