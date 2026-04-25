import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ochjeurxllofgepawkvy.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jaGpldXJ4bGxvZmdlcGF3a3Z5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzAxMzQ0NiwiZXhwIjoyMDkyNTg5NDQ2fQ.mEf8qEAjl85XUJCIzYDvDi44pvGHy0FXTx2d7O9Vmc8';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function checkLogs() {
  const { data, error } = await supabaseAdmin
    .from('script_logs')
    .select('*')
    .limit(1);

  if (error) {
    console.log('Error fetching script_logs:', error.message);
  } else {
    console.log('script_logs found');
  }
}

checkLogs();
