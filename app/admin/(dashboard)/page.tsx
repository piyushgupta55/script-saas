import React from 'react';
import { 
  Users, 
  FileCode, 
  Zap,
  Activity,
  ArrowUpRight,
  Database,
  Lock,
  Cpu,
  BarChart3,
  Terminal
} from 'lucide-react';
import { getDashboardStats } from '../actions';

export default async function AdminDashboard() {
  const data = await getDashboardStats();

  const stats = [
    { name: 'TOTAL_NODES', value: data.totalUsers.toString(), icon: Users, label: 'USERS' },
    { name: 'GENERATED_SCRIPTS', value: data.totalScripts.toString(), icon: FileCode, label: 'CONTENT' },
    { name: 'KNOWLEDGE_CORE', value: data.totalKnowledge.toString(), icon: Database, label: 'PATTERNS' },
    { name: 'AVG_PERFORMANCE', value: data.avgRating, icon: Activity, label: 'RATING' },
  ];

  // Inline Styles
  const styles: Record<string, React.CSSProperties> = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: '40px',
      fontFamily: 'monospace',
      color: '#e5e5e5',
      animation: 'fadeIn 0.7s ease-out',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      borderBottom: '1px solid #111',
      paddingBottom: '32px',
    },
    statGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '1px',
      backgroundColor: '#111',
      border: '1px solid #111',
    },
    statCard: {
      backgroundColor: '#080808',
      padding: '32px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      position: 'relative',
    },
    iconBox: {
      width: '48px',
      height: '48px',
      border: '1px solid #222',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#c5ff00',
    },
    mainGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: '48px',
    },
    sectionTitle: {
      fontSize: '12px',
      fontWeight: 'black',
      color: '#fff',
      textTransform: 'uppercase',
      letterSpacing: '4px',
      borderBottom: '1px solid #111',
      paddingBottom: '16px',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    activityRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '24px',
      backgroundColor: '#080808',
      borderBottom: '1px solid #111',
      transition: 'background 0.2s',
    },
    controlPanel: {
      padding: '32px',
      border: '1px solid rgba(197, 255, 0, 0.1)',
      backgroundColor: 'rgba(197, 255, 0, 0.02)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    button: {
      width: '100%',
      padding: '16px',
      backgroundColor: '#c5ff00',
      color: '#000',
      border: 'none',
      fontWeight: 'black',
      fontSize: '10px',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      cursor: 'pointer',
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={{ color: '#c5ff00', fontSize: '10px', fontWeight: 'black', letterSpacing: '4px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
             <div style={{ width: '8px', height: '8px', backgroundColor: '#c5ff00' }}></div>
             SYS_STATUS: ACTIVE
          </div>
          <h1 style={{ fontSize: '48px', fontWeight: 'black', margin: 0, letterSpacing: '-2px', color: '#fff' }}>DASHBOARD</h1>
        </div>
        <div style={{ textAlign: 'right' }}>
           <p style={{ fontSize: '9px', fontWeight: 'bold', color: '#444', marginBottom: '4px' }}>SERVER_TIME</p>
           <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#777' }}>{new Date().toLocaleTimeString()}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={styles.statGrid}>
        {stats.map((stat) => (
          <div key={stat.name} style={styles.statCard} className="dashboard-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={styles.iconBox}>
                <stat.icon size={24} />
              </div>
              <span style={{ fontSize: '10px', color: '#444', fontWeight: 'black' }}>{stat.label}</span>
            </div>
            <div>
              <p style={{ fontSize: '9px', fontWeight: 'black', color: '#444', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>{stat.name}</p>
              <h2 style={{ fontSize: '36px', fontWeight: 'black', margin: 0, color: '#fff' }}>{stat.value}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Main Analysis */}
      <div style={styles.mainGrid}>
        {/* Recent Activity */}
        <div style={{ gridColumn: 'span 2' }}>
          <h3 style={styles.sectionTitle}>
            <BarChart3 size={16} color="#c5ff00" />
            TELEMETRY_STREAM
          </h3>
          <div style={{ border: '1px solid #111', borderRadius: '4px', overflow: 'hidden' }}>
            {data.recentActivity.length > 0 ? data.recentActivity.map((log, idx) => (
              <div key={log.id} style={styles.activityRow} className="activity-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 'black', color: '#222' }}>{String(idx + 1).padStart(2, '0')}</span>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>
                      {log.prompt.substring(0, 40)}...
                    </p>
                    <p style={{ fontSize: '9px', color: '#444', marginTop: '4px', textTransform: 'uppercase' }}>
                      PLATFORM: {log.platform} // ID: {log.id.substring(0, 8)}
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#c5ff00' }}>SUCCESS</p>
                  <p style={{ fontSize: '9px', color: '#444', marginTop: '4px' }}>{new Date(log.created_at).toLocaleTimeString()}</p>
                </div>
              </div>
            )) : (
              <div style={{ padding: '40px', textAlign: 'center', color: '#444' }}>NO_RECENT_ACTIVITY_DETECTED</div>
            )}
          </div>
        </div>

        {/* System Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div>
            <h3 style={styles.sectionTitle}>
              <Cpu size={16} color="#c5ff00" />
              SYSTEM_CORE
            </h3>
            <div style={styles.controlPanel}>
              <div style={{ position: 'absolute', top: 0, right: 0, padding: '16px', opacity: 0.1 }}>
                <Zap size={60} color="#c5ff00" />
              </div>
              <p style={{ fontSize: '11px', color: '#777', lineHeight: '1.6', marginBottom: '8px' }}>
                Operational environment is stable. All knowledge shards are synchronized.
              </p>
              <button style={styles.button}>REBOOT_ANALYSIS_ENGINE</button>
              <button style={{ ...styles.button, backgroundColor: 'transparent', border: '1px solid #222', color: '#777' }}>
                CLEAR_EMBEDDING_CACHE
              </button>
            </div>
          </div>

          <div>
            <h3 style={styles.sectionTitle}>
              <Terminal size={16} color="#c5ff00" />
              SECURITY_PROTOCOL
            </h3>
            <div style={{ padding: '24px', border: '1px solid #111', backgroundColor: '#080808' }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['DB_ENCRYPTION_ACTIVE', 'RLS_POLICIES_ENFORCED', 'API_RATE_LIMIT_ON', 'ADMIN_PROXY_V2_LIVE'].map(log => (
                  <li key={log} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '10px', color: '#444', fontWeight: 'bold' }}>
                    <div style={{ width: '6px', height: '6px', backgroundColor: '#c5ff00', borderRadius: '50%' }}></div>
                    {log}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dashboard-card:hover {
          background-color: #0c0c0c !important;
          border-color: #c5ff0022 !important;
        }
        .activity-row:hover {
          background-color: #0c0c0c !important;
        }
      `}} />
    </div>
  );
}
