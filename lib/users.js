// lib/users.js - User database with temporary passwords

// Store all users
export const users = {};

// Store temporary passwords (for first-time login)
export const tempPasswords = {};

// Initialize with demo users and all employees
export function initDemoUsers() {
  console.log('🔄 Initializing users...');

  // ============================================================
  // SUPER ADMIN
  // ============================================================
  users['admin@nacca.gov.gh'] = {
    password: 'Admin@123',
    name: 'System Administrator',
    role: 'SUPER_ADMIN',
    staffId: 'NAC-IT-0001',
    department: 'ICT',
    isFirstLogin: false,
    passwordChangedAt: '2026-01-01 00:00:00',
    passwordHistory: [],
    accountLocked: false,
    failedAttempts: 0,
    lastLogin: '2026-07-12 10:00:00'
  };

  // ============================================================
  // DIRECTORS
  // ============================================================
  users['director@nacca.gov.gh'] = {
    password: 'Director@123',
    name: 'Reginald George Quartey',
    role: 'DIRECTOR',
    staffId: 'NAC-CD-0001',
    department: 'Curriculum',
    isFirstLogin: false,
    passwordChangedAt: '2026-06-15 09:00:00',
    passwordHistory: [],
    accountLocked: false,
    failedAttempts: 0,
    lastLogin: '2026-07-11 14:30:00'
  };

  users['hr@nacca.gov.gh'] = {
    password: 'Hr@123',
    name: 'Elijah Intsiful',
    role: 'DIRECTOR',
    staffId: 'NAC-HR-0001',
    department: 'Human Resource',
    isFirstLogin: false,
    passwordChangedAt: '2026-07-01 09:00:00',
    passwordHistory: [],
    accountLocked: false,
    failedAttempts: 0,
    lastLogin: '2026-07-11 16:00:00'
  };

  // ============================================================
  // DEMO STAFF (First Login Enabled)
  // ============================================================
  users['staff@nacca.gov.gh'] = {
    password: null,
    name: 'Genevieve Mensah',
    role: 'STAFF',
    staffId: 'NAC-CD-0002',
    department: 'Curriculum',
    isFirstLogin: true,
    passwordChangedAt: null,
    passwordHistory: [],
    accountLocked: false,
    failedAttempts: 0,
    lastLogin: null
  };
  tempPasswords['staff@nacca.gov.gh'] = 'Temp@2026';

  // ============================================================
// ALL NACCA STAFF EMPLOYEES WITH CORRECT ROLES
// ============================================================
const allEmployees = [
  // ============================================================
  // DIRECTOR-GENERAL
  // ============================================================
  { email: 'samuel.bekoe@nacca.gov.gh', name: 'PROF. SAMUEL OFORI BEKOE', staffId: 'NAC-EX-0001', department: 'Executive', role: 'DIRECTOR_GENERAL' },
  
  // ============================================================
  // DEPUTY DIRECTOR-GENERALS
  // ============================================================
  { email: 'matthew.owusu@nacca.gov.gh', name: 'MATTHEW OWUSU', staffId: 'NAC-EX-0002', department: 'Executive', role: 'DEPUTY_DIRECTOR_GENERAL' },
  { email: 'eric.amoah@nacca.gov.gh', name: 'ERIC AMOAH', staffId: 'NAC-EX-0003', department: 'Executive', role: 'DEPUTY_DIRECTOR_GENERAL' },
  
  // ============================================================
  // DIRECTORS
  // ============================================================
  { email: 'anthony.sarpong@nacca.gov.gh', name: 'ANTHONY SARPONG', staffId: 'NAC-AS-0001', department: 'Assessment', role: 'DIRECTOR' },
  { email: 'anita.collison@nacca.gov.gh', name: 'ANITA FRANCES CORDEI COLLISON', staffId: 'NAC-AS-0002', department: 'Assessment', role: 'DIRECTOR' },
  { email: 'reginald.quartey@nacca.gov.gh', name: 'REGINALD GEORGE QUARTEY', staffId: 'NAC-CD-0001', department: 'Curriculum', role: 'DIRECTOR' },
  { email: 'mercy.nyamekye@nacca.gov.gh', name: 'DR. MERCY NYAMEKYE', staffId: 'NAC-RS-0001', department: 'Research', role: 'DIRECTOR' },
  { email: 'joana.vanderpuje@nacca.gov.gh', name: 'JOANA VANDERPUJE', staffId: 'NAC-IR-0001', department: 'Instructional Resources', role: 'DIRECTOR' },
  { email: 'elijah.intsiful@nacca.gov.gh', name: 'ELIJAH INTSIFUL', staffId: 'NAC-HR-0001', department: 'Human Resource', role: 'DIRECTOR' },
  { email: 'rebecca.gariba@nacca.gov.gh', name: 'REBECCA ABU GARIBA', staffId: 'NAC-CA-0001', department: 'Corporate Affairs', role: 'DIRECTOR' },
  
  // ============================================================
  // STAFF (All remaining employees)
  // ============================================================
  { email: 'joachim.honu@nacca.gov.gh', name: 'JOACHIM KWAME SEYRAM HONU', staffId: 'NAC-AS-0003', department: 'Assessment', role: 'STAFF' },
  { email: 'david.arhin@nacca.gov.gh', name: 'DAVID ARHIN', staffId: 'NAC-AS-0004', department: 'Assessment', role: 'STAFF' },
  { email: 'richard.teye@nacca.gov.gh', name: 'RICHARD TEYE', staffId: 'NAC-AS-0005', department: 'Assessment', role: 'STAFF' },
  { email: 'jephtar.adumensah@nacca.gov.gh', name: 'JEPHTAR ADU-MENSAH', staffId: 'NAC-AS-0006', department: 'Assessment', role: 'STAFF' },
  { email: 'nancy.gyapong@nacca.gov.gh', name: 'NANCY ASIEDUWAA GYAPONG', staffId: 'NAC-AS-0007', department: 'Assessment', role: 'STAFF' },
  { email: 'bridget.anku@nacca.gov.gh', name: 'BRIDGET AKU ANKU', staffId: 'NAC-AS-0008', department: 'Assessment', role: 'STAFF' },
  { email: 'genevieve.mensah@nacca.gov.gh', name: 'GENEVIEVE MENSAH', staffId: 'NAC-CD-0002', department: 'Curriculum', role: 'STAFF' },
  { email: 'thomas.osei@nacca.gov.gh', name: 'THOMAS KUMAH OSEI', staffId: 'NAC-CD-0003', department: 'Curriculum', role: 'STAFF' },
  { email: 'godfred.mireku@nacca.gov.gh', name: 'GODFRED ASIEDU MIREKU', staffId: 'NAC-CD-0004', department: 'Curriculum', role: 'STAFF' },
  { email: 'nii.tagoe@nacca.gov.gh', name: 'NII BOYE TAGOE', staffId: 'NAC-CD-0006', department: 'Curriculum', role: 'STAFF' },
  { email: 'owusu.ansah@nacca.gov.gh', name: 'OWUSU ANSAH SAMUEL', staffId: 'NAC-CD-0007', department: 'Curriculum', role: 'STAFF' },
  { email: 'sullivan.ayuuba@nacca.gov.gh', name: 'SULLIVAN AKUDAGO AYUUBA', staffId: 'NAC-CD-0008', department: 'Curriculum', role: 'STAFF' },
  { email: 'juliet.ansah@nacca.gov.gh', name: 'JULIET OWUSU ANSAH', staffId: 'NAC-CD-0009', department: 'Curriculum', role: 'STAFF' },
  { email: 'stephen.acquah@nacca.gov.gh', name: 'STEPHEN ACQUAH', staffId: 'NAC-CD-0010', department: 'Curriculum', role: 'STAFF' },
  { email: 'godwin.senanu@nacca.gov.gh', name: 'GODWIN M.K SENANU', staffId: 'NAC-CD-0011', department: 'Curriculum', role: 'STAFF' },
  { email: 'abigail.birago@nacca.gov.gh', name: 'ABIGAIL OWUSU BIRAGO', staffId: 'NAC-RS-0002', department: 'Research', role: 'STAFF' },
  { email: 'francis.agbalenyo@nacca.gov.gh', name: 'FRANCIS AGBALENYO', staffId: 'NAC-RS-0003', department: 'Research', role: 'STAFF' },
  { email: 'abigail.oduro@nacca.gov.gh', name: 'ABIGAIL OWUSU ODURO', staffId: 'NAC-RS-0004', department: 'Research', role: 'STAFF' },
  { email: 'kenneth.wontumi@nacca.gov.gh', name: 'KENNETH WONTUMI', staffId: 'NAC-IR-0002', department: 'Instructional Resources', role: 'STAFF' },
  { email: 'joseph.barwuah@nacca.gov.gh', name: 'JOSEPH BARWUAH', staffId: 'NAC-IR-0003', department: 'Instructional Resources', role: 'STAFF' },
  { email: 'sharon.yelbert@nacca.gov.gh', name: 'SHARON EFUA YELBERT', staffId: 'NAC-IR-0004', department: 'Instructional Resources', role: 'STAFF' },
  { email: 'dennis.adjasi@nacca.gov.gh', name: 'DENNIS ADJASI', staffId: 'NAC-IR-0005', department: 'Instructional Resources', role: 'STAFF' },
  { email: 'seth.nartey@nacca.gov.gh', name: 'SETH NII NARTEY', staffId: 'NAC-CA-0002', department: 'Corporate Affairs', role: 'STAFF' },
  { email: 'ogyampo.amankwa@nacca.gov.gh', name: 'OGYAMPO SAMUEL AMANKWA', staffId: 'NAC-CA-0003', department: 'Corporate Affairs', role: 'STAFF' },
  { email: 'alice.kuramah@nacca.gov.gh', name: 'ALICE KURAMAH', staffId: 'NAC-CA-0004', department: 'Corporate Affairs', role: 'STAFF' },
  { email: 'gladys.tseh@nacca.gov.gh', name: 'GLADYS GRATIAS TSEH', staffId: 'NAC-AD-0001', department: 'Administration', role: 'STAFF' },
  { email: 'enock.tetteh@nacca.gov.gh', name: 'ENOCK ANNER TETTEH', staffId: 'NAC-AD-0002', department: 'Administration', role: 'STAFF' },
  { email: 'albert.adjei@nacca.gov.gh', name: 'ALBERT ADJEI', staffId: 'NAC-AD-0003', department: 'Administration', role: 'STAFF' },
  { email: 'sampson.anim@nacca.gov.gh', name: 'SAMPSON ANIM', staffId: 'NAC-AD-0004', department: 'Administration', role: 'STAFF' },
  { email: 'mary.azumah@nacca.gov.gh', name: 'MARY Y. AZUMAH', staffId: 'NAC-AD-0005', department: 'Administration', role: 'STAFF' },
  { email: 'mavis.bonsu@nacca.gov.gh', name: 'MAVIS AMA BONSU', staffId: 'NAC-AD-0006', department: 'Administration', role: 'STAFF' },
  { email: 'miriam.sackey@nacca.gov.gh', name: 'MIRIAM BONYAKIE SACKEY', staffId: 'NAC-AD-0007', department: 'Administration', role: 'STAFF' },
  { email: 'dorcas.acheampong@nacca.gov.gh', name: 'DORCAS ACHEAMPONG', staffId: 'NAC-AD-0008', department: 'Administration', role: 'STAFF' },
  { email: 'justice.buabeng@nacca.gov.gh', name: 'JUSTICE BUABENG', staffId: 'NAC-AD-0009', department: 'Administration', role: 'STAFF' },
  { email: 'daniel.adjei@nacca.gov.gh', name: 'DANIEL ADJEI', staffId: 'NAC-AD-0010', department: 'Administration', role: 'STAFF' },
  { email: 'philip.lartey@nacca.gov.gh', name: 'LARTEY PHILIP NII BOYE', staffId: 'NAC-AD-0011', department: 'Administration', role: 'STAFF' },
  { email: 'george.anertey@nacca.gov.gh', name: 'GEORGE ABBEY ANERTEY', staffId: 'NAC-AD-0012', department: 'Administration', role: 'STAFF' },
  { email: 'prince.ankumah@nacca.gov.gh', name: 'PRINCE ANKUMAH', staffId: 'NAC-AD-0013', department: 'Administration', role: 'STAFF' },
  { email: 'fred.asante@nacca.gov.gh', name: 'FRED ASANTE', staffId: 'NAC-AD-0014', department: 'Administration', role: 'STAFF' },
  { email: 'bernard.baidoo@nacca.gov.gh', name: 'BERNARD BAIDOO', staffId: 'NAC-AD-0015', department: 'Administration', role: 'STAFF' },
  { email: 'ebenezer.amoako@nacca.gov.gh', name: 'EBENEZER AMOAKO', staffId: 'NAC-AD-0016', department: 'Administration', role: 'STAFF' },
  { email: 'alex.amponsah@nacca.gov.gh', name: 'ALEX AMPONSAH', staffId: 'NAC-AD-0017', department: 'Administration', role: 'STAFF' },
  { email: 'seraphine.mantey@nacca.gov.gh', name: 'SERAPHINE MANTEY', staffId: 'NAC-AD-0018', department: 'Administration', role: 'STAFF' },
  { email: 'michael.kwaku@nacca.gov.gh', name: 'MICHAEL KWAKU', staffId: 'NAC-AD-0019', department: 'Administration', role: 'STAFF' },
  { email: 'nana.yeboah@nacca.gov.gh', name: 'NANA OPOKU YEBOAH', staffId: 'NAC-PR-0001', department: 'Procurement', role: 'STAFF' },
  { email: 'richard.owusu@nacca.gov.gh', name: 'RICHARD OWUSU', staffId: 'NAC-PR-0002', department: 'Procurement', role: 'STAFF' },
  { email: 'charity.nyewan@nacca.gov.gh', name: 'CHARITY NYEWAN', staffId: 'NAC-PR-0003', department: 'Procurement', role: 'STAFF' },
  { email: 'prince.boateng@nacca.gov.gh', name: 'PRINCE OWUSU BOATENG', staffId: 'NAC-FN-0001', department: 'Finance', role: 'STAFF' },
  { email: 'abednego.adomako@nacca.gov.gh', name: 'ABEDNEGO ADJINAH ADOMAKO', staffId: 'NAC-FN-0002', department: 'Finance', role: 'STAFF' },
  { email: 'isaac.appoh@nacca.gov.gh', name: 'ISAAC APPOH', staffId: 'NAC-IA-0001', department: 'Internal Audit', role: 'STAFF' },
  { email: 'dzineku.senanu@nacca.gov.gh', name: 'DZINEKU LAWRENCE SENANU', staffId: 'NAC-IT-0001', department: 'ICT', role: 'STAFF' },
];

  // Add all employees to users object
  allEmployees.forEach((emp) => {
  if (!users[emp.email]) {
    users[emp.email] = {
      password: null,
      name: emp.name,
      role: emp.role || 'STAFF',
      staffId: emp.staffId,
      department: emp.department,
      isFirstLogin: true,
      passwordChangedAt: null,
      passwordHistory: [],
      accountLocked: false,
      failedAttempts: 0,
      lastLogin: null
    };
    tempPasswords[emp.email] = 'Temp@2026';
  }
});

  console.log(`✅ Users initialized: ${Object.keys(users).length} users loaded`);
}

