'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (!data.authenticated) {
          router.push('/');
        } else {
          setUser(data.user);
        }
      })
      .catch(() => router.push('/'))
      .finally(() => setLoading(false));
  }, [router]);

  // Define navigation items with role-based visibility
  const getNavItems = (role) => {
    const allItems = [
      { icon: 'fa-th-large', label: 'Dashboard', path: '/admin', roles: ['SUPER_ADMIN', 'DIRECTOR', 'STAFF'] },
      { icon: 'fa-users', label: 'Employees', path: '/admin/employees', roles: ['SUPER_ADMIN', 'DIRECTOR'] },
      { icon: 'fa-calendar-check', label: 'Leave Management', path: '/admin/leave', roles: ['SUPER_ADMIN', 'DIRECTOR', 'STAFF'] },
      { icon: 'fa-clock', label: 'Attendance', path: '/admin/attendance', roles: ['SUPER_ADMIN', 'DIRECTOR', 'STAFF'] },
      { icon: 'fa-chart-line', label: 'Performance', path: '/admin/performance', roles: ['SUPER_ADMIN', 'DIRECTOR'] },
      { icon: 'fa-graduation-cap', label: 'Training', path: '/admin/training', roles: ['SUPER_ADMIN', 'DIRECTOR', 'STAFF'] },
      { icon: 'fa-briefcase', label: 'Recruitment', path: '/admin/recruitment', roles: ['SUPER_ADMIN', 'DIRECTOR'] },
      { icon: 'fa-laptop', label: 'Assets', path: '/admin/assets', roles: ['SUPER_ADMIN'] },
      { icon: 'fa-file-alt', label: 'Documents', path: '/admin/documents', roles: ['SUPER_ADMIN', 'DIRECTOR'] },
      { icon: 'fa-wallet', label: 'Payroll', path: '/admin/payroll', roles: ['SUPER_ADMIN'] },
      { icon: 'fa-chart-bar', label: 'Analytics', path: '/admin/analytics', roles: ['SUPER_ADMIN', 'DIRECTOR'] },
      { icon: 'fa-file-pdf', label: 'Reports', path: '/admin/reports', roles: ['SUPER_ADMIN', 'DIRECTOR'] },
      { icon: 'fa-cog', label: 'Settings', path: '/admin/settings', roles: ['SUPER_ADMIN'] },
    ];

    return allItems.filter(item => item.roles.includes(role));
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  const isActive = (path) => pathname === path;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f7fc]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#e2e8f0] border-t-[#0056A3] rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-[#6b7a8a]">Loading...</p>
        </div>
      </div>
    );
  }

  const navItems = getNavItems(user?.role || 'STAFF');

  const getRoleBadgeColor = (role) => {
    const colors = {
      'SUPER_ADMIN': 'bg-purple-600 text-white',
      'DIRECTOR': 'bg-blue-600 text-white',
      'STAFF': 'bg-green-600 text-white',
    };
    return colors[role] || 'bg-gray-600 text-white';
  };

  return (
    <div className="flex min-h-screen bg-[#f4f7fc]">
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`fixed top-0 left-0 bottom-0 w-[260px] bg-[#0056A3] text-white z-50 transition-transform duration-300 flex flex-col overflow-y-auto ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 ${!sidebarOpen ? 'lg:-translate-x-full' : ''}`}>
        <div className="p-5 border-b border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center text-xl">
            <i className="fas fa-landmark"></i>
          </div>
          <div>
            <h5 className="font-bold text-base m-0">NaCCA HRMIS</h5>
            <small className="text-[10px] opacity-60">Human Resource Management</small>
          </div>
        </div>

        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F5A623] flex items-center justify-center font-bold text-[#0056A3] text-sm">
              {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'SA'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm truncate">{user?.name || 'System Admin'}</div>
              <div className="text-[10px] opacity-60 uppercase tracking-wider">{user?.staffId || 'N/A'}</div>
            </div>
          </div>
          <div className="mt-2">
            <span className={`text-[10px] px-3 py-1 rounded-full ${getRoleBadgeColor(user?.role)}`}>
              {user?.role || 'STAFF'}
            </span>
          </div>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          <div className="text-[10px] uppercase tracking-wider opacity-40 px-3 py-2 font-semibold">Main</div>
          {navItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer text-sm font-medium ${isActive(item.path) ? 'bg-[#F5A623] text-[#0056A3] hover:bg-[#F5A623] hover:text-[#0056A3]' : ''}`}
            >
              <i className={`fas ${item.icon} w-5 text-center text-base`}></i>
              <span>{item.label}</span>
            </a>
          ))}

          {/* ====== ADD THIS SECTION: ACCOUNT ====== */}
          <div className="nav-label mt-3">Account</div>
          <a
            href="/admin/settings/password"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer text-sm font-medium ${isActive('/admin/settings/password') ? 'bg-[#F5A623] text-[#0056A3] hover:bg-[#F5A623] hover:text-[#0056A3]' : ''}`}
          >
            <i className="fas fa-key w-5 text-center text-base"></i>
            <span>Change Password</span>
          </a>
          {/* ====== END OF ADDED SECTION ====== */}

          <div className="text-[10px] uppercase tracking-wider opacity-40 px-3 py-2 font-semibold mt-4">System</div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-red-400 hover:bg-white/10 transition-all cursor-pointer text-sm font-medium w-full text-left"
          >
            <i className="fas fa-sign-out-alt w-5 text-center"></i>
            <span>Sign Out</span>
          </button>
        </nav>
      </aside>

      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-[260px]' : 'lg:ml-0'}`}>
        <header className="bg-white sticky top-0 z-30 border-b border-[#e2e8f0] px-6 py-3 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-xl p-1 rounded-lg hover:bg-[#f4f7fc]"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <i className="fas fa-bars"></i>
            </button>
            <button
              className="hidden lg:block text-xl p-1 rounded-lg hover:bg-[#f4f7fc]"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <i className={`fas ${sidebarOpen ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
            </button>
            <div>
              <h4 className="font-bold text-lg m-0">
                {navItems.find(i => i.path === pathname)?.label || 'Dashboard'}
              </h4>
              <p className="text-sm text-[#6b7a8a] m-0">
                {user?.role === 'SUPER_ADMIN' ? 'Full Access' : user?.role === 'DIRECTOR' ? 'Director Access' : 'Staff Access'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center border-2 border-[#e2e8f0] rounded-full overflow-hidden focus-within:border-[#0056A3] transition">
              <i className="fas fa-search text-[#6b7a8a] ml-3"></i>
              <input
                type="text"
                placeholder="Search..."
                className="px-3 py-1.5 outline-none bg-transparent text-sm w-36 focus:w-48 transition-all"
              />
            </div>
            <button className="w-10 h-10 rounded-full bg-[#f4f7fc] hover:bg-[#e2e8f0] transition flex items-center justify-center relative">
              <i className="fas fa-bell text-[#1a2a3a]"></i>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-[#f4f7fc] transition border-2 border-transparent hover:border-[#e2e8f0]">
              <div className="w-8 h-8 rounded-full bg-[#F5A623] flex items-center justify-center font-bold text-[#0056A3] text-xs">
                {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'SA'}
              </div>
              <span className="text-sm font-semibold hidden sm:inline truncate max-w-[100px]">{user?.name || 'System Admin'}</span>
              <i className="fas fa-chevron-down text-[10px] opacity-50 hidden sm:inline"></i>
            </button>
          </div>
        </header>

        <div className="p-5 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}