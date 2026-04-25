'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Profile from '@/components/dashboard/Profile';

export default function ProfilePage() {
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [historyCount, setHistoryCount] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'Operator');
        setUserEmail(user.email || null);
      }
    };
    
    const savedHistory = JSON.parse(localStorage.getItem('scriptsAAS_history') || '[]');
    setHistoryCount(savedHistory.length);
    fetchUser();
  }, []);

  return (
    <Profile 
      userName={userName} 
      email={userEmail}
      historyCount={historyCount}
    />
  );
}
