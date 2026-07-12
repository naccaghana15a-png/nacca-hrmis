'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Chart.js to avoid SSR issues
const Chart = dynamic(() => import('chart.js/auto'), { ssr: false });

export default function DashboardPage() {
  const trendChartRef = useRef(null);
  const distributionChartRef = useRef(null);
  const trendInstance = useRef(null);
  const distributionInstance = useRef(null);

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    import('chart.js/auto').then((ChartModule) => {
      const Chart = ChartModule.default;

      // Trend Chart
      if (trendChartRef.current) {
        if (trendInstance.current) trendInstance.current.destroy();
        trendInstance.current = new Chart(trendChartRef.current, {
          type: 'line',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
              label: 'Leave Applications',
              data: [12, 18, 24, 20, 28, 16],
              borderColor: '#0056A3',
              backgroundColor: 'rgba(0, 86, 163, 0.05)',
              fill: true,
              tension: 0.4,
              pointBackgroundColor: '#0056A3',
              pointBorderColor: 'white',
              pointBorderWidth: 2,
              pointRadius: 4,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
              x: { grid: { display: false } }
            }
          }
        });
      }

      // Distribution Chart
      if (distributionChartRef.current) {
        if (distributionInstance.current) distributionInstance.current.destroy();
        distributionInstance.current = new Chart(distributionChartRef.current, {
          type: 'doughnut',
          data: {
            labels: ['Annual', 'Sick', 'Casual', 'Study', 'Other'],
            datasets: [{
              data: [45, 25, 15, 10, 5],
              backgroundColor: ['#0056A3', '#059669', '#d97706', '#7c3aed', '#ef4444'],
              borderWidth: 0,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: { padding: 12, usePointStyle: true, pointStyle: 'circle', font: { size: 11 } }
              }
            },
            cutout: '65%'
          }
        });
      }
    });

    return () => {
      if (trendInstance.current) trendInstance.current.destroy();
      if (distributionInstance.current) distributionInstance.current.destroy();
    };
  }, []);

  const stats = [
    { label: 'Total Employees', value: '245', change: '+4.5%', up: true, icon: 'fa-users', color: 'blue' },
    { label: 'Active Staff', value: '198', change: '+2.1%', up: true, icon: 'fa-user-check', color: 'green' },
    { label: 'On Leave Today', value: '15', change: '-3.2%', up: false, icon: 'fa-calendar-day', color: 'yellow' },
    { label: 'Pending Requests', value: '23', change: '+12.5%', up: true, icon: 'fa-clock', color: 'purple' },
  ];

  const activities = [
    { user: 'John Mensah', action: 'applied for Annual Leave', time: '2 hours ago', initials: 'JM' },
    { user: 'Mary Ofori', action: 'completed Performance Review', time: '4 hours ago', initials: 'MO' },
    { user: 'Kwame Asare', action: 'joined as Curriculum Specialist', time: '1 day ago', initials: 'KA' },
    { user: 'Ama Serwaa', action: 'completed Training: Leadership Skills', time: '2 days ago', initials: 'AS' },
  ];

  const quickActions = [
    { icon: 'fa-plus-circle', label: 'Apply for Leave' },
    { icon: 'fa-clock', label: 'Clock In/Out' },
    { icon: 'fa-chart-line', label: 'Performance Review' },
    { icon: 'fa-graduation-cap', label: 'Training Center' },
  ];

  const colorMap = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-emerald-100 text-emerald-700',
    yellow: 'bg-amber-100 text-amber-700',
    purple: 'bg-purple-100 text-purple-700',
  };

  return (
    <div className="space-y-6">
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 content-card">
          <div className="px-5 py-3 border-b border-[#e2e8f0] flex items-center justify-between">
            <h5 className="font-semibold text-[#1a2a3a] flex items-center gap-2">
              <i className="fas fa-chart-bar text-[#0056A3]"></i> Monthly Leave Trends
            </h5>
            <span className="text-[#6b7a8a] text-xs">2026</span>
          </div>
          <div className="p-5">
            <div className="chart-container">
              <canvas ref={trendChartRef}></canvas>
            </div>
          </div>
        </div>
        <div className="content-card">
          <div className="px-5 py-3 border-b border-[#e2e8f0]">
            <h5 className="font-semibold text-[#1a2a3a] flex items-center gap-2">
              <i className="fas fa-chart-pie text-[#0056A3]"></i> Leave Distribution
            </h5>
          </div>
          <div className="p-5">
            <div className="chart-container" style={{ height: 220 }}>
              <canvas ref={distributionChartRef}></canvas>
            </div>
          </div>
        </div>
      </div>

      {/* Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 content-card">
          <div className="px-5 py-3 border-b border-[#e2e8f0] flex items-center justify-between">
            <h5 className="font-semibold text-[#1a2a3a] flex items-center gap-2">
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
        <div className="content-card">
          <div className="px-5 py-3 border-b border-[#e2e8f0]">
            <h5 className="font-semibold text-[#1a2a3a] flex items-center gap-2">
              <i className="fas fa-bolt text-[#0056A3]"></i> Quick Actions
            </h5>
          </div>
          <div className="p-4 space-y-2">
            {quickActions.map((a) => (
              <button key={a.label} className="flex items-center gap-3 w-full p-3 rounded-xl border-2 border-[#e2e8f0] hover:border-[#0056A3] hover:bg-[#0056A3]/5 transition-all text-left">
                <i className={`fas ${a.icon} text-[#0056A3] w-5`}></i>
                <span className="text-sm font-medium">{a.label}</span>
                <i className="fas fa-chevron-right ml-auto text-xs opacity-30"></i>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}