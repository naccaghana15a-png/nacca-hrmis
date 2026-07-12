'use client';

import Link from 'next/link';

export default function SettingsPage() {
  const handleSaveSettings = () => {
    alert('✅ Settings saved successfully!');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h5 className="font-bold text-xl m-0">System Settings</h5>
          <p className="text-[#6b7a8a] text-sm m-0">System configuration and preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Security Settings */}
        <div className="content-card">
          <div className="px-5 py-3 border-b border-[#e2e8f0]">
            <h5 className="font-semibold flex items-center gap-2">
              <i className="fas fa-shield-alt text-[#0056A3]"></i> Security
            </h5>
          </div>
          <div className="p-4 space-y-2">
            <Link href="/admin/settings/password" className="quick-action w-full text-left">
              <i className="fas fa-key w-5"></i> Change Password
              <i className="fas fa-chevron-right ml-auto text-xs opacity-30"></i>
            </Link>
            <button className="quick-action w-full text-left">
              <i className="fas fa-user-lock w-5"></i> Two-Factor Authentication
              <i className="fas fa-chevron-right ml-auto text-xs opacity-30"></i>
            </button>
            <button className="quick-action w-full text-left">
              <i className="fas fa-clock w-5"></i> Session Management
              <i className="fas fa-chevron-right ml-auto text-xs opacity-30"></i>
            </button>
          </div>
        </div>

        {/* Email Settings */}
        <div className="content-card">
          <div className="px-5 py-3 border-b border-[#e2e8f0]">
            <h5 className="font-semibold flex items-center gap-2">
              <i className="fas fa-envelope text-[#0056A3]"></i> Email
            </h5>
          </div>
          <div className="p-4 space-y-3">
            <div>
              <label className="font-semibold text-sm">SMTP Host</label>
              <input type="text" className="w-full p-2 border rounded-lg mt-1" defaultValue="mail.nacca.gov.gh" />
            </div>
            <div>
              <label className="font-semibold text-sm">SMTP Port</label>
              <input type="text" className="w-full p-2 border rounded-lg mt-1" defaultValue="587" />
            </div>
            <button onClick={handleSaveSettings} className="btn-primary w-full">Save Settings</button>
          </div>
        </div>

        {/* System Settings */}
        <div className="content-card">
          <div className="px-5 py-3 border-b border-[#e2e8f0]">
            <h5 className="font-semibold flex items-center gap-2">
              <i className="fas fa-database text-[#0056A3]"></i> System
            </h5>
          </div>
          <div className="p-4 space-y-2">
            <button className="quick-action w-full text-left">
              <i className="fas fa-database w-5"></i> Backup Database
              <i className="fas fa-chevron-right ml-auto text-xs opacity-30"></i>
            </button>
            <button className="quick-action w-full text-left">
              <i className="fas fa-heartbeat w-5"></i> Health Check
              <i className="fas fa-chevron-right ml-auto text-xs opacity-30"></i>
            </button>
            <button className="quick-action w-full text-left">
              <i className="fas fa-trash w-5"></i> Clear Cache
              <i className="fas fa-chevron-right ml-auto text-xs opacity-30"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}