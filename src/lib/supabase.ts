import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ymdsunflblilshbdxrwl.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
  "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltZHN1bmZsYmxpbHNoYmR4cndsIiwi" +
  "cm9sZSI6ImFub24iLCJpYXQiOjE3NzI0Njg2NzAsImV4cCI6MjA4ODA0NDY3MH0." +
  "jhSkI1tnGHkVXixZZpM6V4DFeZL-tzaEDnnNBgNLFzs";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface PostureLog {
  id?: number;
  angle: number;
  status: string;
  confidence: number;
  timestamp: string;
}
