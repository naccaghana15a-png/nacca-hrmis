'use client';

import { useState, useEffect } from 'react';

export default function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setUser(data.user);
        }
      });
  }, []);

  const handleUpdateProfile = () => {
    alert('✅ Profile updated successfully!');
  };

  if (!user) return <div>Loading...</div>;

  const getRoleColor = (role) => {
    const colors = {
      'SUPER_ADMIN': 'text-purple-600',
      'DIRECTOR': 'text-blue-600',
      'STAFF': 'text-green-600',
    };
    return colors[role] || 'text-gray-600';
  };

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
              {user.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'SA'}
            </div>
            <h5 className="font-bold text-lg mt-3">{user.name}</h5>
            <p className={`text-sm font-semibold ${getRoleColor(user.role)}`}>
              <i className="fas fa-shield-alt mr-1"></i>
              {user.role}
            </p>
            <p className="text-[#6b7a8a] text-sm mt-1">{user.email}</p>
            <hr className="my-3" />
            <div className="text-left text-sm space-y-2">
              <p><strong>Staff ID:</strong> {user.staffId || 'N/A'}</p>
              <p><strong>Department:</strong> {user.department || 'N/A'}</p>
              <p><strong>Access Level:</strong> 
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${getRoleColor(user.role)} bg-${user.role === 'SUPER_ADMIN' ? 'purple' : user.role === 'DIRECTOR' ? 'blue' : 'green'}-100`}>
                  {user.role}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 content-card">
          <div className="px-5 py-3 border-b border-[#e2e8f0]">
            <h5 className="font-semibold">Edit Profile</h5>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-sm">Full Name</label>
                <input type="text" className="w-full p-2 border rounded-lg mt-1" defaultValue={user.name} />
              </div>
              <div>
                <label className="font-semibold text-sm">Email</label>
                <input type="email" className="w-full p-2 border rounded-lg mt-1" defaultValue={user.email} />
              </div>
              <div>
                <label className="font-semibold text-sm">Staff ID</label>
                <input type="text" className="w-full p-2 border rounded-lg mt-1 bg-gray-50" defaultValue={user.staffId} readOnly />
              </div>
              <div>
                <label className="font-semibold text-sm">Department</label>
                <input type="text" className="w-full p-2 border rounded-lg mt-1 bg-gray-50" defaultValue={user.department} readOnly />
              </div>
              <div>
                <label className="font-semibold text-sm">Phone</label>
                <input type="tel" className="w-full p-2 border rounded-lg mt-1" defaultValue="+233 20 100 1000" />
              </div>
              <div>
                <label className="font-semibold text-sm">Role</label>
                <input type="text" className="w-full p-2 border rounded-lg mt-1 bg-gray-50 font-semibold" defaultValue={user.role} readOnly />
              </div>
            </div>
            <button onClick={handleUpdateProfile} className="btn-primary mt-4">
              <i className="fas fa-save mr-2"></i>Update Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}