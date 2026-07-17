'use client';

import { useState, useEffect } from 'react';

export default function ReportsPage() {
  const [user, setUser] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState('staff');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [department, setDepartment] = useState('all');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [empRes, leaveRes] = await Promise.all([
        fetch('/api/employees'),
        fetch('/api/leave')
      ]);
      
      if (empRes.ok) {
        const empData = await empRes.json();
        setEmployees(empData);
      }
      
      if (leaveRes.ok) {
        const leaveData = await leaveRes.json();
        setLeaveApplications(leaveData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sample data for demo (in production, fetch from API)
  const departments = ['all', 'Executive', 'Assessment', 'Curriculum', 'Research', 'Instructional Resources', 'Human Resource', 'Corporate Affairs', 'Administration', 'Procurement', 'Finance', 'Internal Audit', 'ICT'];

  const getDepartmentCount = (dept) => {
    if (dept === 'all') return employees.length;
    return employees.filter(e => e.department === dept).length;
  };

  const getStatusCount = (status) => {
    return employees.filter(e => e.status === status).length;
  };

  const generateReport = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      showReportPreview();
    }, 1500);
  };

  const showReportPreview = () => {
    const reportData = getReportData();
    const win = window.open('', '_blank');
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${reportData.title} - NaCCA HRMIS</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; color: #333; max-width: 1200px; margin: 0 auto; }
          .header { border-bottom: 3px solid #0056A3; padding-bottom: 20px; margin-bottom: 30px; }
          .header h1 { color: #0056A3; margin: 0; }
          .header p { color: #6b7a8a; margin: 5px 0 0; }
          .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px; }
          .stat-box { background: #f4f7fc; padding: 15px; border-radius: 8px; text-align: center; }
          .stat-box .number { font-size: 24px; font-weight: bold; color: #0056A3; }
          .stat-box .label { font-size: 12px; color: #6b7a8a; margin-top: 4px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background: #0056A3; color: white; padding: 10px; text-align: left; }
          td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
          tr:hover { background: #f8fafc; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #6b7a8a; font-size: 12px; }
          @media print { body { padding: 20px; } .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🏛️ ${reportData.title}</h1>
          <p>Generated: ${new Date().toLocaleString()} | Department: ${department === 'all' ? 'All' : department}</p>
        </div>
        
        <div class="stats">
          <div class="stat-box">
            <div class="number">${reportData.total}</div>
            <div class="label">Total ${reportData.type}</div>
          </div>
          <div class="stat-box">
            <div class="number">${reportData.active}</div>
            <div class="label">Active</div>
          </div>
          <div class="stat-box">
            <div class="number">${reportData.pending}</div>
            <div class="label">Pending</div>
          </div>
          <div class="stat-box">
            <div class="number">${reportData.departments}</div>
            <div class="label">Departments</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              ${reportData.columns.map(col => `<th>${col}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${reportData.rows.map(row => `
              <tr>
                ${row.map(cell => `<td>${cell}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="footer">
          <p>NaCCA HRMIS - ${reportData.title} | Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        <div class="no-print" style="text-align:center; margin-top:20px;">
          <button onclick="window.print()" style="background:#0056A3; color:white; padding:10px 30px; border:none; border-radius:8px; cursor:pointer; font-size:16px;">
            🖨️ Print / Save as PDF
          </button>
          <button onclick="window.close()" style="background:#e2e8f0; color:#333; padding:10px 30px; border:none; border-radius:8px; cursor:pointer; font-size:16px; margin-left:10px;">
            Close
          </button>
        </div>
      </body>
      </html>
    `);
    win.document.close();
  };

  const getReportData = () => {
    const filtered = department === 'all' 
      ? employees 
      : employees.filter(e => e.department === department);

    switch(reportType) {
      case 'staff':
        return {
          title: 'Staff List Report',
          type: 'Employees',
          total: filtered.length,
          active: filtered.filter(e => e.status === 'Active').length,
          pending: filtered.filter(e => e.status === 'Pending').length,
          departments: new Set(filtered.map(e => e.department)).size,
          columns: ['#', 'Staff ID', 'Name', 'Position', 'Department', 'Status', 'Join Date'],
          rows: filtered.map((e, i) => [
            i + 1,
            e.staffId || 'N/A',
            e.name || 'N/A',
            e.position || 'N/A',
            e.department || 'N/A',
            e.status || 'N/A',
            e.joinDate ? new Date(e.joinDate).toLocaleDateString() : 'N/A'
          ])
        };

      case 'leave':
        const leaveData = leaveApplications.length > 0 ? leaveApplications : [
          { employee: 'John Mensah', type: 'Annual', start: '2026-07-15', end: '2026-07-19', days: 5, status: 'Approved' },
          { employee: 'Mary Ofori', type: 'Sick', start: '2026-07-12', end: '2026-07-13', days: 2, status: 'Pending' },
          { employee: 'Kwame Asare', type: 'Casual', start: '2026-07-10', end: '2026-07-10', days: 1, status: 'Pending' },
        ];
        return {
          title: 'Leave Report',
          type: 'Applications',
          total: leaveData.length,
          active: leaveData.filter(l => l.status === 'Approved').length,
          pending: leaveData.filter(l => l.status === 'Pending').length,
          departments: 0,
          columns: ['#', 'Employee', 'Type', 'Start Date', 'End Date', 'Days', 'Status'],
          rows: leaveData.map((l, i) => [
            i + 1,
            l.employee || l.applicant || 'N/A',
            l.type || l.leave_type || 'N/A',
            l.start || l.startDate || 'N/A',
            l.end || l.endDate || 'N/A',
            l.days || 'N/A',
            l.status || 'Pending'
          ])
        };

      case 'department':
        const deptStats = departments.filter(d => d !== 'all').map(d => ({
          name: d,
          count: employees.filter(e => e.department === d).length,
          active: employees.filter(e => e.department === d && e.status === 'Active').length
        }));
        return {
          title: 'Department Summary Report',
          type: 'Departments',
          total: deptStats.length,
          active: deptStats.reduce((sum, d) => sum + d.active, 0),
          pending: 0,
          departments: deptStats.length,
          columns: ['#', 'Department', 'Total Staff', 'Active', 'Inactive'],
          rows: deptStats.map((d, i) => [
            i + 1,
            d.name,
            d.count,
            d.active,
            d.count - d.active
          ])
        };

      default:
        return {
          title: 'Report',
          type: 'Data',
          total: 0,
          active: 0,
          pending: 0,
          departments: 0,
          columns: ['No data available'],
          rows: []
        };
    }
  };

  const exportCSV = () => {
    const reportData = getReportData();
    if (reportData.rows.length === 0) {
      alert('No data to export.');
      return;
    }
    
    let csv = reportData.columns.join(',') + '\n';
    reportData.rows.forEach(row => {
      csv += row.join(',') + '\n';
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportData.title.replace(/ /g, '_')}_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#e2e8f0] border-t-[#0056A3] rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-[#6b7a8a]">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h5 className="font-bold text-xl m-0">
            <i className="fas fa-file-pdf text-[#0056A3] mr-2"></i>
            Reports
          </h5>
          <p className="text-[#6b7a8a] text-sm m-0">Generate and export reports</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={generateReport} className="btn-primary">
            <i className="fas fa-file-pdf mr-2"></i>Generate Report
          </button>
          <button onClick={exportCSV} className="btn-secondary">
            <i className="fas fa-file-export mr-2"></i>Export CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card text-center">
          <div className="text-2xl font-bold text-[#0056A3]">{employees.length}</div>
          <div className="text-sm text-[#6b7a8a]">Total Employees</div>
        </div>
        <div className="stat-card text-center">
          <div className="text-2xl font-bold text-[#059669]">{employees.filter(e => e.status === 'Active').length}</div>
          <div className="text-sm text-[#6b7a8a]">Active Staff</div>
        </div>
        <div className="stat-card text-center">
          <div className="text-2xl font-bold text-[#d97706]">{employees.filter(e => e.status === 'Pending').length}</div>
          <div className="text-sm text-[#6b7a8a]">Pending</div>
        </div>
        <div className="stat-card text-center">
          <div className="text-2xl font-bold text-[#0056A3]">{new Set(employees.map(e => e.department)).size}</div>
          <div className="text-sm text-[#6b7a8a]">Departments</div>
        </div>
      </div>

      {/* Report Configuration */}
      <div className="content-card">
        <div className="px-5 py-3 border-b border-[#e2e8f0]">
          <h5 className="font-semibold flex items-center gap-2">
            <i className="fas fa-sliders-h text-[#0056A3]"></i> Report Configuration
          </h5>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="font-semibold text-sm">Report Type</label>
              <select 
                className="w-full p-2 border rounded-lg mt-1"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="staff">Staff List</option>
                <option value="leave">Leave Report</option>
                <option value="department">Department Summary</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-sm">Department</label>
              <select 
                className="w-full p-2 border rounded-lg mt-1"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                {departments.map(d => (
                  <option key={d} value={d}>{d === 'all' ? 'All Departments' : d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-semibold text-sm">Start Date</label>
              <input 
                type="date" 
                className="w-full p-2 border rounded-lg mt-1"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              />
            </div>
            <div>
              <label className="font-semibold text-sm">End Date</label>
              <input 
                type="date" 
                className="w-full p-2 border rounded-lg mt-1"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              />
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button 
              onClick={generateReport}
              disabled={generating}
              className="btn-primary disabled:opacity-50"
            >
              {generating ? (
                <span className="flex items-center gap-2">
                  <i className="fas fa-spinner fa-spin"></i> Generating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <i className="fas fa-file-pdf"></i> Generate Report
                </span>
              )}
            </button>
            <button 
              onClick={exportCSV}
              className="btn-secondary"
            >
              <i className="fas fa-file-export mr-2"></i>Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Quick Reports */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="content-card hover:shadow-md transition cursor-pointer" onClick={() => { setReportType('staff'); generateReport(); }}>
          <div className="p-5 text-center">
            <div className="text-3xl mb-2">👥</div>
            <h6 className="font-bold">Staff List</h6>
            <p className="text-sm text-[#6b7a8a]">Complete staff directory</p>
            <p className="text-xs text-[#0056A3] mt-2">{employees.length} employees</p>
          </div>
        </div>
        <div className="content-card hover:shadow-md transition cursor-pointer" onClick={() => { setReportType('leave'); generateReport(); }}>
          <div className="p-5 text-center">
            <div className="text-3xl mb-2">📋</div>
            <h6 className="font-bold">Leave Report</h6>
            <p className="text-sm text-[#6b7a8a]">Leave applications summary</p>
            <p className="text-xs text-[#0056A3] mt-2">{leaveApplications.length || 3} applications</p>
          </div>
        </div>
        <div className="content-card hover:shadow-md transition cursor-pointer" onClick={() => { setReportType('department'); generateReport(); }}>
          <div className="p-5 text-center">
            <div className="text-3xl mb-2">🏢</div>
            <h6 className="font-bold">Department Summary</h6>
            <p className="text-sm text-[#6b7a8a]">Staff by department</p>
            <p className="text-xs text-[#0056A3] mt-2">{new Set(employees.map(e => e.department)).size} departments</p>
          </div>
        </div>
      </div>

      {/* Report Preview - Quick Stats */}
      <div className="content-card">
        <div className="px-5 py-3 border-b border-[#e2e8f0]">
          <h5 className="font-semibold flex items-center gap-2">
            <i className="fas fa-eye text-[#0056A3]"></i> Quick Preview
          </h5>
        </div>
        <div className="p-5 overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f4f7fc]">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">#</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">Staff ID</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">Name</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">Department</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {employees.slice(0, 10).map((emp, i) => (
                <tr key={emp.id} className="hover:bg-[#f8fafc]">
                  <td className="px-4 py-2 text-sm">{i + 1}</td>
                  <td className="px-4 py-2 text-sm font-mono font-semibold text-[#0056A3]">{emp.staffId}</td>
                  <td className="px-4 py-2 text-sm font-medium">{emp.name}</td>
                  <td className="px-4 py-2 text-sm">{emp.department}</td>
                  <td className="px-4 py-2 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      emp.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                      emp.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {emp.status || 'N/A'}
                    </span>
                  </td>
                </tr>
              ))}
              {employees.length > 10 && (
                <tr>
                  <td colSpan="5" className="px-4 py-2 text-center text-sm text-[#6b7a8a]">
                    ... and {employees.length - 10} more employees
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-[#e2e8f0] text-sm text-[#6b7a8a]">
          Showing {Math.min(10, employees.length)} of {employees.length} employees
          <button onClick={generateReport} className="ml-4 text-[#0056A3] font-medium hover:underline">
            View Full Report →
          </button>
        </div>
      </div>
    </div>
  );
}