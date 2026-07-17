import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function GET() {
  try {
    // Test connection
    const { data, error } = await supabase
      .from('employees')
      .select('count', { count: 'exact' });
    
    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        config: {
          url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
          key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing'
        }
      }, { status: 500 });
    }

    // Get a sample employee
    const { data: employees, error: empError } = await supabase
      .from('employees')
      .select('*')
      .limit(3);

    return NextResponse.json({
      success: true,
      message: '✅ Supabase is connected and working!',
      employeeCount: data?.count || 0,
      sampleEmployees: employees || [],
      config: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set ✅' : 'Missing ❌'
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}