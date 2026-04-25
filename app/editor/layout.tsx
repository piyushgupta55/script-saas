'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Sidebar from '@/components/dashboard/Sidebar';
import 'remixicon/fonts/remixicon.css';

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'Operator');
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <div className="dashboard-layout">
      {/* Mobile Header */}
      <div className="mobile-header">
        <div className="mono logo-text">SCRIPTSAAS_SYS</div>
        <button className="menu-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <i className={isSidebarOpen ? "ri-close-line" : "ri-menu-line"}></i>
        </button>
      </div>

      <div className={`sidebar-wrapper ${isSidebarOpen ? 'open' : ''}`}>
        <Sidebar 
          onLogout={handleLogout} 
          userName={userName} 
          onItemClick={() => setIsSidebarOpen(false)} 
        />
        {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />}
      </div>

      <main className="main-content">
        {children}
      </main>

      <style jsx global>{`
        .dashboard-layout {
          display: flex;
          height: 100vh;
          background: #050505;
          color: white;
          overflow: hidden;
          position: relative;
        }
        .mobile-header {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: #111;
          border-bottom: 1px solid #222;
          padding: 0 20px;
          align-items: center;
          justify-content: space-between;
          z-index: 2000;
        }
        .menu-toggle {
          background: transparent;
          border: none;
          color: #c5ff00;
          font-size: 24px;
          cursor: pointer;
        }
        .logo-text { font-size: 12px; font-weight: 800; }
        
        .main-content {
          flex: 1;
          overflow-y: auto;
          background: radial-gradient(circle at 50% 0%, rgba(197, 255, 0, 0.02) 0%, transparent 50%);
          position: relative;
        }
        
        @media (max-width: 768px) {
          .mobile-header { display: flex; }
          .main-content { margin-top: 60px; }
          .sidebar-wrapper {
            position: fixed;
            top: 0;
            left: -260px;
            bottom: 0;
            width: 260px;
            z-index: 3000;
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .sidebar-wrapper.open {
            transform: translateX(260px);
          }
          .sidebar-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(4px);
            z-index: -1;
          }
        }
      `}</style>
    </div>
  );
}
