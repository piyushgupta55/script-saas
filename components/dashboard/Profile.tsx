'use client';

interface ProfileProps {
  userName: string | null;
  email: string | null;
  historyCount: number;
}

export default function Profile({ userName, email, historyCount }: ProfileProps) {
  return (
    <div className="profile-view">
      <div className="view-header">
        <div className="header-icon"><i className="ri-user-smile-fill"></i></div>
        <div>
          <h1 className="mono">OPERATOR_PROFILE</h1>
          <p className="mono text-xxs text-muted">ID: {email?.split('@')[0].toUpperCase() || 'UNKNOWN'}</p>
        </div>
      </div>

      <div className="profile-grid">
        {/* Main Profile Card */}
        <div className="profile-main-card">
          <div className="profile-cover"></div>
          <div className="profile-content">
            <div className="avatar-large">
              <i className="ri-user-3-line"></i>
            </div>
            <div className="profile-details">
              <h2 className="mono">{userName || 'Loading...'}</h2>
              <p className="text-dim">{email}</p>
              <div className="badge mono">ELITE_OPERATOR</div>
            </div>
          </div>

          <div className="profile-stats">
            <div className="stat-box">
              <span className="stat-value mono">{historyCount}</span>
              <span className="stat-label mono">SCRIPTS_GENERATED</span>
            </div>
            <div className="stat-box">
              <span className="stat-value mono">{historyCount * 5}</span>
              <span className="stat-label mono">HOOKS_CREATED</span>
            </div>
            <div className="stat-box">
              <span className="stat-value mono">100%</span>
              <span className="stat-label mono">ENGINE_RELIABILITY</span>
            </div>
          </div>
        </div>

        {/* Account Details */}
        <div className="details-grid">
          <div className="detail-card">
            <h3 className="mono text-xs text-primary mb-16">OPERATIONAL_DATA</h3>
            <div className="data-row">
              <span className="mono text-xxs text-muted">MEMBER_SINCE</span>
              <span className="mono text-xxs">APRIL 2026</span>
            </div>
            <div className="data-row">
              <span className="mono text-xxs text-muted">ACCOUNT_STATUS</span>
              <span className="mono text-xxs text-success">ACTIVE</span>
            </div>
            <div className="data-row">
              <span className="mono text-xxs text-muted">TIER</span>
              <span className="mono text-xxs">PROFESSIONAL</span>
            </div>
          </div>

          <div className="detail-card">
            <h3 className="mono text-xs text-primary mb-16">SYSTEM_ACCESS</h3>
            <p className="text-dim text-xs mb-16">
              Your account is secured with end-to-end encryption. Session tokens are refreshed every 24 hours.
            </p>
            <div className="mono text-xxs text-muted">LAST_LOGIN: {new Date().toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .profile-view { 
          padding: 40px; 
          max-width: 1000px;
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
        }
        .view-header h1 { font-size: 1.5rem; font-weight: 800; margin-bottom: 4px; }
        
        .profile-grid { display: flex; flex-direction: column; gap: 24px; }
        
        .profile-main-card {
          background: #080808;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          overflow: hidden;
        }
        .profile-cover {
          height: 120px;
          background: linear-gradient(90deg, #c5ff00 0%, #000 100%);
          opacity: 0.1;
        }
        .profile-content {
          padding: 0 40px 40px;
          margin-top: -40px;
          display: flex;
          align-items: flex-end;
          gap: 24px;
        }
        .avatar-large {
          width: 100px;
          height: 100px;
          background: #000;
          border: 4px solid #080808;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          color: #c5ff00;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          position: relative;
          z-index: 5;
        }
        .avatar-large::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 140px;
          height: 140px;
          
          z-index: -1;
          pointer-events: none;
        }
        .profile-details { flex: 1; margin-bottom: 10px; position: relative; z-index: 5; }
        .profile-details h2 { font-size: 1.8rem; margin-bottom: 4px; }
        .text-dim { color: #888; margin-bottom: 12px; }
        .badge {
          display: inline-block;
          padding: 4px 12px;
          background: rgba(197, 255, 0, 0.1);
          color: #c5ff00;
          font-size: 10px;
          border: 1px solid rgba(197, 255, 0, 0.2);
          border-radius: 4px;
        }
        
        .profile-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          background: rgba(255, 255, 255, 0.01);
        }
        .stat-box {
          padding: 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          border-right: 1px solid rgba(255, 255, 255, 0.05);
        }
        .stat-box:last-child { border-right: none; }
        .stat-value { font-size: 1.5rem; font-weight: 800; color: white; margin-bottom: 4px; }
        .stat-label { font-size: 9px; color: #444; letter-spacing: 0.1em; }
        
        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        .detail-card {
          padding: 32px;
          background: #080808;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
        }
        .data-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
        }
        .text-success { color: #c5ff00; }
        .mb-16 { margin-bottom: 16px; }

        .mono { font-family: 'JetBrains Mono', monospace; }
        .text-xxs { font-size: 10px; }
        .text-xs { font-size: 12px; }
        .text-primary { color: #c5ff00; }
        .text-muted { color: #444; }

        @media (max-width: 768px) {
          .profile-view { padding: 24px; }
          .profile-content { flex-direction: column; align-items: center; text-align: center; }
          .avatar-large { margin-bottom: 16px; }
          .profile-stats { grid-template-columns: 1fr; }
          .stat-box { border-right: none; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
          .details-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
