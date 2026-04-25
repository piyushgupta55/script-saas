'use client';

import { useState } from 'react';
import { 
  Zap, 
  Sparkles, 
  FileText, 
  Copy, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp,
  Terminal,
  Activity
} from 'lucide-react';

interface GeneratorProps {
  prompt: string;
  setPrompt: (v: string) => void;
  platform: string;
  setPlatform: (v: string) => void;
  tone: string;
  setTone: (v: string) => void;
  length: string;
  setLength: (v: string) => void;
  language: string;
  setLanguage: (v: string) => void;
  loading: boolean;
  handleGenerate: () => void;
  output: { hooks: string[], script: string } | null;
  copyToClipboard: (text: string) => void;
}

export default function Generator(props: GeneratorProps) {
  const [controlsOpen, setControlsOpen] = useState(true);

  return (
    <div className="generator-view">
      <div className="view-header">
        <div>
          <h1 className="mono">00 // LOGIC_ENGINE</h1>
          <p className="mono text-xxs text-muted">SYSTEM_STABILITY: NOMINAL // LATENCY: 12.4ms</p>
        </div>
        <div className="header-actions">
          <div className="status-badge">
             <div className="pulse-dot"></div>
             <span className="mono text-xxs text-primary">AUTO_SAVE: ENABLED</span>
          </div>
        </div>
      </div>

      <div className="generator-grid">
        {/* Left Column: Input + Controls */}
        <div className="input-column">
          <div className="input-group">
            <div className="mono text-xs text-primary mb-12">&gt; DEFINE_INPUT_CORE</div>
            <textarea 
              className="main-input" 
              placeholder="Inject your core idea... (e.g. 'Why most startups fail in the first year')"
              value={props.prompt}
              onChange={(e) => props.setPrompt(e.target.value)}
            />
          </div>

          <div className="controls-panel">
            <button 
              className="controls-toggle mono"
              onClick={() => setControlsOpen(!controlsOpen)}
            >
              {controlsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              01 // GEN_PARAMETERS
            </button>
            
            {controlsOpen && (
              <div className="controls-grid">
                <div className="control-item">
                  <label className="mono text-xxs">PLATFORM_TYPE</label>
                  <select value={props.platform} onChange={(e) => props.setPlatform(e.target.value)}>
                    <option>Reel</option>
                    <option>YouTube</option>
                  </select>
                </div>
                <div className="control-item">
                  <label className="mono text-xxs">LOGIC_TONE</label>
                  <select value={props.tone} onChange={(e) => props.setTone(e.target.value)}>
                    <option>Storytelling</option>
                    <option>Aggressive</option>
                    <option>Funny</option>
                    <option>Educational</option>
                  </select>
                </div>
                <div className="control-item">
                  <label className="mono text-xxs">TEMPORAL_LENGTH</label>
                  <select value={props.length} onChange={(e) => props.setLength(e.target.value)}>
                    <option>30s</option>
                    <option>60s</option>
                    <option>Long</option>
                  </select>
                </div>
                <div className="control-item">
                  <label className="mono text-xxs">LINGUISTIC_MODE</label>
                  <select value={props.language} onChange={(e) => props.setLanguage(e.target.value)}>
                    <option>Hinglish</option>
                    <option>English</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <button 
            className="btn-brutal generate-btn sticky-mobile"
            onClick={props.handleGenerate}
            disabled={props.loading}
          >
            {props.loading ? (
              <>ATOMIZING_CONTEXT... <Activity size={18} className="animate-spin" /></>
            ) : (
              <>INITIALIZE_LOGIC <Zap size={18} /></>
            )}
          </button>
        </div>

        {/* Right Column: Output Panel */}
        <div className="output-column">
          {!props.output ? (
            <div className="output-empty">
              <div className="empty-icon-box">
                <Terminal size={48} />
              </div>
              <p className="mono text-sm text-muted">AWAITING_NEURAL_COMMAND...</p>
              <div className="code-log-preview">
                <span className="mono text-xxs opacity-20">&gt; SYSTEM_IDLE</span> <br />
                <span className="mono text-xxs opacity-20">&gt; LISTENING_FOR_HOOK_SIGNALS</span>
              </div>
            </div>
          ) : (
            <div className="output-content">
              {/* Hooks Section */}
              <div className="output-section hooks-section">
                <div className="mono text-xs text-primary mb-12">02 // VIRAL_HOOK_VARIANTS</div>
                <div className="hooks-list">
                  {props.output.hooks.map((h, i) => (
                    <div key={i} className="hook-item">
                      <span className="hook-text">{h}</span>
                      <button className="copy-btn" onClick={() => props.copyToClipboard(h)} title="Copy Hook">
                        <Copy size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Script Section */}
              <div className="output-section script-section">
                <div className="section-header-row">
                  <div className="mono text-xs text-primary mb-12">03 // ENGINEERED_SCRIPT_LOGIC</div>
                  <div className="output-actions">
                     <button onClick={() => props.copyToClipboard(props.output!.script)} className="mono text-xxs action-btn">
                       <Copy size={12} /> COPY_SCRIPT
                     </button>
                     <button onClick={() => props.copyToClipboard(`HOOKS:\n${props.output!.hooks.join('\n')}\n\nSCRIPT:\n${props.output!.script}`)} className="mono text-xxs action-btn">
                       <Copy size={12} /> COPY_ALL
                     </button>
                  </div>
                </div>
                <div className="script-block-container">
                  <div className="script-accent-l"></div>
                  <div className="script-block">
                    {props.output.script}
                  </div>
                </div>
                <button className="btn-secondary regenerate-btn mono" onClick={props.handleGenerate}>
                  <RefreshCw size={14} /> RE_ENGINEER_VARIATION
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .generator-view { width: 100%; height: 100vh; display: flex; flex-direction: column; }
        .view-header {
          padding: 24px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border);
          background: rgba(0, 0, 0, 0.2);
        }
        .view-header h1 { font-size: 1rem; font-weight: 800; letter-spacing: 0.1em; }
        
        .status-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 12px;
          background: rgba(197, 255, 0, 0.05);
          border: 1px solid rgba(197, 255, 0, 0.2);
          border-radius: 4px;
        }
        .pulse-dot {
          width: 6px;
          height: 6px;
          background: var(--primary);
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
          100% { opacity: 1; transform: scale(1); }
        }

        .generator-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          flex: 1;
          overflow: hidden;
        }
        .input-column {
          padding: 40px;
          border-right: 1px solid var(--border);
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 32px;
          background: var(--bg-base);
        }
        .main-input {
          width: 100%;
          min-height: 240px;
          background: #000;
          border: 1px solid var(--border);
          color: white;
          padding: 24px;
          font-family: inherit;
          font-size: 1.1rem;
          resize: none;
          outline: none;
          transition: all 0.2s;
        }
        .main-input:focus { 
          border-color: var(--primary); 
          box-shadow: 0 0 20px rgba(197, 255, 0, 0.05);
        }
        
        .controls-panel {
          border: 1px solid var(--border);
          background: #000;
        }
        .controls-toggle {
          width: 100%;
          padding: 16px 20px;
          background: transparent;
          border: none;
          color: var(--text-dim);
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          font-size: 11px;
          border-bottom: 1px solid var(--border);
          letter-spacing: 0.1em;
        }
        .controls-toggle:hover { color: var(--primary); }
        
        .controls-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1px;
          background: var(--border);
        }
        .control-item {
          background: #000;
          padding: 20px;
        }
        .control-item label { display: block; color: #444; margin-bottom: 8px; letter-spacing: 0.1em; }
        .control-item select {
          width: 100%;
          background: transparent;
          border: none;
          color: white;
          outline: none;
          font-family: inherit;
          font-size: 14px;
          cursor: pointer;
        }
        .control-item select:hover { color: var(--primary); }
        
        .generate-btn {
          width: 100%;
          padding: 24px;
          font-size: 1rem;
          letter-spacing: 0.1em;
        }

        .output-column {
          padding: 40px;
          overflow-y: auto;
          background: #000;
          position: relative;
        }
        .output-empty {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #222;
          gap: 24px;
        }
        .empty-icon-box {
          width: 100px;
          height: 100px;
          border: 1px dashed #222;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.3;
        }
        .code-log-preview { text-align: center; }
        
        .output-content { display: flex; flex-direction: column; gap: 40px; }
        .output-section {
          padding: 40px;
          background: rgba(255,255,255,0.01);
          border: 1px solid var(--border);
          position: relative;
        }
        .output-section::after {
          content: "";
          position: absolute;
          top: 0; right: 0;
          width: 10px; height: 10px;
          border-top: 1px solid var(--primary);
          border-right: 1px solid var(--primary);
          opacity: 0.5;
        }

        .hook-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border: 1px solid var(--border);
          background: #000;
          margin-bottom: 12px;
          font-size: 14px;
          transition: all 0.2s;
        }
        .hook-item:hover { border-color: var(--primary); transform: translateX(8px); }
        .hook-text { color: var(--text-main); }
        .copy-btn { 
          background: transparent; 
          border: none; 
          color: #444; 
          cursor: pointer; 
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          transition: all 0.2s;
        }
        .copy-btn:hover { color: var(--primary); transform: scale(1.1); }

        .section-header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .output-actions { display: flex; gap: 12px; }
        .action-btn { 
          background: transparent; 
          border: 1px solid var(--border); 
          color: #666; 
          padding: 6px 12px; 
          cursor: pointer; 
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }
        .action-btn:hover { color: var(--primary); border-color: var(--primary); }

        .script-block-container {
          position: relative;
          margin-bottom: 32px;
        }
        .script-accent-l {
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 2px;
          background: var(--primary);
          opacity: 0.3;
        }
        .script-block {
          white-space: pre-wrap;
          line-height: 1.8;
          color: #bbb;
          font-size: 1.1rem;
          padding-left: 24px;
        }
        
        .regenerate-btn { 
          width: 100%; 
          padding: 20px; 
          font-size: 11px; 
          letter-spacing: 0.1em;
          border: 1px dashed var(--border);
        }

        .mono { font-family: 'JetBrains Mono', monospace; }
        .text-xxs { font-size: 10px; }
        .text-xs { font-size: 12px; }
        .text-primary { color: var(--primary); }
        .text-muted { color: #444; }
        .mb-12 { margin-bottom: 12px; }

        @media (max-width: 1024px) {
          .generator-grid { grid-template-columns: 1fr; overflow-y: auto; }
          .input-column { border-right: none; height: auto; padding: 24px; }
          .output-column { padding: 24px; height: auto; }
        }

        @media (max-width: 768px) {
          .view-header { padding: 16px 20px; }
          .input-column, .output-column { padding: 20px; }
          .main-input { min-height: 200px; }
          .sticky-mobile {
            position: sticky;
            bottom: 24px;
            z-index: 100;
          }
          .output-section { padding: 24px; }
        }
      `}</style>
    </div>
  );
}

