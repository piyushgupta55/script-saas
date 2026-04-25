'use client'

import { useState, useMemo } from 'react'
import { KnowledgeChunk } from '@/lib/types'
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  ArrowUpCircle, 
  CheckCircle2, 
  XCircle
} from 'lucide-react'
import { 
  incrementQualityScore, 
  deleteKnowledgeChunk, 
  createKnowledgeChunk, 
  updateKnowledgeChunk 
} from '@/app/admin/(dashboard)/knowledge/actions'

interface Props {
  initialData: KnowledgeChunk[]
}

export default function KnowledgeManager({ initialData }: Props) {
  const [data, setData] = useState<KnowledgeChunk[]>(initialData)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<KnowledgeChunk | null>(null)
  
  const [filterType, setFilterType] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterSource, setFilterSource] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredData = useMemo(() => {
    return initialData.filter(item => {
      const matchesType = !filterType || item.type === filterType
      const matchesCategory = !filterCategory || item.category === filterCategory
      const matchesSource = !filterSource || item.source.toLowerCase().includes(filterSource.toLowerCase())
      const matchesSearch = !searchQuery || item.content.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesType && matchesCategory && matchesSource && matchesSearch
    })
  }, [initialData, filterType, filterCategory, filterSource, searchQuery])

  // Inline Styles
  const styles: Record<string, React.CSSProperties> = {
    wrapper: {
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      color: '#e5e5e5',
      fontFamily: 'monospace',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      margin: 0,
    },
    subtitle: {
      fontSize: '12px',
      color: '#666',
      margin: '4px 0 0 0',
      textTransform: 'uppercase',
    },
    addButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: '#c5ff00',
      color: '#000',
      padding: '10px 20px',
      borderRadius: '4px',
      border: 'none',
      fontWeight: 'bold',
      cursor: 'pointer',
      fontSize: '12px',
      textTransform: 'uppercase',
    },
    filterBar: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '16px',
      backgroundColor: '#0a0a0a',
      padding: '16px',
      borderRadius: '8px',
      border: '1px solid #111',
    },
    input: {
      backgroundColor: '#000',
      border: '1px solid #222',
      color: '#fff',
      padding: '10px 12px',
      borderRadius: '4px',
      fontSize: '12px',
      outline: 'none',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      backgroundColor: '#0a0a0a',
      borderRadius: '8px',
      overflow: 'hidden',
      border: '1px solid #111',
    },
    th: {
      textAlign: 'left',
      padding: '16px',
      fontSize: '10px',
      fontWeight: 'bold',
      color: '#444',
      textTransform: 'uppercase',
      borderBottom: '1px solid #111',
      backgroundColor: '#080808',
    },
    td: {
      padding: '16px',
      fontSize: '12px',
      borderBottom: '1px solid #111',
    },
    badge: {
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '10px',
      fontWeight: 'bold',
      textTransform: 'uppercase',
    },
    modalOverlay: {
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      backgroundColor: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    },
    modal: {
      backgroundColor: '#0a0a0a',
      border: '2px solid #222',
      width: '100%',
      maxWidth: '600px',
      padding: '32px',
      borderRadius: '8px',
      position: 'relative',
    }
  }

  const handleCreateOrUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const payload = {
      type: formData.get('type') as any,
      content: formData.get('content') as string,
      category: formData.get('category') as any,
      tone: formData.get('tone') as string || null,
      source: formData.get('source') as string,
    }

    try {
      if (editingItem) {
        await updateKnowledgeChunk(editingItem.id, payload)
      } else {
        await createKnowledgeChunk(payload)
      }
      setIsModalOpen(false)
      setEditingItem(null)
    } catch (error) {
      alert('Error saving knowledge chunk')
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Knowledge_Manager</h1>
          <p style={styles.subtitle}>Viral Pattern Database // v1.0</p>
        </div>
        <button 
          onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
          style={styles.addButton}
        >
          <Plus size={16} />
          New Entry
        </button>
      </div>

      <div style={styles.filterBar}>
        <input 
          style={styles.input}
          placeholder="SEARCH_CONTENT..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select 
          style={styles.input}
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">ALL_TYPES</option>
          <option value="hook">HOOK</option>
          <option value="rule">RULE</option>
          <option value="structure">STRUCTURE</option>
          <option value="example">EXAMPLE</option>
        </select>
        <select 
          style={styles.input}
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">ALL_CATEGORIES</option>
          <option value="short_form">SHORT_FORM</option>
          <option value="long_form">LONG_FORM</option>
          <option value="general">GENERAL</option>
        </select>
        <input 
          style={styles.input}
          placeholder="FILTER_SOURCE..."
          value={filterSource}
          onChange={(e) => setFilterSource(e.target.value)}
        />
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Type</th>
            <th style={styles.th}>Content</th>
            <th style={styles.th}>Category</th>
            <th style={styles.th}>Score</th>
            <th style={styles.th}>Status</th>
            <th style={{...styles.th, textAlign: 'right'}}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item.id} className="table-row">
              <td style={styles.td}>
                <span style={{
                  ...styles.badge,
                  backgroundColor: item.type === 'hook' ? '#ff006e' : '#3a86ff',
                  color: '#fff'
                }}>
                  {item.type}
                </span>
              </td>
              <td style={styles.td}>
                <div style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.content}
                </div>
              </td>
              <td style={styles.td}>{item.category}</td>
              <td style={styles.td}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#c5ff00', fontWeight: 'bold' }}>{item.quality_score}</span>
                  <button onClick={() => incrementQualityScore(item.id, item.quality_score)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#444' }}>
                    <ArrowUpCircle size={14} />
                  </button>
                </div>
              </td>
              <td style={styles.td}>
                <span style={{ color: item.is_active ? '#c5ff00' : '#ff4444' }}>
                  {item.is_active ? 'ACTIVE' : 'DISABLED'}
                </span>
              </td>
              <td style={{...styles.td, textAlign: 'right'}}>
                <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', marginRight: '8px' }}>
                  <Edit2 size={14} />
                </button>
                <button onClick={() => deleteKnowledgeChunk(item.id)} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer' }}>
                  <Trash2 size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={{ marginTop: 0, marginBottom: '24px', fontSize: '18px', color: '#c5ff00' }}>
              {editingItem ? 'EDIT_KNOWLEDGE' : 'NEW_KNOWLEDGE'}
            </h2>
            <form onSubmit={handleCreateOrUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '10px', color: '#444', marginBottom: '8px' }}>TYPE</label>
                  <select name="type" defaultValue={editingItem?.type || 'hook'} style={{...styles.input, width: '100%'}}>
                    <option value="hook">HOOK</option>
                    <option value="rule">RULE</option>
                    <option value="structure">STRUCTURE</option>
                    <option value="example">EXAMPLE</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '10px', color: '#444', marginBottom: '8px' }}>CATEGORY</label>
                  <select name="category" defaultValue={editingItem?.category || 'short_form'} style={{...styles.input, width: '100%'}}>
                    <option value="short_form">SHORT_FORM</option>
                    <option value="long_form">LONG_FORM</option>
                    <option value="general">GENERAL</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '10px', color: '#444', marginBottom: '8px' }}>CONTENT</label>
                <textarea 
                  name="content"
                  defaultValue={editingItem?.content}
                  style={{...styles.input, width: '100%', minHeight: '120px', resize: 'vertical'}}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '10px', color: '#444', marginBottom: '8px' }}>SOURCE</label>
                <input name="source" defaultValue={editingItem?.source} style={{...styles.input, width: '100%'}} required />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{...styles.addButton, backgroundColor: '#222', color: '#fff', flex: 1}}>CANCEL</button>
                <button type="submit" style={{...styles.addButton, flex: 1}}>{editingItem ? 'UPDATE' : 'CREATE'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .table-row:hover { background-color: #0c0c0c !important; }
      `}} />
    </div>
  )
}
