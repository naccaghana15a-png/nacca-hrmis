'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Password Change States
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  
  // Forgot Password
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  // Check if user needs to change password (from cookie)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.authenticated && data.user?.isFirstLogin) {
          setUserEmail(data.user.email);
          setUserName(data.user.name);
          setShowPasswordChange(true);
        }
      } catch (error) {
        // Ignore
      }
    };
    checkAuth();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.requiresPasswordChange) {
          setUserEmail(email);
          setUserName(data.user.name);
          setShowPasswordChange(true);
          setPassword('');
        } else {
          router.push('/admin');
        }
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordErrors([]);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'change_password',
          email: userEmail,
          password: password,
          newPassword: newPassword,
          confirmPassword: confirmPassword
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('✅ Password changed successfully! Please login with your new password.');
        setShowPasswordChange(false);
        setPassword('');
        setNewPassword('');
        setConfirmPassword('');
        router.push('/');
      } else {
        if (data.errors) {
          setPasswordErrors(data.errors);
        } else {
          setError(data.error || 'Password change failed');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResetMessage('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reset_password',
          email: resetEmail
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setResetMessage(data.message || 'Password reset email sent!');
        setTimeout(() => {
          setShowForgotPassword(false);
          setResetMessage('');
          setResetEmail('');
        }, 3000);
      } else {
        setError(data.error || 'Failed to reset password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validatePasswordStrength = (password) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };
    return checks;
  };

  const passwordChecks = validatePasswordStrength(newPassword);
  const allValid = Object.values(passwordChecks).every(v => v === true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0056A3] to-[#002244] p-5">
      <div className="bg-white/95 rounded-2xl p-10 max-w-md w-full shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#0056A3] rounded-2xl inline-flex items-center justify-center mb-3">
            <i className="fas fa-landmark text-3xl text-white"></i>
          </div>
          <h2 className="text-2xl font-bold text-[#0056A3]">NaCCA HRMIS</h2>
          <p className="text-[#6b7a8a] text-sm">Human Resource Management Information System</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-xl text-sm flex items-center gap-2 mb-4 border border-red-200">
            <i className="fas fa-exclamation-circle"></i>
            <span>{error}</span>
          </div>
        )}

        {showForgotPassword ? (
          <form onSubmit={handleForgotPassword}>
            <div className="mb-4">
              <label className="block font-semibold text-sm mb-1.5">Corporate Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 border-2 border-[#e2e8f0] rounded-xl outline-none focus:border-[#0056A3] transition"
                placeholder="Enter your official email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
            </div>
            {resetMessage && (
              <div className="bg-green-50 text-green-700 p-3 rounded-xl text-sm mb-4 border border-green-200">
                <i className="fas fa-check-circle mr-2"></i>
                {resetMessage}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0056A3] text-white py-3 rounded-xl font-semibold text-base transition hover:bg-[#003d7a] disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <i className="fas fa-spinner fa-spin"></i> Sending...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <i className="fas fa-paper-plane"></i> Reset Password
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setShowForgotPassword(false)}
              className="w-full mt-2 text-[#6b7a8a] hover:text-[#1a2a3a] text-sm"
            >
              ← Back to Login
            </button>
          </form>
        ) : showPasswordChange ? (
          <form onSubmit={handlePasswordChange}>
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <h3 className="font-semibold text-yellow-800 flex items-center gap-2">
                <i className="fas fa-exclamation-triangle"></i>
                First Time Login
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                Welcome {userName}! Please change your temporary password to continue.
              </p>
            </div>

            <div className="mb-4">
              <label className="block font-semibold text-sm mb-1.5">Temporary Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 border-2 border-[#e2e8f0] rounded-xl outline-none focus:border-[#0056A3] transition"
                placeholder="Enter temporary password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block font-semibold text-sm mb-1.5">New Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 border-2 border-[#e2e8f0] rounded-xl outline-none focus:border-[#0056A3] transition"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block font-semibold text-sm mb-1.5">Confirm New Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 border-2 border-[#e2e8f0] rounded-xl outline-none focus:border-[#0056A3] transition"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {newPassword.length > 0 && (
              <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                <p className="text-sm font-semibold mb-2">Password Requirements:</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <span className={passwordChecks.length ? 'text-green-500' : 'text-gray-300'}>
                      <i className={`fas ${passwordChecks.length ? 'fa-check-circle' : 'fa-circle'}`}></i>
                    </span>
                    <span className={passwordChecks.length ? 'text-gray-700' : 'text-gray-400'}>
                      At least 8 characters
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className={passwordChecks.uppercase ? 'text-green-500' : 'text-gray-300'}>
                      <i className={`fas ${passwordChecks.uppercase ? 'fa-check-circle' : 'fa-circle'}`}></i>
                    </span>
                    <span className={passwordChecks.uppercase ? 'text-gray-700' : 'text-gray-400'}>
                      At least one uppercase letter
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className={passwordChecks.lowercase ? 'text-green-500' : 'text-gray-300'}>
                      <i className={`fas ${passwordChecks.lowercase ? 'fa-check-circle' : 'fa-circle'}`}></i>
                    </span>
                    <span className={passwordChecks.lowercase ? 'text-gray-700' : 'text-gray-400'}>
                      At least one lowercase letter
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className={passwordChecks.number ? 'text-green-500' : 'text-gray-300'}>
                      <i className={`fas ${passwordChecks.number ? 'fa-check-circle' : 'fa-circle'}`}></i>
                    </span>
                    <span className={passwordChecks.number ? 'text-gray-700' : 'text-gray-400'}>
                      At least one number
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className={passwordChecks.special ? 'text-green-500' : 'text-gray-300'}>
                      <i className={`fas ${passwordChecks.special ? 'fa-check-circle' : 'fa-circle'}`}></i>
                    </span>
                    <span className={passwordChecks.special ? 'text-gray-700' : 'text-gray-400'}>
                      At least one special character (!@#$%^&*)
                    </span>
                  </div>
                </div>
              </div>
            )}

            {passwordErrors.length > 0 && (
              <div className="mb-4 p-3 bg-red-50 rounded-xl border border-red-200">
                {passwordErrors.map((err, i) => (
                  <p key={i} className="text-sm text-red-700 flex items-center gap-2">
                    <i className="fas fa-times-circle"></i> {err}
                  </p>
                ))}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !allValid}
              className="w-full bg-[#0056A3] text-white py-3 rounded-xl font-semibold text-base transition hover:bg-[#003d7a] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <i className="fas fa-spinner fa-spin"></i> Changing Password...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <i className="fas fa-key"></i> Change Password
                </span>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block font-semibold text-sm mb-1.5">Email Address</label>
              <input
                type="email"
                className="w-full px-4 py-3 border-2 border-[#e2e8f0] rounded-xl outline-none focus:border-[#0056A3] transition"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block font-semibold text-sm mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-4 py-3 border-2 border-[#e2e8f0] rounded-xl outline-none focus:border-[#0056A3] transition pr-12"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b7a8a] hover:text-[#1a2a3a]"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <label className="flex items-center gap-2 text-sm text-[#475569] cursor-pointer">
                <input type="checkbox" className="accent-[#0056A3] w-4 h-4" />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-[#0056A3] font-medium hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0056A3] text-white py-3 rounded-xl font-semibold text-base transition hover:bg-[#003d7a] disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <i className="fas fa-spinner fa-spin"></i> Signing in...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <i className="fas fa-sign-in-alt"></i> Sign In
                </span>
              )}
            </button>
          </form>
        )}

        <hr className="my-6" />

        <div className="text-center text-[#6b7a8a] text-xs">
          <i className="fas fa-shield-alt mr-1"></i> Secure System
          <span className="mx-2">•</span>
          <i className="fas fa-clock mr-1"></i> Session Timeout: 30 Minutes
        </div>

        {/* ===== REMOVED: Demo credentials section ===== */}
      </div>
    </div>
  );
}