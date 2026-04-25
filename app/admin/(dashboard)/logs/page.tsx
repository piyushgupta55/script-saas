'use client'

import { useState, useMemo, useEffect } from 'react'
import { 
  Search, 
  Eye, 
  ThumbsUp, 
  ThumbsDown, 
  Trash2, 
  Calendar,
  X,
  Check
} from 'lucide-react'
import { getScriptLogs, updateLogRating, deleteLog } from './actions'

interface ScriptLog {
  id: string
  user_input: string
  output: string
  rating: number | null
  created_at: string
}

export default function ScriptLogsPage() {
  const [logs, setLogs] = useState<ScriptLog[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLog, setSelectedLog] = useState<ScriptLog | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRating, setFilterRating] = useState('all')

  useEffect(() => {
    loadLogs()
  }, [])

  async function loadLogs() {
    setLoading(true)
    try {
      const data = await getScriptLogs()
      setLogs(data || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = log.user_input.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesRating = filterRating === 'all' 
        ? true 
        : filterRating === 'good' ? log.rating === 10 : log.rating === 1
      return matchesSearch && matchesRating
    })
  }, [logs, searchQuery, filterRating])

  const handleUpdateRating = async (id: string, rating: number) => {
    await updateLogRating(id, rating)
    loadLogs()
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this log permanently?')) {
      await deleteLog(id)
      loadLogs()
    }
  }

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
      marginBottom: '30px'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      margin: 0,
      letterSpacing: '2px'
    },
    filterSection: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '20px',
      marginBottom: '30px',
      backgroundColor: '#0a0a0a',
      padding: '20px',
      border: '1px solid #111'
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
      border: '1px solid #111',
      backgroundColor: '#080808'
    },
    th: {
      textAlign: 'left',
      padding: '15px',
      backgroundColor: '#111',
      fontSize: '10px',
      fontWeight: 'bold',
      color: '#c5ff00',
      textTransform: 'uppercase',
      letterSpacing: '1px'
    },
    td: {
      padding: '15px',
      fontSize: '12px',
      borderBottom: '1px solid #111'
    },
    button: {
      background: 'none',
      border: '1px solid #222',
      color: '#777',
      padding: '8px',
      cursor: 'pointer',
      marginRight: '8px',
      transition: 'all 0.2s',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    modalOverlay: {
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.9)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px'
    },
    modal: {
      backgroundColor: '#0a0a0a',
      border: '2px solid #c5ff00',
      width: '100%',
      maxWidth: '900px',
      maxHeight: '80vh',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    },
    modalHeader: {
      padding: '20px',
      borderBottom: '1px solid #111',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    modalContent: {
      padding: '30px',
      overflowY: 'auto',
      flex: 1
    },
    label: {
      fontSize: '10px',
      color: '#444',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      marginBottom: '10px',
      display: 'block',
      letterSpacing: '1px'
    },
    contentBlock: {
      backgroundColor: '#000',
      padding: '20px',
      border: '1px solid #111',
      marginBottom: '20px',
      whiteSpace: 'pre-wrap',
      fontSize: '13px',
      lineHeight: '1.6'
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>SCRIPT_LOGS_DB</h1>
        <div style={{ fontSize: '10px', color: '#444' }}>
          TOTAL_RECORDS: {logs.length}
        </div>
      </div>

      <div style={styles.filterSection}>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '14px', color: '#444' }} />
          <input 
            style={{ ...styles.input, paddingLeft: '35px' }}
            placeholder="SEARCH_USER_INPUT..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select 
          style={styles.input}
          value={filterRating}
          onChange={(e) => setFilterRating(e.target.value)}
        >
          <option value="all">FILTER_BY_RATING: ALL</option>
          <option value="good">FILTER_BY_RATING: GOOD (10)</option>
          <option value="bad">FILTER_BY_RATING: BAD (1)</option>
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px', color: '#c5ff00' }}>LOADING_SYSTEM_LOGS...</div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>USER_INPUT</th>
              <th style={styles.th}>GENERATED_OUTPUT</th>
              <th style={styles.th}>RATING</th>
              <th style={styles.th}>TIMESTAMP</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map(log => (
              <tr key={log.id} style={{ transition: 'background 0.2s' }}>
                <td style={styles.td}>
                  <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {log.user_input}
                  </div>
                </td>
                <td style={styles.td}>
                  <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {log.output}
                  </div>
                </td>
                <td style={styles.td}>
                  {log.rating ? (
                    <span style={{ 
                      color: log.rating === 10 ? '#c5ff00' : '#ff4444',
                      fontWeight: 'bold',
                      fontSize: '10px'
                    }}>
                      {log.rating === 10 ? 'GOOD (10)' : 'BAD (1)'}
                    </span>
                  ) : (
                    <span style={{ color: '#444', fontSize: '10px' }}>PENDING</span>
                  )}
                </td>
                <td style={styles.td}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666', fontSize: '11px' }}>
                    <Calendar size={12} />
                    {new Date(log.created_at).toLocaleString()}
                  </div>
                </td>
                <td style={{ ...styles.td, textAlign: 'right' }}>
                  <button 
                    onClick={() => setSelectedLog(log)}
                    style={{ ...styles.button, borderColor: '#444' }}
                    title="View Full"
                  >
                    <Eye size={14} />
                  </button>
                  <button 
                    onClick={() => handleUpdateRating(log.id, 10)}
                    style={{ ...styles.button, borderColor: log.rating === 10 ? '#c5ff00' : '#222', color: log.rating === 10 ? '#c5ff00' : '#444' }}
                    title="Mark Good"
                  >
                    <ThumbsUp size={14} />
                  </button>
                  <button 
                    onClick={() => handleUpdateRating(log.id, 1)}
                    style={{ ...styles.button, borderColor: log.rating === 1 ? '#ff4444' : '#222', color: log.rating === 1 ? '#ff4444' : '#444' }}
                    title="Mark Bad"
                  >
                    <ThumbsDown size={14} />
                  </button>
                  <button 
                    onClick={() => handleDelete(log.id)}
                    style={{ ...styles.button, borderColor: '#300', color: '#700' }}
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedLog && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={{ margin: 0, fontSize: '14px', color: '#c5ff00' }}>LOG_DETAIL: {selectedLog.id}</h2>
              <button onClick={() => setSelectedLog(null)} style={{ ...styles.button, marginRight: 0 }}>
                <X size={16} />
              </button>
            </div>
            <div style={styles.modalContent}>
              <label style={styles.label}>USER_PROMPT</label>
              <div style={styles.contentBlock}>{selectedLog.user_input}</div>
              
              <label style={styles.label}>GENERATED_SCRIPT</label>
              <div style={styles.contentBlock}>{selectedLog.output}</div>

              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>CREATED_AT</label>
                  <div style={{ color: '#666', fontSize: '12px' }}>{new Date(selectedLog.created_at).toString()}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>CURRENT_RATING</label>
                  <div style={{ color: selectedLog.rating === 10 ? '#c5ff00' : '#ff4444', fontWeight: 'bold' }}>
                    {selectedLog.rating ? (selectedLog.rating === 10 ? 'GOOD' : 'BAD') : 'UNRATED'}
                  </div>
                </div>
              </div>
            </div>
            <div style={{ padding: '20px', borderTop: '1px solid #111', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                onClick={() => { handleUpdateRating(selectedLog.id, 10); setSelectedLog(null); }}
                style={{ ...styles.button, borderColor: '#c5ff00', color: '#c5ff00', padding: '10px 20px', fontSize: '11px', fontWeight: 'bold' }}
              >
                MARK_GOOD
              </button>
              <button 
                onClick={() => { handleUpdateRating(selectedLog.id, 1); setSelectedLog(null); }}
                style={{ ...styles.button, borderColor: '#ff4444', color: '#ff4444', padding: '10px 20px', fontSize: '11px', fontWeight: 'bold' }}
              >
                MARK_BAD
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
