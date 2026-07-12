'use client';

import { useState } from 'react';

export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');

  const employees = [
    // Directors
    { id: 1, staffId: 'NAC-EX-0001', name: 'Prof. Samuel Ofori Bekoe', position: 'Ag. Director General', department: 'Executive', email: 'samuel.bekoe@nacca.gov.gh', status: 'Active' },
    { id: 2, staffId: 'NAC-EX-0002', name: 'Dr. J. R. Achoanya Ayam', position: 'Ag. Deputy Director General', department: 'Executive', email: 'j.achoanya@nacca.gov.gh', status: 'Active' },
    { id: 3, staffId: 'NAC-EX-0003', name: 'Dr. Eric Amoah', position: 'Ag. Deputy Director General', department: 'Executive', email: 'eric.amoah@nacca.gov.gh', status: 'Active' },
    
    // Directors by Department
    { id: 4, staffId: 'NAC-AS-0001', name: 'Anita Frances Cordeiro Collison', position: 'Ag. Director, SAQA', department: 'Assessment', email: 'anita.collison@nacca.gov.gh', status: 'Active' },
    { id: 5, staffId: 'NAC-CD-0001', name: 'Reginald George Quartey', position: 'Ag. Director, Curriculum Development', department: 'Curriculum', email: 'reginald.quartey@nacca.gov.gh', status: 'Active' },
    { id: 6, staffId: 'NAC-RS-0001', name: 'Dr. Mercy Nyamekye', position: 'Ag. Director, RPME', department: 'Research', email: 'mercy.nyamekye@nacca.gov.gh', status: 'Active' },
    { id: 7, staffId: 'NAC-IR-0001', name: 'Joana Vanderpuje', position: 'Ag. Director, Instructional Resources', department: 'Instructional Resources', email: 'joana.vanderpuje@nacca.gov.gh', status: 'Active' },
    { id: 8, staffId: 'NAC-HR-0001', name: 'Elijah Intsiful', position: 'Ag. Director, Human Resources & Admin', department: 'Human Resource', email: 'elijah.intsiful@nacca.gov.gh', status: 'Active' },
    { id: 9, staffId: 'NAC-CA-0001', name: 'Rebecca Abu Gariba', position: 'Ag. Director, Corporate Affairs', department: 'Corporate Affairs', email: 'rebecca.gariba@nacca.gov.gh', status: 'Active' },

    // Principal Officers - Assessment
    { id: 10, staffId: 'NAC-AS-0002', name: 'Joachim Kwame Seyram Honu', position: 'Principal Officer', department: 'Assessment', email: 'joachim.honu@nacca.gov.gh', status: 'Active' },
    { id: 11, staffId: 'NAC-AS-0003', name: 'Richard Teye', position: 'Principal Officer', department: 'Assessment', email: 'richard.teye@nacca.gov.gh', status: 'Active' },
    { id: 12, staffId: 'NAC-AS-0004', name: 'Jephtar Adu-Mensah', position: 'Principal Officer', department: 'Assessment', email: 'jephtar.adumensah@nacca.gov.gh', status: 'Active' },
    { id: 13, staffId: 'NAC-AS-0005', name: 'Nancy Asieduwaa Gyapong', position: 'Principal Officer', department: 'Assessment', email: 'nancy.gyapong@nacca.gov.gh', status: 'Active' },
    { id: 14, staffId: 'NAC-AS-0006', name: 'Bridget Aku Anku', position: 'Principal Officer', department: 'Assessment', email: 'bridget.anku@nacca.gov.gh', status: 'Active' },
    { id: 15, staffId: 'NAC-AS-0007', name: 'Kwakyewaa Christiana', position: 'Principal Officer', department: 'Assessment', email: 'kwakyewaa.christiana@nacca.gov.gh', status: 'Active' },

    // Principal Officers - Curriculum
    { id: 16, staffId: 'NAC-CD-0002', name: 'Genevieve Mensah', position: 'Principal Officer', department: 'Curriculum', email: 'genevieve.mensah@nacca.gov.gh', status: 'Active' },
    { id: 17, staffId: 'NAC-CD-0003', name: 'Thomas Kumah Osei', position: 'Principal Officer', department: 'Curriculum', email: 'thomas.osei@nacca.gov.gh', status: 'Active' },
    { id: 18, staffId: 'NAC-CD-0004', name: 'Godfred Asiedu Mireku', position: 'Principal Officer', department: 'Curriculum', email: 'godfred.mireku@nacca.gov.gh', status: 'Active' },
    { id: 19, staffId: 'NAC-CD-0005', name: 'Nii Boye Tagoe', position: 'Principal Officer', department: 'Curriculum', email: 'nii.togoe@nacca.gov.gh', status: 'Active' },
    { id: 20, staffId: 'NAC-CD-0006', name: 'Owusu Ansah Samuel', position: 'Principal Officer', department: 'Curriculum', email: 'owusu.ansah@nacca.gov.gh', status: 'Active' },
    { id: 21, staffId: 'NAC-CD-0007', name: 'Sullivan Akudago Ayuuba', position: 'Principal Officer', department: 'Curriculum', email: 'sullivan.ayuuba@nacca.gov.gh', status: 'Active' },
    { id: 22, staffId: 'NAC-CD-0008', name: 'Juliet Owusu Ansah', position: 'Principal Officer', department: 'Curriculum', email: 'juliet.ansah@nacca.gov.gh', status: 'Active' },
    { id: 23, staffId: 'NAC-CD-0009', name: 'Stephen Acquah', position: 'Principal Officer', department: 'Curriculum', email: 'stephen.acquah@nacca.gov.gh', status: 'Active' },
    { id: 24, staffId: 'NAC-CD-0010', name: 'Godwin M.K Senanu', position: 'Principal Officer', department: 'Curriculum', email: 'godwin.senanu@nacca.gov.gh', status: 'Active' },

    // Principal Officers - Research
    { id: 25, staffId: 'NAC-RS-0002', name: 'Abigail Owusu Birago', position: 'Principal Officer', department: 'Research', email: 'abigail.birago@nacca.gov.gh', status: 'Active' },
    { id: 26, staffId: 'NAC-RS-0003', name: 'Francis Agbalenyo', position: 'Principal Officer', department: 'Research', email: 'francis.agbalenyo@nacca.gov.gh', status: 'Active' },
    { id: 27, staffId: 'NAC-RS-0004', name: 'Abigail Owusu Oduro', position: 'Principal Officer', department: 'Research', email: 'abigail.oduro@nacca.gov.gh', status: 'Active' },

    // Instructional Resources
    { id: 28, staffId: 'NAC-IR-0002', name: 'Kenneth Wontumi', position: 'Principal Officer', department: 'Instructional Resources', email: 'kenneth.wontumi@nacca.gov.gh', status: 'Active' },
    { id: 29, staffId: 'NAC-IR-0003', name: 'Joseph Barwuah', position: 'Principal Officer', department: 'Instructional Resources', email: 'joseph.barwuah@nacca.gov.gh', status: 'Active' },
    { id: 30, staffId: 'NAC-IR-0004', name: 'Sharon Efua Yelbert', position: 'Assistant Instructional Resources Officer', department: 'Instructional Resources', email: 'sharon.yelbert@nacca.gov.gh', status: 'Active' },
    { id: 31, staffId: 'NAC-IR-0005', name: 'Dennis Adjasi', position: 'Instructional Resources Officer', department: 'Instructional Resources', email: 'dennis.adjasi@nacca.gov.gh', status: 'Active' },

    // Administrative
    { id: 32, staffId: 'NAC-AD-0001', name: 'Gladys Gratias Tseh', position: 'Principal Administrative Officer', department: 'Administration', email: 'gladys.tseh@nacca.gov.gh', status: 'Active' },
    { id: 33, staffId: 'NAC-AD-0002', name: 'Enock Anner Tetteh', position: 'Administrative Officer', department: 'Administration', email: 'enock.tetteh@nacca.gov.gh', status: 'Active' },
    { id: 34, staffId: 'NAC-AD-0003', name: 'Albert Adjei', position: 'Administrative Assistant III', department: 'Administration', email: 'albert.adjei@nacca.gov.gh', status: 'Active' },
    { id: 35, staffId: 'NAC-AD-0004', name: 'Sampson Anim', position: 'Administrative Assistant I', department: 'Administration', email: 'sampson.anim@nacca.gov.gh', status: 'Active' },
    { id: 36, staffId: 'NAC-AD-0005', name: 'Mary Y. Azumah', position: 'Senior Private Secretary', department: 'Administration', email: 'mary.azumah@nacca.gov.gh', status: 'Active' },
    { id: 37, staffId: 'NAC-AD-0006', name: 'Mavis Ama Bonsu', position: 'Private Secretary', department: 'Administration', email: 'mavis.bonsu@nacca.gov.gh', status: 'Active' },
    { id: 38, staffId: 'NAC-AD-0007', name: 'Miriam Bonyakie Sackey', position: 'Private Secretary', department: 'Administration', email: 'miriam.sackey@nacca.gov.gh', status: 'Active' },
    { id: 39, staffId: 'NAC-AD-0008', name: 'Dorcas Acheampong', position: 'Private Secretary', department: 'Administration', email: 'dorcas.acheampong@nacca.gov.gh', status: 'Active' },

    // Corporate Affairs
    { id: 40, staffId: 'NAC-CA-0002', name: 'Seth Nii Nartey', position: 'Corporate Affairs Officer', department: 'Corporate Affairs', email: 'seth.nartey@nacca.gov.gh', status: 'Active' },
    { id: 41, staffId: 'NAC-CA-0003', name: 'Ogyampo Samuel Amankwa', position: 'Corporate Affairs Officer', department: 'Corporate Affairs', email: 'ogyampo.amankwa@nacca.gov.gh', status: 'Active' },
    { id: 42, staffId: 'NAC-CA-0004', name: 'Alice Kuramah', position: 'Assistant Corporate Affairs Officer', department: 'Corporate Affairs', email: 'alice.kuramah@nacca.gov.gh', status: 'Active' },

    // Procurement
    { id: 43, staffId: 'NAC-PR-0001', name: 'Nana Opoku Yeboah', position: 'Procurement Officer', department: 'Procurement', email: 'nana.yeboah@nacca.gov.gh', status: 'Active' },
    { id: 44, staffId: 'NAC-PR-0002', name: 'Richard Owusu', position: 'Assistant Procurement Officer', department: 'Procurement', email: 'richard.owusu@nacca.gov.gh', status: 'Active' },
    { id: 45, staffId: 'NAC-PR-0003', name: 'Charity Nyewan', position: 'Assistant Procurement Officer', department: 'Procurement', email: 'charity.nyewan@nacca.gov.gh', status: 'Active' },

    // Finance
    { id: 46, staffId: 'NAC-FN-0001', name: 'Prince Owusu Boateng', position: 'Accountant', department: 'Finance', email: 'prince.boateng@nacca.gov.gh', status: 'Active' },
    { id: 47, staffId: 'NAC-FN-0002', name: 'Abednego Adjinah Adomako', position: 'Assistant Accountant', department: 'Finance', email: 'abednego.adomako@nacca.gov.gh', status: 'Active' },

    // Internal Audit
    { id: 48, staffId: 'NAC-IA-0001', name: 'Isaac Appoh', position: 'Assistant Accountant', department: 'Internal Audit', email: 'isaac.appoh@nacca.gov.gh', status: 'Active' },

    // ICT
    { id: 49, staffId: 'NAC-IT-0001', name: 'Dzineku Lawrence Senanu', position: 'Assistant IT Officer', department: 'ICT', email: 'dzineku.senanu@nacca.gov.gh', status: 'Active' },

    // Drivers
    { id: 50, staffId: 'NAC-AD-0009', name: 'Justice Buabeng', position: 'Chief Driver', department: 'Administration', email: 'justice.buabeng@nacca.gov.gh', status: 'Active' },
    { id: 51, staffId: 'NAC-AD-0010', name: 'Daniel Adjei', position: 'Driver Grade I', department: 'Administration', email: 'daniel.adjei@nacca.gov.gh', status: 'Active' },
    { id: 52, staffId: 'NAC-AD-0011', name: 'Lartey Philip Nii Boye', position: 'Driver Grade II', department: 'Administration', email: 'philip.lartey@nacca.gov.gh', status: 'Active' },
    { id: 53, staffId: 'NAC-AD-0012', name: 'George Abbey Anertey', position: 'Driver Grade II', department: 'Administration', email: 'george.anertey@nacca.gov.gh', status: 'Active' },
    { id: 54, staffId: 'NAC-AD-0013', name: 'Prince Ankumah', position: 'Driver Grade II', department: 'Administration', email: 'prince.ankumah@nacca.gov.gh', status: 'Active' },
    { id: 55, staffId: 'NAC-AD-0014', name: 'Fred Asante', position: 'Senior Driver Grade II', department: 'Administration', email: 'fred.asante@nacca.gov.gh', status: 'Active' },
    { id: 56, staffId: 'NAC-AD-0015', name: 'Bernard Baidoo', position: 'Driver Grade II', department: 'Administration', email: 'bernard.baidoo@nacca.gov.gh', status: 'Active' },
    { id: 57, staffId: 'NAC-AD-0016', name: 'Ebenezer Amoako', position: 'Driver Grade I', department: 'Administration', email: 'ebenezer.amoako@nacca.gov.gh', status: 'Active' },

    // Cleaners & Security
    { id: 58, staffId: 'NAC-AD-0017', name: 'Alex Amponsah', position: 'Senior Cleaner/Labourer', department: 'Administration', email: 'alex.amponsah@nacca.gov.gh', status: 'Active' },
    { id: 59, staffId: 'NAC-AD-0018', name: 'Seraphine Mantey', position: 'Cleaner', department: 'Administration', email: 'seraphine.mantey@nacca.gov.gh', status: 'Active' },
    { id: 60, staffId: 'NAC-AD-0019', name: 'Michael Kwaku', position: 'Security Guard', department: 'Administration', email: 'michael.kwaku@nacca.gov.gh', status: 'Active' },
  ];

  const departments = ['All', 'Executive', 'Assessment', 'Curriculum', 'Research', 'Instructional Resources', 'Human Resource', 'Corporate Affairs', 'Administration', 'Procurement', 'Finance', 'Internal Audit', 'ICT'];

  const getStatusBadge = (status) => {
    if (status === 'Active') return '<span class="badge-active"><i class="fas fa-circle mr-1" style="font-size: 6px;"></i>Active</span>';
    if (status === 'On Leave') return '<span class="badge-pending"><i class="fas fa-clock mr-1"></i>On Leave</span>';
    return '<span class="badge-inactive">Inactive</span>';
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.staffId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDepartment === '' || selectedDepartment === 'All' || emp.department === selectedDepartment;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h5 className="font-bold text-xl m-0">Employee Directory</h5>
          <p className="text-[#6b7a8a] text-sm m-0">{employees.length} staff members</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button className="btn-primary">
            <i className="fas fa-plus mr-2"></i>Add Employee
          </button>
          <button className="btn-secondary">
            <i className="fas fa-file-export mr-2"></i>Export
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search by name, staff ID, or position..."
            className="w-full p-2.5 border-2 border-[#e2e8f0] rounded-xl focus:border-[#0056A3] focus:shadow-[0_0_0_4px_rgba(0,86,163,0.1)] transition outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
        <button onClick={() => { setSearchTerm(''); setSelectedDepartment(''); }} className="btn-outline">
          <i className="fas fa-times mr-2"></i>Clear
        </button>
      </div>

      {/* Employee Table */}
      <div className="content-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f4f7fc]">
              <tr>
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
                      <button className="text-[#F5A623] hover:bg-[#F5A623]/10 p-1.5 rounded-lg transition text-sm" title="Edit">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition text-sm" title="Delete">
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
    </div>
  );
}