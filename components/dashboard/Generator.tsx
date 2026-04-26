'use client';

import { useState, useEffect } from 'react';
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
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState<'input' | 'output'>('input');

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (props.output && isMobile) {
      setActiveTab('output');
    }
  }, [props.output, isMobile]);

  return (
    <div className="generator-view" style={{ background: '#050505', color: '#fff' }}>
      {/* Mobile Tab Navigation */}
      {isMobile && (
        <div style={{
          display: 'flex',
          background: '#000',
          borderBottom: '1px solid #222',
          position: 'sticky',
          top: '0',
          zIndex: 1000
        }}>
          <button 
            onClick={() => setActiveTab('input')}
            style={{
              flex: 1,
              padding: '16px',
              background: 'transparent',
              border: 'none',
              color: activeTab === 'input' ? '#c5ff00' : '#444',
              borderBottom: activeTab === 'input' ? '2px solid #c5ff00' : 'none',
              fontSize: '10px',
              fontWeight: '900',
              fontFamily: 'JetBrains Mono, monospace'
            }}
          >
            01 // DRAFTING_CORE
          </button>
          <button 
            onClick={() => setActiveTab('output')}
            style={{
              flex: 1,
              padding: '16px',
              background: 'transparent',
              border: 'none',
              color: activeTab === 'output' ? '#c5ff00' : '#444',
              borderBottom: activeTab === 'output' ? '2px solid #c5ff00' : 'none',
              fontSize: '10px',
              fontWeight: '900',
              fontFamily: 'JetBrains Mono, monospace',
              opacity: !props.output ? 0.3 : 1
            }}
            disabled={!props.output}
          >
            02 // FINAL_LOGIC
          </button>
        </div>
      )}

      <div className="view-header" style={isMobile ? { padding: '16px 20px', borderBottom: '1px solid #111' } : {}}>
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

      <div className="generator-grid" style={isMobile ? { display: 'block', padding: '0' } : {}}>
        {/* Left Column: Input + Controls */}
        <div className="input-column" style={isMobile ? { 
          display: activeTab === 'input' ? 'flex' : 'none',
          padding: '24px',
          background: '#050505',
          height: 'auto',
          minHeight: 'calc(100vh - 120px)'
        } : {}}>
          <div className="input-group">
            <div className="mono text-xs text-primary mb-12" style={{ fontSize: '10px' }}>&gt; CORE_INTENT_INPUT</div>
            <textarea 
              className="main-input" 
              style={isMobile ? { minHeight: '180px', fontSize: '1rem', padding: '20px' } : {}}
              placeholder="Inject your core idea... (e.g. 'Why most startups fail in the first year')"
              value={props.prompt}
              onChange={(e) => props.setPrompt(e.target.value)}
            />
          </div>

          <div className="controls-panel" style={isMobile ? { border: '1px solid #111' } : {}}>
            <button 
              className="controls-toggle mono"
              onClick={() => setControlsOpen(!controlsOpen)}
              style={isMobile ? { padding: '14px', fontSize: '9px' } : {}}
            >
              {controlsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              GEN_PARAMETERS
            </button>
            
            {controlsOpen && (
              <div className="controls-grid">
                <div className="control-item" style={isMobile ? { padding: '15px' } : {}}>
                  <label className="mono text-xxs" style={{ fontSize: '8px' }}>PLATFORM</label>
                  <select value={props.platform} onChange={(e) => props.setPlatform(e.target.value)}>
                    <option>Reel</option>
                    <option>YouTube</option>
                  </select>
                </div>
                <div className="control-item" style={isMobile ? { padding: '15px' } : {}}>
                  <label className="mono text-xxs" style={{ fontSize: '8px' }}>TONE</label>
                  <select value={props.tone} onChange={(e) => props.setTone(e.target.value)}>
                    <option>Storytelling</option>
                    <option>Aggressive</option>
                    <option>Funny</option>
                    <option>Educational</option>
                  </select>
                </div>
                <div className="control-item" style={isMobile ? { padding: '15px' } : {}}>
                  <label className="mono text-xxs" style={{ fontSize: '8px' }}>LENGTH</label>
                  <select value={props.length} onChange={(e) => props.setLength(e.target.value)}>
                    <option>30s</option>
                    <option>60s</option>
                    <option>Long</option>
                  </select>
                </div>
                <div className="control-item" style={isMobile ? { padding: '15px' } : {}}>
                  <label className="mono text-xxs" style={{ fontSize: '8px' }}>LANGUAGE</label>
                  <select value={props.language} onChange={(e) => props.setLanguage(e.target.value)}>
                    <option>Hinglish</option>
                    <option>English</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <button 
            className="btn-brutal generate-btn"
            style={isMobile ? {
              position: 'fixed',
              bottom: '24px',
              left: '24px',
              right: '24px',
              width: 'calc(100% - 48px)',
              zIndex: 9999,
              display: activeTab === 'input' ? 'flex' : 'none',
              justifyContent: 'center',
              boxShadow: '0 0 40px rgba(197, 255, 0, 0.4)',
              padding: '22px',
              fontSize: '14px',
              border: 'none'
            } : {}}
            onClick={props.handleGenerate}
            disabled={props.loading}
          >
            {props.loading ? (
              <>PROCESSING_LOGIC... <Activity size={18} className="animate-spin" /></>
            ) : (
              <>INITIALIZE_ENGINE <Zap size={18} /></>
            )}
          </button>
        </div>

        {/* Right Column: Output Panel */}
        <div className="output-column" style={isMobile ? { 
          display: activeTab === 'output' ? 'block' : 'none',
          padding: '24px',
          background: '#000',
          minHeight: 'calc(100vh - 120px)'
        } : {}}>
          {!props.output ? (
            <div className="output-empty" style={isMobile ? { padding: '40px 0' } : {}}>
              <div className="empty-icon-box" style={isMobile ? { width: '80px', height: '80px' } : {}}>
                <Terminal size={40} />
              </div>
              <p className="mono text-sm text-muted" style={{ fontSize: '10px' }}>AWAITING_CORE_COMMAND...</p>
            </div>
          ) : (
            <div className="output-content">
              {/* Hooks Section */}
              <div className="output-section hooks-section" style={isMobile ? { padding: '24px', marginBottom: '24px' } : {}}>
                <div className="mono text-xs text-primary mb-12" style={{ fontSize: '10px' }}>02 // VIRAL_HOOK_NODES</div>
                <div className="hooks-list">
                  {props.output.hooks.map((h, i) => (
                    <div key={i} className="hook-item" style={isMobile ? { padding: '16px', fontSize: '13px' } : {}}>
                      <span className="hook-text">{h}</span>
                      <button className="copy-btn" onClick={() => props.copyToClipboard(h)}>
                        <Copy size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Knowledge Applied Section */}
              {props.output.applied_knowledge && props.output.applied_knowledge.length > 0 && (
                <div className="output-section knowledge-section" style={isMobile ? { padding: '24px', marginBottom: '24px' } : { marginBottom: '40px' }}>
                  <div className="mono text-xs text-primary mb-12" style={{ fontSize: '10px' }}>03 // INTELLIGENCE_SOURCES_APPLIED</div>
                  <div className="knowledge-chips" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {Array.from(new Set(props.output.applied_knowledge.map(k => k.source))).map((source, i) => (
                      <div key={i} className="source-badge mono" style={{ 
                        padding: '4px 10px', 
                        background: 'rgba(197, 255, 0, 0.1)', 
                        border: '1px solid var(--primary)',
                        color: 'var(--primary)',
                        fontSize: '9px',
                        borderRadius: '2px',
                        textTransform: 'uppercase'
                      }}>
                        SOURCE: {source}
                      </div>
                    ))}
                  </div>
                  <div className="applied-rules-list" style={{ marginTop: '16px' }}>
                    {props.output.applied_knowledge.slice(0, 3).map((rule, i) => (
                      <div key={i} className="rule-item mono" style={{ 
                        fontSize: '11px', 
                        color: '#888', 
                        padding: '8px 0',
                        borderBottom: '1px solid #111',
                        display: 'flex',
                        gap: '8px'
                      }}>
                        <span style={{ color: 'var(--primary)' }}>&gt;</span>
                        <span>{rule.content}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Script Section */}
              <div className="script-premium-container" style={isMobile ? { padding: '30px 20px', gap: '24px' } : {}}>
                <div className="script-premium-header">
                  <div className="mono text-xxs" style={{ fontSize: '8px' }}>DATE: <span className="text-white">{new Date().toLocaleDateString()}</span></div>
                  <div className="mono text-xxs" style={{ fontSize: '8px' }}>PLATFORM: <span className="text-primary">{props.platform.toUpperCase()}</span></div>
                </div>
                
                <div className="script-premium-body mono" style={isMobile ? { fontSize: '1.05rem', lineHeight: '1.7' } : {}}>
                  {props.output.script}
                </div>

                <div className="script-premium-footer" style={isMobile ? { flexDirection: 'column' } : {}}>
                   <button onClick={props.handleGenerate} className="premium-action-btn" style={isMobile ? { width: '100%', justifyContent: 'center', padding: '16px' } : {}}>
                     <RefreshCw size={14} /> RE_ENGINEER
                   </button>
                   <button onClick={() => props.copyToClipboard(props.output!.script)} className="premium-action-btn" style={isMobile ? { width: '100%', justifyContent: 'center', padding: '16px' } : {}}>
                     <Copy size={14} /> COPY_ENGINEERED_SCRIPT
                   </button>
                </div>
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

        .script-premium-container {
          background: #000;
          border: 1px solid var(--primary);
          padding: 40px;
          display: flex;
          flex-direction: column;
          gap: 32px;
          position: relative;
          box-shadow: 0 0 30px rgba(197, 255, 0, 0.05);
        }
        .script-premium-header {
          display: flex;
          gap: 24px;
          color: #444;
          font-weight: 800;
        }
        .text-white { color: #fff; }
        .script-premium-body {
          color: #fff;
          font-size: 1.2rem;
          line-height: 1.6;
          white-space: pre-wrap;
          letter-spacing: 0.05em;
          word-spacing: 0.1em;
        }
        .script-premium-footer {
          display: flex;
          gap: 16px;
        }
        .premium-action-btn {
          background: transparent;
          border: 1px solid #111;
          color: #444;
          padding: 10px 20px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .premium-action-btn:hover {
          border-color: #222;
          color: var(--primary);
          background: rgba(197, 255, 0, 0.02);
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
          .output-section { padding: 24px; }
        }
      `}</style>
    </div>
  );
}

