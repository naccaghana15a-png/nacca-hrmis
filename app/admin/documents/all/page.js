'use client';

import { useState, useEffect } from 'react';

export default function AllDocumentsPage() {
  const [user, setUser] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setUser(data.user);
          fetchAllDocuments();
          fetchEmployees();
        }
      })
      .catch(() => setLoading(false));
  }, []);

  const fetchAllDocuments = async () => {
    try {
      const res = await fetch('/api/documents');
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await fetch('/api/employees');
      if (res.ok) {
        const data = await res.json();
        setEmployees(data);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleDownload = (doc) => {
    if (doc.downloadUrl) {
      const a = document.createElement('a');
      a.href = doc.downloadUrl;
      a.download = doc.fileName;
      a.click();
    } else {
      alert('📄 Download URL not available.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    try {
      const res = await fetch(`/api/documents?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDocuments(prev => prev.filter(d => d.id !== id));
        alert('🗑️ Document deleted successfully!');
      }
    } catch (error) {
      alert('❌ Error deleting document: ' + error.message);
    }
  };

  const getCategoryBadge = (category) => {
    const colors = {
      'personal': 'bg-blue-100 text-blue-800',
      'academic': 'bg-green-100 text-green-800',
      'promotion': 'bg-purple-100 text-purple-800',
      'others': 'bg-gray-100 text-gray-800',
    };
    return colors[category] || colors['others'];
  };

  const getFileIcon = (fileType) => {
    if (fileType?.includes('pdf')) return 'fa-file-pdf text-red-500';
    if (fileType?.includes('word')) return 'fa-file-word text-blue-500';
    if (fileType?.includes('excel')) return 'fa-file-excel text-green-500';
    if (fileType?.includes('image')) return 'fa-file-image text-purple-500';
    return 'fa-file text-gray-500';
  };

  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'DIRECTOR';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#e2e8f0] border-t-[#0056A3] rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-[#6b7a8a]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="content-card p-8 text-center">
        <i className="fas fa-lock text-4xl text-red-500 mb-3 block"></i>
        <h5 className="font-bold text-xl">Access Denied</h5>
        <p className="text-[#6b7a8a]">You do not have permission to view all staff documents.</p>
      </div>
    );
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesEmployee = selectedEmployee === 'all' || doc.staffId === selectedEmployee;
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch = doc.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.fileName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.uploadedBy?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesEmployee && matchesCategory && matchesSearch;
  });

  const categories = ['all', 'personal', 'academic', 'promotion', 'others'];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h5 className="font-bold text-xl m-0">
            <i className="fas fa-folder-open text-[#0056A3] mr-2"></i>
            All Staff Documents
          </h5>
          <p className="text-[#6b7a8a] text-sm m-0">
            Manage all staff documents ({documents.length} total)
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7a8a]"></i>
            <input
              type="text"
              placeholder="Search documents..."
              className="w-full pl-10 p-2 border-2 border-[#e2e8f0] rounded-xl focus:border-[#0056A3] outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div>
          <select
            className="p-2 border-2 border-[#e2e8f0] rounded-xl focus:border-[#0056A3] outline-none bg-white"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
            <option value="all">All Staff</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.staffId}>
                {emp.name} ({emp.staffId})
              </option>
            ))}
          </select>
        </div>
        <div>
          <select
            className="p-2 border-2 border-[#e2e8f0] rounded-xl focus:border-[#0056A3] outline-none bg-white"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="stat-card text-center p-3">
          <div className="text-xl font-bold text-[#0056A3]">{filteredDocuments.length}</div>
          <div className="text-xs text-[#6b7a8a]">Showing Documents</div>
        </div>
        <div className="stat-card text-center p-3">
          <div className="text-xl font-bold text-[#0056A3]">
            {filteredDocuments.filter(d => d.category === 'personal').length}
          </div>
          <div className="text-xs text-[#6b7a8a]">Personal</div>
        </div>
        <div className="stat-card text-center p-3">
          <div className="text-xl font-bold text-[#0056A3]">
            {filteredDocuments.filter(d => d.category === 'academic').length}
          </div>
          <div className="text-xs text-[#6b7a8a]">Academic</div>
        </div>
        <div className="stat-card text-center p-3">
          <div className="text-xl font-bold text-[#0056A3]">
            {filteredDocuments.filter(d => d.category === 'promotion').length}
          </div>
          <div className="text-xs text-[#6b7a8a]">Promotion</div>
        </div>
      </div>

      {/* Document List */}
      <div className="content-card">
        <div className="px-5 py-3 border-b border-[#e2e8f0]">
          <h5 className="font-semibold flex items-center gap-2">
            <i className="fas fa-list text-[#0056A3]"></i> Documents ({filteredDocuments.length})
          </h5>
        </div>
        <div className="p-0">
          {filteredDocuments.length === 0 ? (
            <div className="p-8 text-center text-[#6b7a8a]">
              <i className="fas fa-folder-open text-4xl mb-3 block text-[#e2e8f0]"></i>
              <p>No documents found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f4f7fc]">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">File</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">Title</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">Staff</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">Category</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">Size</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">Uploaded</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8f0]">
                  {filteredDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-[#f8fafc]">
                      <td className="px-4 py-2">
                        <i className={`fas ${getFileIcon(doc.fileType)} text-xl`}></i>
                      </td>
                      <td className="px-4 py-2 text-sm font-medium">{doc.title}</td>
                      <td className="px-4 py-2 text-sm">{doc.uploadedBy || doc.staffId}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getCategoryBadge(doc.category)}`}>
                          {doc.category}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm">{doc.fileSize} KB</td>
                      <td className="px-4 py-2 text-sm text-[#6b7a8a]">
                        {new Date(doc.uploadedAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleDownload(doc)}
                            className="text-[#0056A3] hover:bg-[#0056A3]/10 p-1.5 rounded-lg transition text-sm"
                            title="Download"
                          >
                            <i className="fas fa-download"></i>
                          </button>
                          <button
                            onClick={() => handleDelete(doc.id)}
                            className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition text-sm"
                            title="Delete"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}