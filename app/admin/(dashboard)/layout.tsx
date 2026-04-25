import React from 'react';
import Link from 'next/link';
import { 
  LayoutGrid, 
  BookOpen, 
  FileText, 
  Terminal, 
  Users, 
  LogOut,
  Activity,
  Cpu,
  Zap,
  Settings
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient('admin');
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  const navItems = [
    { name: 'DASHBOARD', icon: LayoutGrid, href: '/admin' },
    { name: 'KNOWLEDGE', icon: BookOpen, href: '/admin/knowledge' },
    { name: 'LOGS', icon: FileText, href: '/admin/logs' },
    { name: 'PROMPTS', icon: Terminal, href: '/admin/prompts' },
    { name: 'USERS', icon: Users, href: '/admin/users' },
    { name: 'SETTINGS', icon: Settings, href: '/admin/settings' },
  ];

  // Inline Styles
  const styles: Record<string, React.CSSProperties> = {
    container: {
      display: 'flex',
      height: '100vh',
      backgroundColor: '#050505',
      color: '#e5e5e5',
      overflow: 'hidden',
      fontFamily: 'monospace',
    },
    sidebar: {
      width: '280px',
      borderRight: '1px solid #111',
      backgroundColor: '#080808',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    },
    logoSection: {
      padding: '32px',
      borderBottom: '1px solid #111',
    },
    logoContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      color: '#c5ff00',
    },
    logoIcon: {
      width: '40px',
      height: '40px',
      border: '1px solid #c5ff00',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '4px 4px 0px rgba(197, 255, 0, 0.1)',
    },
    nav: {
      flex: 1,
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      overflowY: 'auto',
    },
    navLink: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '16px',
      border: '1px solid transparent',
      transition: 'all 0.2s',
      textDecoration: 'none',
      color: '#e5e5e5',
    },
    navIcon: {
      width: '20px',
      height: '20px',
      color: '#444',
    },
    navText: {
      fontSize: '12px',
      fontWeight: 'bold',
      letterSpacing: '2px',
      textTransform: 'uppercase',
    },
    telemetry: {
      padding: '24px',
      marginTop: 'auto',
      borderTop: '1px solid #111',
      backgroundColor: 'rgba(5, 5, 5, 0.5)',
    },
    main: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative',
    },
    header: {
      height: '80px',
      borderBottom: '1px solid #111',
      backgroundColor: 'rgba(8, 8, 8, 0.8)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 40px',
      position: 'sticky',
      top: 0,
      zIndex: 10,
    },
    contentArea: {
      flex: 1,
      overflowY: 'auto',
      padding: '48px',
      position: 'relative',
    },
    operatorInfo: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      borderRight: '1px solid #111',
      paddingRight: '32px',
    }
  };

  return (
    <div style={styles.container}>
      {/* Sidebar Architecture */}
      <aside style={styles.sidebar}>
        <div style={styles.logoSection}>
          <div style={styles.logoContainer}>
            <div style={styles.logoIcon}>
              <Zap size={20} fill="#c5ff00" />
            </div>
            <div>
              <div style={{ fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.2em', opacity: 0.5 }}>ADMIN_SYS</div>
              <div style={{ fontSize: '18px', fontWeight: 'black', letterSpacing: '-0.05em', color: '#fff' }}>V_2.0_ENG</div>
            </div>
          </div>
        </div>

        <nav style={styles.nav}>
          <div style={{ padding: '0 12px', marginBottom: '24px' }}>
            <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#444', letterSpacing: '0.3em', textTransform: 'uppercase' }}>Navigation_Track</span>
          </div>
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              style={styles.navLink}
              className="admin-nav-link"
            >
              <item.icon style={styles.navIcon} className="nav-icon" />
              <span style={styles.navText}>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* System Telemetry */}
        <div style={styles.telemetry}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '9px', fontWeight: 'bold' }}>
                <span style={{ color: '#444' }}>SYS_LOAD:</span>
                <span style={{ color: '#c5ff00' }}>0.02ms</span>
             </div>
             <div style={{ width: '100%', height: '4px', backgroundColor: '#111', overflow: 'hidden' }}>
                <div style={{ width: '33%', height: '100%', backgroundColor: 'rgba(197, 255, 0, 0.4)' }}></div>
             </div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '9px', fontWeight: 'bold', color: '#444' }}>
                <Activity size={10} color="#c5ff00" />
                <span>LINK_ESTABLISHED: TRUE</span>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={styles.main}>
        {/* Top Bar / Command Center */}
        <header style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu size={14} color="#c5ff00" />
              <h1 style={{ fontSize: '12px', fontWeight: 'bold', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                Command_Center / <span style={{ color: '#c5ff00' }}>Main</span>
              </h1>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <div style={styles.operatorInfo}>
              <span style={{ fontSize: '9px', color: '#444', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '4px' }}>Authenticated_Operator</span>
              <span style={{ fontSize: '12px', color: '#fff', fontWeight: 'black' }}>{user.email?.toUpperCase()}</span>
            </div>
            
            <form action="/auth/signout" method="post">
              <button 
                type="submit"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 24px',
                  border: '1px solid #222',
                  backgroundColor: 'transparent',
                  color: '#777',
                  fontSize: '10px',
                  fontWeight: 'black',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                className="admin-logout-btn"
              >
                <LogOut size={16} />
                <span>Deactivate</span>
              </button>
            </form>
          </div>
        </header>

        {/* Page Content */}
        <div style={styles.contentArea} className="custom-scrollbar">
          <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
            {children}
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .admin-nav-link:hover {
          border-color: #222 !important;
          background-color: #0c0c0c !important;
        }
        .admin-nav-link:hover .nav-icon {
          color: #c5ff00 !important;
        }
        .admin-logout-btn:hover {
          border-color: #c5ff00 !important;
          color: #c5ff00 !important;
          background-color: rgba(197, 255, 0, 0.05) !important;
        }
      `}} />
    </div>
  );
}
