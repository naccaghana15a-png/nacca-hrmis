export default function AssetsPage() {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h5 className="font-bold text-xl m-0">Asset Management</h5>
            <p className="text-[#6b7a8a] text-sm m-0">Track and manage organizational assets</p>
          </div>
          <button className="btn-primary">
            <i className="fas fa-plus mr-2"></i>Add Asset
          </button>
        </div>
  
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="stat-card text-center">
            <div className="text-2xl font-bold">156</div>
            <div className="text-sm text-[#6b7a8a]">Total Assets</div>
          </div>
          <div className="stat-card text-center">
            <div className="text-2xl font-bold">89</div>
            <div className="text-sm text-[#6b7a8a]">Assigned</div>
          </div>
          <div className="stat-card text-center">
            <div className="text-2xl font-bold">54</div>
            <div className="text-sm text-[#6b7a8a]">Available</div>
          </div>
          <div className="stat-card text-center">
            <div className="text-2xl font-bold">13</div>
            <div className="text-sm text-[#6b7a8a]">Maintenance</div>
          </div>
        </div>
  
        <div className="content-card">
          <div className="px-5 py-3 border-b border-[#e2e8f0]">
            <h5 className="font-semibold">Asset Inventory</h5>
          </div>
          <div className="p-5 text-center text-[#6b7a8a]">
            <i className="fas fa-laptop text-4xl mb-3 block"></i>
            <p>Assets will appear here</p>
          </div>
        </div>
      </div>
    );
  }