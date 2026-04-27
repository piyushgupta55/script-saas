'use client';

import { useState, useEffect } from 'react';
import Generator from '@/components/dashboard/Generator';

interface HistoryItem {
  id: string;
  idea: string;
  hooks: string[];
  script: string;
  date: string;
  platform: string;
  tone: string;
}

export default function GeneratorPage() {
  const [prompt, setPrompt] = useState('');
  const [platform, setPlatform] = useState('Reel');
  const [tone, setTone] = useState('Storytelling');
  const [length, setLength] = useState('60s');
  const [language, setLanguage] = useState('Hinglish');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<{ hooks: string[], script: string, applied_knowledge?: { content: string, source: string }[] } | null>(null);
  
  const [apiKey, setApiKey] = useState('');
  const [useUserKey, setUseUserKey] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const savedKey = localStorage.getItem('scriptsAAS_apiKey') || '';
    const savedUseKey = localStorage.getItem('scriptsAAS_useUserKey') === 'true';
    const savedHistory = JSON.parse(localStorage.getItem('scriptsAAS_history') || '[]');
    
    setApiKey(savedKey);
    setUseUserKey(savedUseKey);
    setHistory(savedHistory);
  }, []);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    
    try {
      const res = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt, platform, tone, length, language,
          apiKey: useUserKey ? apiKey : undefined 
        }),
      });
      
      const data = await res.json();
      if (data.script) {
        const newOutput = { 
          hooks: data.hooks, 
          script: data.script, 
          applied_knowledge: data.applied_knowledge 
        };
        setOutput(newOutput);
        
        const newItem: HistoryItem = {
          id: Date.now().toString(),
          idea: prompt,
          hooks: data.hooks,
          script: data.script,
          date: new Date().toLocaleDateString(),
          platform,
          tone
        };
        const updatedHistory = [newItem, ...history].slice(0, 50);
        setHistory(updatedHistory);
        localStorage.setItem('scriptsAAS_history', JSON.stringify(updatedHistory));
      } else {
        alert(data.error || 'Generation Failed');
      }
    } catch (err) {
      alert('Network Error');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setPrompt('');
    setOutput(null);
    setLoading(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Generator 
      prompt={prompt} setPrompt={setPrompt}
      platform={platform} setPlatform={setPlatform}
      tone={tone} setTone={setTone}
      length={length} setLength={setLength}
      language={language} setLanguage={setLanguage}
      loading={loading} handleGenerate={handleGenerate}
      handleClear={handleClear}
      output={output} copyToClipboard={copyToClipboard}
    />
  );
}
