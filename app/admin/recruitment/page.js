export default function RecruitmentPage() {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h5 className="font-bold text-xl m-0">Recruitment</h5>
            <p className="text-[#6b7a8a] text-sm m-0">Manage vacancies and job applications</p>
          </div>
          <button className="btn-primary">
            <i className="fas fa-plus mr-2"></i>Create Vacancy
          </button>
        </div>
  
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="stat-card text-center">
            <div className="text-2xl font-bold">4</div>
            <div className="text-sm text-[#6b7a8a]">Open Vacancies</div>
          </div>
          <div className="stat-card text-center">
            <div className="text-2xl font-bold">27</div>
            <div className="text-sm text-[#6b7a8a]">Applications</div>
          </div>
          <div className="stat-card text-center">
            <div className="text-2xl font-bold">8</div>
            <div className="text-sm text-[#6b7a8a]">Interviews</div>
          </div>
          <div className="stat-card text-center">
            <div className="text-2xl font-bold">5</div>
            <div className="text-sm text-[#6b7a8a]">Offers Extended</div>
          </div>
        </div>
  
        <div className="content-card">
          <div className="px-5 py-3 border-b border-[#e2e8f0]">
            <h5 className="font-semibold">Current Vacancies</h5>
          </div>
          <div className="p-5 text-center text-[#6b7a8a]">
            <i className="fas fa-briefcase text-4xl mb-3 block"></i>
            <p>Job vacancies will appear here</p>
          </div>
        </div>
      </div>
    );
  }