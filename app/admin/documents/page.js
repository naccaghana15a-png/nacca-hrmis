export default function DocumentsPage() {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h5 className="font-bold text-xl m-0">Document Management</h5>
            <p className="text-[#6b7a8a] text-sm m-0">Manage documents and files</p>
          </div>
          <button className="btn-primary">
            <i className="fas fa-upload mr-2"></i>Upload Document
          </button>
        </div>
  
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="stat-card text-center">
            <div className="text-2xl font-bold">342</div>
            <div className="text-sm text-[#6b7a8a]">Total Documents</div>
          </div>
          <div className="stat-card text-center">
            <div className="text-2xl font-bold">1.2 GB</div>
            <div className="text-sm text-[#6b7a8a]">Storage Used</div>
          </div>
          <div className="stat-card text-center">
            <div className="text-2xl font-bold">28</div>
            <div className="text-sm text-[#6b7a8a]">Pending Approval</div>
          </div>
          <div className="stat-card text-center">
            <div className="text-2xl font-bold">15</div>
            <div className="text-sm text-[#6b7a8a]">Expiring Soon</div>
          </div>
        </div>
  
        <div className="content-card">
          <div className="px-5 py-3 border-b border-[#e2e8f0]">
            <h5 className="font-semibold">Recent Documents</h5>
          </div>
          <div className="p-5 text-center text-[#6b7a8a]">
            <i className="fas fa-file-alt text-4xl mb-3 block"></i>
            <p>Documents will appear here</p>
          </div>
        </div>
      </div>
    );
  }