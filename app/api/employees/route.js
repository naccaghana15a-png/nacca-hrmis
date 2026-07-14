import { NextResponse } from 'next/server';
import { users, tempPasswords, createStaffAccount } from '../../../lib/users';

// ============================================================
// 📧 EMAIL FUNCTION (Logs to console for now)
// ============================================================
function sendPasswordEmail(email, name, tempPassword) {
  // This will appear in your Vercel logs or terminal
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                    📧 PASSWORD EMAIL                        ║
╠══════════════════════════════════════════════════════════════╣
║ To: ${email.padEnd(50)}║
║ From: noreply@nacca.gov.gh                                  ║
║ Subject: Your NaCCA HRMIS Account Credentials              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║ Dear ${name},                                               ║
║                                                              ║
║ Your account has been created successfully.                  ║
║                                                              ║
║ 🔑 Temporary Password: ${tempPassword}                      ║
║                                                              ║
║ IMPORTANT: Please login with this temporary password        ║
║ and change it immediately.                                  ║
║                                                              ║
║ Login URL: https://nacca-hrmis.vercel.app                   ║
║                                                              ║
║ If you have any issues, please contact HR.                  ║
║                                                              ║
║ Regards,                                                     ║
║ NaCCA HRMIS System                                           ║
╚══════════════════════════════════════════════════════════════╝
  `);
  
  // ✅ In production, replace this with actual email sending:
  // Example using nodemailer, SendGrid, AWS SES, etc.
  /*
  const transporter = nodemailer.createTransport({
    host: 'smtp.nacca.gov.gh',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  
  await transporter.sendMail({
    from: 'noreply@nacca.gov.gh',
    to: email,
    subject: 'Your NaCCA HRMIS Account Credentials',
    html: `
      <h2>Welcome to NaCCA HRMIS!</h2>
      <p>Dear ${name},</p>
      <p>Your account has been created successfully.</p>
      <p><strong>Temporary Password:</strong> ${tempPassword}</p>
      <p><strong>IMPORTANT:</strong> Please login and change your password immediately.</p>
      <p><a href="https://nacca-hrmis.vercel.app">Login Here</a></p>
      <p>Regards,<br>NaCCA HRMIS System</p>
    `
  });
  */
  
  return true;
}

// ============================================================
// 📝 CREATE ACCOUNT API
// ============================================================
// POST - Add new employee
export async function POST(request) {
  try {
    const body = await request.json();
    console.log('📝 Received body:', body);

    const { email, name, department, position, status, joinDate } = body;

    // Validate required fields
    const errors = [];
    if (!email) errors.push('Email is required');
    if (!name) errors.push('Name is required');
    if (!department) errors.push('Department is required');
    if (!position) errors.push('Position is required');

    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Missing required fields: ' + errors.join(', ') },
        { status: 400 }
      );
    }

    // Validate email format
    if (!email.includes('@') || !email.includes('.')) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if user already exists
    if (users[email]) {
      return NextResponse.json(
        { error: 'Employee with this email already exists' },
        { status: 400 }
      );
    }

    import { NextResponse } from 'next/server';
import { users, tempPasswords } from '../../../lib/users';

// ============================================================
// 🔑 GENERATE TEMPORARY PASSWORD
// ============================================================
function generateTempPassword() {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*()';
  
  let password = '';
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];
  
  const all = uppercase + lowercase + numbers + special;
  for (let i = password.length; i < 10; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }
  
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

// ============================================================
// 📊 GET - Fetch all employees
// ============================================================
export async function GET() {
  try {
    const employees = Object.entries(users).map(([email, user], index) => ({
      id: index + 1,
      staffId: user.staffId || `NAC-${String(index + 1).padStart(4, '0')}`,
      name: user.name || 'Unknown',
      position: user.role || 'Staff',
      department: user.department || 'N/A',
      email: email,
      status: user.isFirstLogin ? 'Pending' : 'Active',
      joinDate: user.passwordChangedAt || new Date().toISOString().split('T')[0]
    }));

    return NextResponse.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
      { status: 500 }
    );
  }
}

// ============================================================
// 📝 POST - Add new employee
// ============================================================
export async function POST(request) {
  try {
    const body = await request.json();
    console.log('📝 Received body:', body);

    const { email, name, department, position, status, joinDate } = body;

    // Validate required fields
    const errors = [];
    if (!email) errors.push('Email is required');
    if (!name) errors.push('Name is required');
    if (!department) errors.push('Department is required');
    if (!position) errors.push('Position is required');

    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Missing required fields: ' + errors.join(', ') },
        { status: 400 }
      );
    }

    // Validate email format
    if (!email.includes('@') || !email.includes('.')) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if user already exists
    if (users[email]) {
      return NextResponse.json(
        { error: 'Employee with this email already exists' },
        { status: 400 }
      );
    }

    // Generate staff ID
    const newStaffId = `NAC-${String(Object.keys(users).length + 1).padStart(4, '0')}`;
    const tempPassword = generateTempPassword();

    // Create user
    users[email] = {
      password: null,
      name: name,
      role: position || 'STAFF',
      staffId: newStaffId,
      department: department || 'N/A',
      isFirstLogin: true,
      passwordChangedAt: null,
      passwordHistory: [],
      accountLocked: false,
      failedAttempts: 0,
      lastLogin: null
    };

    tempPasswords[email] = tempPassword;

    console.log('✅ Employee added:', { email, name, newStaffId });

    return NextResponse.json({
      success: true,
      message: 'Employee added successfully',
      tempPassword: tempPassword,
      employee: {
        email,
        name,
        staffId: newStaffId,
        department: department || 'N/A',
        position: position || 'STAFF',
        status: status || 'Active',
        joinDate: joinDate || new Date().toISOString().split('T')[0]
      }
    });

  } catch (error) {
    console.error('❌ Error adding employee:', error);
    return NextResponse.json(
      { error: 'Failed to add employee: ' + error.message },
      { status: 500 }
    );
  }
}

// ============================================================
// ✏️ PUT - Update employee
// ============================================================
export async function PUT(request) {
  try {
    const body = await request.json();
    const { email, name, department, position } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!users[email]) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    // Update user data
    if (name) users[email].name = name;
    if (department) users[email].department = department;
    if (position) users[email].role = position;

    return NextResponse.json({
      success: true,
      message: 'Employee updated successfully',
      user: users[email]
    });

  } catch (error) {
    console.error('Error updating employee:', error);
    return NextResponse.json(
      { error: 'Failed to update employee' },
      { status: 500 }
    );
  }
}

// ============================================================
// 🗑️ DELETE - Delete employee
// ============================================================
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!users[email]) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    delete users[email];
    delete tempPasswords[email];

    return NextResponse.json({
      success: true,
      message: 'Employee deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting employee:', error);
    return NextResponse.json(
      { error: 'Failed to delete employee' },
      { status: 500 }
    );
  }
}