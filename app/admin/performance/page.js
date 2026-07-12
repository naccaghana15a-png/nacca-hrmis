export default function PerformancePage() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h5 className="font-bold text-xl m-0">Performance Management</h5>
          <p className="text-[#6b7a8a] text-sm m-0">Review and manage staff performance</p>
        </div>
        <button className="btn-primary">
          <i className="fas fa-plus mr-2"></i>New Review
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card text-center">
          <div className="text-2xl font-bold">4.2</div>
          <div className="text-sm text-[#6b7a8a]">Average Rating</div>
        </div>
        <div className="stat-card text-center">
          <div className="text-2xl font-bold">28</div>
          <div className="text-sm text-[#6b7a8a]">Reviews This Quarter</div>
        </div>
        <div className="stat-card text-center">
          <div className="text-2xl font-bold">12</div>
          <div className="text-sm text-[#6b7a8a]">Pending Reviews</div>
        </div>
        <div className="stat-card text-center">
          <div className="text-2xl font-bold">85%</div>
          <div className="text-sm text-[#6b7a8a]">Completion Rate</div>
        </div>
      </div>

      <div className="content-card">
        <div className="px-5 py-3 border-b border-[#e2e8f0]">
          <h5 className="font-semibold">Recent Reviews</h5>
        </div>
        <div className="p-5 text-center text-[#6b7a8a]">
          <i className="fas fa-star text-4xl mb-3 block"></i>
          <p>Performance reviews will appear here</p>
        </div>
      </div>
    </div>
  );
}