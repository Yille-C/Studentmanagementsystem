import { 
  Users, 
  GraduationCap, 
  Calendar, 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Database, 
  LogOut,
  CalendarDays,
  LineChart,
  School,
  Bell,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Student, Grade, Attendance } from '../App';

interface DashboardLayoutProps {
  userEmail: string;
  onLogout: () => void;
  students: Student[];
  grades: Grade[];
  attendance: Attendance[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children: React.ReactNode;
}

export function DashboardLayout({
  userEmail,
  onLogout,
  students,
  grades,
  attendance,
  activeTab,
  setActiveTab,
  children
}: DashboardLayoutProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'students', label: 'Student Management', icon: Users },
    { id: 'grades', label: 'Grade Management', icon: GraduationCap },
    { id: 'attendance', label: 'Attendance Tracking', icon: Calendar },
    { id: 'analytics', label: 'Data Analytics', icon: LineChart },
    { id: 'predictions', label: 'Predictions', icon: TrendingUp },
    { id: 'reports', label: 'Visual Reports', icon: PieChart },
    { id: 'data', label: 'Data Persistence', icon: Database },
  ];

  // Calculate statistics
  const totalTasks = students.length;
  const completedTasks = grades.length;
  const totalStudents = students.length;
  
  // Performance calculation
  const averageGrade = grades.length > 0
    ? grades.reduce((sum, g) => sum + (g.finalGrade || 0), 0) / grades.length
    : 0;

  const currentDate = new Date();
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
  const fullDate = `${dayName}, ${currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;

  // Calendar logic
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const renderDashboardOverview = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 style={{ color: '#1B262C' }}>Dashboard</h2>
          <span className="text-gray-500">{fullDate}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Welcome Card */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl p-8 relative overflow-hidden" style={{ backgroundColor: '#3282B8' }}>
              <div className="relative z-10">
                <h2 className="text-white mb-2">Hello, {userEmail.split('@')[0]}!</h2>
                <p className="text-white/90 mb-6">
                  Welcome back! Check out what's new in your dashboard.
                </p>
                <button
                  className="px-6 py-2 bg-white rounded-lg transition-colors"
                  style={{ color: '#3282B8' }}
                  onClick={() => setActiveTab('students')}
                >
                  Explore Students
                </button>
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20">
                <div className="w-full h-full" style={{ backgroundColor: '#0F4C75' }}></div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: '#E3F2FD' }}>
                    <CalendarDays className="w-5 h-5" style={{ color: '#3282B8' }} />
                  </div>
                  <span className="text-gray-500">Active Tasks</span>
                </div>
                <h3 style={{ color: '#1B262C' }}>{totalTasks} Tasks</h3>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: '#E3F2FD' }}>
                    <School className="w-5 h-5" style={{ color: '#3282B8' }} />
                  </div>
                  <span className="text-gray-500">Completed</span>
                </div>
                <h3 style={{ color: '#1B262C' }}>{completedTasks} Tasks</h3>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: '#E3F2FD' }}>
                    <Users className="w-5 h-5" style={{ color: '#3282B8' }} />
                  </div>
                  <span className="text-gray-500">Total Students</span>
                </div>
                <h3 style={{ color: '#1B262C' }}>{totalStudents}</h3>
              </div>
            </div>
          </div>

          {/* Performance & Calendar */}
          <div className="space-y-6">
            {/* Performance */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 style={{ color: '#1B262C' }}>Performance</h3>
              </div>
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="8"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke="#3282B8"
                      strokeWidth="8"
                      strokeDasharray={`${(averageGrade / 100) * 352} 352`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h2 style={{ color: '#1B262C' }}>{Math.round(averageGrade)}</h2>
                  </div>
                </div>
                <p className="text-gray-500 mt-2" style={{ color: '#FF6B9D' }}>
                  ⭐ {grades.length} graded
                </p>
              </div>
            </div>

            {/* Mini Calendar */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h4 style={{ color: '#1B262C' }}>{monthName}</h4>
                <div className="flex gap-2">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                  <div key={i} className="text-center text-gray-400 py-1">
                    {day}
                  </div>
                ))}
                {getDaysInMonth().map((day, i) => (
                  <div
                    key={i}
                    className={`text-center py-1 text-sm rounded ${
                      day === currentDate.getDate()
                        ? 'text-white'
                        : day
                        ? 'text-gray-700'
                        : 'text-gray-300'
                    }`}
                    style={day === currentDate.getDate() ? { backgroundColor: '#3282B8' } : {}}
                  >
                    {day || ''}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 style={{ color: '#1B262C' }}>Recent Activities</h3>
          <button className="text-gray-500 hover:text-gray-700">View All</button>
        </div>
        <div className="py-12 text-center">
          <p className="text-gray-400">No recent activities yet. Start managing students to see your activity here.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#F8F9FA' }}>
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#3282B8' }}>
              <School className="w-5 h-5 text-white" />
            </div>
            <h3 style={{ color: '#1B262C' }}>EduManage</h3>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                  isActive ? 'text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
                style={isActive ? { backgroundColor: '#3282B8' } : {}}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white shadow-sm px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1"></div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-lg hover:bg-gray-100">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: '#3282B8' }}>
                  {userEmail.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-gray-700">{userEmail.split('@')[0]}</p>
                  <p className="text-gray-500">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          {activeTab === 'dashboard' ? renderDashboardOverview() : children}
        </main>
      </div>
    </div>
  );
}
