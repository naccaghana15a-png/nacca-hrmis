import { NextResponse } from 'next/server';

// In-memory storage (replace with database)
let announcements = [
  {
    id: 1,
    title: 'Welcome to NaCCA HRMIS',
    content: 'We are pleased to announce the launch of the new Human Resource Management Information System (HRMIS). This platform will streamline HR processes and improve communication across all directorates.',
    category: 'general',
    priority: 'high',
    author: 'System Administrator',
    authorRole: 'SUPER_ADMIN',
    authorAvatar: 'SA',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    readBy: ['admin@nacca.gov.gh'],
    file: null,
    likes: 12,
    comments: [
      { id: 1, user: 'Elijah Intsiful', text: 'Great initiative!', timestamp: new Date(Date.now() - 3600000).toISOString() }
    ]
  },
  {
    id: 2,
    title: '2026 Performance Review Cycle',
    content: 'The annual performance review cycle for 2026 will commence on August 1st. All staff are required to complete their self-assessments by August 15th. Department heads will conduct reviews by August 31st.',
    category: 'hr',
    priority: 'medium',
    author: 'Elijah Intsiful',
    authorRole: 'DIRECTOR',
    authorAvatar: 'EI',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    readBy: [],
    file: null,
    likes: 8,
    comments: []
  }
];

export async function GET() {
  try {
    return NextResponse.json(announcements);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch announcements' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, content, category, priority, author, authorRole, authorAvatar, file } = body;

    const newAnnouncement = {
      id: Date.now(),
      title,
      content,
      category: category || 'general',
      priority: priority || 'normal',
      author: author || 'System Admin',
      authorRole: authorRole || 'ADMIN',
      authorAvatar: authorAvatar || 'SA',
      createdAt: new Date().toISOString(),
      readBy: [],
      file: file || null,
      likes: 0,
      comments: []
    };

    announcements.unshift(newAnnouncement);
    return NextResponse.json({ success: true, announcement: newAnnouncement });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create announcement' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Announcement ID is required' },
        { status: 400 }
      );
    }

    announcements = announcements.filter(a => a.id !== parseInt(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete announcement' },
      { status: 500 }
    );
  }
}