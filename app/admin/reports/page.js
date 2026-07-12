'use client';

export default function ReportsPage() {
  const handleGenerateReport = (type) => {
    alert(`📄 Generating ${type} report...`);
  };

  const handleCustomReport = (e) => {
    e.preventDefault();
    alert('📊 Generating custom report...');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h5 className="font-bold text-xl m-0">Reports</h5>
          <p className="text-[#6b7a8a] text-sm m-0">Generate and export reports</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* HR Reports */}
        <div className="content-card">
          <div className="px-5 py-3 border-b border-[#e2e8f0]">
            <h5 className="font-semibold flex items-center gap-2">
              <i className="fas fa-users text-[#0056A3]"></i> HR Reports
            </h5>
          </div>
          <div className="p-3 space-y-1">
            {['Staff List', 'Leave Summary', 'Attendance Report', 'Payroll Report'].map((report) => (
              <button key={report} onClick={() => handleGenerateReport(report)} 
                className="flex items-center gap-3 w-full p-2.5 rounded-lg hover:bg-[#f4f7fc] transition text-left text-sm">
                <i className="fas fa-file-pdf text-red-500 w-5"></i>
                <span>{report}</span>
                <i className="fas fa-chevron-right ml-auto text-xs opacity-30"></i>
              </button>
            ))}
          </div>
        </div>

        {/* Analytics Reports */}
        <div className="content-card">
          <div className="px-5 py-3 border-b border-[#e2e8f0]">
            <h5 className="font-semibold flex items-center gap-2">
              <i className="fas fa-chart-line text-[#0056A3]"></i> Analytics Reports
            </h5>
          </div>
          <div className="p-3 space-y-1">
            {['Performance Report', 'Staff Turnover', 'Training Report', 'Recruitment Analytics'].map((report) => (
              <button key={report} onClick={() => handleGenerateReport(report)}
                className="flex items-center gap-3 w-full p-2.5 rounded-lg hover:bg-[#f4f7fc] transition text-left text-sm">
                <i className="fas fa-file-pdf text-red-500 w-5"></i>
                <span>{report}</span>
                <i className="fas fa-chevron-right ml-auto text-xs opacity-30"></i>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Report */}
        <div className="content-card">
          <div className="px-5 py-3 border-b border-[#e2e8f0]">
            <h5 className="font-semibold flex items-center gap-2">
              <i className="fas fa-cog text-[#0056A3]"></i> Custom Report
            </h5>
          </div>
          <div className="p-4">
            <form onSubmit={handleCustomReport}>
              <div className="space-y-3">
                <div>
                  <label className="font-semibold text-sm">Report Type</label>
                  <select className="w-full p-2 border rounded-lg mt-1">
                    <option>Staff Report</option>
                    <option>Leave Report</option>
                    <option>Attendance Report</option>
                    <option>Performance Report</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-sm text-xs">From</label>
                    <input type="date" className="w-full p-2 border rounded-lg mt-1 text-sm" defaultValue="2026-01-01" />
                  </div>
                  <div>
                    <label className="font-semibold text-sm text-xs">To</label>
                    <input type="date" className="w-full p-2 border rounded-lg mt-1 text-sm" defaultValue="2026-03-31" />
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-sm">Format</label>
                  <select className="w-full p-2 border rounded-lg mt-1">
                    <option>PDF</option>
                    <option>Excel</option>
                    <option>CSV</option>
                  </select>
                </div>
                <button type="submit" className="btn-primary w-full">
                  <i className="fas fa-download mr-2"></i>Generate Report
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}