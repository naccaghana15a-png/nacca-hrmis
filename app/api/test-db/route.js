import { NextResponse } from 'next/server';
import db from '../../../lib/db';

export async function GET() {
  try {
    // Test if database is connected
    const test = db.prepare('SELECT 1 as test').get();
    
    // Get count of employees
    const count = db.prepare('SELECT COUNT(*) as count FROM employees').get();
    
    return NextResponse.json({
      success: true,
      message: 'Database is working!',
      test: test,
      employeeCount: count.count,
      dbPath: 'nacca_hrmis.db'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}