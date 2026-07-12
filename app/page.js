'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@nacca.gov.gh');
  const [password, setPassword] = useState('Admin@123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
        router.push('/admin');
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
            <input
              type="password"
              className="w-full px-4 py-3 border-2 border-[#e2e8f0] rounded-xl outline-none focus:border-[#0056A3] transition"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-between items-center mb-6">
            <label className="flex items-center gap-2 text-sm text-[#475569] cursor-pointer">
              <input type="checkbox" className="accent-[#0056A3] w-4 h-4" />
              Remember me
            </label>
            <a href="#" className="text-sm text-[#0056A3] font-medium hover:underline">Forgot Password?</a>
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

        <hr className="my-6" />

        <div className="text-center text-[#6b7a8a] text-xs">
          <i className="fas fa-shield-alt mr-1"></i> Secure System &bull;
          <i className="fas fa-clock ml-2 mr-1"></i> Session Timeout: 30 Minutes
        </div>

        <div className="mt-4 text-center text-xs text-[#6b7a8a] border-t border-[#e2e8f0] pt-4">
          <p className="font-mono text-[10px] text-[#94a3b8]">
            Demo: admin@nacca.gov.gh / Admin@123
          </p>
        </div>
      </div>
    </div>
  );
}