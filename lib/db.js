import Database from 'better-sqlite3';
import path from 'path';

// Use a simpler path that works on Vercel
const dbPath = path.join(process.cwd(), 'data', 'nacca_hrmis.db');

// Create database with error handling
let db;
try {
  db = new Database(dbPath);
  
  // Create tables if they don't exist
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
  
  console.log('✅ Database initialized at:', dbPath);
} catch (error) {
  console.error('❌ Database initialization failed:', error.message);
  // Create a fallback in-memory database
  db = new Database(':memory:');
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
  console.log('✅ Using in-memory database as fallback');
}

export default db;