import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Auth helper functions
export const signInWithEmail = async (email) => {
  const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  });
  return { data, error };
};

export const signInWithPhone = async (phone) => {
  const { data, error } = await supabase.auth.signInWithOtp({
    phone,
    options: {
      channel: 'sms',
    },
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = () => {
  return supabase.auth.getUser();
};

export const getSession = () => {
  return supabase.auth.getSession();
};

// Database helper functions
export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

export const updateProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
};

export const getLeads = async (userId) => {
  const { data, error } = await supabase
    .from('leads')
    .select(`
      *,
      landing_pages(title),
      services(name)
    `)
    .eq('profile_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const getLandingPages = async (userId) => {
  const { data, error } = await supabase
    .from('landing_pages')
    .select('*')
    .eq('profile_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const getServices = async (userId) => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('profile_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
};