// ============================================================
// 📝 CRUD FUNCTIONS FOR EMPLOYEES
// ============================================================

// Get all employees as array - Excluding SUPER_ADMIN, sorted by hierarchy
export function getAllEmployees() {
  // Filter out SUPER_ADMIN role
  const employees = Object.entries(users)
    .filter(([email, user]) => user.role !== 'SUPER_ADMIN')
    .map(([email, user], index) => ({
      id: index + 1,
      staffId: user.staffId || `NAC-${String(index + 1).padStart(4, '0')}`,
      name: user.name || 'Unknown',
      position: user.role || 'Staff',
      department: user.department || 'N/A',
      email: email,
      status: user.isFirstLogin ? 'Pending' : 'Active',
      joinDate: user.passwordChangedAt || new Date().toISOString().split('T')[0],
      role: user.role || 'STAFF'
    }));

  // Define role priority (lower number = higher priority)
  const rolePriority = {
    'DIRECTOR_GENERAL': 1,
    'DEPUTY_DIRECTOR_GENERAL': 2,
    'DIRECTOR': 3,
    'STAFF': 4
  };

  // Sort by role priority first, then by name
  return employees.sort((a, b) => {
    const aPriority = rolePriority[a.role] || 99;
    const bPriority = rolePriority[b.role] || 99;
    
    if (aPriority !== bPriority) return aPriority - bPriority;
    return a.name.localeCompare(b.name);
  });
}

