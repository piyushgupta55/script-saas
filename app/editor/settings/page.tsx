'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Settings from '@/components/dashboard/Settings';

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('');
  const [useUserKey, setUseUserKey] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('scriptsAAS_apiKey') || '';
    const savedUseKey = localStorage.getItem('scriptsAAS_useUserKey') === 'true';
    setApiKey(savedKey);
    setUseUserKey(savedUseKey);
  }, []);

  const saveSettings = () => {
    localStorage.setItem('scriptsAAS_apiKey', apiKey);
    localStorage.setItem('scriptsAAS_useUserKey', String(useUserKey));
    alert('Settings Saved Successfully');
  };

  return (
    <Settings 
      apiKey={apiKey} setApiKey={setApiKey}
      useUserKey={useUserKey} setUseUserKey={setUseUserKey}
      saveSettings={saveSettings}
      supabase={createClient()}
    />
  );
}
