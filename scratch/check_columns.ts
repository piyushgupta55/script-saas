import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ochjeurxllofgepawkvy.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jaGpldXJ4bGxvZmdlcGF3a3Z5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzAxMzQ0NiwiZXhwIjoyMDkyNTg5NDQ2fQ.mEf8qEAjl85XUJCIzYDvDi44pvGHy0FXTx2d7O9Vmc8';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function checkColumns() {
  const { data, error } = await supabaseAdmin
    .from('knowledge_items')
    .select('*')
    .limit(1);

  if (data && data.length > 0) {
    console.log('Columns in knowledge_items:', Object.keys(data[0]));
  } else {
    console.log('knowledge_items is empty, cannot check columns easily.');
  }
}

checkColumns();
