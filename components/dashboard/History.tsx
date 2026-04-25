'use client';

import { 
  Archive, 
  Copy, 
  RotateCcw, 
  Search,
  FileText
} from 'lucide-react';

interface HistoryItem {
  id: string;
  idea: string;
  hooks: string[];
  script: string;
  date: string;
  platform: string;
  tone: string;
}

interface HistoryProps {
  history: HistoryItem[];
  setPrompt: (v: string) => void;
  setPlatform: (v: string) => void;
  setTone: (v: string) => void;
  setActiveTab: (tab: 'generator' | 'history' | 'settings') => void;
  copyToClipboard: (text: string) => void;
}

export default function History(props: HistoryProps) {
  return (
    <div className="history-view">
      <div className="view-header">
        <div>
          <h1 className="mono">01 // LOG_ARCHIVE</h1>
          <p className="mono text-xxs text-muted">RETRIEVED_RECORDS: {props.history.length}</p>
        </div>
        <div className="header-actions">
           <div className="search-mock">
             <Search size={14} className="text-muted" />
             <span className="mono text-xxs text-muted">FILTER_LOGS...</span>
           </div>
        </div>
      </div>
      
      <div className="history-list">
        {props.history.length === 0 ? (
          <div className="empty-state">
            <Archive size={48} className="text-muted mb-16" />
            <div className="mono text-sm text-muted">NO_RECORDS_IN_ARCHIVE</div>
          </div>
        ) : (
          props.history.map((item) => (
            <div key={item.id} className="history-item-card">
              <div className="card-accent"></div>
              <div className="history-meta">
                <div className="meta-tag">
                  <span className="mono text-xxs text-muted">DATE:</span>
                  <span className="mono text-xxs">{item.date}</span>
                </div>
                <div className="meta-tag">
                  <span className="mono text-xxs text-muted">PLATFORM:</span>
                  <span className="mono text-xxs text-primary">{item.platform}</span>
                </div>
              </div>
              <div className="history-idea mono">{item.idea}</div>
              <div className="history-actions-row">
                <button onClick={() => { 
                  props.setPrompt(item.idea); 
                  props.setPlatform(item.platform); 
                  props.setTone(item.tone); 
                  props.setActiveTab('generator');
                }} className="mono action-btn">
                  <RotateCcw size={12} /> REUSE
                </button>
                <button onClick={() => props.copyToClipboard(item.script)} className="mono action-btn">
                  <Copy size={12} /> COPY_SCRIPT
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .history-view { 
          padding: 40px; 
          max-width: 1000px;
          margin: 0 auto;
        }
        .view-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 32px;
          border-bottom: 1px solid var(--border);
          margin-bottom: 40px;
        }
        .view-header h1 { font-size: 1.25rem; font-weight: 800; letter-spacing: 0.1em; }
        
        .search-mock {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 16px;
          border: 1px solid var(--border);
          background: #000;
          border-radius: 4px;
        }

        .history-list { display: flex; flex-direction: column; gap: 20px; }
        .history-item-card {
          padding: 32px;
          background: rgba(255,255,255,0.01);
          border: 1px solid var(--border);
          position: relative;
          transition: all 0.2s;
        }
        .history-item-card:hover {
          border-color: var(--primary);
          background: rgba(197, 255, 0, 0.01);
          transform: translateY(-2px);
        }
        .card-accent {
          position: absolute;
          top: 0; left: 0; bottom: 0;
          width: 2px;
          background: var(--primary);
          opacity: 0.2;
        }

        .history-meta { display: flex; gap: 24px; margin-bottom: 20px; }
        .meta-tag { display: flex; gap: 8px; align-items: center; }
        
        .history-idea { 
          font-size: 1.1rem; 
          margin-bottom: 32px; 
          color: var(--text-main);
          line-height: 1.5;
        }

        .history-actions-row { display: flex; gap: 12px; }
        .action-btn { 
          background: transparent; 
          border: 1px solid var(--border); 
          color: #666; 
          padding: 8px 16px; 
          cursor: pointer; 
          font-size: 10px; 
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
        }
        .action-btn:hover { color: var(--primary); border-color: var(--primary); }
        
        .empty-state {
          padding: 120px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .mono { font-family: 'JetBrains Mono', monospace; }
        .text-xxs { font-size: 10px; }
        .text-sm { font-size: 14px; }
        .text-primary { color: var(--primary); }
        .text-muted { color: #444; }
        .mb-16 { margin-bottom: 16px; }

        @media (max-width: 768px) {
          .history-view { padding: 24px; }
          .history-meta { flex-direction: column; gap: 8px; }
        }
      `}</style>
    </div>
  );
}

