'use client';

import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [knowledge, setKnowledge] = useState<any>(null);
  const [prompt, setPrompt] = useState('');
  const [generatedScript, setGeneratedScript] = useState('');
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
        body: JSON.stringify({ prompt, knowledge }),
      });
      const result = await res.json();
      if (result.script) {
        setGeneratedScript(result.script);
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
        <h1>ScriptSaaS</h1>
        <p>Upload your script writing guides and generate viral content instantly using AI.</p>
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
              <p>{file ? file.name : 'Click to upload or drag & drop PDF guide'}</p>
              <span style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem', display: 'block' }}>
                PDF will be parsed for hooks, rules, and structures
              </span>
            </div>
            <button type="submit" className="btn" disabled={!file || loading}>
              {loading ? 'Processing Pipeline...' : 'Process Knowledge'}
            </button>
          </form>
        </div>
      ) : (
        <div className="results animate-fade-in">
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Knowledge Extracted ✨</h2>
            <div className="result-grid">
              <div className="result-item">
                <h3>Hooks</h3>
                <ul>
                  {knowledge.hooks.slice(0, 5).map((h: string, i: number) => (
                    <li key={i}>{h}</li>
                  ))}
                  {knowledge.hooks.length > 5 && <li>...and {knowledge.hooks.length - 5} more</li>}
                </ul>
              </div>
              <div className="result-item">
                <h3>Rules</h3>
                <ul>
                  {knowledge.rules.slice(0, 5).map((r: string, i: number) => (
                    <li key={i}>{r}</li>
                  ))}
                  {knowledge.rules.length > 5 && <li>...and {knowledge.rules.length - 5} more</li>}
                </ul>
              </div>
              <div className="result-item">
                <h3>Structures</h3>
                <ul>
                  {knowledge.structures.slice(0, 5).map((s: string, i: number) => (
                    <li key={i}>{s}</li>
                  ))}
                  {knowledge.structures.length > 5 && <li>...and {knowledge.structures.length - 5} more</li>}
                </ul>
              </div>
            </div>
            <button 
              className="btn btn-secondary" 
              style={{ marginTop: '2rem' }}
              onClick={() => setKnowledge(null)}
            >
              Upload Another PDF
            </button>
          </div>

          <div className="generator card">
            <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Generate Viral Script</h2>
            <p style={{ color: '#888', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Your script will be generated using the rules and structures extracted from your PDF.
            </p>
            <textarea
              placeholder="What is your script about? (e.g., A video about 10 productivity tips for developers)"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button 
              className="btn" 
              onClick={handleGenerate} 
              disabled={!prompt || genLoading}
              style={{ width: '100%' }}
            >
              {genLoading ? 'Generating Script...' : 'Generate Script'}
            </button>

            {generatedScript && (
              <div className="output animate-fade-in">
                {generatedScript}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
