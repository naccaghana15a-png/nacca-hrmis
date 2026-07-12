'use client';

export default function AttendancePage() {
  const handleClockInOut = () => {
    alert('⏰ Clock In/Out feature coming soon!');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h5 className="font-bold text-xl m-0">Attendance</h5>
          <p className="text-[#6b7a8a] text-sm m-0">Track staff attendance and schedules</p>
        </div>
        <button onClick={handleClockInOut} className="btn-primary">
          <i className="fas fa-clock mr-2"></i>Clock In/Out
        </button>
      </div>

      {/* Rest of the content */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card text-center">
          <div className="text-2xl font-bold">42</div>
          <div className="text-sm text-[#6b7a8a]">Present Today</div>
        </div>
        <div className="stat-card text-center">
          <div className="text-2xl font-bold">8</div>
          <div className="text-sm text-[#6b7a8a]">Late</div>
        </div>
        <div className="stat-card text-center">
          <div className="text-2xl font-bold">5</div>
          <div className="text-sm text-[#6b7a8a]">Absent</div>
        </div>
        <div className="stat-card text-center">
          <div className="text-2xl font-bold">93%</div>
          <div className="text-sm text-[#6b7a8a]">Attendance Rate</div>
        </div>
      </div>

      <div className="content-card">
        <div className="px-5 py-3 border-b border-[#e2e8f0]">
          <h5 className="font-semibold">Today's Attendance</h5>
        </div>
        <div className="p-5 text-center text-[#6b7a8a]">
          <i className="fas fa-users text-4xl mb-3 block"></i>
          <p>Attendance records will appear here</p>
        </div>
      </div>
    </div>
  );
}