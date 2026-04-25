'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye, 
  Terminal,
  X,
  Save,
  Clock
} from 'lucide-react'
import { getPrompts, createPrompt, updatePrompt, deletePrompt } from './actions'

interface Prompt {
  id: string
  name: string
  content: string
  created_at: string
}

export default function PromptsManagerPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null)
  const [viewingPrompt, setViewingPrompt] = useState<Prompt | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadPrompts()
  }, [])

  async function loadPrompts() {
    setLoading(true)
    try {
      const data = await getPrompts()
      setPrompts(data || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPrompts = prompts.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const payload = {
      name: formData.get('name') as string,
      content: formData.get('content') as string,
    }

    try {
      if (editingPrompt) {
        await updatePrompt(editingPrompt.id, payload)
      } else {
        await createPrompt(payload)
      }
      setIsModalOpen(false)
      setEditingPrompt(null)
      loadPrompts()
    } catch (error) {
      alert('Error saving prompt')
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this system prompt? This may break AI generation if not replaced.')) {
      await deletePrompt(id)
      loadPrompts()
    }
  }

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
    addButton: {
      backgroundColor: '#c5ff00',
      color: '#000',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '2px',
      fontWeight: 'bold',
      fontSize: '11px',
      textTransform: 'uppercase',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: '4px 4px 0px rgba(197, 255, 0, 0.1)'
    },
    searchContainer: {
      position: 'relative',
      marginBottom: '30px'
    },
    searchInput: {
      width: '100%',
      backgroundColor: '#080808',
      border: '1px solid #111',
      color: '#fff',
      padding: '16px 16px 16px 45px',
      fontSize: '12px',
      outline: 'none',
      fontFamily: 'monospace'
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
    promptName: {
      color: '#c5ff00',
      fontWeight: 'bold',
      fontSize: '13px'
    },
    actionBtn: {
      background: 'none',
      border: '1px solid #222',
      color: '#666',
      padding: '8px',
      cursor: 'pointer',
      marginLeft: '8px',
      transition: 'all 0.2s'
    },
    modalOverlay: {
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.95)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    },
    modal: {
      backgroundColor: '#0a0a0a',
      border: '1px solid #c5ff00',
      width: '100%',
      maxWidth: '800px',
      maxHeight: '90vh',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 0 50px rgba(197, 255, 0, 0.05)'
    },
    modalHeader: {
      padding: '20px',
      borderBottom: '1px solid #111',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    modalBody: {
      padding: '30px',
      overflowY: 'auto',
      flex: 1
    },
    formGroup: {
      marginBottom: '24px'
    },
    label: {
      display: 'block',
      fontSize: '10px',
      color: '#444',
      marginBottom: '8px',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: '1px'
    },
    input: {
      width: '100%',
      backgroundColor: '#000',
      border: '1px solid #111',
      color: '#fff',
      padding: '12px',
      fontSize: '13px',
      fontFamily: 'monospace',
      outline: 'none'
    },
    textarea: {
      width: '100%',
      backgroundColor: '#000',
      border: '1px solid #111',
      color: '#c5ff00',
      padding: '20px',
      fontSize: '14px',
      fontFamily: 'monospace',
      outline: 'none',
      minHeight: '350px',
      lineHeight: '1.6'
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          <Terminal size={24} color="#c5ff00" />
          SYSTEM_PROMPTS_CORE
        </h1>
        <button 
          onClick={() => { setEditingPrompt(null); setIsModalOpen(true); }}
          style={styles.addButton}
        >
          <Plus size={16} />
          Create New Prompt
        </button>
      </div>

      <div style={styles.searchContainer}>
        <Search size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: '#444' }} />
        <input 
          style={styles.searchInput}
          placeholder="SEARCH_PROMPT_REGISTRY..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#c5ff00' }}>INITIALIZING_PROMPT_CORE...</div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Registry_Name</th>
              <th style={styles.th}>Content_Preview</th>
              <th style={styles.th}>Last_Updated</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Operations</th>
            </tr>
          </thead>
          <tbody>
            {filteredPrompts.map(prompt => (
              <tr key={prompt.id}>
                <td style={styles.td}>
                  <span style={styles.promptName}>{prompt.name.toUpperCase()}</span>
                </td>
                <td style={styles.td}>
                  <div style={{ maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', opacity: 0.6 }}>
                    {prompt.content}
                  </div>
                </td>
                <td style={styles.td}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px' }}>
                    <Clock size={12} />
                    {new Date(prompt.created_at).toLocaleDateString()}
                  </div>
                </td>
                <td style={{ ...styles.td, textAlign: 'right' }}>
                  <button 
                    onClick={() => { setViewingPrompt(prompt); setIsViewModalOpen(true); }}
                    style={styles.actionBtn}
                    title="View Raw"
                  >
                    <Eye size={14} />
                  </button>
                  <button 
                    onClick={() => { setEditingPrompt(prompt); setIsModalOpen(true); }}
                    style={styles.actionBtn}
                    title="Edit System"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button 
                    onClick={() => handleDelete(prompt.id)}
                    style={{ ...styles.actionBtn, color: '#ff4444', borderColor: '#300' }}
                    title="Delete Entry"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Edit/Create Modal */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={{ fontSize: '14px', margin: 0, color: '#c5ff00' }}>
                {editingPrompt ? `CORE_OVERRIDE: ${editingPrompt.name}` : 'NEW_SYSTEM_CORE'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={styles.modalBody}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>REGISTRY_IDENTIFIER</label>
                  <input 
                    name="name"
                    defaultValue={editingPrompt?.name}
                    placeholder="e.g. script_gen_v1"
                    style={styles.input}
                    required
                    readOnly={!!editingPrompt}
                  />
                  {editingPrompt && <p style={{ fontSize: '9px', color: '#444', marginTop: '4px' }}>System identifier is locked after creation.</p>}
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>PROMPT_CORE_LOGIC</label>
                  <textarea 
                    name="content"
                    defaultValue={editingPrompt?.content}
                    placeholder="Enter full system prompt logic here..."
                    style={styles.textarea}
                    required
                  />
                </div>
              </div>
              <div style={{ padding: '20px', borderTop: '1px solid #111', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  style={{ ...styles.addButton, backgroundColor: '#111', color: '#fff', boxShadow: 'none' }}
                >
                  ABORT
                </button>
                <button type="submit" style={styles.addButton}>
                  <Save size={16} />
                  COMMIT_CHANGES
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && viewingPrompt && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.modal, maxWidth: '1000px' }}>
            <div style={styles.modalHeader}>
              <h2 style={{ fontSize: '14px', margin: 0, color: '#c5ff00' }}>RAW_CORE_VIEW: {viewingPrompt.name}</h2>
              <button onClick={() => setIsViewModalOpen(false)} style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ ...styles.modalBody, backgroundColor: '#000' }}>
              <pre style={{ 
                color: '#c5ff00', 
                whiteSpace: 'pre-wrap', 
                fontSize: '14px', 
                lineHeight: '1.8',
                margin: 0
              }}>
                {viewingPrompt.content}
              </pre>
            </div>
            <div style={{ padding: '20px', borderTop: '1px solid #111', textAlign: 'right' }}>
              <button 
                onClick={() => setIsViewModalOpen(false)}
                style={{ ...styles.addButton, backgroundColor: '#111', color: '#fff', boxShadow: 'none', display: 'inline-flex' }}
              >
                CLOSE_VIEW
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
