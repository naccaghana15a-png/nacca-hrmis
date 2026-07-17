import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials not configured.');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export async function getUserByEmail(email) {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .eq('email', email)
    .single();
  
  if (error) return null;
  return data;
}

export async function updateUser(email, updates) {
  const { data, error } = await supabase
    .from('employees')
    .update(updates)
    .eq('email', email)
    .select();
  
  if (error) throw error;
  return data;
}

export async function getTempPassword(email) {
  const { data, error } = await supabase
    .from('temp_passwords')
    .select('temp_password')
    .eq('email', email)
    .single();
  
  if (error) return null;
  return data?.temp_password || null;
}

export async function setTempPassword(email, tempPassword) {
  const { error } = await supabase
    .from('temp_passwords')
    .upsert({ 
      email: email, 
      temp_password: tempPassword,
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 19)
    });
  
  if (error) throw error;
  return true;
}

export async function deleteTempPassword(email) {
  const { error } = await supabase
    .from('temp_passwords')
    .delete()
    .eq('email', email);
  
  if (error) throw error;
  return true;
}

export async function getAllEmployees() {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .order('id', { ascending: true });
  
  if (error) throw error;
  return data;
}

export default supabase;