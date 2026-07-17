// app/api/auth/change-password/route.js
import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';
import { users, tempPasswords } from '../../../../lib/users';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { email, currentPassword, newPassword } = await request.json();

    if (!email || !currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Get user from Supabase
    const { data: employee, error } = await supabase
      .from('employees')
      .select('*')
      .eq('email', normalizedEmail)
      .single();

    if (error || !employee) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify current password
    const tempPasswordMatch = tempPasswords[normalizedEmail] === currentPassword;
    let currentPasswordMatch = false;

    if (employee.password_hash) {
      try {
        currentPasswordMatch = await bcrypt.compare(currentPassword, employee.password_hash);
      } catch (error) {
        currentPasswordMatch = currentPassword === employee.password_hash;
      }
    }

    if (!tempPasswordMatch && !currentPasswordMatch) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user in Supabase
    const { data: updatedUser, error: updateError } = await supabase
      .from('employees')
      .update({
        password_hash: hashedPassword,
        is_first_login: false,
        is_active: true,
        status: 'active',
        login_attempts: 0,
        updated_at: new Date().toISOString()
      })
      .eq('email', normalizedEmail)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating password:', updateError);
      return NextResponse.json(
        { error: 'Failed to update password' },
        { status: 500 }
      );
    }

    // Clear temp password from memory
    delete tempPasswords[normalizedEmail];

    // Update in-memory user if exists
    if (users[normalizedEmail]) {
      users[normalizedEmail].password = hashedPassword;
      users[normalizedEmail].isFirstLogin = false;
      users[normalizedEmail].isActive = true;
      users[normalizedEmail].status = 'active';
      users[normalizedEmail].loginAttempts = 0;
    }

    // Clear temp password from Supabase
    await supabase
      .from('temp_passwords')
      .delete()
      .eq('email', normalizedEmail);

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role || 'staff',
        isFirstLogin: false,
        status: 'active'
      }
    });
  } catch (error) {
    console.error('Password change error:', error);
    return NextResponse.json(
      { error: 'An error occurred while changing password' },
      { status: 500 }
    );
  }
}