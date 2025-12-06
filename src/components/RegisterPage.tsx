import { useState } from 'react';
import { User, Lock, Mail, Eye, EyeOff } from 'lucide-react';

interface RegisterPageProps {
  onRegister: (name: string, email: string, password: string) => void;
  onBack: () => void;
  onSwitchToLogin: () => void;
}

export function RegisterPage({ onRegister, onBack, onSwitchToLogin }: RegisterPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    if (!agreeTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }
    onRegister(name, email, password);
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
                <h1 className="text-white mb-4">JOIN US</h1>
                <h2 className="text-white mb-6">EduManage System</h2>
                <p className="text-white/90 leading-relaxed">
                  Create your account to start managing students, tracking grades, and monitoring attendance. Join thousands of educators using our comprehensive platform for seamless educational management.
                </p>
              </div>
              
              {/* Decorative circle on left panel */}
              <div 
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-48 h-48 rounded-full"
                style={{ backgroundColor: '#0F4C75' }}
              ></div>
            </div>

            {/* Right Side - Register Form */}
            <div className="p-12 md:p-16 bg-white">
              <div className="max-w-sm mx-auto">
                <h2 className="mb-2" style={{ color: '#1B262C' }}>Sign up</h2>
                <p className="text-gray-500 mb-8">Create your account to get started</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name Input */}
                  <div>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <User className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                        style={{ '--tw-ring-color': '#3282B8' } as React.CSSProperties}
                        placeholder="Full Name"
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <Mail className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                        style={{ '--tw-ring-color': '#3282B8' } as React.CSSProperties}
                        placeholder="Email Address"
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

                  {/* Confirm Password Input */}
                  <div>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <Lock className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                        style={{ '--tw-ring-color': '#3282B8' } as React.CSSProperties}
                        placeholder="Confirm Password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-4 h-4 mt-1 cursor-pointer"
                      style={{ accentColor: '#3282B8' }}
                    />
                    <label className="text-gray-600 cursor-pointer" onClick={() => setAgreeTerms(!agreeTerms)}>
                      I agree to the{' '}
                      <button
                        type="button"
                        className="hover:underline"
                        style={{ color: '#3282B8' }}
                      >
                        Terms and Conditions
                      </button>
                    </label>
                  </div>

                  {/* Sign Up Button */}
                  <button
                    type="submit"
                    className="w-full py-3 text-white rounded-lg transition-colors"
                    style={{ backgroundColor: '#0F4C75' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3282B8'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0F4C75'}
                  >
                    Sign up
                  </button>

                  {/* Back to Home */}
                  <button
                    type="button"
                    onClick={onBack}
                    className="w-full py-3 rounded-lg transition-colors border-2"
                    style={{ borderColor: '#0F4C75', color: '#0F4C75', backgroundColor: 'white' }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#F8F9FA';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                    }}
                  >
                    Back to Home
                  </button>
                </form>

                {/* Sign In Link */}
                <div className="mt-6 text-center">
                  <p className="text-gray-600">
                    Already have an account?{' '}
                    <button
                      className="hover:underline"
                      style={{ color: '#3282B8' }}
                      onClick={onSwitchToLogin}
                    >
                      Sign In
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
