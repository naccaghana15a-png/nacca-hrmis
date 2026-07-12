export default function EmployeesPage() {
    const employees = [
      { id: 1, staffId: 'NACCA0001', name: 'Prof. Samuel Ofori Bekoe', position: 'Director-General', directorate: 'Executive', email: 'samuel.bekoe@nacca.gov.gh', status: 'Active' },
      { id: 2, staffId: 'NACCA0002', name: 'Anthony Sarpong', position: 'Director, Assessment', directorate: 'Assessment & Standards', email: 'anthony.sarpong@nacca.gov.gh', status: 'Active' },
      { id: 3, staffId: 'NACCA0003', name: 'Reginald Quartey', position: 'Head, Curriculum', directorate: 'Curriculum Development', email: 'reginald.quartey@nacca.gov.gh', status: 'Active' },
      { id: 4, staffId: 'NACCA0004', name: 'Dr. Mercy Nyamekye', position: 'Director, RPME', directorate: 'Research & PME', email: 'mercy.nyamekye@nacca.gov.gh', status: 'Active' },
      { id: 5, staffId: 'NACCA0005', name: 'Elijah Intsiful', position: 'Director, HR & Admin', directorate: 'HR & Administration', email: 'elijah.intsiful@nacca.gov.gh', status: 'Active' },
    ];
  
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h5 className="font-bold text-xl m-0">Employees</h5>
            <p className="text-[#6b7a8a] text-sm m-0">Manage staff records and profiles</p>
          </div>
          <button className="btn-primary">
            <i className="fas fa-plus mr-2"></i>Add Employee
          </button>
        </div>
  
        <div className="content-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f4f7fc]">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6b7a8a] uppercase tracking-wider">Staff ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6b7a8a] uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6b7a8a] uppercase tracking-wider">Position</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6b7a8a] uppercase tracking-wider">Directorate</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6b7a8a] uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6b7a8a] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]">
                {employees.map((e) => (
                  <tr key={e.id} className="hover:bg-[#f8fafc]">
                    <td className="px-4 py-3 font-semibold">{e.staffId}</td>
                    <td className="px-4 py-3">{e.name}</td>
                    <td className="px-4 py-3">{e.position}</td>
                    <td className="px-4 py-3">{e.directorate}</td>
                    <td className="px-4 py-3">
                      <span className="badge-active">{e.status}</span>
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button className="text-[#0056A3] hover:bg-[#0056A3]/10 p-1.5 rounded-lg transition"><i className="fas fa-eye"></i></button>
                      <button className="text-[#F5A623] hover:bg-[#F5A623]/10 p-1.5 rounded-lg transition"><i className="fas fa-edit"></i></button>
                      <button className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition"><i className="fas fa-trash"></i></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }