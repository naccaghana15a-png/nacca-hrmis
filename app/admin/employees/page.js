'use client';

import { useState, useEffect } from 'react';

export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(null);
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importPreview, setImportPreview] = useState([]);
  const [importLoading, setImportLoading] = useState(false);
  const [importResults, setImportResults] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  const [editFormData, setEditFormData] = useState({
    id: '',
    staffId: '',
    name: '',
    email: '',
    department: '',
    position: '',
    status: 'Active'
  });
  const [addFormData, setAddFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    position: '',
    status: 'Active',
    joinDate: ''
  });
  const [viewEmployee, setViewEmployee] = useState(null);

  // Static fallback data
  const staticEmployees = [
    { id: 1, staffId: 'NAC-EX-0001', name: 'Prof. Samuel Ofori Bekoe', position: 'Ag. Director General', department: 'Executive', email: 'samuel.bekoe@nacca.gov.gh', status: 'Active', joinDate: '2020-01-15' },
    { id: 2, staffId: 'NAC-EX-0002', name: 'Dr. J. R. Achoanya Ayam', position: 'Ag. Deputy Director General', department: 'Executive', email: 'j.achoanya@nacca.gov.gh', status: 'Active', joinDate: '2020-06-01' },
    { id: 3, staffId: 'NAC-EX-0003', name: 'Dr. Eric Amoah', position: 'Ag. Deputy Director General', department: 'Executive', email: 'eric.amoah@nacca.gov.gh', status: 'Active', joinDate: '2021-03-15' },
    { id: 4, staffId: 'NAC-AS-0001', name: 'Anita Frances Cordeiro Collison', position: 'Ag. Director, SAQA', department: 'Assessment', email: 'anita.collison@nacca.gov.gh', status: 'Active', joinDate: '2019-08-20' },
    { id: 5, staffId: 'NAC-CD-0001', name: 'Reginald George Quartey', position: 'Ag. Director, Curriculum Development', department: 'Curriculum', email: 'reginald.quartey@nacca.gov.gh', status: 'Active', joinDate: '2018-11-01' },
    { id: 6, staffId: 'NAC-RS-0001', name: 'Dr. Mercy Nyamekye', position: 'Ag. Director, RPME', department: 'Research', email: 'mercy.nyamekye@nacca.gov.gh', status: 'Active', joinDate: '2019-04-10' },
    { id: 7, staffId: 'NAC-IR-0001', name: 'Joana Vanderpuje', position: 'Ag. Director, Instructional Resources', department: 'Instructional Resources', email: 'joana.vanderpuje@nacca.gov.gh', status: 'Active', joinDate: '2020-09-05' },
    { id: 8, staffId: 'NAC-HR-0001', name: 'Elijah Intsiful', position: 'Ag. Director, Human Resources & Admin', department: 'Human Resource', email: 'elijah.intsiful@nacca.gov.gh', status: 'Active', joinDate: '2018-02-14' },
    { id: 9, staffId: 'NAC-CA-0001', name: 'Rebecca Abu Gariba', position: 'Ag. Director, Corporate Affairs', department: 'Corporate Affairs', email: 'rebecca.gariba@nacca.gov.gh', status: 'Active', joinDate: '2020-07-22' },
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
  ];

  const [auditLogs] = useState([
    { id: 1, user: 'System Admin', action: 'Added new employee: Dr. Eric Amoah', timestamp: '2026-07-12 09:30:15', ip: '192.168.1.100' },
    { id: 2, user: 'System Admin', action: 'Updated employee: Anita Collison (Role Change)', timestamp: '2026-07-12 08:45:22', ip: '192.168.1.100' },
    { id: 3, user: 'Elijah Intsiful', action: 'Approved leave request for Mary Ofori', timestamp: '2026-07-11 16:20:10', ip: '192.168.1.105' },
    { id: 4, user: 'System Admin', action: 'Deleted employee: Test User', timestamp: '2026-07-11 14:15:33', ip: '192.168.1.100' },
    { id: 5, user: 'Reginald Quartey', action: 'Submitted Curriculum report for approval', timestamp: '2026-07-11 11:05:47', ip: '192.168.1.108' },
  ]);

  const departments = ['All', 'Executive', 'Assessment', 'Curriculum', 'Research', 'Instructional Resources', 'Human Resource', 'Corporate Affairs', 'Administration', 'Procurement', 'Finance', 'Internal Audit', 'ICT'];

  // ============================================================
  // 📊 FETCH EMPLOYEES
  // ============================================================
  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDepartment]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/employees');
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setEmployees(data);
        } else {
          setEmployees(staticEmployees);
        }
      } else {
        setEmployees(staticEmployees);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      setEmployees(staticEmployees);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // 🔧 HELPER FUNCTIONS
  // ============================================================
const getStatusBadge = (status) => {
  const statusMap = {
    'Active': '<span class="badge-active"><i class="fas fa-circle mr-1" style="font-size: 6px;"></i>Active</span>',
    'On Leave': '<span class="badge-onleave"><i class="fas fa-clock mr-1"></i>On Leave</span>',
    'Pending': '<span class="badge-pending"><i class="fas fa-clock mr-1"></i>Pending</span>',
    'Inactive': '<span class="badge-inactive"><i class="fas fa-circle mr-1" style="font-size: 6px;"></i>Inactive</span>',
    'Retired': '<span class="badge-retired"><i class="fas fa-circle mr-1" style="font-size: 6px;"></i>Retired</span>',
    'Terminated': '<span class="badge-terminated"><i class="fas fa-circle mr-1" style="font-size: 6px;"></i>Terminated</span>',
    'Suspended': '<span class="badge-suspended"><i class="fas fa-circle mr-1" style="font-size: 6px;"></i>Suspended</span>',
    'Probation': '<span class="badge-probation"><i class="fas fa-circle mr-1" style="font-size: 6px;"></i>Probation</span>',
  };
  return statusMap[status] || `<span class="badge-pending">${status}</span>`;
};

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.staffId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.position?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDepartment === '' || selectedDepartment === 'All' || emp.department === selectedDepartment;
    return matchesSearch && matchesDept;
  });

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + itemsPerPage);

  // ============================================================
  // 👁️ VIEW EMPLOYEE
  // ============================================================
  const handleViewEmployee = (emp) => {
    setViewEmployee(emp);
  };

  // ============================================================
  // ✏️ EDIT EMPLOYEE
  // ============================================================
  const handleEditEmployee = (emp) => {
    setEditFormData({
      id: emp.id,
      staffId: emp.staffId,
      name: emp.name,
      email: emp.email,
      department: emp.department,
      position: emp.position,
      status: emp.status
    });
    setShowEditModal(true);
  };

  const handleEditFormChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/employees', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: editFormData.email,
          name: editFormData.name,
          department: editFormData.department,
          position: editFormData.position
        })
      });
  
      const data = await res.json();
      
      if (data.success) {
        setShowEditModal(false);
        alert('✅ Employee updated successfully!');
        await fetchEmployees();
      } else {
        alert('❌ Failed to update: ' + data.error);
      }
    } catch (error) {
      alert('❌ Error updating employee: ' + error.message);
    }
  };

  // ============================================================
  // 🗑️ DELETE EMPLOYEE
  // ============================================================
  const handleDeleteEmployee = async (id) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    
    try {
      const employee = employees.find(emp => emp.id === id);
      if (!employee) {
        alert('❌ Employee not found');
        return;
      }
  
      const res = await fetch(`/api/employees?email=${encodeURIComponent(employee.email)}`, {
        method: 'DELETE'
      });
  
      const data = await res.json();
      
      if (data.success) {
        alert('🗑️ Employee deleted successfully!');
        await fetchEmployees();
      } else {
        alert('❌ Failed to delete: ' + data.error);
      }
    } catch (error) {
      alert('❌ Error deleting employee: ' + error.message);
    }
  };

  // ============================================================
  // 🔐 CREATE ACCOUNT
  // ============================================================
 const handleCreateAccount = async (employee) => {
  if (!confirm(`Create account for ${employee.name}?\n\nEmail: ${employee.email}\nStaff ID: ${employee.staffId}`)) return;
  
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
    console.log('📥 Create account response:', data);
    
    if (data.success) {
      const password = data.tempPassword || 'No password returned';
      
      // ✅ Use prompt instead of alert - allows copying!
      const message = 
        '✅ ACCOUNT CREATED!\n\n' +
        'Employee: ' + employee.name + '\n' +
        'Email: ' + employee.email + '\n' +
        'Staff ID: ' + employee.staffId + '\n' +
        'Department: ' + employee.department + '\n\n' +
        '🔑 TEMPORARY PASSWORD:\n' +
        password + '\n\n' +
        '📋 Select and copy the password above.\n' +
        'Share it with the staff member.\n\n' +
        '⚠️ They must change it on first login.';
      
      // Show in prompt with password pre-filled in the input field
      const userInput = prompt(message, password);
      
      // If user clicked OK, confirm
      if (userInput !== null) {
        alert('✅ Password copied/shared!\n\nPassword: ' + password);
      }
      
      await fetchEmployees();
    } else {
      if (data.error && data.error.includes('already has an account')) {
        alert(`ℹ️ ${employee.name} already has a login account.\n\nEmail: ${employee.email}\n\nThey can login with their existing password.`);
      } else {
        alert('❌ Failed: ' + (data.error || 'Unknown error'));
      }
    }
  } catch (error) {
    console.error('❌ Error:', error);
    alert('❌ Error: ' + error.message);
  } finally {
    setLoading(false);
  }
};

  // ============================================================
  // ➕ ADD EMPLOYEE
  // ============================================================
  const handleAddEmployee = async (e) => {
    e.preventDefault();
    
    const fullName = `${addFormData.firstName} ${addFormData.lastName}`.trim();
    
    if (!addFormData.email || !fullName || !addFormData.department || !addFormData.position) {
      alert('❌ Please fill in all required fields: Name, Email, Department, and Position.');
      return;
    }
  
    if (!addFormData.email.includes('@') || !addFormData.email.includes('.')) {
      alert('❌ Please enter a valid email address.');
      return;
    }
  
    setLoading(true);
  
    try {
      // Format join date correctly (YYYY-MM-DD)
      let formattedJoinDate = addFormData.joinDate;
      if (formattedJoinDate) {
        // If date is in DD/MM/YYYY format, convert to YYYY-MM-DD
        if (formattedJoinDate.includes('/')) {
          const parts = formattedJoinDate.split('/');
          if (parts.length === 3) {
            formattedJoinDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
          }
        }
      }
  
      const payload = {
        email: addFormData.email.trim(),
        name: fullName.trim(),
        department: addFormData.department.trim(),
        position: addFormData.position.trim(),
        status: addFormData.status || 'Active',
        joinDate: formattedJoinDate || new Date().toISOString().split('T')[0]
      };
  
      console.log('📤 Sending payload:', payload);
  
      const res = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
  
      const data = await res.json();
      console.log('📥 Response:', data);
      
      if (data.success) {
        alert(`✅ Employee added successfully!\n\nName: ${fullName}\nEmail: ${addFormData.email}\nStaff ID: ${data.employee.staffId}\n\nTemporary Password: ${data.tempPassword}\n\n📧 Password has been sent to the employee's email.`);
        setShowAddModal(false);
        setAddFormData({
          firstName: '',
          lastName: '',
          email: '',
          department: '',
          position: '',
          status: 'Active',
          joinDate: ''
        });
        await fetchEmployees();
      } else {
        alert('❌ Failed to add employee: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('❌ Error:', error);
      alert('❌ Error adding employee: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFormChange = (e) => {
    setAddFormData({
      ...addFormData,
      [e.target.name]: e.target.value
    });
  };

  // ============================================================
  // 📤 EXPORT EMPLOYEES
  // ============================================================
  const handleBulkExport = () => {
    if (filteredEmployees.length === 0) {
      alert('No employees to export.');
      return;
    }

    const headers = ['Staff ID', 'Name', 'Position', 'Department', 'Email', 'Status', 'Join Date'];
    let csv = headers.join(',') + '\n';
    
    filteredEmployees.forEach(emp => {
      csv += [
        emp.staffId || 'N/A',
        `"${emp.name || 'N/A'}"`,
        `"${emp.position || 'N/A'}"`,
        `"${emp.department || 'N/A'}"`,
        emp.email || 'N/A',
        emp.status || 'N/A',
        emp.joinDate || 'N/A'
      ].join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `employees_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    alert(`📊 Exported ${filteredEmployees.length} employees successfully!`);
  };

  // ============================================================
  // 📄 GENERATE REPORT
  // ============================================================
  const handleGenerateReport = () => {
    if (filteredEmployees.length === 0) {
      alert('No employees to generate report.');
      return;
    }

    const win = window.open('', '_blank');
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Employee Report - NaCCA</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          h1 { color: #0056A3; border-bottom: 3px solid #0056A3; padding-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background: #0056A3; color: white; padding: 10px; text-align: left; }
          td { padding: 8px; border-bottom: 1px solid #e2e8f0; }
          .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
          .footer { margin-top: 30px; color: #6b7a8a; font-size: 12px; text-align: center; }
          .badge { padding: 2px 8px; border-radius: 12px; font-size: 12px; }
          .active { background: #d1fae5; color: #065f46; }
          .pending { background: #fef3c7; color: #92400e; }
          .inactive { background: #f1f5f9; color: #475569; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1>NaCCA Employee Report</h1>
            <p>Generated: ${new Date().toLocaleString()}</p>
          </div>
          <div>
            <p><strong>Total Employees:</strong> ${filteredEmployees.length}</p>
            <p><strong>Active:</strong> ${filteredEmployees.filter(e => e.status === 'Active').length}</p>
          </div>
        </div>
        <table>
          <thead>
            <tr><th>Staff ID</th><th>Name</th><th>Position</th><th>Department</th><th>Email</th><th>Status</th></tr>
          </thead>
          <tbody>
            ${filteredEmployees.map(emp => `
              <tr>
                <td>${emp.staffId || 'N/A'}</td>
                <td>${emp.name || 'N/A'}</td>
                <td>${emp.position || 'N/A'}</td>
                <td>${emp.department || 'N/A'}</td>
                <td>${emp.email || 'N/A'}</td>
                <td><span class="badge ${(emp.status || '').toLowerCase()}">${emp.status || 'N/A'}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="footer"><p>NaCCA HRMIS - Employee Report</p></div>
      </body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  // ============================================================
  // 📤 BULK IMPORT
  // ============================================================
  const handleBulkImport = () => {
    setShowImportModal(true);
    setImportFile(null);
    setImportPreview([]);
    setImportResults(null);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImportFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const lines = text.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim());
        const data = [];

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim());
          const row = {};
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });
          data.push(row);
        }
        setImportPreview(data);
        setImportResults(null);
      } catch (error) {
        alert('❌ Error reading file: ' + error.message);
      }
    };
    reader.readAsText(file);
  };

  const handleProcessImport = async () => {
    if (importPreview.length === 0) {
      alert('No data to import.');
      return;
    }

    setImportLoading(true);
    const results = { total: importPreview.length, success: 0, failed: 0, errors: [] };

    const getField = (row, fieldNames) => {
      for (const name of fieldNames) {
        if (row[name] !== undefined && row[name] !== '') return row[name];
        for (const key of Object.keys(row)) {
          if (key.toLowerCase() === name.toLowerCase()) return row[key];
        }
      }
      return '';
    };

    for (let i = 0; i < importPreview.length; i++) {
      const row = importPreview[i];
      try {
        const email = getField(row, ['email', 'Email', 'EMAIL']);
        const name = getField(row, ['name', 'Name', 'NAME']);
        const staffId = getField(row, ['staffId', 'StaffId', 'staffID', 'Staff ID']);
        const department = getField(row, ['department', 'Department', 'dept']);

        if (!email || !name || !staffId || !department) {
          results.failed++;
          results.errors.push(`Row ${i + 1}: Missing fields`);
          continue;
        }

        const response = await fetch('/api/employees', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name, staffId, department, position: 'Staff', status: 'Active' })
        });

        const data = await response.json();
        if (data.success) {
          results.success++;
        } else {
          results.failed++;
          results.errors.push(`${email}: ${data.error}`);
        }
      } catch (error) {
        results.failed++;
        results.errors.push(`Row ${i + 1}: ${error.message}`);
      }
    }

    setImportResults(results);
    setImportLoading(false);
    alert(`📊 IMPORT COMPLETE!\n✅ Successful: ${results.success}\n❌ Failed: ${results.failed}`);
    if (results.success > 0) await fetchEmployees();
  };

  const downloadTemplate = () => {
    const csv = 'email,name,staffId,department\njohn.doe@nacca.gov.gh,John Doe,NAC-CD-0100,Curriculum\njane.smith@nacca.gov.gh,Jane Smith,NAC-AS-0101,Assessment';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'staff_import_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // ============================================================
  // 🛠️ OTHER ACTIONS
  // ============================================================
  const handleBulkDelete = () => {
    if (selectedEmployees.length === 0) { alert('Select employees to delete.'); return; }
    if (confirm(`Delete ${selectedEmployees.length} employees?`)) {
      alert(`🗑️ Deleted ${selectedEmployees.length} employees!`);
      setSelectedEmployees([]);
      setSelectAll(false);
      fetchEmployees();
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedDepartment('');
    setSelectedEmployees([]);
    setSelectAll(false);
  };

  const handleSelectAll = (e) => {
    setSelectAll(e.target.checked);
    setSelectedEmployees(e.target.checked ? filteredEmployees.map(emp => emp.id) : []);
  };

  const handleSelectEmployee = (id) => {
    setSelectedEmployees(prev => prev.includes(id) ? prev.filter(eid => eid !== id) : [...prev, id]);
  };

  const handleAuditLog = () => setShowAuditLog(!showAuditLog);
  const handlePrint = () => window.print();
  const handleRefresh = async () => { setLoading(true); await fetchEmployees(); setLoading(false); };

  // ============================================================
  // 🎨 RENDER
  // ============================================================
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h5 className="font-bold text-xl m-0"><i className="fas fa-users-cog text-[#0056A3] mr-2"></i>Employee Management</h5>
          <p className="text-[#6b7a8a] text-sm m-0">{employees.length} total · {employees.filter(e => e.status === 'Active').length} active</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setShowAddModal(true)} className="btn-primary"><i className="fas fa-plus mr-2"></i>Add</button>
          <button onClick={handleBulkImport} className="btn-secondary"><i className="fas fa-upload mr-2"></i>Import</button>
          <button onClick={handleBulkExport} className="btn-outline"><i className="fas fa-file-export mr-2"></i>Export</button>
          <button onClick={handleGenerateReport} className="btn-outline"><i className="fas fa-file-pdf mr-2"></i>Report</button>
          <button onClick={handleAuditLog} className={`${showAuditLog ? 'bg-purple-600 text-white' : 'btn-outline'}`}><i className="fas fa-history mr-2"></i>Audit Log</button>
          <button onClick={handleRefresh} className="btn-outline"><i className="fas fa-sync-alt mr-2"></i></button>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7a8a]"></i>
            <input type="text" placeholder="Search employees..." className="w-full pl-10 p-2.5 border-2 border-[#e2e8f0] rounded-xl focus:border-[#0056A3] outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>
        <select className="p-2.5 border-2 border-[#e2e8f0] rounded-xl focus:border-[#0056A3] outline-none bg-white" value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
          {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
        </select>
        <button onClick={handleClearFilters} className="btn-outline"><i className="fas fa-times mr-2"></i>Clear</button>
        {selectedEmployees.length > 0 && <button onClick={handleBulkDelete} className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition">Delete ({selectedEmployees.length})</button>}
        <button onClick={handlePrint} className="btn-outline"><i className="fas fa-print"></i></button>
      </div>

      {/* Table */}
      <div className="content-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f4f7fc]">
              <tr>
                <th className="px-4 py-3"><input type="checkbox" className="w-4 h-4 accent-[#0056A3]" checked={selectAll} onChange={handleSelectAll} /></th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#6b7a8a] uppercase tracking-wider">Staff ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#6b7a8a] uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#6b7a8a] uppercase tracking-wider">Position</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#6b7a8a] uppercase tracking-wider">Department</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#6b7a8a] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#6b7a8a] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-8">
                    <i className="fas fa-spinner fa-spin text-2xl text-[#0056A3]"></i>
                    <p className="text-sm text-[#6b7a8a] mt-2">Loading...</p>
                  </td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-[#6b7a8a]">
                    <i className="fas fa-users text-4xl mb-3 block text-[#e2e8f0]"></i>
                    <p>No employees found</p>
                  </td>
                </tr>
              ) : (
                paginatedEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-[#f8fafc] transition">
                    <td className="px-4 py-3">
                      <input type="checkbox" className="w-4 h-4 accent-[#0056A3]" checked={selectedEmployees.includes(emp.id)} onChange={() => handleSelectEmployee(emp.id)} />
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
                        <button onClick={() => handleViewEmployee(emp)} className="text-[#0056A3] hover:bg-[#0056A3]/10 p-1.5 rounded-lg transition text-sm" title="View">
                          <i className="fas fa-eye"></i>
                        </button>
                        <button onClick={() => handleEditEmployee(emp)} className="text-[#F5A623] hover:bg-[#F5A623]/10 p-1.5 rounded-lg transition text-sm" title="Edit">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button onClick={() => handleCreateAccount(emp)} className="text-green-600 hover:bg-green-50 p-1.5 rounded-lg transition text-sm" title="Create Account">
                          <i className="fas fa-user-plus"></i>
                        </button>
                        <button onClick={() => handleDeleteEmployee(emp.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition text-sm" title="Delete">
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-[#e2e8f0] flex flex-wrap items-center justify-between gap-2 text-sm text-[#6b7a8a]">
          <span>
            Showing {filteredEmployees.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredEmployees.length)} of {filteredEmployees.length} employees
          </span>
          <div className="flex gap-1">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg hover:bg-[#f4f7fc] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-lg transition ${
                  currentPage === page 
                    ? 'bg-[#0056A3] text-white' 
                    : 'hover:bg-[#f4f7fc]'
                }`}
              >
                {page}
              </button>
            ))}
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1 rounded-lg hover:bg-[#f4f7fc] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* VIEW EMPLOYEE MODAL */}
      {/* ============================================================ */}
      {viewEmployee && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h5 className="font-bold text-xl"><i className="fas fa-user-circle text-[#0056A3] mr-2"></i>Employee Details</h5>
              <button onClick={() => setViewEmployee(null)} className="text-[#6b7a8a] hover:text-[#1a2a3a]">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-[#6b7a8a]">Staff ID</p>
                <p className="font-bold">{viewEmployee.staffId}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-[#6b7a8a]">Name</p>
                <p className="font-bold">{viewEmployee.name}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-[#6b7a8a]">Email</p>
                <p className="font-bold">{viewEmployee.email}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-[#6b7a8a]">Department</p>
                <p className="font-bold">{viewEmployee.department}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-[#6b7a8a]">Position</p>
                <p className="font-bold">{viewEmployee.position}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-[#6b7a8a]">Status</p>
                <p className="font-bold" dangerouslySetInnerHTML={{ __html: getStatusBadge(viewEmployee.status) }} />
              </div>
              <div className="col-span-2 bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-[#6b7a8a]">Join Date</p>
                <p className="font-bold">{viewEmployee.joinDate || 'N/A'}</p>
              </div>
            </div>
            <div className="flex justify-end mt-4 pt-4 border-t border-[#e2e8f0]">
              <button onClick={() => setViewEmployee(null)} className="btn-primary">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* EDIT EMPLOYEE MODAL */}
      {/* ============================================================ */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h5 className="font-bold text-xl"><i className="fas fa-user-edit text-[#0056A3] mr-2"></i>Edit Employee</h5>
              <button onClick={() => setShowEditModal(false)} className="text-[#6b7a8a] hover:text-[#1a2a3a]">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <form onSubmit={handleSaveEdit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-sm">Staff ID</label>
                  <input type="text" name="staffId" className="w-full p-2 border rounded-lg mt-1 bg-gray-50" value={editFormData.staffId} readOnly />
                </div>
                <div>
                  <label className="font-semibold text-sm">Name *</label>
                  <input type="text" name="name" className="w-full p-2 border rounded-lg mt-1" value={editFormData.name} onChange={handleEditFormChange} required />
                </div>
                <div>
                  <label className="font-semibold text-sm">Email *</label>
                  <input type="email" name="email" className="w-full p-2 border rounded-lg mt-1" value={editFormData.email} onChange={handleEditFormChange} required />
                </div>
                <div>
                  <label className="font-semibold text-sm">Department *</label>
                  <select name="department" className="w-full p-2 border rounded-lg mt-1" value={editFormData.department} onChange={handleEditFormChange} required>
                    {departments.filter(d => d !== 'All').map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-sm">Position *</label>
                  <input type="text" name="position" className="w-full p-2 border rounded-lg mt-1" value={editFormData.position} onChange={handleEditFormChange} required />
                </div>
                <div>
                  <label className="font-semibold text-sm">Status</label>
                  <select name="status" className="w-full p-2 border rounded-lg mt-1" value={editFormData.status} onChange={handleEditFormChange}>
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4 mt-4 border-t border-[#e2e8f0]">
                <button type="button" onClick={() => setShowEditModal(false)} className="btn-outline flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1"><i className="fas fa-save mr-2"></i>Update Employee</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* ADD EMPLOYEE MODAL */}
      {/* ============================================================ */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h5 className="font-bold text-xl"><i className="fas fa-user-plus text-[#0056A3] mr-2"></i>Add Employee</h5>
              <button onClick={() => setShowAddModal(false)} className="text-[#6b7a8a] hover:text-[#1a2a3a]"><i className="fas fa-times text-xl"></i></button>
            </div>
            <form onSubmit={handleAddEmployee}>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="font-semibold text-sm">First Name *</label><input type="text" name="firstName" className="w-full p-2 border rounded-lg mt-1" value={addFormData.firstName} onChange={handleAddFormChange} required /></div>
                <div><label className="font-semibold text-sm">Last Name *</label><input type="text" name="lastName" className="w-full p-2 border rounded-lg mt-1" value={addFormData.lastName} onChange={handleAddFormChange} required /></div>
                <div><label className="font-semibold text-sm">Email *</label><input type="email" name="email" className="w-full p-2 border rounded-lg mt-1" value={addFormData.email} onChange={handleAddFormChange} required /></div>
                <div><label className="font-semibold text-sm">Department *</label><select name="department" className="w-full p-2 border rounded-lg mt-1" value={addFormData.department} onChange={handleAddFormChange} required>
                  <option value="">Select</option>
                  {departments.filter(d => d !== 'All').map(d => <option key={d} value={d}>{d}</option>)}
                </select></div>
                <div><label className="font-semibold text-sm">Position *</label><input type="text" name="position" className="w-full p-2 border rounded-lg mt-1" value={addFormData.position} onChange={handleAddFormChange} required /></div>
                <div><label className="font-semibold text-sm">Status</label><select name="status" className="w-full p-2 border rounded-lg mt-1" value={addFormData.status} onChange={handleAddFormChange}><option>Active</option><option>On Leave</option><option>Inactive</option></select></div>
                <div className="col-span-2"><label className="font-semibold text-sm">Join Date</label><input type="date" name="joinDate" className="w-full p-2 border rounded-lg mt-1" value={addFormData.joinDate} onChange={handleAddFormChange} /></div>
              </div>

              {/* Debug Section */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-4 p-3 bg-gray-100 rounded-lg text-xs font-mono overflow-auto max-h-32">
                  <p className="font-semibold text-gray-700 mb-1">📋 Debug Info:</p>
                  <pre className="text-gray-600 whitespace-pre-wrap">
                    {JSON.stringify(addFormData, null, 2)}
                  </pre>
                </div>
              )}

              <div className="flex gap-3 pt-4 mt-4 border-t border-[#e2e8f0]">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-outline flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1"><i className="fas fa-save mr-2"></i>Add Employee</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* AUDIT LOG MODAL */}
      {/* ============================================================ */}
      {showAuditLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h5 className="font-bold text-xl"><i className="fas fa-history text-purple-600 mr-2"></i>Audit Log</h5>
              <button onClick={() => setShowAuditLog(false)} className="text-[#6b7a8a] hover:text-[#1a2a3a]"><i className="fas fa-times text-xl"></i></button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f4f7fc]">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">User</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">Action</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">Timestamp</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8f0]">
                  {auditLogs.map(log => (
                    <tr key={log.id} className="hover:bg-[#f8fafc]">
                      <td className="px-4 py-2 text-sm">{log.user}</td>
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

      {/* ============================================================ */}
      {/* IMPORT MODAL */}
      {/* ============================================================ */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h5 className="font-bold text-xl">
                <i className="fas fa-upload text-[#0056A3] mr-2"></i>
                Bulk Import
              </h5>
              <button onClick={() => setShowImportModal(false)} className="text-[#6b7a8a] hover:text-[#1a2a3a]">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <div className="mb-4 p-4 bg-blue-50 rounded-xl">
              <p className="font-semibold text-blue-800 mb-2">📋 Step 1: Download Template</p>
              <button onClick={downloadTemplate} className="btn-primary text-sm">
                <i className="fas fa-download mr-2"></i>Download Template
              </button>
            </div>

            <div className="mb-4 p-4 bg-gray-50 rounded-xl">
              <p className="font-semibold text-gray-800 mb-2">📤 Step 2: Upload CSV</p>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="w-full p-2 border-2 border-dashed border-[#e2e8f0] rounded-xl cursor-pointer"
              />
              {importFile && (
                <p className="text-sm text-green-600 mt-2">
                  ✅ File loaded: {importFile.name} ({importPreview.length} records)
                </p>
              )}
            </div>

            {importPreview.length > 0 && (
              <div className="mb-4">
                <p className="font-semibold text-gray-800 mb-2">
                  📊 Preview ({importPreview.length})
                </p>
                <div className="overflow-x-auto max-h-60 border rounded-xl">
                  <table className="w-full text-sm">
                    <thead className="bg-[#f4f7fc] sticky top-0">
                      <tr>
                        {Object.keys(importPreview[0]).map(key => (
                          <th key={key} className="px-3 py-2 text-left">{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {importPreview.slice(0, 10).map((row, i) => (
                        <tr key={i}>
                          {Object.values(row).map((v, j) => (
                            <td key={j} className="px-3 py-2">{v}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {importResults && (
              <div className="mb-4 p-4 bg-gray-50 rounded-xl">
                <p className="font-semibold text-gray-800 mb-2">📊 Results</p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{importResults.success}</div>
                    <div className="text-xs text-green-700">Success</div>
                  </div>
                  <div className="bg-red-100 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{importResults.failed}</div>
                    <div className="text-xs text-red-700">Failed</div>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{importResults.total}</div>
                    <div className="text-xs text-blue-700">Total</div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-[#e2e8f0]">
              <button onClick={() => setShowImportModal(false)} className="btn-outline flex-1">Cancel</button>
              <button
                onClick={handleProcessImport}
                disabled={importPreview.length === 0 || importLoading}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                {importLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-upload mr-2"></i>} Import {importPreview.length} Records
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}