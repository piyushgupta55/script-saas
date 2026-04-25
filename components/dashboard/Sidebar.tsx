'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  Zap,
  History,
  Settings as SettingsIcon,
  User,
  LogOut,
  BarChart3,
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  onLogout: () => void;
  userName: string | null;
  onItemClick?: () => void;
}

export default function Sidebar({ onLogout, userName, onItemClick }: SidebarProps) {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);

  const menuItems = [
    { icon: <Zap size={18} />, label: 'GENERATE', href: '/editor' },
    { icon: <History size={18} />, label: 'HISTORY', href: '/editor/history' },
    { icon: <User size={18} />, label: 'PROFILE', href: '/editor/profile' },
    { icon: <SettingsIcon size={18} />, label: 'SETTINGS', href: '/editor/settings' },
  ];

  // Inline Style Objects
  const styles = {
    sidebar: {
      width: '260px',
      height: '100vh',
      backgroundColor: 'var(--bg-surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column' as const,
      padding: '24px 0',
      flexShrink: 0,
      zIndex: 1000,
    },
    header: {
      padding: '0 24px 32px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      borderBottom: '1px solid var(--border)',
      marginBottom: '24px',
    },
    logoBox: {
      width: '20px',
      height: '20px',
      border: '1px solid var(--primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoInner: {
      width: '8px',
      height: '8px',
      backgroundColor: 'var(--primary)',
      boxShadow: '0 0 10px var(--primary)',
    },
    nav: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '4px',
      padding: '0 12px',
    },
    sectionLabel: {
      padding: '0 12px 8px',
      color: '#444',
      fontSize: '10px',
      letterSpacing: '0.1em',
    },
    navItem: (href: string, isActive: boolean, isHovered: boolean) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px',
      textDecoration: 'none',
      color: isActive ? 'var(--primary)' : (isHovered ? 'var(--text-main)' : 'var(--text-dim)'),
      backgroundColor: isActive ? 'var(--primary-muted)' : (isHovered ? 'rgba(255, 255, 255, 0.03)' : 'transparent'),
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative' as const,
      border: `1px solid ${isActive ? 'rgba(197, 255, 0, 0.2)' : (isHovered ? 'var(--border)' : 'transparent')}`,
    }),
    activeIndicator: {
      position: 'absolute' as const,
      right: '-12px',
      top: '12px',
      bottom: '12px',
      width: '3px',
      backgroundColor: 'var(--primary)',
      boxShadow: '-2px 0 10px var(--primary)',
    },
    footer: {
      padding: '24px 12px 0',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '16px',
      borderTop: '1px solid var(--border)',
    },
    profile: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px',
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
      border: '1px solid var(--border)',
    },
    avatar: {
      width: '32px',
      height: '32px',
      backgroundColor: 'var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--text-dim)',
      border: '1px solid #333',
    },
    logoutBtn: (isHovered: boolean) => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      padding: '14px',
      backgroundColor: isHovered ? 'rgba(255, 68, 68, 0.1)' : 'transparent',
      border: `1px solid ${isHovered ? '#ff4444' : 'var(--border)'}`,
      color: '#ff4444',
      cursor: 'pointer',
      transition: 'all 0.2s',
      transform: isHovered ? 'translateY(-1px)' : 'none',
    }),
  };

  return (
    <aside style={styles.sidebar}>
      <Link 
        href="/editor" 
        style={{ ...styles.header, textDecoration: 'none', color: 'inherit' }}
        onClick={onItemClick}
      >
        <div style={styles.logoBox}>
          <div style={styles.logoInner}></div>
        </div>
        <div className="mono" style={{ fontSize: '11px' }}>SCRIPTSAAS_SYS</div>
      </Link>

      <nav style={styles.nav}>
        <div className="mono" style={styles.sectionLabel}>CORE_MODULES</div>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const isHovered = hoveredItem === item.label;
          return (
            <Link
              key={item.label}
              href={item.href}
              style={styles.navItem(item.href, isActive, isHovered)}
              onMouseEnter={() => setHoveredItem(item.label)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={onItemClick}
            >
              <span style={{ display: 'flex' }}>{item.icon}</span>
              <span className="mono" style={{ fontSize: '11px' }}>{item.label}</span>
              {isActive && <div style={styles.activeIndicator} />}
            </Link>
          );
        })}
      </nav>

      <div style={styles.footer}>
        <div style={styles.profile}>
          <div style={styles.avatar}>
            <User size={16} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="mono" style={{ fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {userName || 'OPERATOR_01'}
            </div>
            <div className="mono" style={{ fontSize: '8px', fontWeight: 600, color: '#777' }}>VERIFIED_NODE</div>
          </div>
        </div>
        <button
          onClick={onLogout}
          style={styles.logoutBtn(isLogoutHovered)}
          onMouseEnter={() => setIsLogoutHovered(true)}
          onMouseLeave={() => setIsLogoutHovered(false)}
        >
          <LogOut size={16} />
          <span className="mono" style={{ fontSize: '11px' }}>TERMINATE_SESSION</span>
        </button>
      </div>


    </aside>
  );
}