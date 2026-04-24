'use client';

import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [knowledge, setKnowledge] = useState<any>(null);
  
  // Generation States
  const [prompt, setPrompt] = useState('');
  const [platform, setPlatform] = useState('Instagram Reel');
  const [tone, setTone] = useState('High Energy');
  const [length, setLength] = useState('60 seconds');
  const [generatedData, setGeneratedData] = useState<any>(null);
  const [genLoading, setGenLoading] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const res = await fetch('/api/process-pdf', {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();
      if (result.data) {
        setKnowledge(result.data);
      } else {
        alert(result.error || 'Failed to process PDF');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while processing the PDF');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt) return;

    setGenLoading(true);
    try {
      const res = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, knowledge, platform, tone, length }),
      });
      const result = await res.json();
      if (result.script) {
        setGeneratedData(result);
      } else {
        alert(result.error || 'Failed to generate script');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while generating the script');
    } finally {
      setGenLoading(false);
    }
  };

  return (
    <main>
      <div className="hero animate-fade-in">
        <h1>ScriptSaaS <span style={{fontSize: '1rem', verticalAlign: 'middle', background: 'var(--primary)', padding: '4px 8px', borderRadius: '8px', color: 'white'}}>v1.0</span></h1>
        <p>Turn rough ideas into viral-ready scripts in seconds using your own custom knowledge base.</p>
      </div>

      {!knowledge ? (
        <div className="card animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <form onSubmit={handleUpload} className="upload-section">
            <div className="upload-zone" onClick={() => document.getElementById('fileInput')?.click()}>
              <input
                id="fileInput"
                type="file"
                accept="application/pdf"
                style={{ display: 'none' }}
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
              <p>{file ? file.name : 'Click to upload your script writing guide'}</p>
              <span style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem', display: 'block' }}>
                PDF will be analyzed for hooks, rules, and viral structures
              </span>
            </div>
            <button type="submit" className="btn" disabled={!file || loading}>
              {loading ? 'Analyzing Content...' : 'Build Knowledge Base'}
            </button>
          </form>
        </div>
      ) : (
        <div className="results animate-fade-in">
          <div className="generator-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* Left Column: Controls */}
            <div className="card">
              <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Configuration</h2>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: '#888' }}>INPUT IDEA</label>
                <textarea
                  placeholder="What is your script about?"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  style={{ minHeight: '150px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: '#888' }}>PLATFORM</label>
                  <select value={platform} onChange={(e) => setPlatform(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', borderRadius: '8px', padding: '0.8rem', color: 'white' }}>
                    <option>Instagram Reel</option>
                    <option>TikTok</option>
                    <option>YouTube Short</option>
                    <option>X (Twitter) Video</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: '#888' }}>TONE</label>
                  <select value={tone} onChange={(e) => setTone(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', borderRadius: '8px', padding: '0.8rem', color: 'white' }}>
                    <option>High Energy</option>
                    <option>Educational</option>
                    <option>Contrarian</option>
                    <option>Funny/Witty</option>
                    <option>Serious/Alpha</option>
                  </select>
                </div>
              </div>

              <button 
                className="btn" 
                onClick={handleGenerate} 
                disabled={!prompt || genLoading}
                style={{ width: '100%' }}
              >
                {genLoading ? 'Generating Viral Content...' : 'Generate Viral Script'}
              </button>

              <button 
                className="btn btn-secondary" 
                style={{ marginTop: '1rem', width: '100%', fontSize: '0.8rem' }}
                onClick={() => setKnowledge(null)}
              >
                Upload Different Guide
              </button>
            </div>

            {/* Right Column: Output */}
            <div className="output-column">
              {!generatedData ? (
                <div className="card" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#555' }}>
                  <div>
                    <p>Your viral content will appear here</p>
                    <span style={{ fontSize: '0.8rem' }}>Set your parameters and hit generate</span>
                  </div>
                </div>
              ) : (
                <div className="animate-fade-in">
                  {/* Hook Engine Results */}
                  <div className="card" style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '0.9rem', color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '1rem' }}>🪝 Hook Engine Variations</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                      {Object.entries(generatedData.hooks).map(([type, text]: any) => (
                        <div key={type} style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', borderLeft: '4px solid var(--primary)' }}>
                          <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', opacity: 0.5, display: 'block', marginBottom: '0.3rem' }}>{type.replace('_', ' ')}</span>
                          <p style={{ fontSize: '0.9rem' }}>{text}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Final Script */}
                  <div className="card">
                    <h3 style={{ fontSize: '0.9rem', color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '1rem' }}>🎬 Full Viral Script</h3>
                    <div className="output" style={{ marginTop: 0, fontSize: '0.95rem' }}>
                      {generatedData.script}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
