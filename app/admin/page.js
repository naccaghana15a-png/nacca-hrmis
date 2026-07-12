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

  // REAL NaCCA Staff Activities with Correct Approval Workflow
  const activities = [
    { 
      user: 'Prof. Samuel Ofori Bekoe', 
      action: 'approved Curriculum Development framework v2.4', 
      time: '2 hours ago', 
      initials: 'SB',
      department: 'Executive',
      isApproval: true
    },
    { 
      user: 'Prof. Samuel Ofori Bekoe', 
      action: 'approved 5 staff leave applications', 
      time: '4 hours ago', 
      initials: 'SB',
      department: 'Executive',
      isApproval: true
    },
    { 
      user: 'Dr. J. R. Achoanya Ayam', 
      action: 'submitted RPME Q1 2026 report for review', 
      time: '1 day ago', 
      initials: 'JA',
      department: 'Executive',
      isApproval: false
    },
    { 
      user: 'Reginald George Quartey', 
      action: 'submitted Curriculum Development report for approval', 
      time: '2 days ago', 
      initials: 'RQ',
      department: 'Curriculum',
      isApproval: false
    },
    { 
      user: 'Anita Frances Cordeiro Collison', 
      action: 'submitted Assessment Standards review for approval', 
      time: '3 days ago', 
      initials: 'AC',
      department: 'Assessment',
      isApproval: false
    },
    { 
      user: 'Prof. Samuel Ofori Bekoe', 
      action: 'approved Assessment Standards review document', 
      time: '3 days ago', 
      initials: 'SB',
      department: 'Executive',
      isApproval: true
    },
    { 
      user: 'Dr. Eric Amoah', 
      action: 'submitted Training Needs Assessment for approval', 
      time: '4 days ago', 
      initials: 'EA',
      department: 'Executive',
      isApproval: false
    },
    { 
      user: 'Elijah Intsiful', 
      action: 'submitted HR recruitment plan for approval', 
      time: '5 days ago', 
      initials: 'EI',
      department: 'Human Resource',
      isApproval: false
    },
  ];

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

  const getAvatarColor = (department) => {
    const colors = {
      'Executive': 'bg-purple-600 text-white',
      'Curriculum': 'bg-blue-500 text-white',
      'Assessment': 'bg-green-500 text-white',
      'Research': 'bg-orange-500 text-white',
      'Instructional Resources': 'bg-teal-500 text-white',
      'Human Resource': 'bg-pink-500 text-white',
      'Corporate Affairs': 'bg-indigo-500 text-white',
      'Administration': 'bg-gray-500 text-white',
      'Finance': 'bg-emerald-500 text-white',
      'ICT': 'bg-cyan-500 text-white',
    };
    return colors[department] || 'bg-[#F5A623] text-[#0056A3]';
  };

  // Get icon for action type
  const getActionIcon = (isApproval) => {
    return isApproval ? 'fa-check-circle text-green-500' : 'fa-paper-plane text-blue-500';
  };

  // Get label for action type
  const getActionLabel = (isApproval) => {
    return isApproval ? 'Approval' : 'Submission';
  };

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
              {user?.staffId || 'NAC-IT-0001'} · {user?.department || 'NaCCA'}
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

      {/* Recent Activity with Real NaCCA Staff and Approval Workflow */}
      <div className="content-card">
        <div className="px-5 py-3 border-b border-[#e2e8f0] flex items-center justify-between">
          <h5 className="font-semibold flex items-center gap-2">
            <i className="fas fa-bolt text-[#0056A3]"></i> Recent Activity
          </h5>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#6b7a8a]">Last 7 days</span>
            <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
              <i className="fas fa-check-circle mr-1"></i> Approvals
            </span>
            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
              <i className="fas fa-paper-plane mr-1"></i> Submissions
            </span>
          </div>
        </div>
        <div className="p-4 divide-y divide-[#f1f5f9]">
          {activities.map((a, index) => (
            <div key={index} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${getAvatarColor(a.department)}`}>
                {a.initials}
              </div>
              <div className="flex-1">
                <p className="text-sm m-0">
                  <strong>{a.user}</strong>
                  <span className="text-[#6b7a8a] text-xs ml-1 font-normal">
                    ({a.department})
                  </span>
                  <span className={`ml-2 text-xs font-semibold ${a.isApproval ? 'text-green-600' : 'text-blue-600'}`}>
                    <i className={`fas ${getActionIcon(a.isApproval)} mr-1`}></i>
                    {getActionLabel(a.isApproval)}
                  </span>
                  <br />
                  <span className="text-sm">{a.action}</span>
                </p>
                <span className="text-xs text-[#6b7a8a]"><i className="far fa-clock mr-1"></i>{a.time}</span>
              </div>
              {a.isApproval && (
                <div className="flex-shrink-0">
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    <i className="fas fa-check mr-1"></i> Approved
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Pending Approvals - Director-General's View */}
      <div className="content-card">
        <div className="px-5 py-3 border-b border-[#e2e8f0] flex items-center justify-between">
          <h5 className="font-semibold flex items-center gap-2">
            <i className="fas fa-clock text-amber-500"></i> Pending Approvals
          </h5>
          <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs font-semibold">4</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f4f7fc]">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">Document/Request</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">Submitted By</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">Department</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">Date</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              <tr className="hover:bg-[#f8fafc]">
                <td className="px-4 py-2 text-sm font-medium">Curriculum Framework v2.4</td>
                <td className="px-4 py-2 text-sm">Reginald George Quartey</td>
                <td className="px-4 py-2 text-sm">Curriculum</td>
                <td className="px-4 py-2 text-sm">2026-07-10</td>
                <td className="px-4 py-2">
                  <button className="text-green-600 hover:bg-green-50 p-1.5 rounded-lg transition text-sm mr-1">
                    <i className="fas fa-check"></i>
                  </button>
                  <button className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition text-sm">
                    <i className="fas fa-times"></i>
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-[#f8fafc]">
                <td className="px-4 py-2 text-sm font-medium">RPME Q2 Research Plan</td>
                <td className="px-4 py-2 text-sm">Dr. Mercy Nyamekye</td>
                <td className="px-4 py-2 text-sm">Research</td>
                <td className="px-4 py-2 text-sm">2026-07-09</td>
                <td className="px-4 py-2">
                  <button className="text-green-600 hover:bg-green-50 p-1.5 rounded-lg transition text-sm mr-1">
                    <i className="fas fa-check"></i>
                  </button>
                  <button className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition text-sm">
                    <i className="fas fa-times"></i>
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-[#f8fafc]">
                <td className="px-4 py-2 text-sm font-medium">Staff Recruitment Plan</td>
                <td className="px-4 py-2 text-sm">Elijah Intsiful</td>
                <td className="px-4 py-2 text-sm">Human Resource</td>
                <td className="px-4 py-2 text-sm">2026-07-08</td>
                <td className="px-4 py-2">
                  <button className="text-green-600 hover:bg-green-50 p-1.5 rounded-lg transition text-sm mr-1">
                    <i className="fas fa-check"></i>
                  </button>
                  <button className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition text-sm">
                    <i className="fas fa-times"></i>
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-[#f8fafc]">
                <td className="px-4 py-2 text-sm font-medium">Corporate Communications Strategy</td>
                <td className="px-4 py-2 text-sm">Rebecca Abu Gariba</td>
                <td className="px-4 py-2 text-sm">Corporate Affairs</td>
                <td className="px-4 py-2 text-sm">2026-07-07</td>
                <td className="px-4 py-2">
                  <button className="text-green-600 hover:bg-green-50 p-1.5 rounded-lg transition text-sm mr-1">
                    <i className="fas fa-check"></i>
                  </button>
                  <button className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition text-sm">
                    <i className="fas fa-times"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
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