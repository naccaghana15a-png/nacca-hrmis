// scripts/migrate-users.js
import { supabase } from '../lib/supabase.js';
import bcrypt from 'bcryptjs';

async function migrateUsers() {
  try {
    // Get all employees
    const { data: employees, error } = await supabase
      .from('employees')
      .select('*');

    if (error) {
      console.error('Error fetching employees:', error);
      return;
    }

    console.log(`Found ${employees.length} employees`);

    let updated = 0;
    for (const employee of employees) {
      const updates = {};
      
      // Ensure is_first_login is set
      if (employee.is_first_login === undefined) {
        updates.is_first_login = employee.status === 'pending' || false;
      }

      // Ensure status is set
      if (!employee.status) {
        updates.status = 'pending';
      }

      // Ensure is_active is set
      if (employee.is_active === undefined) {
        updates.is_active = true;
      }

      // Set default login_attempts
      if (employee.login_attempts === undefined) {
        updates.login_attempts = 0;
      }

      if (Object.keys(updates).length > 0) {
        const { error: updateError } = await supabase
          .from('employees')
          .update(updates)
          .eq('id', employee.id);

        if (updateError) {
          console.error(`Error updating employee ${employee.email}:`, updateError);
        } else {
          updated++;
          console.log(`Updated employee: ${employee.email}`);
        }
      }
    }

    console.log(`Migration complete. Updated ${updated} employees.`);
  } catch (error) {
    console.error('Migration error:', error);
  }
}

migrateUsers();