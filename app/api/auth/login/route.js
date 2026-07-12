import { NextResponse } from 'next/server';

// Full employee database with roles
const USERS = [
  // Super Admin - Full Access
  { 
    email: 'admin@nacca.gov.gh', 
    password: 'Admin@123', 
    name: 'System Administrator', 
    role: 'SUPER_ADMIN',
    staffId: 'NAC-IT-0001',
    department: 'ICT'
  },
  
  // Directors - Can see all but limited admin actions
  { 
    email: 'director@nacca.gov.gh', 
    password: 'Director@123', 
    name: 'Reginald George Quartey', 
    role: 'DIRECTOR',
    staffId: 'NAC-CD-0001',
    department: 'Curriculum'
  },
  { 
    email: 'hr@nacca.gov.gh', 
    password: 'Hr@123', 
    name: 'Elijah Intsiful', 
    role: 'DIRECTOR',
    staffId: 'NAC-HR-0001',
    department: 'Human Resource'
  },
  
  // Staff - Limited access
  { 
    email: 'staff@nacca.gov.gh', 
    password: 'Staff@123', 
    name: 'Genevieve Mensah', 
    role: 'STAFF',
    staffId: 'NAC-CD-0002',
    department: 'Curriculum'
  },
];

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const user = USERS.find(u => u.email === email && u.password === password);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
        staffId: user.staffId,
        department: user.department
      }
    });

    response.cookies.set('auth_user', JSON.stringify({
      email: user.email,
      name: user.name,
      role: user.role,
      staffId: user.staffId,
      department: user.department
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}