
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ochjeurxllofgepawkvy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jaGpldXJ4bGxvZmdlcGF3a3Z5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzAxMzQ0NiwiZXhwIjoyMDkyNTg5NDQ2fQ.mEf8qEAjl85XUJCIzYDvDi44pvGHy0FXTx2d7O9Vmc8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDB() {
  console.log('Testing connection...');
  const { data: ki, error: kiErr } = await supabase.from('knowledge_items').select('*').limit(1);
  if (kiErr) console.log('KI Error:', kiErr.message);
  else console.log('KI Data:', ki);

  const { data: sk, error: skErr } = await supabase.from('script_knowledge').select('*').limit(1);
  if (skErr) console.log('SK Error:', skErr.message);
  else console.log('SK Data:', sk);
}

checkDB();
