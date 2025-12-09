const API_BASE_URL = 'http://localhost:5000/api';

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

class APIService {
  async request(endpoint: string, options: RequestOptions = {}): Promise<any> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
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
  async getStudents(): Promise<any> {
    return this.request('/students');
  }

  async getStudent(id: number | string): Promise<any> {
    return this.request(`/students/${id}`);
  }

  async addStudent(studentData: any): Promise<any> {
    return this.request('/students', {
      method: 'POST',
      body: JSON.stringify(studentData),
    });
  }

  async updateStudent(id: number | string, studentData: any): Promise<any> {
    return this.request(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(studentData),
    });
  }

  async deleteStudent(id: number | string): Promise<any> {
    return this.request(`/students/${id}`, {
      method: 'DELETE',
    });
  }

  // Grades
  async getGrades(studentId: number | string | null = null): Promise<any> {
    const query = studentId ? `?studentId=${studentId}` : '';
    return this.request(`/grades${query}`);
  }

  async addGrade(gradeData: any): Promise<any> {
    return this.request('/grades', {
      method: 'POST',
      body: JSON.stringify(gradeData),
    });
  }

  async updateGrade(id: number | string, gradeData: any): Promise<any> {
    return this.request(`/grades/${id}`, {
      method: 'PUT',
      body: JSON.stringify(gradeData),
    });
  }

  async deleteGrade(id: number | string): Promise<any> {
    return this.request(`/grades/${id}`, {
      method: 'DELETE',
    });
  }

  // Attendance
  async getAttendance(studentId: number | string | null = null): Promise<any> {
    const query = studentId ? `?studentId=${studentId}` : '';
    return this.request(`/attendance${query}`);
  }

  async addAttendance(attendanceData: any): Promise<any> {
    return this.request('/attendance', {
      method: 'POST',
      body: JSON.stringify(attendanceData),
    });
  }

  async deleteAttendance(id: number | string): Promise<any> {
    return this.request(`/attendance/${id}`, {
      method: 'DELETE',
    });
  }

  // Analytics
  async getStudentAnalytics(studentId: number | string): Promise<any> {
    return this.request(`/analytics/student/${studentId}`);
  }

  async getClassAnalytics(): Promise<any> {
    return this.request('/analytics/class');
  }

  async getGradeDistribution(): Promise<any> {
    return this.request('/analytics/distribution');
  }

  async getSubjectAnalytics(subject: string): Promise<any> {
    return this.request(`/analytics/subject/${subject}`);
  }

  // Predictions
  async predictStudentGrade(studentId: number | string, subject: string): Promise<any> {
    return this.request(`/predictions/student/${studentId}?subject=${encodeURIComponent(subject)}`);
  }

  async predictAllGrades(subject: string | null = null): Promise<any> {
    const query = subject ? `?subject=${encodeURIComponent(subject)}` : '';
    return this.request(`/predictions/all${query}`);
  }

  async customPredict(grades: number[]): Promise<any> {
    return this.request('/predictions/custom', {
      method: 'POST',
      body: JSON.stringify({ grades }),
    });
  }

  // Charts
  async getGradeDistributionChart(studentId: number | string | null = null): Promise<any> {
    const query = studentId ? `?studentId=${studentId}` : '';
    return this.request(`/charts/grade-distribution${query}`);
  }

  async getGradeProgressChart(studentId: number | string, subject: string | null = null): Promise<any> {
    const query = subject ? `?subject=${encodeURIComponent(subject)}` : '';
    return this.request(`/charts/grade-progress/${studentId}${query}`);
  }

  async getAttendanceChart(studentId: number | string | null = null): Promise<any> {
    const query = studentId ? `?studentId=${studentId}` : '';
    return this.request(`/charts/attendance${query}`);
  }

  async getSubjectComparisonChart(studentId: number | string): Promise<any> {
    return this.request(`/charts/subject-comparison/${studentId}`);
  }

  async getClassPerformanceChart(): Promise<any> {
    return this.request('/charts/class-performance');
  }

  // Data Persistence
  async exportData(): Promise<any> {
    return this.request('/data/export');
  }

  async importData(data: any): Promise<any> {
    return this.request('/data/import', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async clearData(): Promise<any> {
    return this.request('/data/clear', {
      method: 'DELETE',
    });
  }
}

export default new APIService();
