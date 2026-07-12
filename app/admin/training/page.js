'use client';

import { useState } from 'react';

export default function TrainingPage() {
  const [showAddForm, setShowAddForm] = useState(false);

  const trainings = [
    { id: 1, title: 'Leadership Skills Development', date: '2026-04-15', participants: 18, status: 'Scheduled' },
    { id: 2, title: 'Curriculum Design Workshop', date: '2026-03-20', participants: 22, status: 'Completed' },
    { id: 3, title: 'Digital Assessment Tools', date: '2026-05-01', participants: 15, status: 'Scheduled' },
    { id: 4, title: 'HR Policy Training', date: '2026-02-10', participants: 12, status: 'Completed' },
  ];

  const handleAddTraining = () => {
    setShowAddForm(true);
  };

  const handleSubmitTraining = (e) => {
    e.preventDefault();
    alert('✅ Training program created successfully!');
    setShowAddForm(false);
  };

  const getStatusBadge = (status) => {
    if (status === 'Completed') return '<span class="badge-approved"><i class="fas fa-check-circle mr-1"></i>Completed</span>';
    if (status === 'Scheduled') return '<span class="badge-review"><i class="fas fa-calendar mr-1"></i>Scheduled</span>';
    return `<span class="badge-pending">${status}</span>`;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h5 className="font-bold text-xl m-0">Training Management</h5>
          <p className="text-[#6b7a8a] text-sm m-0">Manage training programs and certifications</p>
        </div>
        <button onClick={handleAddTraining} className="btn-primary">
          <i className="fas fa-plus mr-2"></i>New Training
        </button>
      </div>

      {/* Stats */}
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

      {/* Add Training Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h5 className="font-bold text-xl">Create Training Program</h5>
              <button onClick={() => setShowAddForm(false)} className="text-[#6b7a8a] hover:text-[#1a2a3a]">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <form onSubmit={handleSubmitTraining}>
              <div className="space-y-3">
                <div>
                  <label className="font-semibold text-sm">Training Title *</label>
                  <input type="text" className="w-full p-2 border rounded-lg mt-1" required />
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
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-sm">Capacity</label>
                    <input type="number" className="w-full p-2 border rounded-lg mt-1" defaultValue="20" />
                  </div>
                  <div>
                    <label className="font-semibold text-sm">Location</label>
                    <input type="text" className="w-full p-2 border rounded-lg mt-1" placeholder="Training venue" />
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-sm">Description</label>
                  <textarea className="w-full p-2 border rounded-lg mt-1" rows="2"></textarea>
                </div>
                <div className="flex gap-3 pt-3">
                  <button type="button" onClick={() => setShowAddForm(false)} className="btn-outline flex-1">Cancel</button>
                  <button type="submit" className="btn-primary flex-1">Create Training</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Training List */}
      <div className="content-card">
        <div className="px-5 py-3 border-b border-[#e2e8f0]">
          <h5 className="font-semibold flex items-center gap-2">
            <i className="fas fa-calendar-alt text-[#0056A3]"></i> Training Programs
          </h5>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f4f7fc]">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">Title</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">Date</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">Participants</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {trainings.map((t) => (
                <tr key={t.id} className="hover:bg-[#f8fafc]">
                  <td className="px-4 py-2 text-sm font-medium">{t.title}</td>
                  <td className="px-4 py-2 text-sm">{t.date}</td>
                  <td className="px-4 py-2 text-sm">{t.participants}</td>
                  <td className="px-4 py-2" dangerouslySetInnerHTML={{ __html: getStatusBadge(t.status) }} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}