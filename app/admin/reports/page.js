export default function ReportsPage() {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h5 className="font-bold text-xl m-0">Reports</h5>
            <p className="text-[#6b7a8a] text-sm m-0">Generate and export reports</p>
          </div>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="content-card">
            <div className="px-5 py-3 border-b border-[#e2e8f0]">
              <h5 className="font-semibold">HR Reports</h5>
            </div>
            <div className="p-4 space-y-2">
              <button className="quick-action w-full text-left"><i className="fas fa-users w-5"></i> Staff List</button>
              <button className="quick-action w-full text-left"><i className="fas fa-calendar-check w-5"></i> Leave Summary</button>
              <button className="quick-action w-full text-left"><i className="fas fa-clock w-5"></i> Attendance Report</button>
              <button className="quick-action w-full text-left"><i className="fas fa-wallet w-5"></i> Payroll Report</button>
            </div>
          </div>
  
          <div className="content-card">
            <div className="px-5 py-3 border-b border-[#e2e8f0]">
              <h5 className="font-semibold">Analytics Reports</h5>
            </div>
            <div className="p-4 space-y-2">
              <button className="quick-action w-full text-left"><i className="fas fa-chart-line w-5"></i> Performance</button>
              <button className="quick-action w-full text-left"><i className="fas fa-exchange-alt w-5"></i> Turnover</button>
              <button className="quick-action w-full text-left"><i className="fas fa-graduation-cap w-5"></i> Training</button>
            </div>
          </div>
  
          <div className="content-card">
            <div className="px-5 py-3 border-b border-[#e2e8f0]">
              <h5 className="font-semibold">Custom Report</h5>
            </div>
            <div className="p-4">
              <select className="w-full p-2 border rounded-lg mb-2">
                <option>Staff Report</option>
                <option>Leave Report</option>
                <option>Attendance Report</option>
              </select>
              <button className="btn-primary w-full">Generate Report</button>
            </div>
          </div>
        </div>
      </div>
    );
  }