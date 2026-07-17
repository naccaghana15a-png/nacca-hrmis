import db from './db.js';

export function getEmployee(email) {
  const stmt = db.prepare('SELECT * FROM employees WHERE email = ?');
  return stmt.get(email);
}

export function getAllEmployees() {
  const stmt = db.prepare('SELECT * FROM employees');
  return stmt.all();
}

export function saveEmployee(employee) {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO employees (
      email, name, role, staffId, department, isFirstLogin, 
      employmentStatus, password, passwordChangedAt, accountLocked, 
      failedAttempts, lockTime, lastLogin
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  return stmt.run(
    employee.email,
    employee.name,
    employee.role,
    employee.staffId,
    employee.department,
    employee.isFirstLogin ? 1 : 0,
    employee.employmentStatus || 'Active',
    employee.password,
    employee.passwordChangedAt,
    employee.accountLocked ? 1 : 0,
    employee.failedAttempts || 0,
    employee.lockTime,
    employee.lastLogin
  );
}

export function updateEmployeeName(email, newName) {
  const stmt = db.prepare('UPDATE employees SET name = ? WHERE email = ?');
  return stmt.run(newName, email);
}

export function deleteEmployee(email) {
  const stmt = db.prepare('DELETE FROM employees WHERE email = ?');
  return stmt.run(email);
}