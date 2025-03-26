
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://iusgislsdltfyjqsvvcx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1c2dpc2xzZGx0ZnlqcXN2dmN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5ODE3OTEsImV4cCI6MjA1ODU1Nzc5MX0.BxSLIf0mfvhh3p8s4hG5tOspHJUkx5iHWCcjxcX7oaI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
