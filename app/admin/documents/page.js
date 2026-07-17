'use client';

import { useState, useEffect } from 'react';

export default function DocumentsPage() {
  const [user, setUser] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showUploadForm, setShowUploadForm] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setUser(data.user);
          fetchDocuments(data.user.staffId);
        }
      })
      .catch(() => setLoading(false));
  }, []);

  const fetchDocuments = async (staffId) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/documents?staffId=${staffId}`);
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

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const file = formData.get('file');
    const category = formData.get('category');
    const title = formData.get('title');

    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    setUploading(true);

    try {
      const newDoc = {
        id: Date.now(),
        title: title || file.name,
        category: category || 'others',
        fileName: file.name,
        fileSize: (file.size / 1024).toFixed(1),
        fileType: file.type,
        uploadedBy: user?.name || 'Staff',
        uploadedByStaffId: user?.staffId,
        uploadedAt: new Date().toISOString(),
        staffId: user?.staffId,
        downloadUrl: URL.createObjectURL(file)
      };

      // Save to local state (in production, send to API)
      setDocuments(prev => [newDoc, ...prev]);
      alert('✅ Document uploaded successfully!');
      setShowUploadForm(false);
      e.target.reset();
    } catch (error) {
      alert('❌ Error uploading document: ' + error.message);
    } finally {
      setUploading(false);
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
    setDocuments(prev => prev.filter(d => d.id !== id));
    alert('🗑️ Document deleted successfully!');
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'personal', label: 'Personal Documents' },
    { value: 'academic', label: 'Academic Records' },
    { value: 'promotion', label: 'Promotion Letters' },
    { value: 'others', label: 'Others' },
  ];

  const filteredDocuments = selectedCategory === 'all' 
    ? documents 
    : documents.filter(d => d.category === selectedCategory);

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
    if (fileType?.includes('zip')) return 'fa-file-archive text-yellow-500';
    return 'fa-file text-gray-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#e2e8f0] border-t-[#0056A3] rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-[#6b7a8a]">Loading documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h5 className="font-bold text-xl m-0">
            <i className="fas fa-folder text-[#0056A3] mr-2"></i>
            My Documents
          </h5>
          <p className="text-[#6b7a8a] text-sm m-0">
            Manage your personal documents and files
          </p>
        </div>
        <button 
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="btn-primary"
        >
          <i className="fas fa-upload mr-2"></i>Upload Document
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="stat-card text-center p-3">
          <div className="text-xl font-bold text-[#0056A3]">{documents.length}</div>
          <div className="text-xs text-[#6b7a8a]">Total Documents</div>
        </div>
        <div className="stat-card text-center p-3">
          <div className="text-xl font-bold text-[#0056A3]">
            {documents.filter(d => d.category === 'personal').length}
          </div>
          <div className="text-xs text-[#6b7a8a]">Personal</div>
        </div>
        <div className="stat-card text-center p-3">
          <div className="text-xl font-bold text-[#0056A3]">
            {documents.filter(d => d.category === 'academic').length}
          </div>
          <div className="text-xs text-[#6b7a8a]">Academic</div>
        </div>
        <div className="stat-card text-center p-3">
          <div className="text-xl font-bold text-[#0056A3]">
            {documents.filter(d => d.category === 'promotion').length}
          </div>
          <div className="text-xs text-[#6b7a8a]">Promotion</div>
        </div>
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <div className="content-card">
          <div className="px-5 py-3 border-b border-[#e2e8f0] flex items-center justify-between">
            <h5 className="font-semibold flex items-center gap-2">
              <i className="fas fa-upload text-[#0056A3]"></i> Upload Document
            </h5>
            <button onClick={() => setShowUploadForm(false)} className="text-[#6b7a8a] hover:text-[#1a2a3a]">
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="p-5">
            <form onSubmit={handleUpload}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold text-sm">Document Title</label>
                  <input
                    type="text"
                    name="title"
                    className="w-full p-2 border rounded-lg mt-1"
                    placeholder="Enter document title"
                  />
                </div>
                <div>
                  <label className="font-semibold text-sm">Category *</label>
                  <select name="category" className="w-full p-2 border rounded-lg mt-1" required>
                    <option value="personal">Personal Documents</option>
                    <option value="academic">Academic Records</option>
                    <option value="promotion">Promotion Letters</option>
                    <option value="others">Others</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-sm">File *</label>
                  <input
                    type="file"
                    name="file"
                    className="w-full p-2 border rounded-lg mt-1"
                    required
                  />
                  <p className="text-xs text-[#6b7a8a] mt-1">
                    Supported: PDF, Word, Excel, Images (Max: 10MB)
                  </p>
                </div>
              </div>
              <div className="flex gap-3 pt-4 mt-4 border-t border-[#e2e8f0]">
                <button
                  type="button"
                  onClick={() => setShowUploadForm(false)}
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="btn-primary flex-1 disabled:opacity-50"
                >
                  {uploading ? (
                    <span className="flex items-center justify-center gap-2">
                      <i className="fas fa-spinner fa-spin"></i> Uploading...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <i className="fas fa-upload"></i> Upload Document
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              selectedCategory === cat.value
                ? 'bg-[#0056A3] text-white'
                : 'bg-white border border-[#e2e8f0] hover:bg-[#f4f7fc]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Document List */}
      <div className="content-card">
        <div className="px-5 py-3 border-b border-[#e2e8f0] flex items-center justify-between">
          <h5 className="font-semibold flex items-center gap-2">
            <i className="fas fa-list text-[#0056A3]"></i> 
            {selectedCategory === 'all' ? 'All' : selectedCategory} Documents ({filteredDocuments.length})
          </h5>
          <span className="text-xs text-[#6b7a8a]">
            <i className="fas fa-download mr-1"></i> Click to download
          </span>
        </div>
        <div className="p-0">
          {filteredDocuments.length === 0 ? (
            <div className="p-8 text-center text-[#6b7a8a]">
              <i className="fas fa-folder-open text-4xl mb-3 block text-[#e2e8f0]"></i>
              <p>No documents found.</p>
              <p className="text-sm mt-1">Upload your first document using the button above.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f4f7fc]">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">File</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">Title</th>
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
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getCategoryBadge(doc.category)}`}>
                          {doc.category}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm">{doc.fileSize} KB</td>
                      <td className="px-4 py-2 text-sm text-[#6b7a8a]">
                        {new Date(doc.uploadedAt).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
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

      {/* Footer Info */}
      <div className="text-center text-xs text-[#6b7a8a] border-t border-[#e2e8f0] pt-4">
        <p>
          <i className="fas fa-shield-alt mr-1"></i>
          Your documents are private and only accessible to you and authorized HR personnel.
        </p>
      </div>
    </div>
  );
}