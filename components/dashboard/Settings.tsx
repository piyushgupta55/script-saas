'use client';

interface SettingsProps {
  apiKey: string;
  setApiKey: (v: string) => void;
  useUserKey: boolean;
  setUseUserKey: (v: boolean) => void;
  saveSettings: () => void;
  supabase: any;
}

export default function Settings(props: SettingsProps) {
  return (
    <div className="settings-view">
      <div className="view-header">
        <div className="header-icon"><i className="ri-settings-4-fill"></i></div>
        <div>
          <h1 className="mono">CORE_SETTINGS</h1>
          <p className="mono text-xxs text-muted">SYSTEM_CONFIG_V2.0 // STATUS: OPERATIONAL</p>
        </div>
      </div>

      <div className="settings-grid">
        {/* API Section */}
        <div className="settings-card">
          <div className="card-header">
            <i className="ri-key-2-line"></i>
            <h3 className="mono">API_INTEGRATION</h3>
          </div>
          <div className="card-body">
            <p className="text-dim text-sm mb-24">
              Switch between platform credits and your personal OpenAI infrastructure.
            </p>
            
            <div className="toggle-wrapper">
              <span className="mono text-xs">USE_PERSONAL_KEY</span>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={props.useUserKey} 
                  onChange={(e) => props.setUseUserKey(e.target.checked)} 
                />
                <span className="slider"></span>
              </label>
            </div>

            {props.useUserKey && (
              <div className="input-group animate-in">
                <div className="mono text-xxs mb-8 text-primary">OPENAI_SECRET_KEY</div>
                <input 
                  type="password" 
                  className="settings-input" 
                  placeholder="sk-proj-••••••••••••••••••••••••"
                  value={props.apiKey}
                  onChange={(e) => props.setApiKey(e.target.value)}
                />
              </div>
            )}

            <button className="btn-brutal mt-24 mono" onClick={props.saveSettings}>
              SAVE_CONFIG <i className="ri-save-line"></i>
            </button>
            
            <div className="info-box mt-24">
              <i className="ri-shield-check-line"></i>
              <span className="text-xxs">Keys are encrypted and stored locally in your browser.</span>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="settings-card">
          <div className="card-header">
            <i className="ri-lock-password-line"></i>
            <h3 className="mono">SECURITY_PROTOCOLS</h3>
          </div>
          <div className="card-body">
            <p className="text-dim text-sm mb-24">
              Update your system access credentials regularly to maintain operational security.
            </p>
            
            <form 
              onSubmit={async (e) => {
                e.preventDefault();
                const pwd = (e.target as any).new_password.value;
                const { error } = await props.supabase.auth.updateUser({ password: pwd });
                if (error) alert(error.message);
                else {
                  alert('PASSWORD_UPDATED');
                  (e.target as any).reset();
                }
              }}
            >
              <div className="input-group">
                <label className="mono text-xxs mb-8 d-block">NEW_PASSWORD</label>
                <input 
                  name="new_password"
                  type="password" 
                  className="settings-input" 
                  placeholder="••••••••"
                  required
                />
              </div>
              <button type="submit" className="btn-secondary mt-24 mono">
                UPDATE_PASSWORD <i className="ri-shield-flash-line"></i>
              </button>
            </form>
          </div>
        </div>

        {/* Info Section */}
        <div className="settings-card info-card">
          <div className="card-header">
            <i className="ri-information-line"></i>
            <h3 className="mono">SYSTEM_DIAGNOSTICS</h3>
          </div>
          <div className="card-body">
             <div className="stat-row">
               <span className="mono text-xxs">ENGINE_STATUS</span>
               <span className="mono text-xxs text-primary">STABLE</span>
             </div>
             <div className="stat-row">
               <span className="mono text-xxs">LATENCY_INDEX</span>
               <span className="mono text-xxs text-primary">OPTIMAL</span>
             </div>
             <div className="stat-row">
               <span className="mono text-xxs">ENCRYPTION</span>
               <span className="mono text-xxs text-primary">AES-256</span>
             </div>
             <div className="stat-row mt-24 pt-24 border-top">
               <span className="mono text-xxs text-muted">UID: {Math.random().toString(36).substring(7).toUpperCase()}</span>
             </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .settings-view { 
          padding: 40px; 
          max-width: 1200px;
          margin: 0 auto;
        }
        .view-header {
          display: flex;
          align-items: center;
          gap: 20px;
          padding-bottom: 40px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          margin-bottom: 40px;
        }
        .header-icon {
          width: 50px;
          height: 50px;
          background: rgba(197, 255, 0, 0.1);
          border: 1px solid #c5ff00;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #c5ff00;
          border-radius: 8px;
          font-size: 24px;
          box-shadow: 0 0 20px rgba(197, 255, 0, 0.1);
        }
        .view-header h1 { font-size: 1.5rem; font-weight: 800; margin-bottom: 4px; }
        
        .settings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 24px;
        }
        
        .settings-card {
          background: #080808;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s;
          display: flex;
          flex-direction: column;
        }
        .settings-card:hover {
          border-color: rgba(197, 255, 0, 0.3);
          transform: translateY(-4px);
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        }
        
        .card-header {
          padding: 24px;
          background: rgba(255, 255, 255, 0.02);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .card-header i { color: #c5ff00; font-size: 20px; }
        .card-header h3 { font-size: 13px; font-weight: 700; }
        
        .card-body { padding: 24px; flex: 1; display: flex; flex-direction: column; }
        
        .settings-input {
          width: 100%;
          background: #000;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          padding: 14px 16px;
          font-family: inherit;
          outline: none;
          font-size: 14px;
          border-radius: 4px;
          transition: all 0.2s;
        }
        .settings-input:focus { 
          border-color: #c5ff00; 
          box-shadow: 0 0 15px rgba(197, 255, 0, 0.05);
        }
        
        .toggle-wrapper {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255,255,255,0.03);
          padding: 12px 16px;
          border-radius: 6px;
          margin-bottom: 24px;
        }
        
        .switch {
          position: relative;
          display: inline-block;
          width: 48px;
          height: 24px;
        }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: #1a1a1a;
          transition: .3s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 16px; width: 16px;
          left: 3px; bottom: 3px;
          background-color: #444;
          transition: .3s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        input:checked + .slider { 
          background-color: rgba(197, 255, 0, 0.1); 
          border-color: rgba(197, 255, 0, 0.5); 
          box-shadow: 0 0 10px rgba(197, 255, 0, 0.1);
        }
        input:checked + .slider:before { 
          transform: translateX(24px); 
          background-color: #c5ff00; 
          box-shadow: 0 0 10px rgba(197, 255, 0, 0.5);
        }
        
        .btn-brutal {
          background: #c5ff00;
          color: black;
          border: none;
          padding: 14px;
          font-weight: 800;
          cursor: pointer;
          font-size: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border-radius: 4px;
          transition: all 0.2s;
        }
        .btn-brutal:hover { transform: scale(1.02); filter: brightness(1.1); }
        
        .btn-secondary {
          background: transparent;
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 14px;
          font-weight: 700;
          cursor: pointer;
          font-size: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border-radius: 4px;
          transition: all 0.2s;
        }
        .btn-secondary:hover { background: rgba(255, 255, 255, 0.05); border-color: white; }
        
        .info-box {
          display: flex;
          gap: 10px;
          padding: 16px;
          background: rgba(197, 255, 0, 0.02);
          border: 1px dashed rgba(197, 255, 0, 0.2);
          border-radius: 6px;
          color: #888;
        }
        .info-box i { color: #c5ff00; margin-top: 2px; }
        
        .stat-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .border-top { border-top: 1px solid rgba(255, 255, 255, 0.1); }
        .d-block { display: block; }
        
        .animate-in {
          animation: slideDown 0.3s ease-out;
        }
        
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .mono { font-family: 'JetBrains Mono', monospace; }
        .text-xxs { font-size: 10px; }
        .text-xs { font-size: 12px; }
        .text-sm { font-size: 14px; }
        .text-primary { color: #c5ff00; }
        .text-muted { color: #444; }
        .text-dim { color: #888; }
        .mb-24 { margin-bottom: 24px; }
        .mb-8 { margin-bottom: 8px; }
        .mt-24 { margin-top: 24px; }
        .pt-24 { padding-top: 24px; }

        @media (max-width: 768px) {
          .settings-view { padding: 24px; }
          .settings-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
