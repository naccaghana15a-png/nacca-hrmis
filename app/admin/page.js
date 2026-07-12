'use client';

import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setUser(data.user);
        }
      });
  }, []);

  const stats = [
    { label: 'Total Employees', value: '60', change: '+4.5%', up: true, icon: 'fa-users', color: 'blue' },
    { label: 'Active Staff', value: '58', change: '+2.1%', up: true, icon: 'fa-user-check', color: 'green' },
    { label: 'On Leave Today', value: '2', change: '-3.2%', up: false, icon: 'fa-calendar-day', color: 'yellow' },
    { label: 'Pending Requests', value: '3', change: '+12.5%', up: true, icon: 'fa-clock', color: 'purple' },
  ];

  // Role-specific welcome message
  const getWelcomeMessage = () => {
    if (!user) return 'Welcome to NaCCA HRMIS';
    switch(user.role) {
      case 'SUPER_ADMIN':
        return `Welcome back, ${user.name}! You have full system access.`;
      case 'DIRECTOR':
        return `Welcome back, ${user.name}! You have director-level access.`;
      default:
        return `Welcome back, ${user.name}! You have staff-level access.`;
    }
  };

  const getRoleBadge = () => {
    if (!user) return '';
    const colors = {
      'SUPER_ADMIN': 'bg-purple-100 text-purple-700',
      'DIRECTOR': 'bg-blue-100 text-blue-700',
      'STAFF': 'bg-green-100 text-green-700',
    };
    return colors[user.role] || 'bg-gray-100 text-gray-700';
  };

  const activities = [
    { user: 'John Mensah', action: 'applied for Annual Leave', time: '2 hours ago', initials: 'JM' },
    { user: 'Mary Ofori', action: 'completed Performance Review', time: '4 hours ago', initials: 'MO' },
    { user: 'Kwame Asare', action: 'joined as Curriculum Specialist', time: '1 day ago', initials: 'KA' },
  ];

  const colorMap = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-emerald-100 text-emerald-700',
    yellow: 'bg-amber-100 text-amber-700',
    purple: 'bg-purple-100 text-purple-700',
  };

  return (
    <div className="space-y-6">
      {/* Welcome Message with Role Badge */}
      <div className="bg-white rounded-xl p-5 border border-[#e2e8f0] shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h5 className="font-bold text-xl m-0">{getWelcomeMessage()}</h5>
            <p className="text-[#6b7a8a] text-sm mt-1">
              {user?.staffId} · {user?.department || 'NaCCA'}
            </p>
          </div>
          <div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getRoleBadge()}`}>
              <i className="fas fa-shield-alt mr-2"></i>
              {user?.role || 'STAFF'}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${colorMap[s.color]}`}>
              <i className={`fas ${s.icon}`}></i>
            </div>
            <div className="text-2xl font-bold mt-2">{s.value}</div>
            <div className="text-sm text-[#6b7a8a]">{s.label}</div>
            <div className={`text-xs font-semibold mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${s.up ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
              <i className={`fas fa-${s.up ? 'arrow-up' : 'arrow-down'}`}></i> {s.change}
            </div>
          </div>
        ))}
      </div>

      {/* Activity Feed */}
      <div className="content-card">
        <div className="px-5 py-3 border-b border-[#e2e8f0] flex items-center justify-between">
          <h5 className="font-semibold flex items-center gap-2">
            <i className="fas fa-bolt text-[#0056A3]"></i> Recent Activity
          </h5>
          <span className="text-[#6b7a8a] text-xs">Last 7 days</span>
        </div>
        <div className="p-4 divide-y divide-[#f1f5f9]">
          {activities.map((a) => (
            <div key={a.user} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
              <div className="w-9 h-9 rounded-full bg-[#F5A623] flex items-center justify-center font-bold text-[#0056A3] text-xs flex-shrink-0">
                {a.initials}
              </div>
              <div className="flex-1">
                <p className="text-sm m-0"><strong>{a.user}</strong> {a.action}</p>
                <span className="text-xs text-[#6b7a8a]"><i className="far fa-clock mr-1"></i>{a.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Role-specific quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {user?.role === 'SUPER_ADMIN' && (
          <>
            <button className="quick-action"><i className="fas fa-user-cog w-5"></i> Manage Users</button>
            <button className="quick-action"><i className="fas fa-database w-5"></i> System Backup</button>
          </>
        )}
        {user?.role === 'DIRECTOR' && (
          <>
            <button className="quick-action"><i className="fas fa-users w-5"></i> Team Dashboard</button>
            <button className="quick-action"><i className="fas fa-file-alt w-5"></i> Department Reports</button>
          </>
        )}
        <button className="quick-action"><i className="fas fa-calendar-plus w-5"></i> Apply Leave</button>
        <button className="quick-action"><i className="fas fa-clock w-5"></i> My Attendance</button>
      </div>
    </div>
  );
}