// Update employee by email
export function updateEmployee(email, updatedData) {
  if (!users[email]) {
    return { success: false, error: 'Employee not found' };
  }

  // Update user data
  if (updatedData.name) users[email].name = updatedData.name;
  if (updatedData.department) users[email].department = updatedData.department;
  if (updatedData.position) users[email].role = updatedData.position;

  return { success: true, user: users[email] };
}

// Delete employee by email
export function deleteEmployee(email) {
  if (!users[email]) {
    return { success: false, error: 'Employee not found' };
  }

  delete users[email];
  delete tempPasswords[email];
  return { success: true };
}

// Function to create a new staff account
export function createStaffAccount(email, name, staffId, department, role = 'STAFF') {
  // Check if user already has a REAL password (not null)
  if (users[email] && users[email].password !== null) {
    return { success: false, error: 'User already has an account with a password' };
  }

  // Generate a NEW temporary password
  const tempPassword = generateTempPassword();

  // If user exists but has no password (isFirstLogin), update them
  if (users[email] && users[email].password === null) {
    // Update existing user
    users[email].name = name;
    users[email].role = role;
    users[email].staffId = staffId;
    users[email].department = department;
    users[email].isFirstLogin = true;
    tempPasswords[email] = tempPassword;
    
    console.log('✅ Updated account for:', email);
    console.log('🔑 New temporary password:', tempPassword);
    
    return {
      success: true,
      tempPassword: tempPassword,
      user: users[email]
    };
  }

  // Create new user if doesn't exist
  users[email] = {
    password: null,
    name: name,
    role: role,
    staffId: staffId,
    department: department,
    isFirstLogin: true,
    passwordChangedAt: null,
    passwordHistory: [],
    accountLocked: false,
    failedAttempts: 0,
    lastLogin: null
  };

  tempPasswords[email] = tempPassword;

  console.log('✅ New account created for:', email);
  console.log('🔑 Temporary password:', tempPassword);

  return {
    success: true,
    tempPassword: tempPassword,
    user: users[email]
  };
}

// Function to change password
export function changePassword(email, newPassword) {
  if (!users[email]) {
    return { success: false, error: 'User not found' };
  }

  users[email].password = newPassword;
  users[email].isFirstLogin = false;
  users[email].passwordChangedAt = new Date().toISOString().replace('T', ' ').slice(0, 19);

  users[email].passwordHistory.push('hashed_old_password');
  if (users[email].passwordHistory.length > 5) {
    users[email].passwordHistory.shift();
  }

  delete tempPasswords[email];

  return { success: true };
}

// Function to reset password (forgot password)
export function resetPassword(email) {
  if (!users[email]) {
    return { success: false, error: 'User not found' };
  }

  const tempPassword = generateTempPassword();
  tempPasswords[email] = tempPassword;
  users[email].isFirstLogin = true;

  return { success: true, tempPassword: tempPassword };
}

// Generate temporary password
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
// 🔥 AUTO-INITIALIZE WHEN MODULE IS IMPORTED - MOVED TO BOTTOM
// ============================================================
initDemoUsers();