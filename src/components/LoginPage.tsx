import { useState } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';

interface LoginPageProps {
  onLogin: (email: string, password: string) => void;
  onBack: () => void;
  onSwitchToRegister: () => void;
}

export function LoginPage({ onLogin, onBack, onSwitchToRegister }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden"
      style={{ backgroundColor: '#0F4C75' }}
    >
      {/* Decorative circles */}
      <div className="absolute top-20 left-20 w-64 h-64 rounded-full opacity-20" style={{ backgroundColor: '#3282B8' }}></div>
      <div className="absolute bottom-32 left-32 w-96 h-96 rounded-full opacity-10" style={{ backgroundColor: '#3282B8' }}></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-20" style={{ backgroundColor: '#3282B8' }}></div>
      
      <div className="w-full max-w-5xl relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Left Side - Welcome Section */}
            <div className="p-12 md:p-16 relative" style={{ backgroundColor: '#3282B8' }}>
              <div className="relative z-10">
                <h1 className="text-white mb-4">WELCOME</h1>
                <h2 className="text-white mb-6">EduManage System</h2>
                <p className="text-white/90 leading-relaxed">
                  Your comprehensive platform for managing students, tracking grades, and monitoring attendance. Experience seamless educational management with powerful analytics and insights.
                </p>
              </div>
              
              {/* Decorative circle on left panel */}
              <div 
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-48 h-48 rounded-full"
                style={{ backgroundColor: '#0F4C75' }}
              ></div>
            </div>

            {/* Right Side - Login Form */}
            <div className="p-12 md:p-16 bg-white">
              <div className="max-w-sm mx-auto">
                <h2 className="mb-2" style={{ color: '#1B262C' }}>Sign in</h2>
                <p className="text-gray-500 mb-8">Access your student management dashboard</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email Input */}
                  <div>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <User className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                        style={{ '--tw-ring-color': '#3282B8' } as React.CSSProperties}
                        placeholder="User Name"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <Lock className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                        style={{ '--tw-ring-color': '#3282B8' } as React.CSSProperties}
                        placeholder="Password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 cursor-pointer"
                        style={{ accentColor: '#3282B8' }}
                      />
                      <span className="text-gray-600">Remember me</span>
                    </label>
                    <button
                      type="button"
                      className="hover:underline"
                      style={{ color: '#3282B8' }}
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {/* Sign In Button */}
                  <button
                    type="submit"
                    className="w-full text-white py-3 rounded-lg transition-colors"
                    style={{ backgroundColor: '#0F4C75' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3282B8'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0F4C75'}
                  >
                    Sign in
                  </button>
                </form>

                {/* Sign Up Link */}
                <div className="mt-6 text-center">
                  <p className="text-gray-600">
                    Don&apos;t have an account?{' '}
                    <button
                      className="hover:underline"
                      style={{ color: '#3282B8' }}
                      onClick={onSwitchToRegister}
                    >
                      Sign Up
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}