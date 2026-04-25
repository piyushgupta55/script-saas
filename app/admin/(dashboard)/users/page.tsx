'use client'

import { useState, useEffect, useMemo } from 'react'
import { 
  Users, 
  Search, 
  Shield, 
  ShieldOff, 
  Zap, 
  ZapOff, 
  RotateCcw,
  Trash2,
  Filter,
  CheckCircle2,
  XCircle
} from 'lucide-react'
import { 
  getUsersMeta, 
  updateUserPlan, 
  toggleUserBlock, 
  resetUsageCount, 
  deleteUserMeta 
} from './actions'

interface UserMeta {
  id: string
  email: string
  usage_count: number
  plan: 'free' | 'pro'
  is_blocked: boolean
  created_at: string
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserMeta[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterPlan, setFilterPlan] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    setLoading(true)
    try {
      const data = await getUsersMeta()
      setUsers(data || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.email.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesPlan = filterPlan === 'all' ? true : user.plan === filterPlan
      const matchesStatus = filterStatus === 'all' 
        ? true 
        : filterStatus === 'blocked' ? user.is_blocked : !user.is_blocked
      return matchesSearch && matchesPlan && matchesStatus
    })
  }, [users, searchQuery, filterPlan, filterStatus])

  // Styles
  const styles: Record<string, React.CSSProperties> = {
    container: {
      padding: '30px',
      backgroundColor: '#050505',
      minHeight: '100vh',
      color: '#e5e5e5',
      fontFamily: 'monospace'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
      borderBottom: '1px solid #111',
      paddingBottom: '20px'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'black',
      margin: 0,
      color: '#fff',
      letterSpacing: '2px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    filterBar: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1fr',
      gap: '16px',
      backgroundColor: '#0a0a0a',
      padding: '20px',
      border: '1px solid #111',
      marginBottom: '30px'
    },
    input: {
      backgroundColor: '#000',
      border: '1px solid #222',
      color: '#fff',
      padding: '12px',
      fontSize: '12px',
      outline: 'none',
      width: '100%'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      backgroundColor: '#080808',
      border: '1px solid #111'
    },
    th: {
      textAlign: 'left',
      padding: '16px',
      fontSize: '10px',
      fontWeight: 'bold',
      color: '#444',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      borderBottom: '2px solid #111'
    },
    td: {
      padding: '16px',
      fontSize: '12px',
      borderBottom: '1px solid #111',
      color: '#aaa'
    },
    badge: {
      padding: '4px 8px',
      fontSize: '10px',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      borderRadius: '2px'
    },
    actionBtn: {
      background: 'none',
      border: '1px solid #222',
      color: '#666',
      padding: '8px',
      cursor: 'pointer',
      marginLeft: '8px',
      transition: 'all 0.2s',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px'
    }
  }

  const handleToggleBlock = async (user: UserMeta) => {
    await toggleUserBlock(user.id, !user.is_blocked)
    loadUsers()
  }

  const handleChangePlan = async (user: UserMeta) => {
    const newPlan = user.plan === 'free' ? 'pro' : 'free'
    await updateUserPlan(user.id, newPlan)
    loadUsers()
  }

  const handleResetUsage = async (id: string) => {
    if (confirm('Reset usage count for this user?')) {
      await resetUsageCount(id)
      loadUsers()
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this user meta?')) {
      await deleteUserMeta(id)
      loadUsers()
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          <Users size={24} color="#c5ff00" />
          USER_REGISTRY_CORE
        </h1>
        <div style={{ color: '#444', fontSize: '10px' }}>
          ACTIVE_NODES: {users.length}
        </div>
      </div>

      <div style={styles.filterBar}>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '14px', color: '#444' }} />
          <input 
            style={{ ...styles.input, paddingLeft: '35px' }}
            placeholder="SEARCH_BY_EMAIL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select style={styles.input} value={filterPlan} onChange={(e) => setFilterPlan(e.target.value)}>
          <option value="all">PLAN: ALL</option>
          <option value="free">PLAN: FREE</option>
          <option value="pro">PLAN: PRO</option>
        </select>
        <select style={styles.input} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">STATUS: ALL</option>
          <option value="active">STATUS: ACTIVE</option>
          <option value="blocked">STATUS: BLOCKED</option>
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px', color: '#c5ff00' }}>SYNCHRONIZING_USER_DATA...</div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>USER_IDENTIFIER</th>
              <th style={styles.th}>PLAN_TYPE</th>
              <th style={styles.th}>USAGE_LOAD</th>
              <th style={styles.th}>SECURITY_STATUS</th>
              <th style={styles.th}>REGISTERED</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>OPERATIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td style={styles.td}>
                  <div style={{ color: '#fff', fontWeight: 'bold' }}>{user.email}</div>
                  <div style={{ fontSize: '9px', color: '#444' }}>ID: {user.id}</div>
                </td>
                <td style={styles.td}>
                  <span style={{ 
                    ...styles.badge, 
                    backgroundColor: user.plan === 'pro' ? 'rgba(197, 255, 0, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                    color: user.plan === 'pro' ? '#c5ff00' : '#888',
                    border: `1px solid ${user.plan === 'pro' ? '#c5ff00' : '#333'}`
                  }}>
                    {user.plan}
                  </span>
                </td>
                <td style={styles.td}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: user.usage_count > 100 ? '#ff4444' : '#fff' }}>{user.usage_count}</span>
                    <button 
                      onClick={() => handleResetUsage(user.id)}
                      style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer' }}
                      title="Reset Usage"
                    >
                      <RotateCcw size={12} />
                    </button>
                  </div>
                </td>
                <td style={styles.td}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {user.is_blocked ? (
                      <span style={{ color: '#ff4444', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px' }}>
                        <XCircle size={12} /> BLOCKED
                      </span>
                    ) : (
                      <span style={{ color: '#c5ff00', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px' }}>
                        <CheckCircle2 size={12} /> ACTIVE
                      </span>
                    )}
                  </div>
                </td>
                <td style={styles.td}>
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td style={{ ...styles.td, textAlign: 'right' }}>
                  <button 
                    onClick={() => handleChangePlan(user)}
                    style={{ ...styles.actionBtn, borderColor: user.plan === 'pro' ? '#c5ff00' : '#222' }}
                    title={user.plan === 'free' ? 'Upgrade to PRO' : 'Downgrade to FREE'}
                  >
                    {user.plan === 'free' ? <Zap size={14} /> : <ZapOff size={14} />}
                  </button>
                  <button 
                    onClick={() => handleToggleBlock(user)}
                    style={{ ...styles.actionBtn, borderColor: user.is_blocked ? '#c5ff00' : '#222', color: user.is_blocked ? '#c5ff00' : '#666' }}
                    title={user.is_blocked ? 'Unblock User' : 'Block User'}
                  >
                    {user.is_blocked ? <Shield size={14} /> : <ShieldOff size={14} />}
                  </button>
                  <button 
                    onClick={() => handleDelete(user.id)}
                    style={{ ...styles.actionBtn, borderColor: '#300', color: '#700' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
