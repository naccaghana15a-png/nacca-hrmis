import { NextResponse } from 'next/server';
import { users, tempPasswords, getAllEmployees } from '../../../lib/users';
import db from '../../../lib/db';

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
    let employees = [];
    let dbWorking = false;
    
    // Try to get from database
    try {
      const stmt = db.prepare('SELECT * FROM employees');
      const dbEmployees = stmt.all();
      
      if (dbEmployees && dbEmployees.length > 0) {
        employees = dbEmployees.map(emp => ({
          id: emp.id,
          staffId: emp.staffId || `NAC-${String(emp.id).padStart(4, '0')}`,
          name: emp.name || 'Unknown',
          position: emp.role || 'Staff',
          department: emp.department || 'N/A',
          email: emp.email,
          status: emp.isFirstLogin ? 'Pending' : 'Active',
          joinDate: emp.passwordChangedAt || new Date().toISOString().split('T')[0]
        }));
        dbWorking = true;
        console.log('📊 Employees from database:', employees.length);
      }
    } catch (dbError) {
      console.log('Database error, using memory:', dbError.message);
    }

    // If database is empty or failed, use memory
    if (employees.length === 0) {
      const memoryEmployees = getAllEmployees();
      // Filter out SUPER_ADMIN
      employees = memoryEmployees.filter(emp => emp.role !== 'SUPER_ADMIN');
      console.log('📊 Employees from memory:', employees.length);
    }

    return NextResponse.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    // Ultimate fallback
    try {
      const memoryEmployees = getAllEmployees();
      const filtered = memoryEmployees.filter(emp => emp.role !== 'SUPER_ADMIN');
      return NextResponse.json(filtered);
    } catch (fallbackError) {
      return NextResponse.json(
        { error: 'Failed to fetch employees' },
        { status: 500 }
      );
    }
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

    if (!email.includes('@') || !email.includes('.')) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (users[email]) {
      return NextResponse.json(
        { error: 'Employee with this email already exists' },
        { status: 400 }
      );
    }

    const newStaffId = `NAC-${String(Object.keys(users).length + 1).padStart(4, '0')}`;
    const tempPassword = generateTempPassword();

    // Create user in memory
    users[email] = {
      password: null,
      name: name,
      role: position || 'STAFF',
      staffId: newStaffId,
      department: department || 'N/A',
      isFirstLogin: true,
      employmentStatus: status || 'Active',
      passwordChangedAt: null,
      passwordHistory: [],
      accountLocked: false,
      failedAttempts: 0,
      lockTime: null,
      lastLogin: null
    };

    tempPasswords[email] = tempPassword;

    // Try to save to database
    try {
      const stmt = db.prepare(`
        INSERT OR REPLACE INTO employees (
          email, name, role, staffId, department, isFirstLogin,
          employmentStatus, password, passwordChangedAt, accountLocked,
          failedAttempts, lockTime, lastLogin
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run(
        email,
        name,
        position || 'STAFF',
        newStaffId,
        department || 'N/A',
        1,
        status || 'Active',
        null,
        null,
        0,
        0,
        null,
        null
      );
      console.log('✅ Employee saved to database:', email);
    } catch (dbError) {
      console.log('⚠️ Could not save to database:', dbError.message);
    }

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

    // Update in-memory
    if (name) users[email].name = name;
    if (department) users[email].department = department;
    if (position) users[email].role = position;

    // Try to update in database
    try {
      let updateQuery = 'UPDATE employees SET ';
      const params = [];
      
      if (name) {
        updateQuery += 'name = ?, ';
        params.push(name);
      }
      if (department) {
        updateQuery += 'department = ?, ';
        params.push(department);
      }
      if (position) {
        updateQuery += 'role = ?, ';
        params.push(position);
      }
      
      updateQuery = updateQuery.slice(0, -2);
      updateQuery += ' WHERE email = ?';
      params.push(email);
      
      const stmt = db.prepare(updateQuery);
      stmt.run(...params);
      console.log('✅ Employee updated in database:', email);
    } catch (dbError) {
      console.log('⚠️ Could not update database:', dbError.message);
    }

    return NextResponse.json({
      success: true,
      message: 'Employee updated successfully',
      user: users[email]
    });

  } catch (error) {
    console.error('Error updating employee:', error);
    return NextResponse.json(
      { error: 'Failed to update employee: ' + error.message },
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

    try {
      const stmt = db.prepare('DELETE FROM employees WHERE email = ?');
      stmt.run(email);
      console.log('✅ Employee deleted from database:', email);
    } catch (dbError) {
      console.log('⚠️ Could not delete from database:', dbError.message);
    }

    return NextResponse.json({
      success: true,
      message: 'Employee deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting employee:', error);
    return NextResponse.json(
      { error: 'Failed to delete employee: ' + error.message },
      { status: 500 }
    );
  }
}