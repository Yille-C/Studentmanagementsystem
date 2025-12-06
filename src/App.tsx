import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { StudentManagement } from './components/StudentManagement';
import { GradeManagement } from './components/GradeManagement';
import { AttendanceTracking } from './components/AttendanceTracking';
import { DataAnalytics } from './components/DataAnalytics';
import { Predictions } from './components/Predictions';
import { VisualReports } from './components/VisualReports';
import { DataPersistence } from './components/DataPersistence';
import { Users, GraduationCap, Calendar, BarChart3, TrendingUp, PieChart, Database, LogOut } from 'lucide-react';
import { DashboardLayout } from './components/DashboardLayout';

export interface Student {
  id: string;
  name: string;
  email: string;
  course: string;
  enrollmentDate: string;
}

export interface Grade {
  studentId: string;
  subject: string;
  midterm: number;
  finals: number;
  quizzes: number;
  projects: number;
  finalGrade?: number;
}

export interface Attendance {
  studentId: string;
  date: string;
  status: 'present' | 'absent';
}

export interface AppData {
  students: Student[];
  grades: Grade[];
  attendance: Attendance[];
}

export default function App() {
  const [view, setView] = useState<'landing' | 'login' | 'register' | 'dashboard'>('landing');
  const [userEmail, setUserEmail] = useState<string>('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [students, setStudents] = useState<Student[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);

  const handleLogin = (email: string, password: string) => {
    // Simple demo authentication - in production, this would validate against a backend
    if (email && password) {
      setUserEmail(email);
      setView('dashboard');
    }
  };

  const handleRegister = (name: string, email: string, password: string) => {
    // Simple demo registration - in production, this would create an account
    if (name && email && password) {
      setUserEmail(email);
      setView('dashboard');
    }
  };

  const handleLogout = () => {
    setUserEmail('');
    setView('landing');
    setActiveTab('dashboard');
  };

  const tabs = [
    { id: 'students', label: 'Students', icon: Users },
    { id: 'grades', label: 'Grades', icon: GraduationCap },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'predictions', label: 'Predictions', icon: TrendingUp },
    { id: 'reports', label: 'Reports', icon: PieChart },
    { id: 'data', label: 'Data', icon: Database },
  ];

  const appData: AppData = { students, grades, attendance };

  const setAppData = (data: AppData) => {
    setStudents(data.students);
    setGrades(data.grades);
    setAttendance(data.attendance);
  };

  // Show Landing Page
  if (view === 'landing') {
    return <LandingPage onGetStarted={() => setView('login')} />;
  }

  // Show Login Page
  if (view === 'login') {
    return (
      <LoginPage 
        onLogin={handleLogin} 
        onBack={() => setView('landing')} 
        onSwitchToRegister={() => setView('register')}
      />
    );
  }

  // Show Register Page
  if (view === 'register') {
    return (
      <RegisterPage 
        onRegister={handleRegister} 
        onBack={() => setView('landing')} 
        onSwitchToLogin={() => setView('login')}
      />
    );
  }

  // Show Dashboard
  return (
    <DashboardLayout
      userEmail={userEmail}
      onLogout={handleLogout}
      students={students}
      grades={grades}
      attendance={attendance}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {activeTab === 'students' && (
        <StudentManagement students={students} setStudents={setStudents} />
      )}
      {activeTab === 'grades' && (
        <GradeManagement students={students} grades={grades} setGrades={setGrades} />
      )}
      {activeTab === 'attendance' && (
        <AttendanceTracking students={students} attendance={attendance} setAttendance={setAttendance} />
      )}
      {activeTab === 'analytics' && (
        <DataAnalytics students={students} grades={grades} attendance={attendance} />
      )}
      {activeTab === 'predictions' && (
        <Predictions students={students} grades={grades} />
      )}
      {activeTab === 'reports' && (
        <VisualReports students={students} grades={grades} attendance={attendance} />
      )}
      {activeTab === 'data' && (
        <DataPersistence appData={appData} setAppData={setAppData} />
      )}
    </DashboardLayout>
  );
}