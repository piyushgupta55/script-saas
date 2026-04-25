'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import History from '@/components/dashboard/History';

interface HistoryItem {
  id: string;
  idea: string;
  hooks: string[];
  script: string;
  date: string;
  platform: string;
  tone: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('scriptsAAS_history') || '[]');
    setHistory(savedHistory);
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleReuse = (idea: string, platform: string, tone: string) => {
    // We can pass these via URL params to the generator
    const params = new URLSearchParams({ idea, platform, tone });
    router.push(`/editor?${params.toString()}`);
  };

  return (
    <History 
      history={history} 
      setPrompt={(v) => {}} // Not used directly here
      setPlatform={(v) => {}} 
      setTone={(v) => {}}
      setActiveTab={(v) => {}} // Replaced by router
      copyToClipboard={copyToClipboard}
    />
  );
}
