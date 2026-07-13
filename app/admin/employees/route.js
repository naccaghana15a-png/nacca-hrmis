import { NextResponse } from 'next/server';
import { users, tempPasswords } from '../../../lib/users';

// GET all employees
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

// POST - Add new employee
export async function POST(request) {
  try {
    const body = await request.json();
    const { email, name, staffId, department, position, status, joinDate } = body;

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
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

    // Generate staff ID if not provided
    const newStaffId = staffId || `NAC-${String(Object.keys(users).length + 1).padStart(4, '0')}`;
    
    // Generate temporary password
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
    console.error('Error adding employee:', error);
    return NextResponse.json(
      { error: 'Failed to add employee' },
      { status: 500 }
    );
  }
}

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