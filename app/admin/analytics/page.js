'use client';

import { useEffect, useRef } from 'react';

export default function AnalyticsPage() {
  const chartRefs = {
    directorate: useRef(null),
    gender: useRef(null),
    status: useRef(null),
    hiring: useRef(null)
  };
  const chartInstances = useRef({});

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    import('chart.js/auto').then((ChartModule) => {
      const Chart = ChartModule.default;

      // Directorate Chart
      if (chartRefs.directorate.current) {
        if (chartInstances.current.directorate) chartInstances.current.directorate.destroy();
        chartInstances.current.directorate = new Chart(chartRefs.directorate.current, {
          type: 'bar',
          data: {
            labels: ['Curriculum', 'Assessment', 'Instructional', 'Research', 'Corporate', 'HR', 'Finance', 'ICT'],
            datasets: [{
              label: 'Staff Count',
              data: [32, 28, 18, 15, 22, 25, 20, 12],
              backgroundColor: '#0056A3',
              borderRadius: 6,
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

      // Gender Chart
      if (chartRefs.gender.current) {
        if (chartInstances.current.gender) chartInstances.current.gender.destroy();
        chartInstances.current.gender = new Chart(chartRefs.gender.current, {
          type: 'doughnut',
          data: {
            labels: ['Male', 'Female'],
            datasets: [{
              data: [108, 90],
              backgroundColor: ['#0056A3', '#F5A623'],
              borderWidth: 0,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'bottom', labels: { usePointStyle: true, padding: 16 } }
            },
            cutout: '60%'
          }
        });
      }

      // Status Chart
      if (chartRefs.status.current) {
        if (chartInstances.current.status) chartInstances.current.status.destroy();
        chartInstances.current.status = new Chart(chartRefs.status.current, {
          type: 'pie',
          data: {
            labels: ['Active', 'On Leave', 'Probation', 'Retired'],
            datasets: [{
              data: [165, 15, 8, 12],
              backgroundColor: ['#059669', '#d97706', '#7c3aed', '#94a3b8'],
              borderWidth: 0,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'bottom', labels: { usePointStyle: true, padding: 16 } }
            }
          }
        });
      }

      // Hiring Trend Chart
      if (chartRefs.hiring.current) {
        if (chartInstances.current.hiring) chartInstances.current.hiring.destroy();
        chartInstances.current.hiring = new Chart(chartRefs.hiring.current, {
          type: 'line',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
              label: 'New Hires',
              data: [3, 5, 2, 4, 6, 3, 2, 4, 5, 3, 2, 4],
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
    });

    return () => {
      Object.values(chartInstances.current).forEach(chart => {
        if (chart) chart.destroy();
      });
    };
  }, []);

  const handleExport = () => {
    alert('📊 Export analytics data coming soon!');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h5 className="font-bold text-xl m-0">Analytics & Insights</h5>
          <p className="text-[#6b7a8a] text-sm m-0">Data insights and analytics</p>
        </div>
        <button onClick={handleExport} className="btn-outline">
          <i className="fas fa-download mr-2"></i>Export
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="content-card">
          <div className="px-5 py-3 border-b border-[#e2e8f0]">
            <h5 className="font-semibold">Staff by Directorate</h5>
          </div>
          <div className="p-4">
            <div className="chart-container" style={{ height: 220 }}>
              <canvas ref={chartRefs.directorate}></canvas>
            </div>
          </div>
        </div>

        <div className="content-card">
          <div className="px-5 py-3 border-b border-[#e2e8f0]">
            <h5 className="font-semibold">Gender Distribution</h5>
          </div>
          <div className="p-4">
            <div className="chart-container" style={{ height: 220 }}>
              <canvas ref={chartRefs.gender}></canvas>
            </div>
          </div>
        </div>

        <div className="content-card">
          <div className="px-5 py-3 border-b border-[#e2e8f0]">
            <h5 className="font-semibold">Employment Status</h5>
          </div>
          <div className="p-4">
            <div className="chart-container" style={{ height: 220 }}>
              <canvas ref={chartRefs.status}></canvas>
            </div>
          </div>
        </div>

        <div className="content-card">
          <div className="px-5 py-3 border-b border-[#e2e8f0]">
            <h5 className="font-semibold">Monthly Hiring Trend</h5>
          </div>
          <div className="p-4">
            <div className="chart-container" style={{ height: 220 }}>
              <canvas ref={chartRefs.hiring}></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}