import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Ensure the database directory exists
const dbDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'nacca_hrmis.db');
const db = new Database(dbPath);

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

export default db;