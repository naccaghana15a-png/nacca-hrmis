'use client';

import { useState, useEffect } from 'react';

export default function AnnouncementsPage() {
  const [user, setUser] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setUser(data.user);
          fetchAnnouncements();
        }
      })
      .catch(() => setLoading(false));
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/announcements');
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get('title');
    const content = formData.get('content');
    const category = formData.get('category');
    const priority = formData.get('priority');
    const file = formData.get('file');

    if (!title || !content) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      const newAnnouncement = {
        id: Date.now(),
        title,
        content,
        category: category || 'general',
        priority: priority || 'normal',
        author: user?.name || 'System Admin',
        authorRole: user?.role || 'ADMIN',
        authorAvatar: user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'SA',
        createdAt: new Date().toISOString(),
        readBy: [],
        file: file ? {
          name: file.name,
          size: (file.size / 1024).toFixed(1),
          type: file.type,
          url: URL.createObjectURL(file)
        } : null,
        likes: 0,
        comments: []
      };

      setAnnouncements(prev => [newAnnouncement, ...prev]);
      alert('✅ Announcement published successfully!');
      setShowCreateForm(false);
      e.target.reset();
    } catch (error) {
      alert('❌ Error creating announcement: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    alert('🗑️ Announcement deleted successfully!');
  };

  const handleLike = (id) => {
    setAnnouncements(prev => prev.map(a => 
      a.id === id ? { ...a, likes: (a.likes || 0) + 1 } : a
    ));
  };

  const handleDownload = (file) => {
    if (file?.url) {
      const a = document.createElement('a');
      a.href = file.url;
      a.download = file.name;
      a.click();
    }
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      'high': 'bg-red-500 text-white',
      'medium': 'bg-yellow-500 text-white',
      'normal': 'bg-blue-500 text-white',
    };
    return colors[priority] || colors['normal'];
  };

  const getPriorityIcon = (priority) => {
    const icons = {
      'high': 'fa-exclamation-circle',
      'medium': 'fa-exclamation-triangle',
      'normal': 'fa-info-circle',
    };
    return icons[priority] || icons['normal'];
  };

  const getCategoryBadge = (category) => {
    const colors = {
      'general': 'bg-purple-100 text-purple-800',
      'hr': 'bg-pink-100 text-pink-800',
      'policy': 'bg-blue-100 text-blue-800',
      'event': 'bg-green-100 text-green-800',
      'training': 'bg-orange-100 text-orange-800',
      'important': 'bg-red-100 text-red-800',
    };
    return colors[category] || colors['general'];
  };

  const getFileIcon = (fileType) => {
    if (fileType?.includes('pdf')) return 'fa-file-pdf text-red-500';
    if (fileType?.includes('image')) return 'fa-file-image text-purple-500';
    if (fileType?.includes('word')) return 'fa-file-word text-blue-500';
    if (fileType?.includes('excel')) return 'fa-file-excel text-green-500';
    if (fileType?.includes('powerpoint')) return 'fa-file-powerpoint text-orange-500';
    return 'fa-file text-gray-500';
  };

  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'DIRECTOR';

  const categories = [
    { value: 'all', label: '📢 All', color: 'bg-gray-200' },
    { value: 'general', label: '📋 General', color: 'bg-purple-100' },
    { value: 'hr', label: '👥 HR', color: 'bg-pink-100' },
    { value: 'policy', label: '📜 Policy', color: 'bg-blue-100' },
    { value: 'event', label: '🎉 Event', color: 'bg-green-100' },
    { value: 'training', label: '🎓 Training', color: 'bg-orange-100' },
    { value: 'important', label: '⚠️ Important', color: 'bg-red-100' },
  ];

  const filteredAnnouncements = announcements.filter(a => {
    const matchesSearch = a.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.author?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || a.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#e2e8f0] border-t-[#0056A3] rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-[#6b7a8a]">Loading announcements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ============================================================
      HERO BANNER
      ============================================================ */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0056A3] to-[#003d7a] p-8 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#F5A623] rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl">📢</span>
              <h5 className="font-bold text-2xl m-0">Announcements</h5>
              <span className="bg-[#F5A623] text-[#0056A3] text-xs font-bold px-3 py-1 rounded-full">
                {announcements.length} Updates
              </span>
            </div>
            <p className="text-blue-100 m-0 text-sm">
              Stay informed with the latest news from HR and Management
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2">
              <i className="fas fa-users text-[#F5A623]"></i>
              <span className="text-sm font-medium">{announcements.filter(a => a.readBy?.length > 0).length || 0} read</span>
            </div>
            {isAdmin && (
              <button 
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="bg-[#F5A623] text-[#0056A3] px-5 py-2.5 rounded-xl font-semibold hover:bg-[#f8c86a] transition-all hover:scale-105 flex items-center gap-2"
              >
                <i className="fas fa-plus"></i>
                <span>New Announcement</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================
      CREATE ANNOUNCEMENT FORM
      ============================================================ */}
      {showCreateForm && isAdmin && (
        <div className="content-card border-2 border-[#F5A623] shadow-lg animate-[fadeUp_0.3s_ease-out]">
          <div className="px-5 py-3 border-b border-[#e2e8f0] bg-gradient-to-r from-yellow-50 to-white flex items-center justify-between">
            <h5 className="font-semibold text-[#0056A3] flex items-center gap-2">
              <i className="fas fa-pen text-[#F5A623]"></i> 
              Create New Announcement
              <span className="text-xs text-[#6b7a8a] font-normal ml-2">Share important updates with all staff</span>
            </h5>
            <button onClick={() => setShowCreateForm(false)} className="text-[#6b7a8a] hover:text-[#1a2a3a] text-xl">
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="p-5">
            <form onSubmit={handleCreateAnnouncement}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="font-semibold text-sm">Announcement Title *</label>
                  <input
                    type="text"
                    name="title"
                    className="w-full p-2.5 border-2 border-[#e2e8f0] rounded-xl mt-1 focus:border-[#0056A3] focus:shadow-[0_0_0_4px_rgba(0,86,163,0.1)] transition outline-none"
                    placeholder="Enter a catchy title..."
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-sm">Category</label>
                  <select name="category" className="w-full p-2.5 border-2 border-[#e2e8f0] rounded-xl mt-1 focus:border-[#0056A3] outline-none">
                    <option value="general">📋 General</option>
                    <option value="hr">👥 HR</option>
                    <option value="policy">📜 Policy</option>
                    <option value="event">🎉 Event</option>
                    <option value="training">🎓 Training</option>
                    <option value="important">⚠️ Important</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-sm">Priority</label>
                  <select name="priority" className="w-full p-2.5 border-2 border-[#e2e8f0] rounded-xl mt-1 focus:border-[#0056A3] outline-none">
                    <option value="normal">🔵 Normal</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🔴 High</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="font-semibold text-sm">Content *</label>
                  <textarea
                    name="content"
                    className="w-full p-2.5 border-2 border-[#e2e8f0] rounded-xl mt-1 focus:border-[#0056A3] focus:shadow-[0_0_0_4px_rgba(0,86,163,0.1)] transition outline-none"
                    rows="4"
                    placeholder="Write your announcement details..."
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="font-semibold text-sm">Attach File (Optional)</label>
                  <div className="border-2 border-dashed border-[#e2e8f0] rounded-xl p-6 mt-1 text-center hover:border-[#0056A3] transition cursor-pointer">
                    <input type="file" name="file" className="hidden" id="fileInput" />
                    <label htmlFor="fileInput" className="cursor-pointer block">
                      <i className="fas fa-cloud-upload-alt text-3xl text-[#6b7a8a] mb-2 block"></i>
                      <p className="text-sm text-[#6b7a8a]">Click to upload or drag and drop</p>
                      <p className="text-xs text-[#94a3b8]">PDF, Images, Word, Excel (Max 10MB)</p>
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-4 mt-4 border-t border-[#e2e8f0]">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1 bg-[#F5A623] text-[#0056A3] hover:bg-[#f8c86a]">
                  <i className="fas fa-paper-plane mr-2"></i>Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
      FILTERS & SEARCH
      ============================================================ */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7a8a]"></i>
            <input
              type="text"
              placeholder="Search announcements..."
              className="w-full pl-10 p-2.5 border-2 border-[#e2e8f0] rounded-xl focus:border-[#0056A3] focus:shadow-[0_0_0_4px_rgba(0,86,163,0.1)] transition outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-1 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                selectedCategory === cat.value
                  ? 'bg-[#0056A3] text-white shadow-lg'
                  : 'bg-white border border-[#e2e8f0] hover:bg-[#f4f7fc]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ============================================================
      ANNOUNCEMENTS LIST
      ============================================================ */}
      {filteredAnnouncements.length === 0 ? (
        <div className="content-card p-12 text-center">
          <div className="text-6xl mb-4">📢</div>
          <h5 className="font-bold text-xl text-[#1a2a3a]">No Announcements Yet</h5>
          <p className="text-[#6b7a8a] text-sm mt-1">
            {isAdmin ? 'Be the first to share an update!' : 'Check back later for updates from HR and Management.'}
          </p>
          {isAdmin && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="mt-4 btn-primary bg-[#F5A623] text-[#0056A3] hover:bg-[#f8c86a]"
            >
              <i className="fas fa-plus mr-2"></i>Create Announcement
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAnnouncements.map((announcement, index) => (
            <div key={announcement.id} className="group content-card hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-[#0056A3] animate-[fadeUp_0.3s_ease-out]">
              <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0056A3] to-[#F5A623] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {announcement.authorAvatar || 'SA'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h5 className="font-bold text-lg m-0 truncate">{announcement.title}</h5>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1 ${getPriorityBadge(announcement.priority)}`}>
                          <i className={`fas ${getPriorityIcon(announcement.priority)} text-[10px]`}></i>
                          {announcement.priority}
                        </span>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full ${getCategoryBadge(announcement.category)}`}>
                          {announcement.category}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#6b7a8a]">
                        <span>
                          <i className="fas fa-user mr-1"></i>
                          {announcement.author}
                        </span>
                        <span>
                          <i className="fas fa-clock mr-1"></i>
                          {new Date(announcement.createdAt).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        {announcement.readBy?.length > 0 && (
                          <span>
                            <i className="fas fa-eye mr-1"></i>
                            {announcement.readBy.length} read
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(announcement.id)}
                      className="text-[#6b7a8a] hover:text-red-500 opacity-0 group-hover:opacity-100 transition p-1"
                      title="Delete"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  )}
                </div>

                {/* Content */}
                <div className="mt-3 ml-[60px]">
                  <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                    {announcement.content}
                  </p>

                  {/* Attachment */}
                  {announcement.file && (
                    <div className="mt-3 p-3 bg-[#f8fafc] rounded-xl border border-[#e2e8f0] flex items-center justify-between hover:bg-[#f1f5f9] transition cursor-pointer group/file" onClick={() => handleDownload(announcement.file)}>
                      <div className="flex items-center gap-3">
                        <i className={`fas ${getFileIcon(announcement.file.type)} text-2xl`}></i>
                        <div>
                          <p className="text-sm font-medium m-0">{announcement.file.name}</p>
                          <p className="text-xs text-[#6b7a8a] m-0">{announcement.file.size} KB</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#0056A3] font-medium opacity-0 group-hover/file:opacity-100 transition">
                          Download
                        </span>
                        <i className="fas fa-download text-[#0056A3]"></i>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-3 flex flex-wrap items-center gap-4">
                    <button
                      onClick={() => handleLike(announcement.id)}
                      className="flex items-center gap-1 text-[#6b7a8a] hover:text-[#0056A3] transition text-sm"
                    >
                      <i className="far fa-heart hover:fas transition"></i>
                      <span>{announcement.likes || 0}</span>
                    </button>
                    <button className="flex items-center gap-1 text-[#6b7a8a] hover:text-[#0056A3] transition text-sm">
                      <i className="far fa-comment"></i>
                      <span>{announcement.comments?.length || 0}</span>
                    </button>
                    <button className="flex items-center gap-1 text-[#6b7a8a] hover:text-[#0056A3] transition text-sm">
                      <i className="far fa-share-square"></i>
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ============================================================
      FOOTER
      ============================================================ */}
      <div className="text-center text-xs text-[#6b7a8a] border-t border-[#e2e8f0] pt-4 mt-4">
        <p>
          <i className="fas fa-bullhorn mr-1"></i>
          Stay informed with official announcements from NaCCA Management
          <span className="mx-2">•</span>
          <span className="text-[#0056A3]">{announcements.length} announcements</span>
        </p>
      </div>
    </div>
  );
}