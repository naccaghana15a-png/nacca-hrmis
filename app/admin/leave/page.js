'use client';

import { useState } from 'react';

export default function LeavePage() {
  const [showApplyForm, setShowApplyForm] = useState(false);

  const leaveBalance = {
    annual: 14,
    casual: 5,
    sick: 9,
    study: 30,
    maternity: 90,
    paternity: 14
  };

  const leaveHistory = [
    { id: 1, reference: 'NACCA-LV-2026-0001', employee: 'John Mensah', type: 'Annual Leave', start: '2026-03-15', end: '2026-03-19', days: 5, status: 'approved' },
    { id: 2, reference: 'NACCA-LV-2026-0002', employee: 'Mary Ofori', type: 'Sick Leave', start: '2026-02-10', end: '2026-02-12', days: 3, status: 'approved' },
    { id: 3, reference: 'NACCA-LV-2026-0003', employee: 'Kwame Asare', type: 'Casual Leave', start: '2026-04-01', end: '2026-04-01', days: 1, status: 'pending' },
  ];

  const pendingApprovals = [
    { id: 1, employee: 'Kwame Asare', type: 'Casual Leave', start: '2026-04-01', end: '2026-04-01', days: 1, reason: 'Personal matter' },
    { id: 2, employee: 'Prof. Samuel Ofori Bekoe', type: 'Annual Leave', start: '2026-03-20', end: '2026-03-27', days: 6, reason: 'Annual vacation' },
  ];

  const handleApplyLeave = () => {
    setShowApplyForm(true);
  };

  const handleSubmitLeave = (e) => {
    e.preventDefault();
    alert('✅ Leave application submitted successfully!');
    setShowApplyForm(false);
  };

  const handleApprove = (id) => {
    if (confirm('Approve this leave application?')) {
      alert('✅ Leave approved!');
    }
  };

  const handleReject = (id) => {
    if (confirm('Reject this leave application?')) {
      alert('❌ Leave rejected');
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      'approved': '<span class="badge-approved"><i class="fas fa-check-circle mr-1"></i>Approved</span>',
      'pending': '<span class="badge-pending"><i class="fas fa-clock mr-1"></i>Pending</span>',
      'rejected': '<span class="badge-rejected"><i class="fas fa-times-circle mr-1"></i>Rejected</span>',
      'review': '<span class="badge-review"><i class="fas fa-eye mr-1"></i>In Review</span>',
    };
    return map[status] || `<span class="badge-pending">${status}</span>`;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h5 className="font-bold text-xl m-0">Leave Management</h5>
          <p className="text-[#6b7a8a] text-sm m-0">Apply and manage leave applications</p>
        </div>
        <button onClick={handleApplyLeave} className="btn-primary">
          <i className="fas fa-plus mr-2"></i>Apply for Leave
        </button>
      </div>

      {/* Leave Balance */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {Object.entries(leaveBalance).map(([type, days]) => (
          <div key={type} className="stat-card text-center p-3">
            <div className="text-xl font-bold">{days}</div>
            <div className="text-xs text-[#6b7a8a] capitalize">{type}</div>
          </div>
        ))}
      </div>

      {/* Apply Form Modal */}
      {showApplyForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h5 className="font-bold text-xl">Apply for Leave</h5>
              <button onClick={() => setShowApplyForm(false)} className="text-[#6b7a8a] hover:text-[#1a2a3a]">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <form onSubmit={handleSubmitLeave}>
              <div className="space-y-3">
                <div>
                  <label className="font-semibold text-sm">Leave Type *</label>
                  <select className="w-full p-2 border rounded-lg mt-1" required>
                    <option value="">Select Type</option>
                    <option>Annual Leave</option>
                    <option>Casual Leave</option>
                    <option>Sick Leave</option>
                    <option>Study Leave</option>
                    <option>Maternity Leave</option>
                    <option>Paternity Leave</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-sm">Start Date *</label>
                    <input type="date" className="w-full p-2 border rounded-lg mt-1" required />
                  </div>
                  <div>
                    <label className="font-semibold text-sm">End Date *</label>
                    <input type="date" className="w-full p-2 border rounded-lg mt-1" required />
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-sm">Reason *</label>
                  <textarea className="w-full p-2 border rounded-lg mt-1" rows="3" required placeholder="Explain the reason for leave..."></textarea>
                </div>
                <div className="flex gap-3 pt-3">
                  <button type="button" onClick={() => setShowApplyForm(false)} className="btn-outline flex-1">Cancel</button>
                  <button type="submit" className="btn-primary flex-1">Submit Application</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pending Approvals */}
      {pendingApprovals.length > 0 && (
        <div className="content-card">
          <div className="px-5 py-3 border-b border-[#e2e8f0] flex items-center justify-between">
            <h5 className="font-semibold flex items-center gap-2">
              <i className="fas fa-clock text-amber-500"></i> Pending Approvals
            </h5>
            <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs font-semibold">{pendingApprovals.length}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f4f7fc]">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">Employee</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">Dates</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">Days</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]">
                {pendingApprovals.map((a) => (
                  <tr key={a.id} className="hover:bg-[#f8fafc]">
                    <td className="px-4 py-2 text-sm font-medium">{a.employee}</td>
                    <td className="px-4 py-2 text-sm">{a.type}</td>
                    <td className="px-4 py-2 text-sm">{a.start} - {a.end}</td>
                    <td className="px-4 py-2 text-sm">{a.days}</td>
                    <td className="px-4 py-2">
                      <button onClick={() => handleApprove(a.id)} className="text-green-600 hover:bg-green-50 p-1.5 rounded-lg transition text-sm mr-1">
                        <i className="fas fa-check"></i>
                      </button>
                      <button onClick={() => handleReject(a.id)} className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition text-sm">
                        <i className="fas fa-times"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Leave History */}
      <div className="content-card">
        <div className="px-5 py-3 border-b border-[#e2e8f0]">
          <h5 className="font-semibold flex items-center gap-2">
            <i className="fas fa-history text-[#0056A3]"></i> Leave History
          </h5>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f4f7fc]">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">Reference</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">Employee</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">Type</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">Days</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {leaveHistory.map((l) => (
                <tr key={l.id} className="hover:bg-[#f8fafc]">
                  <td className="px-4 py-2 text-sm font-medium">{l.reference}</td>
                  <td className="px-4 py-2 text-sm">{l.employee}</td>
                  <td className="px-4 py-2 text-sm">{l.type}</td>
                  <td className="px-4 py-2 text-sm">{l.days}</td>
                  <td className="px-4 py-2" dangerouslySetInnerHTML={{ __html: getStatusBadge(l.status) }} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}