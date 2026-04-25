import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ochjeurxllofgepawkvy.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jaGpldXJ4bGxvZmdlcGF3a3Z5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzAxMzQ0NiwiZXhwIjoyMDkyNTg5NDQ2fQ.mEf8qEAjl85XUJCIzYDvDi44pvGHy0FXTx2d7O9Vmc8';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function listTables() {
  const { data, error } = await supabaseAdmin
    .from('knowledge_items')
    .select('*')
    .limit(1);

  if (error) {
    console.log('Error fetching knowledge_items:', error.message);
  } else {
    console.log('knowledge_items found');
  }

  const { data: chunks, error: chunkError } = await supabaseAdmin
    .from('knowledge_chunks')
    .select('*')
    .limit(1);

  if (chunkError) {
    console.log('Error fetching knowledge_chunks:', chunkError.message);
  } else {
    console.log('knowledge_chunks found');
  }
}

listTables();
