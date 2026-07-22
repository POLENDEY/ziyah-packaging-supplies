import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client configuration.
 * Note: NEXT_PUBLIC_ variables are exposed to the browser.
 * These are required for both client-side and server-side Supabase operations.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      'MISSING SUPABASE CONFIGURATION: Please check your .env.local file.\n' +
      'Expected variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
    );
  } else {
    console.error(
      'CRITICAL: Supabase environment variables are missing in production.\n' +
      'Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in Vercel project settings.'
    );
  }
}

// Initialize the Supabase client
// We use placeholders if variables are missing to prevent the build from failing,
// but runtime errors will be clear about the invalid configuration.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-project.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);
