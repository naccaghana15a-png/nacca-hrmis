'use client';

import { useState } from 'react';

export default function PasswordSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const validatePassword = (password) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };
    return checks;
  };

  const passwordChecks = validatePassword(newPassword);
  const allValid = Object.values(passwordChecks).every(v => v === true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSuccess('');
    setLoading(true);

    // Validate
    const validationErrors = [];
    if (newPassword !== confirmPassword) {
      validationErrors.push('Passwords do not match.');
    }
    if (newPassword.length < 8) {
      validationErrors.push('Password must be at least 8 characters long.');
    }
    if (!/[A-Z]/.test(newPassword)) {
      validationErrors.push('Password must contain at least one uppercase letter.');
    }
    if (!/[a-z]/.test(newPassword)) {
      validationErrors.push('Password must contain at least one lowercase letter.');
    }
    if (!/[0-9]/.test(newPassword)) {
      validationErrors.push('Password must contain at least one number.');
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword)) {
      validationErrors.push('Password must contain at least one special character.');
    }
    // Check if new password is same as current
    if (currentPassword === newPassword) {
      validationErrors.push('New password cannot be the same as your current password.');
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      // Call API to change password
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('✅ Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setSuccess(''), 5000);
      } else {
        setErrors([data.error || 'Failed to change password.']);
      }
    } catch (error) {
      setErrors(['Failed to change password. Please try again.']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h5 className="font-bold text-xl m-0">
          <i className="fas fa-key text-[#0056A3] mr-2"></i>
          Change Password
        </h5>
        <p className="text-[#6b7a8a] text-sm m-0">Update your password securely</p>
      </div>

      <div className="content-card max-w-2xl">
        <div className="px-5 py-3 border-b border-[#e2e8f0]">
          <h5 className="font-semibold">Password Settings</h5>
        </div>
        <div className="p-5">
          <form onSubmit={handleSubmit}>
            {/* Current Password */}
            <div className="mb-4">
              <label className="font-semibold text-sm">Current Password *</label>
              <input
                type="password"
                className="w-full p-3 border-2 border-[#e2e8f0] rounded-xl mt-1 focus:border-[#0056A3] outline-none transition"
                placeholder="Enter your current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            {/* New Password */}
            <div className="mb-4">
              <label className="font-semibold text-sm">New Password *</label>
              <input
                type="password"
                className="w-full p-3 border-2 border-[#e2e8f0] rounded-xl mt-1 focus:border-[#0056A3] outline-none transition"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label className="font-semibold text-sm">Confirm New Password *</label>
              <input
                type="password"
                className="w-full p-3 border-2 border-[#e2e8f0] rounded-xl mt-1 focus:border-[#0056A3] outline-none transition"
                placeholder="Re-enter your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {/* Password Strength */}
            {newPassword.length > 0 && (
              <div className="mb-4 p-4 bg-gray-50 rounded-xl">
                <p className="text-sm font-semibold mb-2">Password Requirements:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                  <div className="flex items-center gap-2 text-sm">
                    <span className={passwordChecks.length ? 'text-green-500' : 'text-gray-300'}>
                      <i className={`fas ${passwordChecks.length ? 'fa-check-circle' : 'fa-circle'}`}></i>
                    </span>
                    <span className={passwordChecks.length ? 'text-gray-700' : 'text-gray-400'}>
                      8+ characters
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className={passwordChecks.uppercase ? 'text-green-500' : 'text-gray-300'}>
                      <i className={`fas ${passwordChecks.uppercase ? 'fa-check-circle' : 'fa-circle'}`}></i>
                    </span>
                    <span className={passwordChecks.uppercase ? 'text-gray-700' : 'text-gray-400'}>
                      Uppercase letter
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className={passwordChecks.lowercase ? 'text-green-500' : 'text-gray-300'}>
                      <i className={`fas ${passwordChecks.lowercase ? 'fa-check-circle' : 'fa-circle'}`}></i>
                    </span>
                    <span className={passwordChecks.lowercase ? 'text-gray-700' : 'text-gray-400'}>
                      Lowercase letter
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className={passwordChecks.number ? 'text-green-500' : 'text-gray-300'}>
                      <i className={`fas ${passwordChecks.number ? 'fa-check-circle' : 'fa-circle'}`}></i>
                    </span>
                    <span className={passwordChecks.number ? 'text-gray-700' : 'text-gray-400'}>
                      Number
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className={passwordChecks.special ? 'text-green-500' : 'text-gray-300'}>
                      <i className={`fas ${passwordChecks.special ? 'fa-check-circle' : 'fa-circle'}`}></i>
                    </span>
                    <span className={passwordChecks.special ? 'text-gray-700' : 'text-gray-400'}>
                      Special character
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Errors */}
            {errors.length > 0 && (
              <div className="mb-4 p-3 bg-red-50 rounded-xl border border-red-200">
                {errors.map((err, i) => (
                  <p key={i} className="text-sm text-red-700 flex items-center gap-2">
                    <i className="fas fa-times-circle"></i> {err}
                  </p>
                ))}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="mb-4 p-3 bg-green-50 rounded-xl border border-green-200">
                <p className="text-sm text-green-700 flex items-center gap-2">
                  <i className="fas fa-check-circle"></i> {success}
                </p>
              </div>
            )}

            {/* Security Info */}
            <div className="mb-4 p-3 bg-blue-50 rounded-xl text-sm text-blue-700">
              <i className="fas fa-shield-alt mr-2"></i>
              For security, your password will be encrypted and never stored in plain text.
              Password changes are logged for audit purposes.
            </div>

            <button
              type="submit"
              disabled={loading || !allValid}
              className="w-full bg-[#0056A3] text-white py-3 rounded-xl font-semibold transition hover:bg-[#003d7a] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <i className="fas fa-spinner fa-spin"></i> Updating...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <i className="fas fa-save"></i> Change Password
                </span>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Password Policy Information */}
      <div className="content-card">
        <div className="px-5 py-3 border-b border-[#e2e8f0]">
          <h5 className="font-semibold flex items-center gap-2">
            <i className="fas fa-info-circle text-[#0056A3]"></i> Password Policy
          </h5>
        </div>
        <div className="p-5 text-sm text-[#6b7a8a] space-y-2">
          <p><i className="fas fa-check-circle text-green-500 mr-2"></i> Minimum 8 characters</p>
          <p><i className="fas fa-check-circle text-green-500 mr-2"></i> Must include uppercase and lowercase letters</p>
          <p><i className="fas fa-check-circle text-green-500 mr-2"></i> Must include at least one number</p>
          <p><i className="fas fa-check-circle text-green-500 mr-2"></i> Must include at least one special character (!@#$%^&*)</p>
          <p><i className="fas fa-check-circle text-green-500 mr-2"></i> Cannot be the same as previous passwords (last 5)</p>
          <p><i className="fas fa-check-circle text-green-500 mr-2"></i> Password changes are logged for security auditing</p>
          <p className="mt-2 text-xs text-[#94a3b8]">
            <i className="fas fa-clock mr-1"></i>
            For security, you will be required to change your password every 90 days.
          </p>
        </div>
      </div>
    </div>
  );
}