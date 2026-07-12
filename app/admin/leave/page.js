export default function LeavePage() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h5 className="font-bold text-xl m-0">Leave Management</h5>
          <p className="text-[#6b7a8a] text-sm m-0">Apply and manage leave applications</p>
        </div>
        <button className="btn-primary">
          <i className="fas fa-plus mr-2"></i>Apply for Leave
        </button>
      </div>

      <div className="content-card">
        <div className="p-5">
          <p className="text-[#6b7a8a]">Leave management coming soon...</p>
        </div>
      </div>
    </div>
  );
}