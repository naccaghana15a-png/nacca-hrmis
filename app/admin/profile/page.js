export default function ProfilePage() {
    return (
      <div className="space-y-4">
        <div>
          <h5 className="font-bold text-xl m-0">My Profile</h5>
          <p className="text-[#6b7a8a] text-sm m-0">View and edit your profile</p>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="content-card">
            <div className="p-5 text-center">
              <div className="w-24 h-24 rounded-full bg-[#F5A623] mx-auto flex items-center justify-center text-3xl font-bold text-[#0056A3]">
                SA
              </div>
              <h5 className="font-bold text-lg mt-3">System Admin</h5>
              <p className="text-[#6b7a8a] text-sm">SUPER_ADMIN</p>
              <p className="text-[#6b7a8a] text-sm mt-1">admin@nacca.gov.gh</p>
              <hr className="my-3" />
              <div className="text-left text-sm space-y-2">
                <p><strong>Staff ID:</strong> NACCA0001</p>
                <p><strong>Department:</strong> HR & Administration</p>
                <p><strong>Joined:</strong> January 2020</p>
              </div>
              <button className="btn-primary w-full mt-3">Edit Profile</button>
            </div>
          </div>
  
          <div className="md:col-span-2 content-card">
            <div className="px-5 py-3 border-b border-[#e2e8f0]">
              <h5 className="font-semibold">Edit Profile</h5>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-sm">First Name</label>
                  <input type="text" className="w-full p-2 border rounded-lg mt-1" value="System" />
                </div>
                <div>
                  <label className="font-semibold text-sm">Last Name</label>
                  <input type="text" className="w-full p-2 border rounded-lg mt-1" value="Admin" />
                </div>
                <div>
                  <label className="font-semibold text-sm">Email</label>
                  <input type="email" className="w-full p-2 border rounded-lg mt-1" value="admin@nacca.gov.gh" />
                </div>
                <div>
                  <label className="font-semibold text-sm">Phone</label>
                  <input type="tel" className="w-full p-2 border rounded-lg mt-1" value="+233 20 100 1000" />
                </div>
              </div>
              <button className="btn-primary mt-4">Update Profile</button>
            </div>
          </div>
        </div>
      </div>
    );
  }