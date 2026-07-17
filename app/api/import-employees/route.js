import { NextResponse } from 'next/server';
import { users } from '../../../lib/users';
import db from '../../../lib/db';

export async function GET() {
  try {
    let imported = 0;
    let skipped = 0;

    // Check if employees table exists
    try {
      const tableCheck = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='employees'").get();
      if (!tableCheck) {
        // Create table if it doesn't exist
        db.exec(`
          CREATE TABLE IF NOT EXISTS employees (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            name TEXT,
            role TEXT,
            staffId TEXT,
            department TEXT,
            isFirstLogin INTEGER DEFAULT 1,
            employmentStatus TEXT DEFAULT 'Active',
            password TEXT,
            passwordChangedAt TEXT,
            accountLocked INTEGER DEFAULT 0,
            failedAttempts INTEGER DEFAULT 0,
            lockTime INTEGER,
            lastLogin TEXT
          )
        `);
      }
    } catch (err) {
      console.log('Table check error:', err.message);
    }

    // Get existing employees in database
    let existingEmails = [];
    try {
      const existing = db.prepare('SELECT email FROM employees').all();
      existingEmails = existing.map(e => e.email);
    } catch (err) {
      console.log('Error getting existing employees:', err.message);
    }

    // Import each user from memory to database
    for (const [email, user] of Object.entries(users)) {
      if (existingEmails.includes(email)) {
        skipped++;
        continue;
      }

      try {
        const stmt = db.prepare(`
          INSERT INTO employees (
            email, name, role, staffId, department, isFirstLogin,
            employmentStatus, password, passwordChangedAt, accountLocked,
            failedAttempts, lockTime, lastLogin
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(
          email,
          user.name || 'Unknown',
          user.role || 'STAFF',
          user.staffId || '',
          user.department || 'N/A',
          user.isFirstLogin ? 1 : 0,
          user.employmentStatus || 'Active',
          user.password || null,
          user.passwordChangedAt || null,
          user.accountLocked ? 1 : 0,
          user.failedAttempts || 0,
          user.lockTime || null,
          user.lastLogin || null
        );
        imported++;
      } catch (err) {
        console.log('Error importing:', email, err.message);
      }
    }

    // Get final count
    let count = { count: 0 };
    try {
      count = db.prepare('SELECT COUNT(*) as count FROM employees').get();
    } catch (err) {
      console.log('Error getting count:', err.message);
    }

    return NextResponse.json({
      success: true,
      message: 'Employees imported successfully!',
      imported: imported,
      skipped: skipped,
      totalInDatabase: count.count,
      totalInMemory: Object.keys(users).length,
      tableExists: true
    });
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}