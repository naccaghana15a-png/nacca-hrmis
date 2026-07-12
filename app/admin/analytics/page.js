export default function AnalyticsPage() {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h5 className="font-bold text-xl m-0">Analytics & Insights</h5>
            <p className="text-[#6b7a8a] text-sm m-0">Data insights and analytics</p>
          </div>
          <button className="btn-outline">
            <i className="fas fa-download mr-2"></i>Export
          </button>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="content-card">
            <div className="px-5 py-3 border-b border-[#e2e8f0]">
              <h5 className="font-semibold">Staff by Department</h5>
            </div>
            <div className="p-5 text-center text-[#6b7a8a] h-48 flex items-center justify-center">
              <div>
                <i className="fas fa-chart-bar text-3xl mb-2 block"></i>
                <p>Charts will appear here</p>
              </div>
            </div>
          </div>
          <div className="content-card">
            <div className="px-5 py-3 border-b border-[#e2e8f0]">
              <h5 className="font-semibold">Gender Distribution</h5>
            </div>
            <div className="p-5 text-center text-[#6b7a8a] h-48 flex items-center justify-center">
              <div>
                <i className="fas fa-chart-pie text-3xl mb-2 block"></i>
                <p>Charts will appear here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }