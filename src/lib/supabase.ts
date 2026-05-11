import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ltgldkbjifvheiqykvvm.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0Z2xka2JqaWZ2aGVpcXlrdnZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0MzU0MTcsImV4cCI6MjA5NDAxMTQxN30.ksi5hKTWdDVhGLhEdKQQ77TaVPlnPiEASdMCGMZM_tg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
