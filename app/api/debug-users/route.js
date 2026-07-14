import { NextResponse } from 'next/server';
import { users } from '../../../lib/users';

export async function GET() {
  const userList = Object.keys(users);
  const adminUser = users['admin@nacca.gov.gh'];
  
  return NextResponse.json({
    totalUsers: userList.length,
    users: userList.slice(0, 10), // Show first 10
    adminExists: !!adminUser,
    adminPassword: adminUser?.password || 'not found',
    adminRole: adminUser?.role || 'not found'
  });
}