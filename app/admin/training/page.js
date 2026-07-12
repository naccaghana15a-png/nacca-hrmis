export default function TrainingPage() {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h5 className="font-bold text-xl m-0">Training Management</h5>
            <p className="text-[#6b7a8a] text-sm m-0">Manage training programs and certifications</p>
          </div>
          <button className="btn-primary">
            <i className="fas fa-plus mr-2"></i>New Training
          </button>
        </div>
  
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="stat-card text-center">
            <div className="text-2xl font-bold">8</div>
            <div className="text-sm text-[#6b7a8a]">Total Programs</div>
          </div>
          <div className="stat-card text-center">
            <div className="text-2xl font-bold">142</div>
            <div className="text-sm text-[#6b7a8a]">Participants</div>
          </div>
          <div className="stat-card text-center">
            <div className="text-2xl font-bold">76%</div>
            <div className="text-sm text-[#6b7a8a]">Completion Rate</div>
          </div>
          <div className="stat-card text-center">
            <div className="text-2xl font-bold">12</div>
            <div className="text-sm text-[#6b7a8a]">Certifications</div>
          </div>
        </div>
  
        <div className="content-card">
          <div className="px-5 py-3 border-b border-[#e2e8f0]">
            <h5 className="font-semibold">Upcoming Training</h5>
          </div>
          <div className="p-5 text-center text-[#6b7a8a]">
            <i className="fas fa-graduation-cap text-4xl mb-3 block"></i>
            <p>Training programs will appear here</p>
          </div>
        </div>
      </div>
    );
  }