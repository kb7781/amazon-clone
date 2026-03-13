import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiEye, FiEyeOff, FiLock, FiMail, FiUser } from 'react-icons/fi';

function validate(fields, isSignup) {
  const errors = {};
  if (!fields.email)                         errors.email    = 'Email is required';
  else if (!/\S+@\S+\.\S+/.test(fields.email)) errors.email  = 'Enter a valid email';
  if (!fields.password)                      errors.password = 'Password is required';
  else if (fields.password.length < 6)       errors.password = 'Min 6 characters';
  if (isSignup) {
    if (!fields.name)                        errors.name     = 'Name is required';
    if (fields.password !== fields.confirm)  errors.confirm  = 'Passwords do not match';
  }
  return errors;
}

export default function Auth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [tab, setTab]       = useState(searchParams.get('tab') === 'signup' ? 'signup' : 'login');
  const [fields, setFields] = useState({ email: '', password: '', name: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const isSignup = tab === 'signup';

  const handleChange = (e) => {
    setFields((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((e2) => ({ ...e2, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(fields, isSignup);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    // Simulate async auth
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);

    if (isSignup) {
      toast.success(`Welcome, ${fields.name}! Account created.`);
    } else {
      toast.success('Signed in successfully!');
    }
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#eaeded] flex flex-col">
      {/* Mini navbar */}
      <header className="bg-amazon-dark py-3 flex justify-center">
        <Link to="/" className="text-white font-extrabold text-2xl">
          amazon<span className="text-amazon">.clone</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="bg-white rounded-lg shadow-md w-full max-w-md p-8">
          {/* Tab switcher */}
          <div className="flex mb-6 border-b border-gray-200">
            {['login', 'signup'].map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setErrors({}); setFields({ email: '', password: '', name: '', confirm: '' }); }}
                className={`flex-1 py-2.5 text-sm font-semibold transition-colors capitalize ${
                  tab === t
                    ? 'border-b-2 border-amazon text-amazon-dark'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <h1 className="text-xl font-bold text-gray-900 mb-6">
            {isSignup ? 'Create account' : 'Sign in'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Name (signup only) */}
            {isSignup && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your name</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    name="name"
                    value={fields.name}
                    onChange={handleChange}
                    placeholder="First and last name"
                    className={`input-amazon pl-9 ${errors.name ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="email"
                  name="email"
                  value={fields.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`input-amazon pl-9 ${errors.email ? 'border-red-500' : ''}`}
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type={showPw ? 'text' : 'password'}
                  name="password"
                  value={fields.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className={`input-amazon pl-9 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                  autoComplete={isSignup ? 'new-password' : 'current-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Confirm (signup) */}
            {isSignup && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Re-enter password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type={showPw ? 'text' : 'password'}
                    name="confirm"
                    value={fields.confirm}
                    onChange={handleChange}
                    placeholder="Repeat password"
                    className={`input-amazon pl-9 ${errors.confirm ? 'border-red-500' : ''}`}
                    autoComplete="new-password"
                  />
                </div>
                {errors.confirm && <p className="text-red-500 text-xs mt-1">{errors.confirm}</p>}
              </div>
            )}

            {/* Forgot password */}
            {!isSignup && (
              <div className="text-right">
                <button type="button" className="text-xs text-blue-600 hover:underline">Forgot your password?</button>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-amazon-primary w-full py-2.5 text-base disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-gray-700 border-t-transparent rounded-full animate-spin" />
              ) : null}
              {isSignup ? 'Create your Amazon account' : 'Sign in'}
            </button>
          </form>

          {/* Legal */}
          <p className="text-xs text-gray-500 mt-4 text-center leading-relaxed">
            By continuing, you agree to Amazon Clone's{' '}
            <a href="#" className="text-blue-600 hover:underline">Conditions of Use</a> and{' '}
            <a href="#" className="text-blue-600 hover:underline">Privacy Notice</a>.
          </p>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <hr className="flex-1 border-gray-200" />
            <span className="text-xs text-gray-400">New to Amazon Clone?</span>
            <hr className="flex-1 border-gray-200" />
          </div>

          {/* Toggle tab link */}
          <button
            onClick={() => setTab(isSignup ? 'login' : 'signup')}
            className="w-full border border-gray-300 rounded py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {isSignup ? 'Already have an account? Sign in' : "Create your Amazon account"}
          </button>
        </div>
      </main>

      {/* Mini footer */}
      <footer className="bg-amazon-dark text-gray-400 py-4 text-center text-xs">
        © 2024 Amazon Clone &nbsp;|&nbsp; Conditions of Use &nbsp;|&nbsp; Privacy Notice
      </footer>
    </div>
  );
}
