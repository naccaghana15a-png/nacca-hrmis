'use client';

import { useState } from 'react';

export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(null);
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);

  // Full employee data
  const [employees, setEmployees] = useState([
    { id: 1, staffId: 'NAC-EX-0001', name: 'Prof. Samuel Ofori Bekoe', position: 'Ag. Director General', department: 'Executive', email: 'samuel.bekoe@nacca.gov.gh', status: 'Active', joinDate: '2020-01-15' },
    { id: 2, staffId: 'NAC-EX-0002', name: 'Dr. J. R. Achoanya Ayam', position: 'Ag. Deputy Director General', department: 'Executive', email: 'j.achoanya@nacca.gov.gh', status: 'Active', joinDate: '2020-06-01' },
    { id: 3, staffId: 'NAC-EX-0003', name: 'Dr. Eric Amoah', position: 'Ag. Deputy Director General', department: 'Executive', email: 'eric.amoah@nacca.gov.gh', status: 'Active', joinDate: '2021-03-15' },
    { id: 4, staffId: 'NAC-AS-0001', name: 'Anita Frances Cordeiro Collison', position: 'Ag. Director, SAQA', department: 'Assessment', email: 'anita.collison@nacca.gov.gh', status: 'Active', joinDate: '2019-08-20' },
    { id: 5, staffId: 'NAC-CD-0001', name: 'Reginald George Quartey', position: 'Ag. Director, Curriculum Development', department: 'Curriculum', email: 'reginald.quartey@nacca.gov.gh', status: 'Active', joinDate: '2018-11-01' },
    { id: 6, staffId: 'NAC-RS-0001', name: 'Dr. Mercy Nyamekye', position: 'Ag. Director, RPME', department: 'Research', email: 'mercy.nyamekye@nacca.gov.gh', status: 'Active', joinDate: '2019-04-10' },
    { id: 7, staffId: 'NAC-IR-0001', name: 'Joana Vanderpuje', position: 'Ag. Director, Instructional Resources', department: 'Instructional Resources', email: 'joana.vanderpuje@nacca.gov.gh', status: 'Active', joinDate: '2020-09-05' },
    { id: 8, staffId: 'NAC-HR-0001', name: 'Elijah Intsiful', position: 'Ag. Director, Human Resources & Admin', department: 'Human Resource', email: 'elijah.intsiful@nacca.gov.gh', status: 'Active', joinDate: '2018-02-14' },
    { id: 9, staffId: 'NAC-CA-0001', name: 'Rebecca Abu Gariba', position: 'Ag. Director, Corporate Affairs', department: 'Corporate Affairs', email: 'rebecca.gariba@nacca.gov.gh', status: 'Active', joinDate: '2020-07-22' },
    // Staff
    { id: 10, staffId: 'NAC-AS-0002', name: 'Joachim Kwame Seyram Honu', position: 'Principal Officer', department: 'Assessment', email: 'joachim.honu@nacca.gov.gh', status: 'Active', joinDate: '2021-01-15' },
    { id: 11, staffId: 'NAC-AS-0003', name: 'Richard Teye', position: 'Principal Officer', department: 'Assessment', email: 'richard.teye@nacca.gov.gh', status: 'Active', joinDate: '2021-03-20' },
    { id: 12, staffId: 'NAC-CD-0002', name: 'Genevieve Mensah', position: 'Principal Officer', department: 'Curriculum', email: 'genevieve.mensah@nacca.gov.gh', status: 'Active', joinDate: '2020-06-10' },
    { id: 13, staffId: 'NAC-CD-0003', name: 'Thomas Kumah Osei', position: 'Principal Officer', department: 'Curriculum', email: 'thomas.osei@nacca.gov.gh', status: 'Active', joinDate: '2021-02-01' },
    { id: 14, staffId: 'NAC-RS-0002', name: 'Abigail Owusu Birago', position: 'Principal Officer', department: 'Research', email: 'abigail.birago@nacca.gov.gh', status: 'Active', joinDate: '2021-07-15' },
    { id: 15, staffId: 'NAC-IR-0002', name: 'Kenneth Wontumi', position: 'Principal Officer', department: 'Instructional Resources', email: 'kenneth.wontumi@nacca.gov.gh', status: 'Active', joinDate: '2020-11-01' },
    { id: 16, staffId: 'NAC-CA-0002', name: 'Seth Nii Nartey', position: 'Corporate Affairs Officer', department: 'Corporate Affairs', email: 'seth.nartey@nacca.gov.gh', status: 'Active', joinDate: '2021-05-10' },
    { id: 17, staffId: 'NAC-AD-0001', name: 'Gladys Gratias Tseh', position: 'Principal Administrative Officer', department: 'Administration', email: 'gladys.tseh@nacca.gov.gh', status: 'Active', joinDate: '2019-09-01' },
    { id: 18, staffId: 'NAC-FN-0001', name: 'Prince Owusu Boateng', position: 'Accountant', department: 'Finance', email: 'prince.boateng@nacca.gov.gh', status: 'Active', joinDate: '2020-04-15' },
    { id: 19, staffId: 'NAC-IT-0001', name: 'Dzineku Lawrence Senanu', position: 'Assistant IT Officer', department: 'ICT', email: 'dzineku.senanu@nacca.gov.gh', status: 'Active', joinDate: '2021-08-01' },
    { id: 20, staffId: 'NAC-PR-0001', name: 'Nana Opoku Yeboah', position: 'Procurement Officer', department: 'Procurement', email: 'nana.yeboah@nacca.gov.gh', status: 'Active', joinDate: '2020-10-15' },
  ]);

  // Audit log entries
  const [auditLogs] = useState([
    { id: 1, user: 'System Admin', action: 'Added new employee: Dr. Eric Amoah', timestamp: '2026-07-12 09:30:15', ip: '192.168.1.100' },
    { id: 2, user: 'System Admin', action: 'Updated employee: Anita Collison (Role Change)', timestamp: '2026-07-12 08:45:22', ip: '192.168.1.100' },
    { id: 3, user: 'Elijah Intsiful', action: 'Approved leave request for Mary Ofori', timestamp: '2026-07-11 16:20:10', ip: '192.168.1.105' },
    { id: 4, user: 'System Admin', action: 'Deleted employee: Test User', timestamp: '2026-07-11 14:15:33', ip: '192.168.1.100' },
    { id: 5, user: 'Reginald Quartey', action: 'Submitted Curriculum report for approval', timestamp: '2026-07-11 11:05:47', ip: '192.168.1.108' },
  ]);

  const departments = ['All', 'Executive', 'Assessment', 'Curriculum', 'Research', 'Instructional Resources', 'Human Resource', 'Corporate Affairs', 'Administration', 'Procurement', 'Finance', 'Internal Audit', 'ICT'];

  const getStatusBadge = (status) => {
    if (status === 'Active') return '<span class="badge-active"><i class="fas fa-circle mr-1" style="font-size: 6px;"></i>Active</span>';
    if (status === 'On Leave') return '<span class="badge-pending"><i class="fas fa-clock mr-1"></i>On Leave</span>';
    if (status === 'Inactive') return '<span class="badge-inactive">Inactive</span>';
    return '<span class="badge-pending">Pending</span>';
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.staffId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDepartment === '' || selectedDepartment === 'All' || emp.department === selectedDepartment;
    return matchesSearch && matchesDept;
  });

  // ============================================================
  // 🔐 ACCOUNT CREATION FUNCTION - ADD THIS
  // ============================================================
  const handleCreateAccount = async (employee) => {
    if (!confirm(`Create account for ${employee.name}?\n\nEmail: ${employee.email}\nDepartment: ${employee.department}`)) {
      return;
    }
  
    setLoading(true);
  
    try {
      const res = await fetch('/api/auth/create-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: employee.email,
          name: employee.name,
          staffId: employee.staffId,
          department: employee.department,
          role: 'STAFF'
        })
      });
  
      const data = await res.json();
      
      // Log the full response to console for debugging
      console.log('Full API Response:', data);
      
      if (data.success) {
        // The password is in data.tempPassword
        const password = data.tempPassword;
        
        // Show password in a prompt box (the password will be pre-filled and selectable)
        const userInput = prompt(
          '✅ ACCOUNT CREATED!\n\n' +
          'Employee: ' + employee.name + '\n' +
          'Email: ' + employee.email + '\n' +
          'Staff ID: ' + employee.staffId + '\n' +
          'Department: ' + employee.department + '\n\n' +
          '🔑 TEMPORARY PASSWORD:\n' +
          password + '\n\n' +
          '📋 Select and copy the password above.\n' +
          'Share it with the staff member.\n\n' +
          '⚠️ They must change it on first login.',
          password // This pre-fills the password in the input field
        );
        
        // If user clicked OK, confirm
        if (userInput !== null) {
          alert('✅ Password copied/shared!\n\nPassword: ' + password);
        }
      } else {
        alert('❌ Failed to create account: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating account:', error);
      alert('❌ An error occurred: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Admin Actions
  const handleAddEmployee = (e) => {
    e.preventDefault();
    alert('✅ Employee added successfully!');
    setShowAddModal(false);
  };

  const handleEditEmployee = (id) => {
    const emp = employees.find(e => e.id === id);
    setShowEditModal(emp);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    alert('✅ Employee updated successfully!');
    setShowEditModal(null);
  };

  const handleDeleteEmployee = (id) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      alert('🗑️ Employee deleted successfully!');
    }
  };

  const handleBulkDelete = () => {
    if (selectedEmployees.length === 0) {
      alert('Please select employees to delete.');
      return;
    }
    if (confirm(`Delete ${selectedEmployees.length} selected employees?`)) {
      alert(`🗑️ ${selectedEmployees.length} employees deleted successfully!`);
      setSelectedEmployees([]);
      setSelectAll(false);
    }
  };

  const handleBulkExport = () => {
    alert(`📊 Exporting ${filteredEmployees.length} employees data...`);
  };

  const handleBulkImport = () => {
    alert('📤 Bulk import dialog opened. Select a CSV/Excel file.');
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedDepartment('');
    setSelectedEmployees([]);
    setSelectAll(false);
  };

  const handleSelectAll = (e) => {
    setSelectAll(e.target.checked);
    if (e.target.checked) {
      setSelectedEmployees(filteredEmployees.map(emp => emp.id));
    } else {
      setSelectedEmployees([]);
    }
  };

  const handleSelectEmployee = (id) => {
    setSelectedEmployees(prev => 
      prev.includes(id) ? prev.filter(eid => eid !== id) : [...prev, id]
    );
  };

  const handleAuditLog = () => {
    setShowAuditLog(!showAuditLog);
  };

  const handleGenerateReport = () => {
    alert('📄 Generating employee report...');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleRefresh = () => {
    alert('🔄 Data refreshed successfully!');
  };

  return (
    <div className="space-y-4">
      {/* Header with Admin Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h5 className="font-bold text-xl m-0">
            <i className="fas fa-users-cog text-[#0056A3] mr-2"></i>
            Employee Management
          </h5>
          <p className="text-[#6b7a8a] text-sm m-0">
            {employees.length} total employees · {employees.filter(e => e.status === 'Active').length} active
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setShowAddModal(true)} className="btn-primary">
            <i className="fas fa-plus mr-2"></i>Add
          </button>
          <button onClick={handleBulkImport} className="btn-secondary">
            <i className="fas fa-upload mr-2"></i>Import
          </button>
          <button onClick={handleBulkExport} className="btn-outline">
            <i className="fas fa-file-export mr-2"></i>Export
          </button>
          <button onClick={handleGenerateReport} className="btn-outline">
            <i className="fas fa-file-pdf mr-2"></i>Report
          </button>
          <button onClick={handleAuditLog} className={`${showAuditLog ? 'bg-purple-600 text-white hover:bg-purple-700' : 'btn-outline'}`}>
            <i className="fas fa-history mr-2"></i>Audit Log
          </button>
          <button onClick={handleRefresh} className="btn-outline">
            <i className="fas fa-sync-alt mr-2"></i>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7a8a]"></i>
            <input
              type="text"
              placeholder="Search employees..."
              className="w-full pl-10 p-2.5 border-2 border-[#e2e8f0] rounded-xl focus:border-[#0056A3] focus:shadow-[0_0_0_4px_rgba(0,86,163,0.1)] transition outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div>
          <select
            className="p-2.5 border-2 border-[#e2e8f0] rounded-xl focus:border-[#0056A3] outline-none bg-white"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
        <button onClick={handleClearFilters} className="btn-outline">
          <i className="fas fa-times mr-2"></i>Clear
        </button>
        {selectedEmployees.length > 0 && (
          <button onClick={handleBulkDelete} className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition font-medium">
            <i className="fas fa-trash mr-2"></i>Delete ({selectedEmployees.length})
          </button>
        )}
        <button onClick={handlePrint} className="btn-outline">
          <i className="fas fa-print"></i>
        </button>
      </div>

      {/* Employee Table */}
      <div className="content-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f4f7fc]">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-[#0056A3]"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#6b7a8a] uppercase tracking-wider">Staff ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#6b7a8a] uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#6b7a8a] uppercase tracking-wider">Position</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#6b7a8a] uppercase tracking-wider">Department</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#6b7a8a] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#6b7a8a] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-[#f8fafc] transition">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-[#0056A3]"
                      checked={selectedEmployees.includes(emp.id)}
                      onChange={() => handleSelectEmployee(emp.id)}
                    />
                  </td>
                  <td className="px-4 py-3 text-sm font-mono font-semibold text-[#0056A3]">{emp.staffId}</td>
                  <td className="px-4 py-3 text-sm font-medium">{emp.name}</td>
                  <td className="px-4 py-3 text-sm">{emp.position}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 bg-[#f1f5f9] rounded-lg text-xs font-medium">{emp.department}</span>
                  </td>
                  <td className="px-4 py-3" dangerouslySetInnerHTML={{ __html: getStatusBadge(emp.status) }} />
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button className="text-[#0056A3] hover:bg-[#0056A3]/10 p-1.5 rounded-lg transition text-sm" title="View">
                        <i className="fas fa-eye"></i>
                      </button>
                      <button onClick={() => handleEditEmployee(emp.id)} className="text-[#F5A623] hover:bg-[#F5A623]/10 p-1.5 rounded-lg transition text-sm" title="Edit">
                        <i className="fas fa-edit"></i>
                      </button>
                      {/* ============================================================ */}
                      {/* 🆕 CREATE ACCOUNT BUTTON - ADD THIS */}
                      {/* ============================================================ */}
                      <button 
                        onClick={() => handleCreateAccount(emp)} 
                        className="text-green-600 hover:bg-green-50 p-1.5 rounded-lg transition text-sm" 
                        title="Create Account"
                        disabled={loading}
                      >
                        <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-user-plus'}`}></i>
                      </button>
                      <button onClick={() => handleDeleteEmployee(emp.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition text-sm" title="Delete">
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-[#e2e8f0] flex flex-wrap items-center justify-between gap-2 text-sm text-[#6b7a8a]">
          <span>Showing {filteredEmployees.length} of {employees.length} employees</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 rounded-lg hover:bg-[#f4f7fc] transition">Previous</button>
            <button className="px-3 py-1 rounded-lg bg-[#0056A3] text-white">1</button>
            <button className="px-3 py-1 rounded-lg hover:bg-[#f4f7fc] transition">2</button>
            <button className="px-3 py-1 rounded-lg hover:bg-[#f4f7fc] transition">3</button>
            <button className="px-3 py-1 rounded-lg hover:bg-[#f4f7fc] transition">Next</button>
          </div>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h5 className="font-bold text-xl"><i className="fas fa-user-plus text-[#0056A3] mr-2"></i>Add New Employee</h5>
              <button onClick={() => setShowAddModal(false)} className="text-[#6b7a8a] hover:text-[#1a2a3a]">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <form onSubmit={handleAddEmployee}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-sm">First Name *</label>
                  <input type="text" className="w-full p-2 border rounded-lg mt-1" required />
                </div>
                <div>
                  <label className="font-semibold text-sm">Last Name *</label>
                  <input type="text" className="w-full p-2 border rounded-lg mt-1" required />
                </div>
                <div>
                  <label className="font-semibold text-sm">Email *</label>
                  <input type="email" className="w-full p-2 border rounded-lg mt-1" required />
                </div>
                <div>
                  <label className="font-semibold text-sm">Department *</label>
                  <select className="w-full p-2 border rounded-lg mt-1" required>
                    <option value="">Select Department</option>
                    <option>Executive</option>
                    <option>Assessment</option>
                    <option>Curriculum</option>
                    <option>Research</option>
                    <option>Instructional Resources</option>
                    <option>Human Resource</option>
                    <option>Corporate Affairs</option>
                    <option>Administration</option>
                    <option>Procurement</option>
                    <option>Finance</option>
                    <option>Internal Audit</option>
                    <option>ICT</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-sm">Position *</label>
                  <input type="text" className="w-full p-2 border rounded-lg mt-1" required />
                </div>
                <div>
                  <label className="font-semibold text-sm">Status</label>
                  <select className="w-full p-2 border rounded-lg mt-1">
                    <option>Active</option>
                    <option>On Leave</option>
                    <option>Inactive</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="font-semibold text-sm">Join Date</label>
                  <input type="date" className="w-full p-2 border rounded-lg mt-1" />
                </div>
              </div>
              <div className="flex gap-3 pt-4 mt-4 border-t border-[#e2e8f0]">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-outline flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">
                  <i className="fas fa-save mr-2"></i>Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h5 className="font-bold text-xl"><i className="fas fa-user-edit text-[#0056A3] mr-2"></i>Edit Employee</h5>
              <button onClick={() => setShowEditModal(null)} className="text-[#6b7a8a] hover:text-[#1a2a3a]">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <form onSubmit={handleSaveEdit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-sm">Staff ID</label>
                  <input type="text" className="w-full p-2 border rounded-lg mt-1 bg-gray-50" value={showEditModal.staffId} readOnly />
                </div>
                <div>
                  <label className="font-semibold text-sm">Name</label>
                  <input type="text" className="w-full p-2 border rounded-lg mt-1" defaultValue={showEditModal.name} />
                </div>
                <div>
                  <label className="font-semibold text-sm">Email</label>
                  <input type="email" className="w-full p-2 border rounded-lg mt-1" defaultValue={showEditModal.email} />
                </div>
                <div>
                  <label className="font-semibold text-sm">Department</label>
                  <select className="w-full p-2 border rounded-lg mt-1" defaultValue={showEditModal.department}>
                    <option>Executive</option>
                    <option>Assessment</option>
                    <option>Curriculum</option>
                    <option>Research</option>
                    <option>Instructional Resources</option>
                    <option>Human Resource</option>
                    <option>Corporate Affairs</option>
                    <option>Administration</option>
                    <option>Procurement</option>
                    <option>Finance</option>
                    <option>Internal Audit</option>
                    <option>ICT</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-sm">Position</label>
                  <input type="text" className="w-full p-2 border rounded-lg mt-1" defaultValue={showEditModal.position} />
                </div>
                <div>
                  <label className="font-semibold text-sm">Status</label>
                  <select className="w-full p-2 border rounded-lg mt-1" defaultValue={showEditModal.status}>
                    <option>Active</option>
                    <option>On Leave</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4 mt-4 border-t border-[#e2e8f0]">
                <button type="button" onClick={() => setShowEditModal(null)} className="btn-outline flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">
                  <i className="fas fa-save mr-2"></i>Update Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Audit Log Modal */}
      {showAuditLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h5 className="font-bold text-xl"><i className="fas fa-history text-purple-600 mr-2"></i>Audit Log</h5>
              <button onClick={() => setShowAuditLog(false)} className="text-[#6b7a8a] hover:text-[#1a2a3a]">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <div className="flex gap-2 mb-4">
              <button className="btn-outline text-sm"><i className="fas fa-filter mr-1"></i>Filter</button>
              <button className="btn-outline text-sm"><i className="fas fa-download mr-1"></i>Export</button>
              <button className="btn-outline text-sm"><i className="fas fa-sync-alt mr-1"></i>Refresh</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f4f7fc]">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a] uppercase tracking-wider">User</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a] uppercase tracking-wider">Action</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a] uppercase tracking-wider">Timestamp</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a] uppercase tracking-wider">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8f0]">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#f8fafc]">
                      <td className="px-4 py-2 text-sm font-medium">{log.user}</td>
                      <td className="px-4 py-2 text-sm">{log.action}</td>
                      <td className="px-4 py-2 text-sm text-[#6b7a8a]">{log.timestamp}</td>
                      <td className="px-4 py-2 text-sm font-mono text-[#6b7a8a]">{log.ip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#e2e8f0]">
              <span className="text-sm text-[#6b7a8a]">Total: {auditLogs.length} entries</span>
              <button onClick={() => setShowAuditLog(false)} className="btn-primary">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
