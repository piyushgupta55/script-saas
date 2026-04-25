import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function getUsers() {
  const { data: { users }, error } = await supabase.auth.admin.listUsers()
  if (error) {
    console.error(error)
    return
  }
  console.log('Users:', users.map(u => u.email))
}

getUsers()
