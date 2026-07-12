export default function PayrollPage() {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h5 className="font-bold text-xl m-0">Payroll Management</h5>
            <p className="text-[#6b7a8a] text-sm m-0">Manage staff payroll and compensation</p>
          </div>
          <button className="btn-primary">
            <i className="fas fa-cog mr-2"></i>Process Payroll
          </button>
        </div>
  
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="stat-card text-center">
            <div className="text-2xl font-bold">₵458,200</div>
            <div className="text-sm text-[#6b7a8a]">Monthly Payroll</div>
          </div>
          <div className="stat-card text-center">
            <div className="text-2xl font-bold">198</div>
            <div className="text-sm text-[#6b7a8a]">Active Staff</div>
          </div>
          <div className="stat-card text-center">
            <div className="text-2xl font-bold">₵2,314</div>
            <div className="text-sm text-[#6b7a8a]">Average Salary</div>
          </div>
          <div className="stat-card text-center">
            <div className="text-2xl font-bold">Mar 2026</div>
            <div className="text-sm text-[#6b7a8a]">Current Period</div>
          </div>
        </div>
  
        <div className="content-card">
          <div className="px-5 py-3 border-b border-[#e2e8f0] flex items-center justify-between">
            <h5 className="font-semibold">Payroll Summary</h5>
            <span className="text-sm text-[#6b7a8a]">March 2026</span>
          </div>
          <div className="p-5 text-center text-[#6b7a8a]">
            <i className="fas fa-wallet text-4xl mb-3 block"></i>
            <p>Payroll data will appear here</p>
            <p className="text-sm mt-2 text-[#94a3b8]">Ready for integration</p>
          </div>
        </div>
      </div>
    );
  }