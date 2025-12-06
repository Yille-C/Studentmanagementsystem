import { GraduationCap, Users, BarChart3, Calendar, TrendingUp, Award, CheckCircle } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0F4C75 0%, #3282B8 100%)' }}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-2 text-white">
            <GraduationCap className="w-8 h-8" />
            <span className="text-xl">EduManage</span>
          </div>
          <button
            onClick={onGetStarted}
            className="px-6 py-2 text-black rounded-lg transition-colors"
            style={{ backgroundColor: '#FFD700' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#E6C200'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FFD700'}
          >
            Sign In
          </button>
        </header>

        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-white mb-6 max-w-4xl mx-auto">
            Comprehensive Student Management System
          </h1>
          <p className="text-white/90 text-xl mb-8 max-w-2xl mx-auto">
            Streamline student management, track grades and attendance, generate insights with advanced analytics and predictions.
          </p>
          <button
            onClick={onGetStarted}
            className="px-8 py-4 text-black rounded-lg transition-colors shadow-xl"
            style={{ backgroundColor: '#FFD700' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#E6C200'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FFD700'}
          >
            Get Started Free
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-white mb-2">Student Management</h3>
            <p className="text-white/80">
              Register, update, and manage student records with ease. Keep all student information organized in one place.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-white mb-2">Grade Tracking</h3>
            <p className="text-white/80">
              Automated grade calculation with detailed statistics. Track midterms, finals, quizzes, and projects effortlessly.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-white mb-2">Attendance Monitoring</h3>
            <p className="text-white/80">
              Mark attendance daily, view summaries, and calculate attendance rates with visual progress tracking.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-white mb-2">Data Analytics</h3>
            <p className="text-white/80">
              Comprehensive analytics including grade distributions, standard deviation, and student performance rankings.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-white mb-2">Predictive Insights</h3>
            <p className="text-white/80">
              AI-powered predictions for next semester grades and performance patterns to identify students needing support.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-white mb-2">Visual Reports</h3>
            <p className="text-white/80">
              Beautiful charts and graphs including pie charts, line graphs, and bar charts for easy data visualization.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white/10 backdrop-blur-lg p-12 rounded-2xl border border-white/20 text-center">
          <h2 className="text-white mb-4">
            Ready to transform your student management?
          </h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Join educators worldwide who trust EduManage for comprehensive student tracking and analytics.
          </p>
          <button
            onClick={onGetStarted}
            className="px-8 py-4 text-black rounded-lg transition-colors shadow-xl"
            style={{ backgroundColor: '#FFD700' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#E6C200'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FFD700'}
          >
            Start Managing Now
          </button>
        </div>
      </div>
    </div>
  );
}